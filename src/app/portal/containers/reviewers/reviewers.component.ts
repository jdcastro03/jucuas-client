import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/auth/services/auth.service';
import { environment } from 'src/environments/environment';
import { ADTSettings } from 'angular-datatables/src/models/settings';
import { ReviewerService } from '../../services/reviewer.service';

declare var $: any;
@Component({
  selector: 'app-reviewers',
  templateUrl: './reviewers.component.html',
  styleUrls: ['./reviewers.component.css'],
})
export class ReviewersComponent implements OnInit, OnDestroy {
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective | undefined;
  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject<ADTSettings>();

  reviewer_unit_list: string[] = []
  reviewers_list: any;
  reviewer_id: Number | null = null;
  apiUrl: string = environment.apiURL;
  //validator: boolean;
  constructor(
    private reviewers: ReviewerService,
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
      this.get_reviewer_list();
    } else {
      this.router.navigateByUrl('/portal/dashboard');
      this.toastr.warning('No se pudo acceder a la página solicitada.');
    }
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  get_reviewer_list() {
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
    this.reviewers.reviewers().subscribe(
      (res) => {
        console.log(res)
        this.reviewers_list = res;

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

  set_reviewer_id(id: Number) {
    this.reviewer_id = id;
  }

  delete_reviewer() {
    this.reviewers.deleteReviewer(Number(this.reviewer_id)).subscribe((res) => {
      this.toastr.success('Revisador eliminado correctamente.');
      this.dtElement?.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
      });
      this.get_reviewer_list();
    });
  }
}
