import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PaginationWrapperModel } from '../../models/pagination-wrapper.model';
import { Observable } from 'rxjs';

declare var $: any;

@Component({
  selector: 'app-input-search',
  templateUrl: './input-search.component.html',
  styleUrls: ['./input-search.component.css'],
})
export class InputSearchComponent {
  //PRESENTADORES
  constructor(private router: Router, private toastr: ToastrService) {}

  @Input() getPaginationWrapperFunction!: (
    filter: JSON,
    getUrl: string
  ) => Observable<PaginationWrapperModel<any>>;

  @Input()
  set pageSize(pageSize) {
    this._pageSize = pageSize;
    this.pageSizeChange.emit(this._pageSize);
    this.currentPage = 1;
    //if (this.filtro.length >= 3) {
    //  this.getTable(this.filtro);
    //}
  }
  get pageSize() {
    return this._pageSize;
  }
  @Output() pageSizeChange = new EventEmitter<number>();

  @Input()
  set currentPage(currentPage: number) {
    this._currentPage = currentPage;
    this.currentPageChange.emit(this._currentPage);
    if (this.filtro.length >= 3) {
      this.getTable(this.filtro);
    }
  }
  get currentPage() {
    return this._currentPage;
  }
  @Output() currentPageChange = new EventEmitter<number>();

  @Input()
  set arrayEntries(arrayEntries: any[]) {
    this.array_entries = arrayEntries;
    this._arrayEntries = arrayEntries;
    this.arrayEntriesChange.emit(this._arrayEntries);
  }
  get arrayEntries() {
    return this._arrayEntries;
  }
  @Output() arrayEntriesChange = new EventEmitter<any[]>();

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

  @Input()
  set next(next: string) {
    this._next = next;
    this.nextChange.emit(this._next);
  }
  get next() {
    return this._next;
  }
  @Output() nextChange = new EventEmitter<string>();

  @Input()
  set previous(previous: string) {
    this._previous = previous;
    this.previousChange.emit(this._previous);
  }
  get previous() {
    return this._previous;
  }
  @Output() previousChange = new EventEmitter<string>();

  private _next: string = '';
  private _previous: string = '';
  private _firstEntry: number = 0;
  private _count: number = 0;
  private _lastEntry: number = 0;
  private _arrayEntries: any[] = [];
  private _pageSize: number = 20;
  private _currentPage: number = 1;

  filtro: string = '';
  @Output() filtroChange = new EventEmitter<string>();

  @Input() form: string = '';
  array_entries: any[] = [];
  pre_Control = new FormControl('');
  selected_presenter: string = '';
  blacklist: string[] = [];
  mensaje: string = 'Para buscar coloque mínimo 3 caracteres y presione enter';
  isLoading: boolean = false;

  onSearchChange(event: any) {
    let last = this.filtro.length;
    this.filtro = event.target.value;
    this.filtroChange.emit(this.filtro);
    if (this.filtro.length >= 3 && event.key == 'Enter') {
      this.currentPage = 1;
      this.getTable(this.filtro);
    } else if (this.filtro.length <= 2 && last >= 3) {
      this.currentPage = 1;
    }
  }

  getTable(filter: string) {
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
    let url = 'p=' + this.currentPage + '&page_size=' + this.pageSize;
    const data: JSON = <JSON>(<unknown>{
      filter: filter,
      form: this.form,
    });
    this.getPaginationWrapperFunction(data, url).subscribe(
      (res: any) => {
        this.arrayEntries = res.results;
        this.next = res.next;
        this.previous = res.previous;
        this.count = res.count;
        if (this.count == 0) {
          this.firstEntry = 0;
          this.lastEntry = 0;
        } else {
          this.firstEntry = (this.currentPage - 1) * this.pageSize + 1;
          this.lastEntry = this.firstEntry + this.arrayEntries.length - 1;
        }
        this.isLoading = false;
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
        this.isLoading = false;
      }
    );
  }
}
