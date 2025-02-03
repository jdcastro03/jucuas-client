import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { TypeActivitiesService } from '../../services/type-activities.service';
import { TypeEvidencesService } from '../../services/type-evidences.service';
import { error } from 'console';

declare var $: any;

interface Choice {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-type-activities-form',
  templateUrl: './type-activities-form.component.html',
  styleUrls: [
    './type-activities-form.component.css',
    '../../../app.component.css',
  ],
})
export class TypeActivitiesFormComponent implements OnInit {
  type_activity_form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    title: new FormControl('', Validators.required),
    type_evidence: new FormControl([]),
    maxCopresenter: new FormControl('', Validators.required),
    is_active: new FormControl(true, Validators.required),
  });

  form_type: string = 'Agregar';
  id: string | null = null;
  type_activity_obj: any;
  apiURL: string = environment.apiURL;
  options: any;
  data: any = {};

  evidencesList: Choice[] = [];

  constructor(
    private type_activities: TypeActivitiesService,
    private type_evidences: TypeEvidencesService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService
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
      this.getEvidences();
      if (this.id == 'add') {
        this.form_type = 'Agregar';
      } else {
        this.form_type = 'Editar';
        this.type_activities.typeActivityDetail(Number(this.id)).subscribe(
          (res: any) => {
            let type_evidence: Array<String> = [];
            let res_evidence: any;
            delete res['id'];
            res_evidence = res['type_evidence'];
            res_evidence.forEach((element: any) => {
              type_evidence.push(`${element.id}`);
            });

            res['type_evidence'] = type_evidence;
            this.type_activity_obj = res;
            this.type_activity_form.setValue(this.type_activity_obj);
          },
          (error) => {
            this.router.navigateByUrl('/portal/type-activities');
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

  save_type_activity() {
    const formData = new FormData();
    formData.append(
      'name',
      (this.type_activity_form.get('name') as FormControl).value
    );
    formData.append(
      'title',
      (this.type_activity_form.get('title') as FormControl).value
    );
    formData.append(
      'type_evidence',
      (this.type_activity_form.get('type_evidence') as FormControl).value
    );
    formData.append(
      'maxCopresenter',
      (this.type_activity_form.get('maxCopresenter') as FormControl).value
    );
    formData.forEach((value: any, key) => {
      var temp = ""
      if (key == 'type_evidence') {
        let arrvalue: Number[] = [];
        value = value+","
        for (let val in value) {
          if (value[val] != ',') {
            temp += value[val];
          }
          if (value[val] == ',') {
            arrvalue.push(Number(temp));
            temp = ""
          }
        }
        this.data[key] = arrvalue;
      } else {
        this.data[key] = value;
      }
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

      this.type_activities.addTypeActivity(JSON.stringify(this.data)).subscribe(
        (res) => {
          $.unblockUI();
          this.router.navigateByUrl('/portal/type-activities');
          this.toastr.success('Tipo de actividad agregada correctamente.');
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
      this.type_activities
        .editTypeActivity(Number(this.id), JSON.stringify(this.data))
        .subscribe(
          (res) => {
            $.unblockUI();
            this.router.navigateByUrl('/portal/type-activities');
            this.toastr.success('Tipo de actividad modificada correctamente.');
            this.type_activities
              .syncTypeActivity(JSON.stringify({"edited_evidence":this.id}))
              .subscribe(
                (res) => {
                },
                (error) =>{
                }
              )
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

  getEvidences() {
    this.type_evidences.typeEvidences().subscribe(
      (res: any) => {
        let evidences: Choice[] = [];
        for (let key in res) {
          if (Object.prototype.hasOwnProperty.call(res, key)) {
            evidences.push({ value: res[key].id, viewValue: res[key].name });
          }
        }
        this.evidencesList = evidences;
      },
      () => {
        this.router.navigateByUrl('/portal/type-activities');
        this.toastr.error('Error!');
      }
    );
  }
}
