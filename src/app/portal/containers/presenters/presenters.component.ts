import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { Observable, Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { ADTSettings } from 'angular-datatables/src/models/settings';
import { AuthService } from 'src/app/auth/services/auth.service';
import { PresentersService } from '../../services/presenters.service';
import { PresenterModel } from '../../models/presenter.model';
import { PaginationWrapperModel } from '../../models/pagination-wrapper.model';

declare var $: any;

@Component({
  selector: 'app-presenters',
  templateUrl: './presenters.component.html',
  styleUrls: ['./presenters.component.css'],
})
export class PresentersComponent implements OnInit, OnDestroy {
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective | undefined;
  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject<ADTSettings>();
  presenters_list: PresenterModel[] = [];
  presenter_id: number | null = null;
  apiUrl: string = environment.apiURL;
  pageSize: number = 10;
  currentPage: number = 1;
  filter: string = '';
  next: string = '';
  previous: string = '';
  count: number = 0;
  firstEntry: number = 0;
  lastEntry: number = 0;
  //validator: boolean;
  paginationWrapperFunction!: (
    page: string
  ) => Observable<PaginationWrapperModel<any>>;

  constructor(
    public presenters: PresentersService,
    private auth: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.dtOptions = {
      language: {
        url: '//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json',
      },
      ordering: false,
    };
  }

  ngOnInit(): void {
    if (localStorage['group'] == 'admin' || localStorage['group'] == 'representative') {
      this.paginationWrapperFunction = this.presenters.presenters;
    } else {
      this.router.navigateByUrl('/portal/dashboard');
      this.toastr.warning('No se pudo acceder a la página solicitada.');
    }
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  set_presenter_id(id: number) {
    this.presenter_id = id;
  }

  delete_presenter() {
    this.presenters
      .deletePresenter(Number(this.presenter_id))
      .subscribe((res) => {
        this.toastr.success('Participante eliminado correctamente.');
      });
  }
}
