import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/auth/services/auth.service';
import { environment } from 'src/environments/environment';
import { ADTSettings } from 'angular-datatables/src/models/settings';
import { UniversityService } from '../../services/university.service';

declare var $: any;
@Component({
  selector: 'app-universities',
  templateUrl: './universities.component.html',
  styleUrls: ['./universities.component.css'],
})
export class UniversitiesComponent implements OnInit, OnDestroy {
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective | undefined;
  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject<ADTSettings>();
  universities_list: any;
  university_id: Number | null = null;
  apiUrl: string = environment.apiURL;
  pageSize: number = 20;
  currentPage: number = 1;

  constructor(
    private universities: UniversityService,
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
    if (localStorage['group'] == 'admin') {
      this.get_universities_list();
    } else {
      this.router.navigateByUrl('/portal/dashboard');
      this.toastr.warning('No se pudo acceder a la página solicitada.');
    }
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  get_universities_list() {
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
    this.universities.universities().subscribe(
      (res) => {
        this.universities_list = res;
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

  set_university_id(id: Number) {
    this.university_id = id;
  }

  delete_university() {
    this.universities
      .deleteUniversity(Number(this.university_id))
      .subscribe((res) => {
        this.toastr.success('Unidad Academica eliminada correctamente.');
        this.dtElement?.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
        });
        this.get_universities_list();
      });
  }
}
export interface UniversityModel {
  id: Number;
  name: string;
}
