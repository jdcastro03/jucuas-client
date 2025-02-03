import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import {
  VerifyUniqueUserDataParameterModel,
  VerifyUniqueUserDataType,
} from '../models/verify-unique-user-data-parameter.model';
import { map } from 'rxjs';
import { PaginationWrapperModel } from '../models/pagination-wrapper.model';
import { PresenterModel } from '../models/presenter.model';

@Injectable({
  providedIn: 'root',
})
export class PresentersService {
  apiURL: string = `${environment.apiURL}/presenter/`;
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };
  constructor(private http: HttpClient) {
    this.presenters = this.presenters.bind(this);
    this.getfilteredtablepresenters =
      this.getfilteredtablepresenters.bind(this);
  }

  //Presenters
  presenters(getUrl: string) {
    return this.http
      .get(`${this.apiURL}list/?${getUrl}`)
      .pipe(
        map((response) => response as PaginationWrapperModel<PresenterModel>)
      );
  }

  getfilteredpresenters(filter: JSON) {
    return this.http.post(
      `${this.apiURL}filteredlist/`,
      filter,
      this.httpOptions
    );
  }

  getfilteredtablepresenters(filter: JSON, getUrl: string) {
    return this.http
      .post(
        `${this.apiURL}filteredlisttable/?${getUrl}`,
        filter,
        this.httpOptions
      )
      .pipe(
        map((response) => response as PaginationWrapperModel<PresenterModel>)
      );
  }

  addPresenter(data: any) {
    return this.http
      .post(`${this.apiURL}create/`, data, this.httpOptions)
      .pipe(map((response) => response as any));
  }

  presenterDetail(id: number) {
    return this.http.get(`${this.apiURL}${id}/`);
  }

  //funcion para editar presentador
  editPresenter(id: number, data: any) {
    return this.http.put(`${this.apiURL}${id}/`, data, this.httpOptions);
  }

  // funcion para borrar un presentador mediante id
  deletePresenter(id: number) {
    return this.http.delete(`${this.apiURL}${id}/`);
  }

  updateGender(data: any, headers: any) {
    return this.update('gender', data, headers);
  }
  updateName(data: any, headers: any) {
    return this.update('name', data, headers);
  }
  updateEmail(data: any, headers: any) {
    return this.update('email', data, headers);
  }
  updatePhone(data: any, headers: any) {
    return this.update('phone', data, headers);
  }

  update(url: string, data: any, headers: any) {
    return this.http.post(`${this.apiURL}update_${url}/`, data, headers);
  }
  //funcion para verificar si el telefono ya está registrado
  //retorna 1 si el telefono ya existe
  //retorna 0 si el telefono no existe
  verifyUniqueUserData(ty: VerifyUniqueUserDataType, tel: string, id: string) {
    let data: VerifyUniqueUserDataParameterModel = {
      type: ty,
      data: tel,
      user: id,
    };

    return this.http.post(`${this.apiURL}verify/`, data, this.httpOptions);
  }
}
