import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { ActivityManagerService } from '../../services/activity-manager.service';

declare var $: any;

interface Choice {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-activity-managers-form',
  templateUrl: './activity-managers-form.component.html',
  styleUrls: ['./activity-managers-form.component.css']
})
export class ActivityManagersFormComponent implements OnInit {
  activity_manager_form = new FormGroup({
    first_name: new FormControl('', [Validators.required]),
    last_name: new FormControl('', [Validators.required]),
    gender: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    birth_date: new FormControl(''),
    is_active: new FormControl(true, Validators.required),
  });

  form_type: string = 'Agregar';
  id: string | null = null;
  activity_manager_obj: any;
  apiURL: string = environment.apiURL;
  options: any;
  data: any = {};
  d: Date = new Date();

  genders: Choice[] = [
    {value: 'H', viewValue: 'Hombre'},
    {value: 'M', viewValue: 'Mujer'},
    {value: 'O', viewValue: 'Otro'},
  ];

  constructor(
    private activity_managers: ActivityManagerService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
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
      this.activity_managers.activityManagerDetail(Number(this.id)).subscribe(
        (res:any) => {
          delete res['id'];
          this.activity_manager_obj = res;
          this.activity_manager_form.setValue(this.activity_manager_obj);
        },
        (error) => {
          this.router.navigateByUrl('/portal/activity-managers');
          this.toastr.error(error['error'].detail, 'Error');
        }
      );
    }
    $.unblockUI();
  }

  save_activity_manager() {
    const formData = new FormData();
    formData.append('first_name', (this.activity_manager_form.get('first_name') as FormControl).value);
    formData.append('last_name', (this.activity_manager_form.get('last_name') as FormControl).value);
    formData.append('gender', (this.activity_manager_form.get('gender') as FormControl).value);
    formData.append('email', (this.activity_manager_form.get('email') as FormControl).value);
    formData.append('birth_date', (this.activity_manager_form.get('birth_date') as FormControl).value);
    formData.forEach((value, key) => {       
      if (key=='birth_date') {
        const format = 'yyyy-MM-dd';
        const locale = 'en-US';
        this.data[key] = formatDate(String(value), format, locale);
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
        this.activity_managers.addActivityManager(JSON.stringify(this.data)).subscribe(
          (res) => {
            $.unblockUI();
            this.router.navigateByUrl('/portal/activity-managers');
            this.toastr.success('Responsable de actividad agregado correctamente.');
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
        this.activity_managers.editActivityManager(Number(this.id),JSON.stringify(this.data)).subscribe(
          (res) => {
            $.unblockUI();
            this.router.navigateByUrl('/portal/activity-managers');
            this.toastr.success('Responsable de actividad modificado correctamente.');
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
