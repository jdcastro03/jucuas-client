import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root',
})
export class EvidencesService {
    apiURL: string = `${environment.apiURL}/activity/evidence/`
    apiURLForActivity: string = `${environment.apiURL}/activity/evidencesforactivity/`
    httpOptions = {
        headers: new HttpHeaders({'Content-Type': 'application/json'})
      }
    constructor(private http: HttpClient) {}

    //Evidences

    evidences() {
        return this.http.get(`${this.apiURL}list/`);
    }

    addEvidence(data:any) {
        return this.http.post(`${this.apiURL}create/`, data, this.httpOptions);
    }

    evidenceDetail(id:number) {
        return this.http.get(`${this.apiURL}${id}/`);
    }

    editEvidence(id:number, data:any) {
        return this.http.put(`${this.apiURL}${id}/`, data, this.httpOptions);
    }

    editValidateEvidence(id:number, data:any) {
        return this.http.put(`${this.apiURL}validate/${id}/`, data, this.httpOptions);
    }

    deleteEvidence(id:number) {
        return this.http.delete(`${this.apiURL}${id}/`);
    }

    evidencesByActivity(id:number) {
        return this.http.get(`${this.apiURLForActivity}${id}/`);
    }
}