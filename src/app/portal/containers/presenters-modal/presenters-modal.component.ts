import { Component, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';

import {
  UntypedFormGroup,
  FormControl,
  Validators,
  AsyncValidatorFn,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { PresentersService } from '../../services/presenters.service';
import { OrganizationalUnitService } from '../../services/organizational-unit.service';
import { UniversityService } from '../../services/university.service';
import { VerifyDataService } from '../../services/verify-data.service';
import { resolve } from 'dns';

declare var $: any;

interface Choice {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-presenters-modal',
  templateUrl: './presenters-modal.component.html',
  styleUrls: ['./presenters-modal.component.css'],
})
export class PresentersModalComponent implements OnInit {
  grades: Choice[] = [
    { value: 'Licenciatura', viewValue: 'Licenciatura' },
    { value: 'Maestría', viewValue: 'Maestría' },
    { value: 'Doctorado', viewValue: 'Doctorado' },
  ];

  presenter_form = new UntypedFormGroup({
    first_name: new FormControl('', [Validators.required]),
    last_name: new FormControl('', [Validators.required]),
    gender: new FormControl('', [Validators.required]),
    email: new FormControl(
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
    curp: new FormControl(
      '',
      [Validators.minLength(18), Validators.maxLength(18)],
      [
        this.verify
          .verifyDataValidator(
            'curp',
            18,
            this.route.snapshot.paramMap.get('id')
          )
          .bind(this),
      ]
    ),
    phone: new FormControl(
      '',
      [
        Validators.minLength(10),
        Validators.maxLength(10),
        Validators.pattern('^[0-9]*$'),
      ],
      [
        this.verify
          .verifyDataValidator(
            'phone',
            10,
            this.route.snapshot.paramMap.get('id')
          )
          .bind(this),
      ]
    ),
    academic_degree: new FormControl('', [Validators.required]),
    origin_university: new FormControl(''),
    origin_organizational_unit: new FormControl(''),
    if_belong_to_school: new FormControl(false, [Validators.required]),
    position_institution: new FormControl(''),
    birth_date: new FormControl(''),
    user: new FormControl(''),
    is_active: new FormControl(true, Validators.required),
  });

  form_type: string = 'Agregar';
  id: string | null = null;
  presenter_obj: any;
  apiURL: string = environment.apiURL;
  options: any;
  data: any = {};
  d: Date = new Date();

  genders: Choice[] = [
    { value: 'H', viewValue: 'Hombre' },
    { value: 'M', viewValue: 'Mujer' },
    { value: 'O', viewValue: 'Otro' },
  ];

  positions_institutions: Choice[] = [
    { value: '1', viewValue: 'Estudiante' },
    { value: '2', viewValue: 'Maestro' },
    { value: '3', viewValue: 'Director' },
    { value: '4', viewValue: 'Personal de confianza' },
    { value: '5', viewValue: 'Externo' },
  ];

  institutions: Choice[] = [];
  organizational: Choice[] = [];

  constructor(
    private presenters: PresentersService,
    private universities: UniversityService,
    private organizationalunit: OrganizationalUnitService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private verify: VerifyDataService
  ) {}

  ngOnInit(): void {
    this.presenter_form.valueChanges.subscribe(() =>
      console.log(this.presenter_form)
    );

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
        if (Object.prototype.hasOwnProperty.call(res, key)) {
          universities.push({
            value: res[key].id,
            viewValue: res[key].name,
          });
        }
      }
      console.log(universities);
      this.institutions = universities;
    });

    this.organizationalunit.organizationalUnits().subscribe((res: any) => {
      let organizationalunit: Choice[] = [];
      organizationalunit.push({
        value: '',
        viewValue: 'No pertenece a una Unidad Organizacional',
      });
      for (let key in res) {
        if (Object.prototype.hasOwnProperty.call(res, key)) {
          organizationalunit.push({
            value: res[key].id,
            viewValue: res[key].name,
          });
        }
      }
      this.organizational = organizationalunit;
    });

    this.id = this.route.snapshot.paramMap.get('id') ?? 'add';
    if (this.id == 'add') {
      this.form_type = 'Agregar';
    }
    $.unblockUI();
  }

  save_presenter() {
    const formData = new FormData();
    formData.append(
      'first_name',
      (this.presenter_form.get('first_name') as FormControl).value
    );
    formData.append(
      'last_name',
      (this.presenter_form.get('last_name') as FormControl).value
    );
    formData.append(
      'gender',
      (this.presenter_form.get('gender') as FormControl).value
    );
    formData.append(
      'email',
      (this.presenter_form.get('email') as FormControl).value
    );
    formData.append(
      'phone',
      (this.presenter_form.get('phone') as FormControl).value
    );
    formData.append(
      'academic_degree',
      (this.presenter_form.get('academic_degree') as FormControl).value
    );
    formData.append(
      'curp',
      (this.presenter_form.get('curp') as FormControl).value
    );
    if (
      (this.presenter_form.get('origin_university') as FormControl).value == 0
    ) {
      formData.append('origin_university', '');
    } else {
      formData.append(
        'origin_university',
        (this.presenter_form.get('origin_university') as FormControl).value
      );
    }

    if (
      (this.presenter_form.get('origin_organizational_unit') as FormControl)
        .value == 0
    ) {
      formData.append('origin_organizational_unit', '');
    } else {
      formData.append(
        'origin_organizational_unit',
        (this.presenter_form.get('origin_organizational_unit') as FormControl)
          .value
      );
    }

    formData.append(
      'if_belong_to_school',
      (this.presenter_form.get('if_belong_to_school') as FormControl).value
    );
    formData.append(
      'position_institution',
      (this.presenter_form.get('position_institution') as FormControl).value
    );
    formData.append(
      'birth_date',
      (this.presenter_form.get('birth_date') as FormControl).value
    );
    //formData.append('user', (this.presenter_form.get('user_name') as FormControl).value);
    formData.forEach((value, key) => {

      if (key == 'birth_date') {
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
      this.presenters.addPresenter(JSON.stringify(this.data)).subscribe(
        (res) => {
          $.unblockUI();
          this.toastr.success('Participante agregado correctamente.');
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
