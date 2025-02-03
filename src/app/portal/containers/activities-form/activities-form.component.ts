import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { ActivitiesService } from '../../services/activities.service';
import { TypeActivitiesService } from '../../services/type-activities.service';
import { PresentersService } from '../../services/presenters.service';
import { MatDialog } from '@angular/material/dialog';
import { PresentersFormComponent } from '../presenters-form/presenters-form.component';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';
import { AuthService } from 'src/app/auth/services/auth.service';
import { type } from 'os';

declare var $: any;

interface Choice {
  value: string;
  viewValue: string;
}

interface ChoiceActivity {
  value: string;
  viewValue: string;
  max: string;
}

export interface User {
  name: string;
  last: string;
}

@Component({
  selector: 'app-activities-form',
  templateUrl: './activities-form.component.html',
  styleUrls: ['./activities-form.component.css', '../../../app.component.css'],
})
export class ActivitiesFormComponent implements OnInit {
  //MODAL
  //COOPRESENTADORES
  co_Control = new FormControl('');
  co_text = '';
  InputShow: boolean = false;
  copresenter_msg: string = '';
  isWaiting = false;
  user = {
    username: '',
    first_name: '',
    last_name: '',
    origin_university: '',
    origin_organizational_unit: '',
    email: '',
    groups: [{ name: '' }],
  };
  //*ngIf="user.groups[0].name == 'admin'"
  //PRESENTADORES
  pre_Control = new FormControl('');
  pre_text = '';
  //EDICIONES
  edition_Control = new FormControl('');
  selected_edition: string = '';
  //ACTIVIDADES
  activity_Control = new FormControl('');
  //FORMULARIO
  activity_form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    numbers_expected_attendees: new FormControl('', [
      Validators.maxLength(3),
      Validators.pattern('^[0-9]*$'),
    ]),
    numbers_total_attendees: new FormControl('0', [
      Validators.maxLength(3),
      Validators.pattern('^[0-9]*$'),
    ]),
    modality: new FormControl(''),
    date_activity: new FormControl(''),
    edition_list: new FormControl(''),
    educational_level_to_is_directed: new FormControl(''),
    area_knowledge: new FormControl(''),
    type_of_public: new FormControl(''),
    presenter: new FormControl(''),
    co_presenter: new FormControl(''),
    type: new FormControl(''),
    is_active: new FormControl(true, Validators.required),
  });

  get f() {
    return this.activity_form.controls;
  }

  form_type: string = 'Agregar';
  id: string | null = null;
  activity_obj: any;
  apiURL: string = environment.apiURL;
  data: any = {};
  max_copresenters: number = 0;

  modalities: Choice[] = [
    { value: 'V', viewValue: 'Virtual' },
    { value: 'P', viewValue: 'Presencial' },
    { value: 'H', viewValue: 'Híbrida (Virtual y Presencial)' },
  ];

  educational_levels: Choice[] = [
    { value: 'PCO', viewValue: 'Público en general' },
    { value: 'PREESC', viewValue: 'Preescolar' },
    { value: 'PRIM', viewValue: 'Primaria' },
    { value: 'SEC', viewValue: 'Secundaria' },
    { value: 'MDSUP', viewValue: 'Media superior' },
    { value: 'SUP', viewValue: 'Superior' },
  ];

  knowledge_areas: Choice[] = [
    { value: 'I', viewValue: 'I. Físico-Matemáticas y Ciencias de la Tierra' },
    { value: 'II', viewValue: 'II. Biología y Química' },
    { value: 'III', viewValue: 'III. Medicina y Ciencias de la Salud' },
    { value: 'IV', viewValue: 'IV. Ciencias de la Conducta y la Educación' },
    { value: 'V', viewValue: 'V. Humanidades' },
    { value: 'VI', viewValue: 'VI. Ciencias Sociales' },
    {
      value: 'VII',
      viewValue:
        'VII. Ciencias de la Agricultura, Agropecuarias, Forestales y de Ecosistemas',
    },
    { value: 'VIII', viewValue: 'VIII. Ingenierías y Desarrollo Tecnológico' },
    { value: 'IX', viewValue: 'IX. Investigación Multidisciplinaria' },
  ];

  types_of_public: Choice[] = [
    { value: 'INT', viewValue: 'Interno' },
    { value: 'EXT', viewValue: 'Externo' },
  ];

  typeActivitiesList: ChoiceActivity[] = [];
  presentersList: Choice[] = [];
  copresentersList: Choice[] = [];
  selected_copresentersList: Choice[] = [];
  editions: Choice[] = [];

  constructor(
    private activities: ActivitiesService,
    private type_activities: TypeActivitiesService,
    private presenters: PresentersService,
    private copresenters: PresentersService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    public dialog: MatDialog,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    if (localStorage['group'] == 'admin' || 'representative') {
      this.getAuth();
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

      //Tomar lista de ediciones
      this.activities.editionList().subscribe(
        (res: any) => {
          res.forEach((element: { [x: string]: any }) => {
            this.editions.push({
              value: element['id'],
              viewValue: `${element['date_edition']}: ${element['name_edition']}`,
            });
          });
        },
        (error) => {
          this.router.navigateByUrl('/portal/activities');
          this.toastr.error(error['error'].detail, 'Error');
        }
      );
      this.id = this.route.snapshot.paramMap.get('id');
      this.getTypeActivities();
      
      $.unblockUI();
    } else {
      this.router.navigateByUrl('/portal/dashboard');
      this.toastr.warning('No se pudo acceder a la página solicitada.');
    }
  }

  get_activity_data(){
    if (this.id == 'add') {
      this.form_type = 'Agregar';
    } else {
      this.form_type = 'Editar';
      this.activities.activityDetail(Number(this.id)).subscribe(
        (res: any) => {
          let co_presenter: Array<String> = [];
          let res_co_presenter: any;
          delete res['id'];
          delete res['created_by'];
          delete res['evidences'];
          delete res['certificate_file'];
          delete res['activity_status'];
          var id = res['type'] = res['type'].id;
          //TOMAR NOMBRES DE CADA COPRESENTADOR
          res_co_presenter = res['co_presenter'];
          res_co_presenter.forEach((element: any) => {
            this.activities.presenterDetail(Number(element)).subscribe(
              (res_co: any) => {
                this.selected_copresentersList.push({
                  value: res_co[0]['id'],
                  viewValue:
                    res_co[0]['first_name'] + ' ' + res_co[0]['last_name'],
                });
                this.items.push(
                  res_co[0]['first_name'] + ' ' + res_co[0]['last_name']
                );
                this.blacklist.push(res_co[0]['id']);

                this.itemChangeAct("",id);
              },
              (error) => {
                this.router.navigateByUrl('/portal/activities');
                this.toastr.error(error['error'].detail, 'Error');
              }
            );
          });
          //LLENAR LA LISTA DE COPRESENTADORES CON SUS NOMBRES
          res['co_presenter'] = co_presenter;
          console.log(this.blacklist)

          this.selected_presenter = res['presenter'].id;
          res['presenter'] = res['presenter'].first_name + ' ' + res['presenter'].last_name;
          res['edition_list'] = res['edition'];
          this.selected_edition = res['edition']['id'];
          delete res['edition'];
          this.activity_obj = res;
          this.activity_form.setValue(this.activity_obj);
          //this.selected_edition = this.get_edition_name(this.selected_edition)
          //this.activity_form.controls['edition_list'].setValue(this.selected_edition)
        },
        (error) => {
          this.router.navigateByUrl('/portal/activities');
          this.toastr.error(error['error'].detail, 'Error');
        }
      );
    }
  }

  get_edition_name(id: string) {
    for (let i = 0; i < this.editions.length; i++) {
      if (this.editions[i].value == id) {
        return this.editions[i].viewValue;
      }
    }
    return '';
  }

  save_activity() {
    const formData = new FormData();
    formData.append(
      'name',
      (this.activity_form.get('name') as FormControl).value
    );
    formData.append(
      'description',
      (this.activity_form.get('description') as FormControl).value
    );
    formData.append(
      'numbers_expected_attendees',
      (this.activity_form.get('numbers_expected_attendees') as FormControl)
        .value
    );
    formData.append('numbers_total_attendees', '0');
    formData.append(
      'modality',
      (this.activity_form.get('modality') as FormControl).value
    );
    formData.append(
      'type_of_public',
      (this.activity_form.get('type_of_public') as FormControl).value
    );
    formData.append(
      'date_activity',
      (this.activity_form.get('date_activity') as FormControl).value
    );
    formData.append(
      'educational_level_to_is_directed',
      (
        this.activity_form.get(
          'educational_level_to_is_directed'
        ) as FormControl
      ).value
    );
    formData.append(
      'area_knowledge',
      (this.activity_form.get('area_knowledge') as FormControl).value
    );
    formData.append('presenter', this.selected_presenter);
    formData.append(
      'co_presenter',
      (this.activity_form.get('co_presenter') as FormControl).value
    );
    if (localStorage['group'] == 'admin') {
      formData.append(
        'edition',
        (this.activity_form.get('edition_list') as FormControl).value
      );
    } else {
      formData.append('edition', this.selected_edition);
    }

    formData.append(
      'type',
      (this.activity_form.get('type') as FormControl).value
    );
    if (this.form_type == 'Agregar') {
      formData.append('created_by', '');
    }

    formData.forEach((value: any, key) => {
      if (key == 'co_presenter') {
        let arrvalue: Number[] = [];
        for (let i = 0; i < this.selected_copresentersList.length; i++) {
          arrvalue.push(Number(this.selected_copresentersList[i].value));
        }
        this.data[key] = arrvalue;
      } else if (key == 'date_activity') {
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
        this.activities.addActivity(JSON.stringify(this.data)).subscribe(
          (res) => {
            $.unblockUI();
            this.router.navigateByUrl('/portal/activities');
            this.toastr.success('Actividad agregada correctamente.');
            this.isWaiting = false;
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
      this.activities
        .editActivity(Number(this.id), JSON.stringify(this.data))
        .subscribe(
          (res) => {
            $.unblockUI();
            this.router.navigateByUrl('/portal/activities');
            this.toastr.success('Actividad modificada correctamente.');
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

  getAuth() {
    if (this.auth.isAuth()) {
      this.auth.currentUser().subscribe((res: any) => {
        this.user = res;
      });
    }
  }

  getTypeActivities() {
    this.type_activities.typeActivities().subscribe(
      (res: any) => {
        let type_activities: ChoiceActivity[] = [];
        for (let key in res) {
          if (Object.prototype.hasOwnProperty.call(res, key)) {
            type_activities.push({
              value: res[key].id,
              viewValue: res[key].name,
              max: res[key].maxCopresenter,
            });
          }
        }
        this.typeActivitiesList = type_activities;
        console.log(this.typeActivitiesList)
        this.get_activity_data()
      },
      () => {
        this.router.navigateByUrl('/portal/activities');
        this.toastr.error('Error!');
      }
    );
  }

  //PRESENTADOR
  onSearchChange(event: any) {
    let filter = event.target.value;
    if (filter.length >= 3 && filter.length < 7) {
      this.getPresenter(filter);
    }
    if (filter.length < 3) {
      this.presentersList = [];
      this.selected_presenter = '';
    }
  }

  getPresenter(filter: string) {
    const data: JSON = <JSON>(<unknown>{
      filter: filter,
    });
    this.presenters.getfilteredpresenters(data).subscribe(
      (res: any) => {
        let presenters: Choice[] = [];
        for (let key in res) {
          if (Object.prototype.hasOwnProperty.call(res, key)) {
            if (
              this.blacklist.indexOf(res[key].id) < 0 &&
              res[key].id != this.selected_presenter
            ) {
              presenters.push({
                value: res[key].id,
                viewValue: res[key].first_name + ' ' + res[key].last_name,
              });
            }
          }
        }
        this.presentersList = presenters;
      },
      () => {
        this.router.navigateByUrl('/portal/activities');
        this.toastr.error('Error!');
      }
    );
  }

  //COPRESENTADOR
  onSearchChangeCo(event: any) {
    let filter = event.target.value;
    if (filter.length >= 3 && filter.length < 7) {
      this.getCopresenter(filter);
    }
    if (filter.length < 3) {
      this.copresentersList = [];
    }
  }

  getCopresenter(filter: string) {
    const data: JSON = <JSON>(<unknown>{
      filter: filter,
    });
    this.copresenters.getfilteredpresenters(data).subscribe(
      (res: any) => {
        let copresenters: Choice[] = [];
        for (let key in res) {
          if (Object.prototype.hasOwnProperty.call(res, key)) {
            if (
              this.blacklist.indexOf(res[key].id) < 0 &&
              res[key].id != this.selected_presenter
            ) {
              copresenters.push({
                value: res[key].id,
                viewValue: res[key].first_name + ' ' + res[key].last_name,
              });
            }
          }
        }
        this.copresentersList = copresenters;
      },
      () => {
        this.router.navigateByUrl('/portal/activities');
        this.toastr.error('Error!');
      }
    );
  }
  blacklist: Array<string> = [];
  selected_presenter: string = '';
  presenter_name: string = '';
  items: string[] = [];

  addItem(item: string) {
    //AGREGAR COOPRESENTADOR A LA LISTA
    this.items.push(item);
  }

  removeItem(index: number) {
    //REMOVER COOPRESENTADOR DE LA LISTA
    this.items.splice(index, 1);
    this.selected_copresentersList.splice(index, 1);
    this.blacklist.splice(index, 1);
  }

  itemChangeCo(value: string, index: number) {
    //FUNCION PARA DETECTAR QUE UN COOPRESENTADOR FUE SELECCIONADO
    if (this.items.length < this.max_copresenters) {
      this.addItem(value);
      this.blacklist.push(this.copresentersList[index].value);
      this.selected_copresentersList.push({
        value: this.copresentersList[index].value,
        viewValue: this.copresentersList[index].viewValue,
      });
      this.co_text = '';
      this.copresentersList = [];
    }
    if (this.items.length >= this.max_copresenters) {
      //PONER UN TOAST AQUI PA Q DIGA QUE NO SE PUEDEN AGREGAR MAS COPRESENTADORES EN ESE TIPO DE ACTIVIDAD
    }
  }

  itemChangePre(value: string, index: number) {
    //FUNCION PARA DETECTAR QUE UN PRESENTADOR FUE SELECCIONADO
    this.selected_presenter = this.presentersList[index].value;
    this.presentersList = [];
  }

  //ACTIVIDADES
  itemChangeAct(value: string, index: number) {
    console.log(index)
    //FUNCION PARA DETECTAR QUE UNA ACTIVIDAD FUE SELECCIONADA
    console.log(this.typeActivitiesList[index-1].max);
    this.max_copresenters = Number(this.typeActivitiesList[index-1].max);
    this.InputShow = true;
    this.blacklist
    console.log(this.blacklist)
    this.copresenter_msg =
      'Seleccione hasta ' +
      (Number(this.typeActivitiesList[index-1].max)-this.blacklist.length) +
      ' colaboradores';
    while (this.items.length > this.max_copresenters) {
      let len = this.items.length - 1;
      this.items.splice(len, 1);
      this.selected_copresentersList.splice(len, 1);
      this.blacklist.splice(len, 1);
    }
  }
  //MODAL
  openDialog() {}
}
