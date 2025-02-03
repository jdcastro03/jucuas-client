import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { PaginationWrapperModel } from '../models/pagination-wrapper.model';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ActivitiesService {
  apiURL: string = `${environment.apiURL}/activity/`;
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };
  constructor(private http: HttpClient) {
    this.activities = this.activities.bind(this);
    this.activitiesByRepresenter = this.activitiesByRepresenter.bind(this);
    this.activitiesByPresenter = this.activitiesByPresenter.bind(this);
    this.activitiesByRegion = this.activitiesByRegion.bind(this);
    this.getFilteredTableActivities =
      this.getFilteredTableActivities.bind(this);
  }

  //Activities

  activities(getUrl: string) {
    return this.http
      .get(`${this.apiURL}list/?${getUrl}`)
      .pipe(map((response) => response as PaginationWrapperModel<any>));
  }

  getFilteredTableActivities(filter: JSON, getUrl: string) {
    return this.http
      .post(
        `${this.apiURL}filteredlisttable/?${getUrl}`,
        filter,
        this.httpOptions
      )
      .pipe(map((response) => response as PaginationWrapperModel<any>));
  }

  activitiesByRepresenter(getUrl: string) {
    return this.http
      .get(`${this.apiURL}list/representer/?${getUrl}`)
      .pipe(map((response) => response as PaginationWrapperModel<any>));
  }

  activitiesByPresenter(getUrl: string) {
    return this.http
      .get(`${this.apiURL}list/presenter/?${getUrl}`)
      .pipe(map((response) => response as PaginationWrapperModel<any>));
  }

  addActivity(data: any) {
    return this.http.post(`${this.apiURL}create/`, data, this.httpOptions);
  }

  activityDetail(id: number) {
    return this.http.get(`${this.apiURL}${id}/`);
  }

  editionList() {
    return this.http.get(`${environment.apiURL}/deadline/list/`);
  }

  presenterDetail(id: number) {
    return this.http.post(`${environment.apiURL}/presenter/get_copresenter/`, {
      id: id,
    });
  }

  editActivity(id: number, data: any) {
    return this.http.put(`${this.apiURL}${id}/`, data, this.httpOptions);
  }

  deleteActivity(id: number) {
    return this.http.delete(`${this.apiURL}${id}/`);
  }

  activitiesByRegion(getUrl: string) {
    return this.http
      .get(`${this.apiURL}list/region/?${getUrl}`)
      .pipe(map((response) => response as PaginationWrapperModel<any>));
  }

  partialUpdateActivity(id: number, data: any) {
    return this.http.put(
      `${this.apiURL}partial/activity/${id}/`,
      data,
      this.httpOptions
    );
  }

  partialUpdateSavePDFActivity(id: number, data: any) {
    return this.http.put(
      `${this.apiURL}partial/pdf/${id}/`,
      data,
      this.httpOptions
    );
  }
}
