import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TypeActivitiesService {
  apiURL: string = `${environment.apiURL}/activity/type/activity/`;
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };
  constructor(private http: HttpClient) {}

  //TypeActivities

  typeActivities() {
    return this.http.get(`${this.apiURL}list/`);
  }

  addTypeActivity(data: any) {
    return this.http.post(`${this.apiURL}create/`, data, this.httpOptions);
  }

  typeActivityDetail(id: number) {
    return this.http.get(`${this.apiURL}${id}/`);
  }

  editTypeActivity(id: number, data: any) {
    return this.http.put(`${this.apiURL}${id}/`, data, this.httpOptions);
  }

  syncTypeActivity(data: any){
    return this.http.post(`${environment.apiURL}/activity/evidence/updateTables`, data, this.httpOptions);
  }

  deleteTypeActivity(id: number) {
    return this.http.delete(`${this.apiURL}${id}/`);
  }
}
