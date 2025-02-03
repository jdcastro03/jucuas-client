import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import {
  VerifyUniqueUserDataParameterModel,
  VerifyUniqueUserDataType,
} from '../models/verify-unique-user-data-parameter.model';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminsService {
  getCookie(name: string) {
    const cookieValue = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
    return cookieValue ? cookieValue.pop() : '';
  }
  getHeaders() {
    const csrfToken: any = this.getCookie('csrftoken');
    return {
      'Content-Type': 'application/json',
      'X-CSRFToken': csrfToken,
    }
  }

  apiURL: string = `${environment.apiURL}/auth/`;
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(private http: HttpClient) {
    //this.admins = this.admins.bind(this);
  }



  updateName(data: any, headers: any) {return this.update('name', data, headers);}
  updateEmail(data: any, headers: any) {return this.update('email', data, headers);}
  updatePhone(data: any, headers: any) {return this.update('phone', data, headers);}
  updateGender(data: any, headers: any) {return this.update('gender', data, headers);}
  getGender(data: any, headers: any) {return this.http.post(`${this.apiURL}my_gender/`, data, headers);}

  update(url:string, data: any, headers: any) {
    return this.http.post(`${this.apiURL}update_${url}/`, data, headers);
  }

  estadisticas(id_edicion: string){
    let data = {
      "id_edition":id_edicion
    }
    return this.http.post(`${environment.apiURL}/activity/statistics/`, data);
  }
}
