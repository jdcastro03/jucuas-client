import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { PaginationWrapperModel } from '../../models/pagination-wrapper.model';

declare var $: any;

// type ArrayEntries =
//   | PresenterModel
//   | RepresenterModel<OriginUniversityModel, OriginOrganizationalUnitModel>;

@Component({
  selector: 'app-table-pagination',
  templateUrl: './table-pagination.component.html',
  styleUrls: ['./table-pagination.component.css'],
})
export class TablePaginationComponent implements OnInit {
  constructor(private router: Router, private toastr: ToastrService) {}

  ngOnInit(): void {
    //this.get_table(`p=${this.currentPage}&page_size=${this.pageSize}`);
  }

  /**
   * Function need to be bind to **(this)** in service before input.
   */
  @Input() getPaginationWrapperFunction!: (
    page: string
  ) => Observable<PaginationWrapperModel<any>>;

  @Input()
  set pageSize(pageSize) {
    this._pageSize = pageSize;
    this.pageSizeChange.emit(this._pageSize);
    this.currentPage = 1;
    if (this.filtro.length < 3 && this.actBusq) {
      this.actBusq = false;
    } else if (this.filtro.length >= 3) {
      this.actBusq = true;
    }
    if (pageSize == this._pageSize && this.filter.length < 3) {
      this.get_table(`p=${this.currentPage}&page_size=${this.pageSize}`);
    }
  }
  get pageSize() {
    return this._pageSize;
  }
  @Output() pageSizeChange = new EventEmitter<number>();

  @Input()
  set currentPage(currentPage: number) {
    this._currentPage = currentPage;
    this.currentPageChange.emit(this._currentPage);
  }
  get currentPage() {
    return this._currentPage;
  }
  @Output() currentPageChange = new EventEmitter<number>();

  @Input()
  set arrayEntries(arrayEntries: any[]) {
    this._arrayEntries = arrayEntries;
    this.arrayEntriesChange.emit(this._arrayEntries);
  }
  get arrayEntries() {
    return this._arrayEntries;
  }
  @Output() arrayEntriesChange = new EventEmitter<any[]>();

  @Input()
  set nextPage(nextPage: string) {
    this._nextPage = nextPage;
    this.nextPageChange.emit(this._nextPage);
    this.isNextDisabled = !this.nextPage;
    this.isPreviousDisabled = !this.previousPage;
  }
  get nextPage() {
    return this._nextPage;
  }
  @Output() nextPageChange = new EventEmitter<string>();

  @Input()
  set previousPage(previousPage: string) {
    this._previousPage = previousPage;
    this.previousPageChange.emit(this._previousPage);
    this.isNextDisabled = !this.nextPage;
    this.isPreviousDisabled = !this.previousPage;
  }
  get previousPage() {
    return this._previousPage;
  }
  @Output() previousPageChange = new EventEmitter<string>();

  actBusq: boolean = false;
  @Input()
  set filtro(filtro: string) {
    this.filter = filtro;
    if (filtro.length < 3 && this.actBusq) {
      this.currentPage = 1;
      this.get_table(`p=${this.currentPage}&page_size=${this.pageSize}`);
      this.actBusq = false;
    } else if (filtro.length >= 3) {
      this.actBusq = true;
    }
  }
  get filtro() {
    return this._filtro;
  }

  msjEntries: string = '';

  @Input()
  set count(count: number) {
    this._count = count;
    this.countChange.emit(this._count);
  }
  get count() {
    return this._count;
  }
  @Output() countChange = new EventEmitter<number>();

  @Input()
  set lastEntry(lastEntry: number) {
    this._lastEntry = lastEntry;
    this.lastEntryChange.emit(this._lastEntry);
  }
  get lastEntry() {
    return this._lastEntry;
  }
  @Output() lastEntryChange = new EventEmitter<number>();

  @Input()
  set firstEntry(firstEntry: number) {
    this._firstEntry = firstEntry;
    this.firstEntryChange.emit(this._firstEntry);
  }
  get firstEntry() {
    return this._firstEntry;
  }
  @Output() firstEntryChange = new EventEmitter<number>();

  private _firstEntry: number = 0;
  private _count: number = 0;
  private _lastEntry: number = 0;
  private _filtro: string = '';
  private _previousPage: string = '';
  private _nextPage: string = '';
  private _arrayEntries: any[] = [];
  private _pageSize: number = 20;
  private _currentPage: number = 1;

  isNextDisabled: boolean = true;
  isPreviousDisabled: boolean = true;
  isLoading: boolean = false;
  filter: string = '';

  set_pagination(next: string, previous: string) {
    this.isNextDisabled = !next;
    this.isPreviousDisabled = !previous;
  }

  next_click() {
    if (this.isNextDisabled) return;
    this.currentPage += 1;
    if (this.filter.length < 3 && !this.actBusq) {
      this.get_table(String(this.nextPage?.split('?')[1]));
      this.actBusq = false;
    } else if (this.filter.length >= 3) {
      this.actBusq = true;
    }
  }

  previous_click() {
    if (this.isPreviousDisabled) return;
    this.currentPage -= 1;
    if (this.filter.length < 3 && !this.actBusq) {
      this.get_table(String(this.previousPage?.split('?')[1]));
      this.actBusq = false;
    } else if (this.filter.length >= 3) {
      this.actBusq = true;
    }
  }

  get_table(page: string) {
    this.isLoading = true;
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
    this.getPaginationWrapperFunction(page).subscribe(
      (res) => {
        this.arrayEntries = res.results;
        this.nextPage = res.next;
        this.previousPage = res.previous;
        this.count = res.count;
        if (this.count == 0) {
          this.firstEntry = 0;
          this.lastEntry = 0;
        } else {
          this.firstEntry = (this.currentPage - 1) * this.pageSize + 1;
          this.lastEntry = this.firstEntry + this.arrayEntries.length - 1;
        }
        this.msjEntries = `Showing ${this.firstEntry} to ${this.lastEntry} of ${this.count} results`;
        this.set_pagination(this.nextPage, this.previousPage);
        $.unblockUI();
        this.isLoading = false;
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
        this.isLoading = false;
      }
    );
  }
}
