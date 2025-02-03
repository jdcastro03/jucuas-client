import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { UniversityService } from '../../services/university.service';
import { OrganizationalUnitService } from '../../services/organizational-unit.service';
import { OrganizationalUnitsComponent } from '../organizational-units/organizational-units.component';
import { OrganizationalUnitsFormComponent } from '../organizational-units-form/organizational-units-form.component';
import { VerifyDataService } from '../../services/verify-data.service';
// import
declare var $: any;

interface Choice {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-universities-form',
  templateUrl: './universities-form.component.html',
  styleUrls: [
    './universities-form.component.css',
    '../../../app.component.css',
  ],
})
export class UniversitiesFormComponent implements OnInit {
  university_form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    acronym: new FormControl(''),
    //acronym: new FormControl('', [Validators.required]),
    key_code: new FormControl('', [Validators.required]),
    type: new FormControl('', [Validators.required]),
    region: new FormControl('', [Validators.required]),
    municipality: new FormControl('', [Validators.required]),
    locality: new FormControl('', [Validators.required]),
    email: new FormControl(''),
    phone: new FormControl(''),
    /*
    email: new FormControl(
      '',
      [Validators.required, Validators.email],
      [this.verify.verifyDataValidator('email', 0,this.route.snapshot.paramMap.get('id')).bind(this)]
    ),
    phone: new FormControl(
      '',
      [
        Validators.minLength(10),
        Validators.maxLength(10),
        Validators.pattern('^[0-9]*$'),
      ],
      [this.verify.verifyDataValidator('phone', 10,this.route.snapshot.paramMap.get('id')).bind(this)]
    ),*/
    is_active: new FormControl(true, Validators.required),
  });

  form_type: string = 'Agregar';
  id: string | null = null;
  university_obj: any;
  apiURL: string = environment.apiURL;
  options: any;
  data: any = {};

  types: Choice[] = [
    { value: 'PREESC', viewValue: 'Preescolar' },
    { value: 'PRIM', viewValue: 'Primaria' },
    { value: 'SEC', viewValue: 'Secundaria' },
    { value: 'P', viewValue: 'Preparatoria' },
    { value: 'U', viewValue: 'Universidad' },
  ];

  municipios: Choice[] = OrganizationalUnitsFormComponent._municipios;
  regions: Choice[] = OrganizationalUnitsFormComponent._regions;
  onMunicipalityChange(event: any) {
    const selectedMunicipality = event.value,
      regionCode =
        OrganizationalUnitsFormComponent.get_region_code(selectedMunicipality);
    (this.university_form.get('region') as FormControl).setValue(regionCode);
  }

  constructor(
    private universities: UniversityService,
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

      this.id = this.route.snapshot.paramMap.get('id');
      if (this.id == 'add') {
        this.form_type = 'Agregar';
      } else {
        this.form_type = 'Editar';
        this.universities.universityDetail(Number(this.id)).subscribe(
          (res: any) => {
            delete res['id'];
            this.university_obj = res;
            this.university_form.setValue(this.university_obj);
          },
          (error) => {
            this.router.navigateByUrl('/portal/universities');
            this.toastr.error(error['error'].detail, 'Error');
          }
        );
      }
      $.unblockUI();
    } else {
      this.router.navigateByUrl('/portal/dashboard');
      this.toastr.warning('No se pudo acceder a la página solicitada.');
    }
  }

  save_university() {
    const formData = new FormData();
    formData.append(
      'name',
      (this.university_form.get('name') as FormControl).value
    );
    formData.append(
      'acronym',
      (this.university_form.get('acronym') as FormControl).value
    );
    formData.append(
      'key_code',
      (this.university_form.get('key_code') as FormControl).value
    );
    formData.append(
      'type',
      (this.university_form.get('type') as FormControl).value
    );
    formData.append(
      'region',
      (this.university_form.get('region') as FormControl).value
    );
    formData.append(
      'municipality',
      (this.university_form.get('municipality') as FormControl).value
    );
    formData.append(
      'locality',
      (this.university_form.get('locality') as FormControl).value
    );
    formData.append(
      'email',
      (this.university_form.get('email') as FormControl).value
    );
    formData.append(
      'phone',
      (this.university_form.get('phone') as FormControl).value
    );
    formData.forEach((value, key) => {
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
      this.universities.addUniversity(JSON.stringify(this.data)).subscribe(
        (res) => {
          $.unblockUI();
          this.router.navigateByUrl('/portal/universities');
          this.toastr.success('Unidad Academica agregada correctamente.');
        },
        (error) => {
          let errors = error['error'];
          for (let e in errors) {
            this.toastr.error(errors[e], 'Error!');
          }
          $.unblockUI();
        }
      );
    } else if (this.form_type == 'Editar') {
      this.universities
        .editUniversity(Number(this.id), JSON.stringify(this.data))
        .subscribe(
          (res) => {
            $.unblockUI();
            this.router.navigateByUrl('/portal/universities');
            this.toastr.success('Unidad Academica modificada correctamente.');
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
}
