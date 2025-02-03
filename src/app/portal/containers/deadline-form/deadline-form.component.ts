import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { DeadlineService } from '../../services/deadline.service';
import { read } from 'fs';

declare var $: any;

interface Choice {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-deadline-form',
  templateUrl: './deadline-form.component.html',
  styleUrls: ['./deadline-form.component.css'],
})
export class DeadlineFormComponent implements OnInit {
  deadline_form = new FormGroup({
    name_edition: new FormControl('', [Validators.required]),
    date_edition: new FormControl('', [Validators.required]),
    date_to_upload_activities: new FormControl(''),
    date_to_upload_evidence: new FormControl(''),
    date_to_validate_evidence: new FormControl(''),
    date_edition_start: new FormControl(''),
    end_date_of_the_edition: new FormControl(''),
    is_active: new FormControl(true, Validators.required),
  });

  year: number = new Date().getFullYear() - 5;
  years: Choice[] = [];
  form_type: string = 'Agregar';
  id: string | null = null;
  deadline_obj: any;
  apiURL: string = environment.apiURL;
  options: any;
  data: any = {};
  d: Date = new Date();

  constructor(
    private deadlines: DeadlineService,
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

      for (let i = 0; i <= 7; i++) {
        this.years.push({
          value: (this.year + i).toString(),
          viewValue: (this.year + i).toString(),
        });
      }

      this.id = this.route.snapshot.paramMap.get('id');
      if (this.id == 'add') {
        this.form_type = 'Agregar';
      } else {
        this.form_type = 'Editar';
        this.deadlines.deadlineDetail(Number(this.id)).subscribe(
          (res: any) => {
            delete res['id'];
            this.deadline_obj = res;
            this.deadline_form.setValue(this.deadline_obj);
          },
          (error) => {
            this.router.navigateByUrl('/portal/deadlines');
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

  save_deadline() {
    const formData = new FormData();
    formData.append(
      'name_edition',
      (this.deadline_form.get('name_edition') as FormControl).value
    );
    formData.append(
      'date_edition',
      (this.deadline_form.get('date_edition') as FormControl).value
    );
    formData.append(
      'date_to_upload_activities',
      (this.deadline_form.get('date_to_upload_activities') as FormControl).value
    );
    formData.append(
      'date_to_upload_evidence',
      (this.deadline_form.get('date_to_upload_evidence') as FormControl).value
    );
    formData.append(
      'date_to_validate_evidence',
      (this.deadline_form.get('date_to_validate_evidence') as FormControl).value
    );
    formData.append(
      'date_edition_start',
      (this.deadline_form.get('date_edition_start') as FormControl).value
    );
    formData.append(
      'end_date_of_the_edition',
      (this.deadline_form.get('end_date_of_the_edition') as FormControl).value
    );
    formData.append(
      'file_name',
      (this.file_name)
    )
    formData.append(
      'file',
      this.file_content
    )
    formData.forEach((value, key) => {
      if (key != 'name_edition' && key != 'date_edition' && key != 'file' && key != 'file_name') {
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
      this.deadlines.addDeadline(JSON.stringify(this.data)).subscribe(
        (res) => {
          $.unblockUI();
          this.router.navigateByUrl('/portal/deadlines');
          this.toastr.success('Fecha de jornada agregada correctamente.');
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
      this.deadlines
        .editDeadline(Number(this.id), JSON.stringify(this.data))
        .subscribe(
          (res) => {
            $.unblockUI();
            this.router.navigateByUrl('/portal/deadlines');
            this.toastr.success('Fecha de jornada modificada correctamente.');
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
  file:any;
  file_content: string  = "";
  file_name: any;
  async fileChanged(e: any) {
      this.file = e.target.files[0];
      this.file_name = e.target.files[0].name
      const fileContent = await this.readFileContent(this.file);
      const reader = new FileReader();
      reader.readAsDataURL(this.file);
      reader.onload = () => {
        const read = reader.result;
        if(read){
          this.file_content = read.toString();
        }

    };
  }

  readFileContent(file: File): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        if (!file) {
            resolve('');
        }
        const reader = new FileReader();
        reader.onload = (e) => {
          if(reader.result != null){
            const text = reader.result.toString();
            resolve(text);
          }
        };
        reader.readAsText(file);
    });
}
}
