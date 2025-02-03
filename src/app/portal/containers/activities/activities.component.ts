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
import { PaginationWrapperModel } from '../../models/pagination-wrapper.model';

declare var $: any;

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.css'],
})
export class ActivitiesComponent implements OnInit, OnDestroy {
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective | undefined;
  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject<ADTSettings>();

  activities_list: any;
  activity_id: number | null = null;
  apiUrl: string = environment.apiURL;
  add_activities: boolean = false;
  data: any = {};
  isAdmin: boolean = false;
  pageSize: number = 10;
  currentPage: number = 1;
  filter: string = '';
  next: string = '';
  previous: string = '';
  count: number = 0;
  firstEntry: number = 0;
  lastEntry: number = 0;
  isPresenter: boolean = false;
  paginationWrapperFunction!: (
    page: string
  ) => Observable<PaginationWrapperModel<any>>;

  constructor(
    public activities: ActivitiesService,
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

  ngOnInit(): void {
    if (localStorage['group'] == 'admin') {
      //agregar que los revisores tambien puedan ver todo pero no modificar
      this.isAdmin = true;
      this.add_activities = true;
      this.paginationWrapperFunction = this.activities.activities;
    } else if (localStorage['group'] == 'representative') {
      this.isAdmin = true;
      this.get_deadlines();
      this.paginationWrapperFunction = this.activities.activitiesByRepresenter;
    } else if (localStorage['group'] == 'presenter') {
      this.isPresenter = true;
      this.isAdmin = false;
      this.paginationWrapperFunction = this.activities.activitiesByPresenter;
    } else {
      this.router.navigateByUrl('/portal/dashboard');
      this.toastr.warning('No se pudo acceder a la página solicitada.');
    }
  }

  show(){
    console.log(this.activities_list)
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  set_activity_id(id: number) {
    this.activity_id = id;
  }

  delete_activity() {
    this.activities
      .deleteActivity(Number(this.activity_id))
      .subscribe((res) => {
        this.toastr.success('Actividad eliminada correctamente.');
      });
  }

  get_deadlines() {
    this.data['deadline'] = 'upload_activities';
    this.deadline.currentDeadlines(JSON.stringify(this.data)).subscribe(
      (res: any) => {
        this.add_activities = true;
      },
      (error) => {
        if (error['status'] == 401) {
          this.router.navigateByUrl('/auth/portal_login"');
          this.toastr.warning('Credenciales inválidas, vuelva iniciar sesión.');
          //agregar un clearToken
        } else {
          //this.toastr.error('Error: ' + error['error'].message);
          this.add_activities = false;
        }
        $.unblockUI();
      }
    );
  }
  //agregar funcion para validar permisos
}
