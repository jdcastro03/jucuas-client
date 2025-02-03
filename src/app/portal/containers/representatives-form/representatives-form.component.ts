import { Component, OnInit } from '@angular/core';
import {
  UntypedFormGroup,
  UntypedFormControl,
  Validators,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { RepresentativeService } from '../../services/representatives.service';
import { OrganizationalUnitService } from '../../services/organizational-unit.service';
import { UniversityService } from '../../services/university.service';
import { VerifyDataService } from '../../services/verify-data.service';

declare var $: any;

interface Choice {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-representatives-form',
  templateUrl: './representatives-form.component.html',
  styleUrls: ['./representatives-form.component.css'],
})
export class RepresentativesFormComponent implements OnInit {
  isWaiting = false;
  representative_form = new UntypedFormGroup({
    first_name: new UntypedFormControl('', [Validators.required]),
    last_name: new UntypedFormControl('', [Validators.required]),
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
    origin_university: new UntypedFormControl(''),
    origin_organizational_unit: new UntypedFormControl(''),
    user: new UntypedFormControl(''),
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
    is_active: new UntypedFormControl(true, Validators.required),
  });

  unitys = ['Unidad Academica', 'Unidad Organizacional'];
  selection: Choice[] = [];
  selected_unity: string = '';
  hide = false;
  selected_unit = 0;
  form_type: string = 'Agregar';
  id: string | null = null;
  representative_obj: any;
  apiURL: string = environment.apiURL;
  options: any;
  data: any = {};

  institutions: Choice[] = [];
  organizational: Choice[] = [];

  constructor(
    private representatives: RepresentativeService,
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
        let universities: Choice[] = [];
        universities.push({
          value: '',
          viewValue: 'No pertenece a una Universidad',
        });
        for (let key in res) {
          let keyCode =
            res[key].key_code != null ? `(${res[key].key_code})` : '';
          if (Object.prototype.hasOwnProperty.call(res, key)) {
            universities.push({
              value: res[key].id,
              viewValue: `${res[key].name} ${keyCode}`,
            });
          }
        }
        this.institutions = universities;
      });

      this.organizationalunit.organizationalUnits().subscribe((res: any) => {
        let organizationalunit: Choice[] = [];
        organizationalunit.push({
          value: '',
          viewValue: 'No pertenece a una Unidad Organizativa',
        });
        for (let key in res) {
          let keyCode =
            res[key].key_code != null ? `(${res[key].key_code})` : '';
          if (Object.prototype.hasOwnProperty.call(res, key)) {
            organizationalunit.push({
              value: res[key].id,
              viewValue: `${res[key].name} ${keyCode}`,
            });
          }
        }
        this.organizational = organizationalunit;
      });

      this.id = this.route.snapshot.paramMap.get('id');
      if (this.id == 'add') {
        this.form_type = 'Agregar';
      } else {
        this.form_type = 'Editar';
        this.representatives.representativeDetail(Number(this.id)).subscribe(
          (res: any) => {
            let origin_university: any;
            let origin_organizational_unit: any;
            delete res['id'];

            origin_university = res['origin_university'].id;
            if (origin_university === null || origin_university === undefined) {
              res['origin_university'] = 0;
            } else {
              res['origin_university'] = res['origin_university'].id;
            }

            origin_organizational_unit = res['origin_organizational_unit'].id;
            if (
              origin_organizational_unit === null ||
              origin_organizational_unit === undefined
            ) {
              res['origin_organizational_unit'] = 0;
            } else {
              res['origin_organizational_unit'] =
                res['origin_organizational_unit'].id;
            }

            this.representative_obj = res;
            this.representative_form.setValue(this.representative_obj);
          },
          (error) => {
            this.router.navigateByUrl('/portal/representatives');
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

  selectedData: any;

  selected(event: any) {
    let target = event.source.selected._element.nativeElement;
    this.selectedData = {
      value: event.value,
      text: target.innerText.trim(),
    };
    this.hide = true;
    if (this.selectedData.text == 'Unidad Organizacional') {
      this.selection = [];
      for (let i = 0; i <= this.organizational.length - 1; i++) {
        this.selection.push({
          value: i.toString(),
          viewValue: this.organizational[i].viewValue.toString(),
        });
      }
    }
    if (this.selectedData.text == 'Unidad Academica') {
      this.selection = [];
      for (let i = 0; i <= this.institutions.length - 1; i++) {
        this.selection.push({
          value: i.toString(),
          viewValue: this.institutions[i].viewValue.toString(),
        });
      }
    }
  }

  unit_selected(event: any) {
    let target = event.source.selected._element.nativeElement;
    let data = { value: '', text: '' };
    if (this.selectedData.value == 'Unidad Organizacional') {
      data = {
        value: String(
          this.organizational[Number(event.value)].value.toString()
        ),
        text: target.innerText.trim(),
      };
    }
    if (this.selectedData.value == 'Unidad Academica') {
      data = {
        value: String(this.institutions[Number(event.value)].value.toString()),
        text: target.innerText.trim(),
      };
    }
    this.selected_unit = parseInt(data.value);
  }

  save_representative() {
    const formData = new FormData();
    formData.append(
      'first_name',
      (this.representative_form.get('first_name') as UntypedFormControl).value
    );
    formData.append(
      'last_name',
      (this.representative_form.get('last_name') as UntypedFormControl).value
    );
    formData.append(
      'user_name',
      (this.representative_form.get('user_name') as UntypedFormControl).value
    );

    if (this.selectedData.text == 'Unidad Organizacional') {
      formData.append('origin_university', '');
      formData.append(
        'origin_organizational_unit',
        this.selected_unit.toString()
      );
    }
    if (this.selectedData.text == 'Unidad Academica') {
      formData.append('origin_organizational_unit', '');
      formData.append('origin_university', this.selected_unit.toString());
    }

    formData.append(
      'user',
      (this.representative_form.get('user') as UntypedFormControl).value
    );
    formData.append(
      'email',
      (this.representative_form.get('email') as UntypedFormControl).value
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
      if (!this.isWaiting) {
        this.isWaiting = true;
        this.representatives
          .addRepresentative(JSON.stringify(this.data))
          .subscribe(
            (res) => {
              $.unblockUI();
              this.router.navigateByUrl('/portal/representatives');
              this.toastr.success('Representante agregado correctamente.');
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
      this.representatives
        .editRepresentative(Number(this.id), JSON.stringify(this.data))
        .subscribe(
          (res) => {
            $.unblockUI();
            this.router.navigateByUrl('/portal/representatives');
            this.toastr.success('Representante modificado correctamente.');
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
