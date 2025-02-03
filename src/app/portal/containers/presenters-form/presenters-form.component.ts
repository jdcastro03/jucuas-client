import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { PresentersService } from '../../services/presenters.service';
import { OrganizationalUnitService } from '../../services/organizational-unit.service';
import { UniversityService } from '../../services/university.service';
import { VerifyUniqueUserDataType } from '../../models/verify-unique-user-data-parameter.model';
import { resolve } from 'dns';
import { VerifyDataService } from '../../services/verify-data.service';

declare var $: any;

interface Choice {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-presenters-form',
  templateUrl: './presenters-form.component.html',
  styleUrls: ['./presenters-form.component.css', '../../../app.component.css'],
})
export class PresentersFormComponent implements OnInit {
  form_type: string = 'Agregar';
  id: string | null = null;
  presenter_obj: any;
  apiURL: string = environment.apiURL;
  options: any;
  data: any = {};
  isWaiting = false;
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

  grades: Choice[] = [
    { value: 'Licenciatura', viewValue: 'Licenciatura' },
    { value: 'Maestría', viewValue: 'Maestría' },
    { value: 'Doctorado', viewValue: 'Doctorado' },
  ];

  institutions: Choice[] = [];
  organizational: Choice[] = [];

  constructor(
    private presenters: PresentersService,
    private universities: UniversityService,
    private organizationalunit: OrganizationalUnitService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private verify: VerifyDataService
  ) {}

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

  ngOnInit(): void {
    if (
      localStorage['group'] == 'admin' ||
      localStorage['group'] == 'representative'
    ) {
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

      this.id = this.route.snapshot.paramMap.get('id');
      if (this.id == 'add') {
        this.form_type = 'Agregar';
      } else {
        this.form_type = 'Editar';
        this.presenters.presenterDetail(Number(this.id)).subscribe(
          (res: any) => {
            let origin_university: any;
            let origin_organizational_unit: any;
            res['user'] = res['id'] + 1;
            delete res['id'];
            delete res['user_name'];
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

            this.presenter_obj = res;
            this.presenter_form.setValue(this.presenter_obj);
          },
          (error) => {
            this.router.navigateByUrl('/portal/presenters');
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

  save_presenter() {
    //obtener fecha de cumpleaños de la curp en pipipi
    let jijija = (
      this.presenter_form.get('curp') as FormControl
    ).value.substring(4, 10);
    const yy = jijija.substr(0, 2);
    const mm = jijija.substr(2, 2);
    const dd = jijija.substr(4, 2);
    let pipipi = `${mm}-${dd}-${yy}`;

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
    formData.append('birth_date', pipipi);

    formData.append(
      'user',
      (this.presenter_form.get('user') as FormControl).value
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
      if (!this.isWaiting) {
        this.isWaiting = true;
        this.presenters.addPresenter(JSON.stringify(this.data)).subscribe(
          (res) => {
            if (res['message']) {
              $.unblockUI();
              this.toastr.error(res['message']);
              this.isWaiting = false;
            } else {
              $.unblockUI();
              this.router.navigateByUrl('/portal/presenters');
              this.toastr.success('Participante agregado correctamente.');
              this.isWaiting = false;
            }
          },
          (error) => {
            let errors = error['error'];
            for (let e in errors) {
              this.toastr.error(errors[e], 'Error!');
              this.isWaiting = false;
            }
            $.unblockUI();
          }
        );
      }
    } else if (this.form_type == 'Editar') {
      this.presenters
        .editPresenter(Number(this.id), JSON.stringify(this.data))
        .subscribe(
          (res) => {
            $.unblockUI();
            this.router.navigateByUrl('/portal/presenters');
            this.toastr.success('Participante modificado correctamente.');
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
