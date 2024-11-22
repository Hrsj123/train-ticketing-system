import { HttpClient, HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CustomerRegistration, UserLogin } from '../model/class/User';
import { IUser } from '../model/interface/user';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  baseUrl: string = "http://localhost:8080/api/v1"
  httpOptions: object = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  constructor(private http: HttpClient) { }

  postCustomer(newCustomer: CustomerRegistration): Observable<HttpResponse<any>> {
    return this.http.post<any>(this.baseUrl + "/customers/register", newCustomer, {
      ...this.httpOptions,
      observe: 'response',
    });
  }

  postCustomerLogin(loginCredentials: UserLogin): Observable<HttpResponse<any>> {
    return this.http.post<any>(this.baseUrl +  "/customers/login", loginCredentials, {
      ...this.httpOptions,
      observe: 'response',
    });
  }
  
}
