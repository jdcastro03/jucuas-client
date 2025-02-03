import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/auth/services/auth.service';
import { environment } from 'src/environments/environment';
import { ADTSettings } from 'angular-datatables/src/models/settings';
import { ActivityManagerService } from '../../services/activity-manager.service';

declare var $: any;
@Component({
  selector: 'app-activity-managers',
  templateUrl: './activity-managers.component.html',
  styleUrls: ['./activity-managers.component.css']
})
export class ActivityManagersComponent implements OnInit, OnDestroy {
  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective|undefined;
  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject<ADTSettings>();

  activity_managers_list: any;
  activity_manager_id: Number | null = null;
  apiUrl: string = environment.apiURL;
  //validator: boolean;
  constructor(
    private activity_managers: ActivityManagerService,
    private auth: AuthService,
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
    this.get_activity_manager_list();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  get_activity_manager_list() {
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
    this.activity_managers.activityManagers().subscribe(
      (res) => {
        this.activity_managers_list = res;
        this.dtTrigger.next(res);
        $.unblockUI();
      },
      (error) => {
        if (error['status'] == 401) {
          this.router.navigateByUrl('/auth/portal_login"');
          this.toastr.warning('Credenciales inválidas, vuelva iniciar sesión.');
          //agregar un clearToken
        } else {
          this.toastr.error('Error: ' + error);
        }
        $.unblockUI();
      }
    );
  }

  set_activity_manager_id(id: Number) {
    this.activity_manager_id = id;
  }

  delete_activity_manager() {
    this.activity_managers.deleteActivityManager(Number(this.activity_manager_id)).subscribe((res) => {
      this.toastr.success('Responsable de actividad eliminado correctamente.');
      this.dtElement?.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
      });
      this.get_activity_manager_list();
    });
  }

}
