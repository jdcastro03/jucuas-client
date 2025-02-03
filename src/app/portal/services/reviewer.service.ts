import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root',
})
export class ReviewerService {
    apiURL: string = `${environment.apiURL}/reviewer/`
    httpOptions = {
        headers: new HttpHeaders({'Content-Type': 'application/json'})
      }
    constructor(private http: HttpClient) {}

    //Reviewer

    reviewers() {
        return this.http.get(`${this.apiURL}list/`);
    }

    addReviewer(data:any) {
        return this.http.post(`${this.apiURL}create/`, data, this.httpOptions);
    }

    reviewerDetail(id:number) {
        return this.http.get(`${this.apiURL}${id}/`);
    }

    editReviewer(id:number, data:any) {
        return this.http.put(`${this.apiURL}${id}/`, data, this.httpOptions);
    }

    deleteReviewer(id:number) {
        return this.http.delete(`${this.apiURL}${id}/`);
    }
}