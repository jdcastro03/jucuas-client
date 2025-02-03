import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import {
  VerifyUniqueUserDataParameterModel,
  VerifyUniqueUserDataType,
} from '../models/verify-unique-user-data-parameter.model';
import { map, Observable } from 'rxjs';
import { PaginationWrapperModel } from '../models/pagination-wrapper.model';
import { PresenterModel } from '../models/presenter.model';
import { JsonPipe } from '@angular/common';
@Injectable({
    providedIn: 'root',
})
export class ProfileService {
    apiURL: string = `${environment.apiURL}/auth/`
    httpOptions = {
        headers: new HttpHeaders({'Content-Type': 'application/json'})
      }
    constructor(private http: HttpClient) {}

    //profile

    myself(): Observable<Profile> {
      // const apiUrl = 'http://localhost:8011/auth/'; // Replace with your API base URL
      return this.http.get<Profile>(`${this.apiURL}users/current/`)
          .pipe(map((response) => response as Profile));
  }


    addprofile(data:any) {
        return this.http.post(`${this.apiURL}create/`, data, this.httpOptions);
    }

    profileDetail(id:number) {
        return this.http.get(`${this.apiURL}${id}/`);
    }

    editprofile(id:number, data:any) {
        return this.http.put(`${this.apiURL}${id}/`, data, this.httpOptions);
    }

    deleteprofile(id:number) {
        return this.http.delete(`${this.apiURL}${id}/`);
    }
}
interface Profile{
  username:string;
  first_name:string;
  last_name:string;
  email:string;
  groups:JSON[];
  is_active:boolean;
  is_superuser:boolean;
}
