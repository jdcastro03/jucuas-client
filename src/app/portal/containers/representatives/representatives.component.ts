import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/auth/services/auth.service';
import { environment } from 'src/environments/environment';
import { ADTSettings } from 'angular-datatables/src/models/settings';
import { RepresentativeService } from '../../services/representatives.service';

declare var $: any;

@Component({
  selector: 'app-representatives',
  templateUrl: './representatives.component.html',
  styleUrls: ['./representatives.component.css'],
})
export class RepresentativesComponent implements OnInit, OnDestroy {
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective | undefined;
  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject<ADTSettings>();

  representatives_list: any;
  representative_id: number | null = null;
  apiUrl: string = environment.apiURL;
  //validator: boolean;

  constructor(
    private representative: RepresentativeService,
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
      this.get_representatives_list();
    } else {
      this.router.navigateByUrl('/portal/dashboard');
      this.toastr.warning('No se pudo acceder a la página solicitada.');
    }
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  get_representatives_list() {
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
    this.representative.representatives().subscribe(
      (res) => {
        this.representatives_list = res;
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

  set_representative_id(id: number) {
    this.representative_id = id;
  }

  delete_representative() {
    this.representative
      .deleteRepresentative(Number(this.representative_id))
      .subscribe((res) => {
        this.toastr.success('Representante eliminado correctamente.');
        this.dtElement?.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
        });
        this.get_representatives_list();
      });
  }
  //agregar funcion para validar permisos
}
