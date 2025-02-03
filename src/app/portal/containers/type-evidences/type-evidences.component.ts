import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { ADTSettings } from 'angular-datatables/src/models/settings';
import { AuthService } from 'src/app/auth/services/auth.service';
import { TypeEvidencesService } from '../../services/type-evidences.service';

declare var $: any;

@Component({
  selector: 'app-type-evidences',
  templateUrl: './type-evidences.component.html',
  styleUrls: ['./type-evidences.component.css'],
})
export class TypeEvidencesComponent implements OnInit, OnDestroy {
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective | undefined;
  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject<ADTSettings>();

  type_evidences_list: any;
  type_evidence_id: number | null = null;
  apiUrl: string = environment.apiURL;
  //validator: boolean;

  constructor(
    private type_evidences: TypeEvidencesService,
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
      this.get_type_evidences_list();
    } else {
      this.router.navigateByUrl('/portal/dashboard');
      this.toastr.warning('No se pudo acceder a la página solicitada.');
    }
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  get_type_evidences_list() {
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
    this.type_evidences.typeEvidences().subscribe(
      (res) => {
        this.type_evidences_list = res;
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

  set_type_evidence_id(id: number) {
    this.type_evidence_id = id;
  }

  delete_type_evidence() {
    this.type_evidences
      .deleteTypeEvidence(Number(this.type_evidence_id))
      .subscribe((res) => {
        this.toastr.success('Tipo de evidencia eliminada correctamente.');
        this.dtElement?.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
        });
        this.get_type_evidences_list();
      });
  }
  //agregar funcion para validar permisos
}
