import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { Observable, Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { ADTSettings } from 'angular-datatables/src/models/settings';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ActivitiesService } from '../../services/activities.service';
import { DeadlineService } from '../../services/deadline.service';
import { ConstancyComponent } from '../constancy/constancy.component';
import { TablePaginationComponent } from '../table-pagination/table-pagination.component';
import { PaginationWrapperModel } from '../../models/pagination-wrapper.model';

declare var $: any;

@Component({
  selector: 'app-evidences',
  templateUrl: './evidences.component.html',
  styleUrls: ['./evidences.component.css'],
  providers: [ConstancyComponent],
})
export class EvidencesComponent implements OnInit, OnDestroy {
  @ViewChild(TablePaginationComponent)
  child!: TablePaginationComponent;
  dtElement: DataTableDirective | undefined;
  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject<ADTSettings>();

  activities_list: any;

  activity_id: number | null = null;
  evidence_id: number | null = null;
  evidence_type_id: number | null = null;
  evidence_name: string | null = null;
  evidence_type: string | null = null;
  evidence_file: string = '';
  evidence_url: string | null = null;
  evidence_status: string | null = null;
  evidence_observation: string | null = null;
  user_group: string | null = null;
  apiUrl: string = environment.apiURL;
  add_evidences: boolean = false;
  validate_evidences: boolean = false;
  data: any = {};
  pageSize: number = 10;
  currentPage: number = 1;
  filter: string = '';
  next: string = '';
  previous: string = '';
  count: number = 0;
  firstEntry: number = 0;
  lastEntry: number = 0;
  paginationWrapperFunction!: (
    page: string
  ) => Observable<PaginationWrapperModel<any>>;

  constructor(
    public activities: ActivitiesService,
    private constansy: ConstancyComponent,
    private auth: AuthService,
    private deadline: DeadlineService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.dtOptions = {
      language: {
        url: '//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json',
      },
    };
  }

  isAdmin: boolean = false;

  ngOnInit(): void {

    if (
      localStorage['group'] == 'admin' ||
      localStorage['group'] == 'representative'
    ) {
      this.add_evidences = true;
    }
    if (
      localStorage['group'] == 'admin' ||
      localStorage['group'] == 'reviewer'
    ) {
      this.validate_evidences = true;
    }

    if (localStorage['group'] == 'admin') {
      //agregar que los revisores tambien puedan ver todo pero no modificar
      this.paginationWrapperFunction = this.activities.activities;
      this.user_group = 'admin';
    } else if (
      localStorage['group'] == 'reviewer' &&
      localStorage['isGlobal']
    ) {
      this.get_deadlines_validate_evidences(); //REVISAR LA FECHA DE VALIDACION DE EVIDENCIA
      this.paginationWrapperFunction = this.activities.activities;
      this.user_group = 'reviewer';
    } else if (localStorage['group'] == 'reviewer') {
      this.get_deadlines_validate_evidences(); //REVISAR LA FECHA DE VALIDACION DE EVIDENCIA
      this.paginationWrapperFunction = this.activities.activitiesByRegion;
      this.user_group = 'reviewer';
    } else if (localStorage['group'] == 'representative') {
      this.get_deadlines_upload_evidences(); //REVISAR LA FECHA DE SUBIDA DE EVIDENCIA
      this.paginationWrapperFunction = this.activities.activitiesByRepresenter;
    }
    this.show()
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  set_activity_and_evidence_id(
    activity_id: number,
    evidence_id: number,
    evidence_type_id: number,
    evidence_name: string,
    evidence_type: string,
    evidence_status: string,
    evidence_observation: string
  ) {
    this.activity_id = activity_id;
    this.evidence_id = evidence_id;
    this.evidence_type_id = evidence_type_id;
    this.evidence_name = evidence_name;
    this.evidence_type = evidence_type;
    this.evidence_status = evidence_status;
    this.evidence_observation = evidence_observation;
    this.evidence_url = '';
    this.evidence_file = '';
    this.activities_list.forEach((value: any, key: any) => {
      if (value.id == activity_id) {
        value.evidences.forEach((v: any, k: any) => {
          if (
            v.type_evidence.id == evidence_type_id &&
            evidence_type == 'PDF'
          ) {
            this.evidence_file = v.evidence_file;
          } else if (
            v.type_evidence.id == evidence_type_id &&
            evidence_type == 'URL'
          ) {
            this.evidence_url = v.name;
          }
        });
      }
    });
  }

  show(){
    console.log(this.activities_list)
  }

  //CAMBIAR EN EL BACK EL ENDPOINT PARA QUE SEA UNO PARA
  //VALIDAR LA FECHA DE SUBIDA DE ACTIVIDADES
  //Y OTRA PARA LA DE EVIDENCIAS
  //CAMBIAR AQUI TAMBIEN EL ENDPOINT
  get_deadlines_validate_evidences() {
    this.data['deadline'] = 'validate_evidences';
    this.deadline.currentDeadlines(JSON.stringify(this.data)).subscribe(
      (res: any) => {
        this.validate_evidences = true;
      },
      (error) => {
        if (error['status'] == 401) {
          this.router.navigateByUrl('/auth/portal_login"');
          this.toastr.warning('Credenciales inválidas, vuelva iniciar sesión.');
          //agregar un clearToken
        } else {
          //this.toastr.error('Error: ' + error['error'].message);
          this.validate_evidences = false;
        }
        $.unblockUI();
      }
    );
  }

  get_deadlines_upload_evidences() {
    this.data['deadline'] = 'upload_evidences';
    this.deadline.currentDeadlines(JSON.stringify(this.data)).subscribe(
      (res: any) => {
        this.add_evidences = true;
      },
      (error) => {
        if (error['status'] == 401) {
          this.router.navigateByUrl('/auth/portal_login"');
          this.toastr.warning('Credenciales inválidas, vuelva iniciar sesión.');
          //agregar un clearToken
        } else {
          this.toastr.error('Error: ' + error['error'].message);
          this.add_evidences = false;
        }
        $.unblockUI();
      }
    );
  }

  re_generate_constansy(activity_id: number) {
    this.constansy.createCertificate(Number(activity_id));
  }
}
