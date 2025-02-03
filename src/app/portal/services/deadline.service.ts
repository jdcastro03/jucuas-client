import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root',
})
export class DeadlineService {
    apiURL: string = `${environment.apiURL}/deadline/`
    httpOptions = {
        headers: new HttpHeaders({'Content-Type': 'application/json'})
      }
    constructor(private http: HttpClient) {}

    //Deadline

    deadlines() {
        return this.http.get(`${this.apiURL}list/`);
    }

    addDeadline(data:any) {
        return this.http.post(`${this.apiURL}create/`, data, this.httpOptions);
    }

    deadlineDetail(id:number) {
        return this.http.get(`${this.apiURL}${id}/`);
    }

    editDeadline(id:number, data:any) {
        return this.http.put(`${this.apiURL}${id}/`, data, this.httpOptions);
    }

    deleteDeadline(id:number) {
        return this.http.delete(`${this.apiURL}${id}/`);
    }

    currentDeadlines(data:any) {
        return this.http.post(`${this.apiURL}current/`, data, this.httpOptions);
    }

}