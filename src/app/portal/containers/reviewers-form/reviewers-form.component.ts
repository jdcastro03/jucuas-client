import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  UntypedFormControl,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { ReviewerService } from '../../services/reviewer.service';
import { OrganizationalUnitService } from '../../services/organizational-unit.service';
import { UniversityService } from '../../services/university.service';
import { VerifyDataService } from '../../services/verify-data.service';
import { contains } from 'jquery';

declare var $: any;

interface Choice {
  value: string;
  viewValue: string;
}

interface unitChoice {
  value: string;
  viewValue: string;
  region: string;
}
@Component({
  selector: 'app-reviewers-form',
  templateUrl: './reviewers-form.component.html',
  styleUrls: ['./reviewers-form.component.css', '../../../app.component.css'],
})
export class ReviewersFormComponent implements OnInit {
  isWaiting = false;
  global_reviewer: boolean = false;
  region_selected: boolean = true
  is_academic: boolean = true;
  is_academic_type: boolean = true;
  is_organizational: boolean = true;
  is_university: boolean = true;
  is_highschool: boolean = true;
  uni: boolean = false;
  high: boolean = false;
  org: boolean = false;
  selected_unit_rev: boolean = true;
  selected_unit = "";
  selected_degree = "";
  selected_unit_type = "";
  selected_degree_type = "";
  revisor_permision: string = "";
  region: string = ""
  selected_region: string = "X000"
  reviewer_form = new FormGroup({
    first_name: new FormControl('', [Validators.required]),
    last_name: new FormControl('', [Validators.required]),
    user_name: new UntypedFormControl(
      '',
      [
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9]+(?:_[a-zA-Z0-9]+)*$'),
        Validators.minLength(3),
        Validators.maxLength(150),
      ],
      [
        this.verify
          .verifyDataValidator(
            'username',
            0,
            this.route.snapshot.paramMap.get('id')
          )
          .bind(this),
      ]
    ),
    region: new FormControl('', [Validators.required]),
    global_reviewer: new FormControl(false, Validators.required),
    origin_university: new FormControl(''),
    origin_highschool: new FormControl(''),
    origin_organizational_unit: new FormControl(''),
    user: new FormControl(''),
    email: new UntypedFormControl(
      '',
      [Validators.required, Validators.email],
      [
        this.verify
          .verifyDataValidator(
            'email',
            0,
            this.route.snapshot.paramMap.get('id')
          )
          .bind(this),
      ]
    ),
    is_active: new FormControl(true, Validators.required),
  });

  form_type: string = 'Agregar';
  id: string | null = null;
  reviewer_obj: any;
  apiURL: string = environment.apiURL;
  options: any;
  data: any = {};

  regions: Choice[] = [
    { value: 'N', viewValue: 'Norte' },
    { value: 'CN', viewValue: 'Centro Norte' },
    { value: 'C', viewValue: 'Centro' },
    { value: 'S', viewValue: 'Sur' },
  ];
  university_list: unitChoice[] = [];
  highschool_list: unitChoice[] = [];
  organizational: unitChoice[] = [];
  filtered_university_list: Choice[] = [];
  filtered_highschool_list: Choice[] = [];
  filtered_organizational: Choice[] = [];

  constructor(
    private reviewers: ReviewerService,
    private universities: UniversityService,
    private organizationalunit: OrganizationalUnitService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private verify: VerifyDataService
  ) {}

  ngOnInit(): void {
    if (localStorage['group'] == 'admin') {
      $.blockUI({
        message: '<i class="icon-spinner4 spinner"></i>',
        overlayCSS: {
          backgroundColor: '#1b2024',
          opacity: 0.8,
          zIndex: 1200,
          cursor: 'wait',
        },
        css: {
          border: 0,
          color: '#fff',
          padding: 0,
          zIndex: 1201,
          backgroundColor: 'transparent',
        },
      });

      this.universities.universities().subscribe((res: any) => {
        console.log(res)
        let universities: unitChoice[] = [];
        let highschools: unitChoice[] = [];
        universities.push({
          value: '',
          viewValue: 'No pertenece a una Universidad',
          region: ''
        });
        highschools.push({
          value: '',
          viewValue: 'No pertenece a un Bachillerato',
          region: ''
        });
        for (let key in res) {
          if (Object.prototype.hasOwnProperty.call(res, key)) {
            if(res[key].type == "U"){
              universities.push({ value: res[key].id, viewValue: res[key].name, region: res[key].region});
            }
            if(res[key].type == "P"){
              highschools.push({ value: res[key].id, viewValue: res[key].name, region: res[key].region });
            }
          }
        }
        this.university_list = universities;
        this.highschool_list = highschools;
        this.organizationalunit.organizationalUnits().subscribe((res: any) => {
          let organizationalunit: unitChoice[] = [];
          organizationalunit.push({
            value: '',
            viewValue: 'No pertenece a una Unidad Organizativa',
            region:''
          });
          for (let key in res) {
            if (Object.prototype.hasOwnProperty.call(res, key)) {
              organizationalunit.push({
                value: res[key].id,
                viewValue: res[key].name,
                region: res[key].region
              });
            }
          }
          this.organizational = organizationalunit;
          this.id = this.route.snapshot.paramMap.get('id');
      if (this.id == 'add') {
        this.form_type = 'Agregar';
      } else {
        this.form_type = 'Editar';
        this.reviewers.reviewerDetail(Number(this.id)).subscribe(
          (res: any) => {
            this.region_selected = false;
            let origin_university: any;
            let origin_organizational_unit: any;
            delete res['id'];
            origin_university = res['origin_university'].id;
            if (origin_university === null || origin_university === undefined) {
              res['origin_university'] = 0;
            } else {
              this.region = res['origin_university'].region
              if(this.region == null){
                this.region = res['region']
              }
              this.change_region();
              res['origin_university'] = res['origin_university'].id;
              this.is_academic = false
            }
            let index = this.check_if_highschool(res['origin_university']);
            console.log(index)
            if(index != -1){
              this.is_highschool = false;
              res['origin_highschool'] = res['origin_university']
            }else{
              res['origin_highschool'] = 0
              this.is_university = false;
            }

            origin_organizational_unit = res['origin_organizational_unit'].id;
            if (origin_organizational_unit === null || origin_organizational_unit === undefined) {
              res['origin_organizational_unit'] = 0;
            } else {
              this.region = res['origin_organizational_unit'].region
              if(this.region == null){
                this.region = res['region']
              }
              this.change_region();
              res['origin_organizational_unit'] = res['origin_organizational_unit'].id;
              this.is_organizational = false
            }
            //AUTOSELECCIONAR UNIDAD DEL REVISOR
            if(this.is_academic == false){
              this.selected_unit = "0"
            }
            if(this.is_organizational == false){
              this.selected_unit = "1"
            }
            if(this.is_academic == false && this.is_organizational == false){
              this.selected_unit = "2"
            }
            if(this.is_university == false){
              this.selected_degree = "0"
            }
            if(this.is_highschool == false){
              this.selected_degree = "1"
            }
            if(this.is_university == false && this.is_highschool == false){
              this.selected_degree = "2"
            }
            //AUTOSELECCIONAR UNIDADES PARA REVISAR
            this.revisor_permision = res['reviewer_permission'];
            console.log(this.revisor_permision)
            delete res['reviewer_permission'];
            if(this.revisor_permision != null){
              if(this.revisor_permision.includes("U") || this.revisor_permision.includes("P")){
                this.is_academic_type = false;
                this.selected_unit_type = "0"
              }
              if(this.revisor_permision.includes("O")){
                this.selected_unit_type = "1"
                this.org = true
              }
              if((this.revisor_permision.includes("O"))&&(this.revisor_permision.includes("U") || this.revisor_permision.includes("P"))){
                this.is_academic_type = false;
                this.uni = true
                this.high = true
                this.org = true
                this.selected_unit_type = "2"
              }
              if(this.revisor_permision.includes("U")){
                this.selected_degree_type = "0"
                this.uni = true
              }
              if(this.revisor_permision.includes("P")){
                this.selected_degree_type = "1"
                this.high = true
              }
              if(this.revisor_permision.includes("U") && this.revisor_permision.includes("P")){
                this.selected_degree_type = "2"
                this.uni = true
                this.high = true
              }
              if(this.revisor_permision.includes("N")){
                this.selected_region = "N"
              }
              if(this.revisor_permision.includes("X")){
                this.selected_region = "CN"
              }
              if(this.revisor_permision.includes("C")){
                this.selected_region = "C"
              }
              if(this.revisor_permision.includes("S")){
                this.selected_region = "S"
              }
              this.selected_unit_rev = false;
            }
            console.log(res);
            this.reviewer_obj = res;
            this.reviewer_form.setValue(this.reviewer_obj);
          },
          (error) => {
            this.router.navigateByUrl('/portal/reviewers');
            this.toastr.error(error['error'].detail, 'Error');
          }
        );
      }
      $.unblockUI();
          
        });
      });
    } else {
      this.router.navigateByUrl('/portal/dashboard');
      this.toastr.warning('No se pudo acceder a la página solicitada.');
    }
  }

  save_reviewer() {
    const formData = new FormData();
    let check = this.generate_permission_string()
    if(check == false){
      this.toastr.error("Elija por lo menos un tipo de unidad")
      return;
    }
    formData.append('reviewer_permission',this.revisor_permision);
    formData.append(
      'first_name',
      (this.reviewer_form.get('first_name') as FormControl).value
    );
    formData.append(
      'last_name',
      (this.reviewer_form.get('last_name') as FormControl).value
    );
    formData.append(
      'user_name',
      (this.reviewer_form.get('user_name') as FormControl).value
    );
    formData.append(
      'region',
      (this.reviewer_form.get('region') as FormControl).value
    );
    formData.append(
      'global_reviewer',
      (this.reviewer_form.get('global_reviewer') as FormControl).value
    );

    if (
      (this.reviewer_form.get('origin_university') as FormControl).value == 0
    ) {
      formData.append('origin_university', '');
    } else {
      formData.append(
        'origin_university',
        (this.reviewer_form.get('origin_university') as FormControl).value
      );
    }
    if ((this.reviewer_form.get('origin_highschool') as FormControl).value == 0) {
    } else {
      formData.delete('origin_university')
      formData.append(
        'origin_university',
        (this.reviewer_form.get('origin_highschool') as FormControl).value
      );
    }

    if (
      (this.reviewer_form.get('origin_organizational_unit') as FormControl).value == 0
    ) {
      formData.append('origin_organizational_unit', '');
    } else {
      formData.append(
        'origin_organizational_unit',
        (this.reviewer_form.get('origin_organizational_unit') as FormControl)
          .value
      );
    }
    formData.append(
      'user',
      (this.reviewer_form.get('user') as FormControl).value
    );
    formData.append(
      'email',
      (this.reviewer_form.get('email') as FormControl).value
    );
    formData.forEach((value, key) => {
      console.log(key, value)

      this.data[key] = value;
      
    });

    $.blockUI({
      message: '<i class="icon-spinner4 spinner"></i>',
      overlayCSS: {
        backgroundColor: '#1b2024',
        opacity: 0.8,
        zIndex: 1200,
        cursor: 'wait',
      },
      css: {
        border: 0,
        color: '#fff',
        padding: 0,
        zIndex: 1201,
        backgroundColor: 'transparent',
      },
    });

    if (this.form_type == 'Agregar') {
      if (!this.isWaiting) {
        this.isWaiting = true;
        this.reviewers.addReviewer(JSON.stringify(this.data)).subscribe(
          (res) => {
            $.unblockUI();
            this.router.navigateByUrl('/portal/reviewers');
            this.toastr.success('Revisador agregado correctamente.');
            this.isWaiting = false;
          },
          (error) => {
            let errors = error['error'];
            for (let e in errors) {
              this.toastr.error(errors[e], 'Error!');
            }
            this.isWaiting = false;
            $.unblockUI();
          }
        );
      }
    } else if (this.form_type == 'Editar') {
      this.reviewers
        .editReviewer(Number(this.id), JSON.stringify(this.data))
        .subscribe(
          (res) => {
            $.unblockUI();
            this.router.navigateByUrl('/portal/reviewers');
            this.toastr.success('Revisador modificado correctamente.');
          },
          (error) => {
            let errors = error['error'];
            for (let e in errors) {
              this.toastr.error(errors[e], 'Error!');
            }
            $.unblockUI();
          }
        );
    }
  }

  change_to_global(){
    this.global_reviewer = !this.global_reviewer
  }

  change_region(){
    console.log(this.region)
    this.region_selected = false
    this.filtered_highschool_list = []
    this.filtered_university_list = []
    this.filtered_organizational = []
    for(let i = 1; i < this.university_list.length; i++){
      if(this.university_list[i].region==this.region){
        this.filtered_university_list.push({value: this.university_list[i].value, viewValue: this.university_list[i].viewValue})
      }
    }
    for(let i = 1; i < this.highschool_list.length; i++){
      if(this.highschool_list[i].region==this.region){
        this.filtered_highschool_list.push({value: this.highschool_list[i].value, viewValue: this.highschool_list[i].viewValue})
      }
    }
    for(let i = 1; i < this.organizational.length; i++){
      if(this.organizational[i].region==this.region){
        this.filtered_organizational.push({value: this.organizational[i].value, viewValue: this.organizational[i].viewValue})
      }
    }
    console.log(this.university_list)
    console.log(this.highschool_list)
    console.log(this.organizational)
  }

  change_ua_uo(){
    let index: Number =+ this.selected_unit
    console.log(index)
    if(index == 0){
      this.is_academic = false
      this.is_organizational = true
    }
    if(index == 1){
      this.is_organizational = false
      this.is_academic = true
      this.is_university = true
      this.is_highschool = true
    }
    if(index == 2){
      this.is_organizational = false
      this.is_academic = false
    }
  }

  change_academic_degree(){
    let index: Number =+ this.selected_degree
    console.log(index)
    if(index == 0){
      this.is_university = false
      this.is_highschool = true
    }
    if(index == 1){
      this.is_university = true
      this.is_highschool = false
    }
    if(index == 2){
      this.is_university = false
      this.is_highschool = false
    }
  }
  select_unit_type(){
    this.org = false;
    let index: Number =+ this.selected_unit_type
    if(index == 2 || index == 0){
      this.is_academic_type = false
      this.selected_unit_rev = true;
    }
    if(index == 1){
      this.org = true;
      this.is_academic_type = true
      this.selected_unit_rev = false;
    }
    if(index == 2){
      this.org = true
      this.is_academic_type = false
      this.selected_unit_rev = true;
    }
  }

  select_academic_degree(){
    this.uni = false;
    this.high = false;
    let index: Number =+ this.selected_degree_type
    this.selected_unit_rev = false;
    if(index == 2 || index == 0){
      this.uni = true;
    }
    if(index == 1){
      this.high = true;
    }
    if(index == 2){
      this.uni = true
      this.high = true
    }
  }

  generate_permission_string(){
    if(this.selected_region == "N"){
      this.revisor_permision = "N"
    }if(this.selected_region == "CN"){
      this.revisor_permision = "X"
    }if(this.selected_region == "C"){
      this.revisor_permision = "C"
    }if(this.selected_region == "S"){
      this.revisor_permision = "S"
    }
    if(this.uni == true){
      this.revisor_permision += "U"
    }if(this.high == true){
      this.revisor_permision += "P"
    }if(this.org == true){
      this.revisor_permision += "O"
    }
    console.log(this.revisor_permision)
    if(this.uni == false && this.high == false && this.org == false){
      return false
    }
    return true;
  }

  check_if_highschool(id: string){
    for(let i = 0; i < this.filtered_highschool_list.length ; i++){
      if(this.filtered_highschool_list[i].value == id){
        return 1;
      }
    }
    return -1;
  }

}

// PERMISSION STRING

// Region
// Norte = N
// CentroNorte = X
// Centro = C
// Sur = S

// Unidades
// Organizacional = O
// Academica Universidad = U
// Academica Preparatoria = P

// Ejemplo
// NOP = Norte Organizacional/Preparatoria
// XUP = Centro Norte Universidad/Preparatoria