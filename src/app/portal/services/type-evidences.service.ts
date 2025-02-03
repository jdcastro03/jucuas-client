import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root',
})
export class TypeEvidencesService {
    apiURL: string = `${environment.apiURL}/activity/type/evidence/`
    httpOptions = {
        headers: new HttpHeaders({'Content-Type': 'application/json'})
      }
    constructor(private http: HttpClient) {}

    //TypeEvidences

    typeEvidences() {
        return this.http.get(`${this.apiURL}list/`);
    }

    addTypeEvidence(data:any) {
        return this.http.post(`${this.apiURL}create/`, data, this.httpOptions);
    }

    typeEvidenceDetail(id:number) {
        return this.http.get(`${this.apiURL}${id}/`);
    }

    editTypeEvidence(id:number, data:any) {
        return this.http.put(`${this.apiURL}${id}/`, data, this.httpOptions);
    }

    deleteTypeEvidence(id:number) {
        return this.http.delete(`${this.apiURL}${id}/`);
    }
}