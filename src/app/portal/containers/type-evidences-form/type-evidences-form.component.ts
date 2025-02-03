import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { TypeEvidencesService } from '../../services/type-evidences.service';

declare var $: any;

interface Choice {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-type-evidences-form',
  templateUrl: './type-evidences-form.component.html',
  styleUrls: [
    './type-evidences-form.component.css',
    '../../../app.component.css',
  ],
})
export class TypeEvidencesFormComponent implements OnInit {
  type_evidence_form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    type: new FormControl('', [Validators.required]),
    is_optional: new FormControl(false, Validators.required),
    is_active: new FormControl(true, Validators.required),
  });

  form_type: string = 'Agregar';
  id: string | null = null;
  type_evidence_obj: any;
  apiURL: string = environment.apiURL;
  options: any;
  data: any = {};

  types: Choice[] = [
    { value: 'PDF', viewValue: 'PDF' },
    { value: 'URL', viewValue: 'URL' },
  ];

  constructor(
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
      if (this.id == 'add') {
        this.form_type = 'Agregar';
      } else {
        this.form_type = 'Editar';
        this.type_evidences.typeEvidenceDetail(Number(this.id)).subscribe(
          (res: any) => {
            delete res['id'];
            this.type_evidence_obj = res;
            this.type_evidence_form.setValue(this.type_evidence_obj);
          },
          (error) => {
            this.router.navigateByUrl('/portal/type-evidences');
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

  save_type_evidence() {
    const formData = new FormData();
    formData.append(
      'name',
      (this.type_evidence_form.get('name') as FormControl).value
    );
    formData.append(
      'type',
      (this.type_evidence_form.get('type') as FormControl).value
    );
    formData.append(
      'is_optional',
      (this.type_evidence_form.get('is_optional') as FormControl).value
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
      this.type_evidences.addTypeEvidence(JSON.stringify(this.data)).subscribe(
        (res) => {
          $.unblockUI();
          this.router.navigateByUrl('/portal/type-evidences');
          this.toastr.success('Tipo de evidencia agregada correctamente.');
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
      this.type_evidences
        .editTypeEvidence(Number(this.id), JSON.stringify(this.data))
        .subscribe(
          (res) => {
            $.unblockUI();
            this.router.navigateByUrl('/portal/type-evidences');
            this.toastr.success('Tipo de evidencia modificada correctamente.');
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
