import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root',
})
export class ActivityManagerService {
    apiURL: string = `${environment.apiURL}/activity/manager/`
    httpOptions = {
        headers: new HttpHeaders({'Content-Type': 'application/json'})
      }
    constructor(private http: HttpClient) {}

    //Activity Manager

    activityManagers() {
        return this.http.get(`${this.apiURL}list/`);
    }

    addActivityManager(data:any) {
        return this.http.post(`${this.apiURL}create/`, data, this.httpOptions);
    }

    activityManagerDetail(id:number) {
        return this.http.get(`${this.apiURL}${id}/`);
    }

    editActivityManager(id:number, data:any) {
        return this.http.put(`${this.apiURL}${id}/`, data, this.httpOptions);
    }

    deleteActivityManager(id:number) {
        return this.http.delete(`${this.apiURL}${id}/`);
    }
}