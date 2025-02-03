import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root',
})
export class ConstancyService {
    apiURL: string = `${environment.apiURL}/activity/`
    httpOptions = {
        headers: new HttpHeaders({'Content-Type': 'application/json'})
      }
    constructor(private http: HttpClient) {}

    qr_generator(data:any) {
        return this.http.post(`${this.apiURL}qr_generator/`, data, this.httpOptions);
    }

    pyjwt_generator(data:any) {
        return this.http.post(`${this.apiURL}pyjwt_generator/`, data, this.httpOptions);
    }

    pyjwt_verify_qr(data:any) {
        return this.http.post(`${this.apiURL}pyjwt_verify_qr/`, data, this.httpOptions);
    }

    send_certificate(data:any) {
        return this.http.post(`${this.apiURL}send_certificate/`, data, this.httpOptions);
    }

    activityConstansy(data:any) {
        return this.http.post(`${this.apiURL}list/activity_constansy/`, data, this.httpOptions);
    }

    
}