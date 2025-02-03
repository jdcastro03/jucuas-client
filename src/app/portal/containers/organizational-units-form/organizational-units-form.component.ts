import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { OrganizationalUnitService } from '../../services/organizational-unit.service';
import { VerifyDataService } from '../../services/verify-data.service';

declare var $: any;

interface Choice {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-organizational-units-form',
  templateUrl: './organizational-units-form.component.html',
  styleUrls: [
    './organizational-units-form.component.css',
    '../../../app.component.css',
  ],
})
export class OrganizationalUnitsFormComponent implements OnInit {
  organizational_unit_form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    acronym: new FormControl(''),
    //acronym: new FormControl('', [Validators.required]),
    key_code: new FormControl('', [Validators.required]),
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
  organizational_unit_obj: any;
  apiURL: string = environment.apiURL;
  options: any;
  data: any = {};

  static _regions: Choice[] = [
    { value: 'N', viewValue: 'Norte' },
    { value: 'CN', viewValue: 'Centro Norte' },
    { value: 'C', viewValue: 'Centro' },
    { value: 'S', viewValue: 'Sur' },
  ];

  municipios = OrganizationalUnitsFormComponent._municipios;
  regions = OrganizationalUnitsFormComponent._regions;
  //    Agregado por MinMin AburridA
  // Basado en https://sau.uas.edu.mx/bachillerato/
  // y en https://sau.uas.edu.mx/nivel_superior/
  // LISTA PARA ELEGIR MUNICIPIO
  // v=value # llave del array de municipios
  // v[0]&&v[1]: codigo de municipio
  //
  static _municipios: Choice[] = [
    { value: 'AHN', viewValue: 'Ahome' },
    { value: 'ANCN', viewValue: 'Angostura' },
    { value: 'BACN', viewValue: 'Badiraguato' },
    { value: 'CHN', viewValue: 'Choix' },
    { value: 'CNS', viewValue: 'Concordia' },
    { value: 'COS', viewValue: 'Cosala' },
    { value: 'CUC', viewValue: 'Culiacan' },
    { value: 'EFN', viewValue: 'El Fuerte' },
    { value: 'ELS', viewValue: 'Elota' },
    { value: 'ESS', viewValue: 'Escuinapa' },
    { value: 'GVCN', viewValue: 'Guasave' },
    { value: 'MAS', viewValue: 'Mazatlan' },
    { value: 'MOCN', viewValue: 'Mocorito' },
    { value: 'NAC', viewValue: 'Navolato' },
    { value: 'ROS', viewValue: 'Rosario' },
    { value: 'SACN', viewValue: 'Salvador Alvarado' },
    { value: 'SIS', viewValue: 'San Ignacio' },
    { value: 'SNCN', viewValue: 'Sinaloa' },
  ];

  /*
  By Min Min AburridA
  Funcion que regresa el codigo de region a partir de un municipio
   params: s: cadena a evaluar
   return: subcadena de s a partir de 2
   ejemplo #1: s = 'GVCN', return 'CN'
   ejemplo #2: s = 'ESS', return 'S'
  */
  static get_region_code(s: string): string {
    return s.substring(2);
  }

  /*
  By MinMinmamasita
  Evento que al elegir un municipio para la OU, busca el codigo
    de region, y cambia el valor del select de dicho

  */
  onMunicipalityChange(event: any) {
    const selectedMunicipality = event.value,
      regionCode =
        OrganizationalUnitsFormComponent.get_region_code(selectedMunicipality);
    (this.organizational_unit_form.get('region') as FormControl).setValue(
      regionCode
    );
  }
  /* TODO:
    Poder elegir un municipio con select
    Asignar en automatico la region al elegir municipio
      y seguir dando la libertad de elegirle region, porque hay
      unidades centro norte, y centro de guasave, y centro y sur
      de culishi y maza
  */

  constructor(
    private organizational_units: OrganizationalUnitService,
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
        this.organizational_units
          .organizationalUnitDetail(Number(this.id))
          .subscribe(
            (res: any) => {
              delete res['id'];
              this.organizational_unit_obj = res;
              this.organizational_unit_form.setValue(
                this.organizational_unit_obj
              );
            },
            (error) => {
              this.router.navigateByUrl('/portal/organizational-units');
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

  save_organizational_unit() {
    const formData = new FormData();
    formData.append(
      'name',
      (this.organizational_unit_form.get('name') as FormControl).value
    );
    formData.append(
      'acronym',
      (this.organizational_unit_form.get('acronym') as FormControl).value
    );
    formData.append(
      'key_code',
      (this.organizational_unit_form.get('key_code') as FormControl).value
    );
    formData.append(
      'region',
      (this.organizational_unit_form.get('region') as FormControl).value
    );
    formData.append(
      'municipality',
      (this.organizational_unit_form.get('municipality') as FormControl).value
    );
    formData.append(
      'locality',
      (this.organizational_unit_form.get('locality') as FormControl).value
    );
    formData.append(
      'email',
      (this.organizational_unit_form.get('email') as FormControl).value
    );
    formData.append(
      'phone',
      (this.organizational_unit_form.get('phone') as FormControl).value
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
      this.organizational_units
        .addOrganizationalUnit(JSON.stringify(this.data))
        .subscribe(
          (res) => {
            $.unblockUI();
            this.router.navigateByUrl('/portal/organizational-units');
            this.toastr.success(
              'Unidad Organizacional agregada correctamente.'
            );
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
      this.organizational_units
        .editOrganizationalUnit(Number(this.id), JSON.stringify(this.data))
        .subscribe(
          (res) => {
            $.unblockUI();
            this.router.navigateByUrl('/portal/organizational-units');
            this.toastr.success(
              'Unidad Organizacional modificada correctamente.'
            );
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
