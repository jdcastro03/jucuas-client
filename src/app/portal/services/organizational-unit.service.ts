import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root',
})
export class OrganizationalUnitService {
    apiURL: string = `${environment.apiURL}/university/organizational-unit/`
    httpOptions = {
        headers: new HttpHeaders({'Content-Type': 'application/json'})
      }
    constructor(private http: HttpClient) {}

    //Organizational Unit

    organizationalUnits() {
        return this.http.get(`${this.apiURL}list/`);
    }

    addOrganizationalUnit(data:any) {
        return this.http.post(`${this.apiURL}create/`, data, this.httpOptions);
    }

    organizationalUnitDetail(id:Number) {
        return this.http.get(`${this.apiURL}${id}/`);
    }

    editOrganizationalUnit(id:number, data:any) {
        return this.http.put(`${this.apiURL}${id}/`, data, this.httpOptions);
    }

    deleteOrganizationalUnit(id:number) {
        return this.http.delete(`${this.apiURL}${id}/`);
    }
}
