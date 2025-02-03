import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs';
import { PaginationWrapperModel } from '../models/pagination-wrapper.model';
import { RepresenterModel } from '../models/representer.model';

@Injectable({
  providedIn: 'root',
})
export class RepresentativeService {
  apiURL: string = `${environment.apiURL}/representative/`;
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };
  constructor(private http: HttpClient) {
    this.representatives = this.representatives.bind(this);
  }

  //Representative

  representatives() {
    return this.http.get(`${this.apiURL}list/`);
  }

  addRepresentative(data: any) {
    return this.http.post(`${this.apiURL}create/`, data, this.httpOptions);
  }

  representativeDetail(id: number) {
    return this.http.get(`${this.apiURL}${id}/`);
  }

  editRepresentative(id: number, data: any) {
    return this.http.put(`${this.apiURL}${id}/`, data, this.httpOptions);
  }

  deleteRepresentative(id: number) {
    return this.http.delete(`${this.apiURL}${id}/`);
  }
}
