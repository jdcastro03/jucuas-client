import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { PaginationWrapperModel } from '../models/pagination-wrapper.model';
import { UniversityModel } from '../containers/universities/universities.component';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UniversityService {
  apiURL: string = `${environment.apiURL}/university/university/`;
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };
  constructor(private http: HttpClient) {}

  //University

  universities() {
    return this.http.get(`${this.apiURL}list/`);
  }

  /*universitiesTable(getUrl: string) {
    return this.http
      .get(`${this.apiURL}list/?${getUrl}`)
      .pipe(
        map((response) => response as PaginationWrapperModel<UniversityModel>)
      );
  }*/

  addUniversity(data: any) {
    return this.http.post(`${this.apiURL}create/`, data, this.httpOptions);
  }

  universityDetail(id: number) {
    return this.http.get(`${this.apiURL}${id}/`);
  }

  editUniversity(id: number, data: any) {
    return this.http.put(`${this.apiURL}${id}/`, data, this.httpOptions);
  }

  deleteUniversity(id: number) {
    return this.http.delete(`${this.apiURL}${id}/`);
  }
}
