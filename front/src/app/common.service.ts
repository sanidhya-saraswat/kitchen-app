import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatSnackBar } from '../../node_modules/@angular/material';
import { BehaviorSubject } from '../../node_modules/rxjs';
export interface GlobalResponse {
  error: any;
  response: object;
}
@Injectable({
  providedIn: 'root'
})
export class CommonService {
  testingURL: string = environment.testingURL;
  options = {};

  constructor(private http: HttpClient,public snackBar: MatSnackBar) {
    const jsonHeads = new HttpHeaders();
    jsonHeads.append('Content-Type', 'application/x-www-form-urlencoded');
    jsonHeads.append('Access-Control-Allow-Origin', '');
    jsonHeads.append('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, access-control-allow-origin');
    this.options = { headers: jsonHeads, withCredentials: true }
  }
  httpGet(url: string) {
    return this.http.get<GlobalResponse>(this.testingURL + url, this.options)
  }

  httpPost(url: string, data: any) {
    return this.http.post<GlobalResponse>(this.testingURL + url, data, this.options)
  }
  
  httpPut(url: string, data: any) {
    return this.http.put<GlobalResponse>(this.testingURL + url, data, this.options)
  }

  openSnackBar(message: string) {
    this.snackBar.open(message,"", {
      duration: 4000,
    });}
}
