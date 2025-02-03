import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/auth/services/auth.service';
import { environment } from 'src/environments/environment';
import { ADTSettings } from 'angular-datatables/src/models/settings';
import { OrganizationalUnitService } from '../../services/organizational-unit.service';

declare var $: any;
@Component({
  selector: 'app-organizational-units',
  templateUrl: './organizational-units.component.html',
  styleUrls: ['./organizational-units.component.css'],
})
export class OrganizationalUnitsComponent implements OnInit, OnDestroy {
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective | undefined;
  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject<ADTSettings>();

  organizational_units_list: any;
  organizational_unit_id: Number | null = null;
  apiUrl: string = environment.apiURL;
  //validator: boolean;
  constructor(
    private organizational_units: OrganizationalUnitService,
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
      this.get_organizational_units_list();
    } else {
      this.router.navigateByUrl('/portal/dashboard');
      this.toastr.warning('No se pudo acceder a la página solicitada.');
    }
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  get_organizational_units_list() {
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
    this.organizational_units.organizationalUnits().subscribe(
      (res) => {
        this.organizational_units_list = res;
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

  set_organizational_unit_id(id: Number) {
    this.organizational_unit_id = id;
  }

  delete_organizational_unit() {
    this.organizational_units
      .deleteOrganizationalUnit(Number(this.organizational_unit_id))
      .subscribe((res) => {
        this.toastr.success('Unidad Organizacional eliminada correctamente.');
        this.dtElement?.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
        });
        this.get_organizational_units_list();
      });
  }
}
export interface organizational_unit_model {
  id: number;
  name: string;
  acronym: string;
  key_code: null;
  region: string;
  municipality: string;
  locality: string;
  email: string;
  phone: string;
  is_active: boolean;
}
