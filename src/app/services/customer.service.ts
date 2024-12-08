import { HttpClient, HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CustomerRegistration, UserLogin } from '../model/class/User';
import { IUser } from '../model/interface/user';
import { TokenService } from './authentication/token.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  baseUrl: string = environment.API_URL;
  private httpHeaders: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  constructor(private http: HttpClient, private tokenService: TokenService) { }

  private getAuthHeader(): HttpHeaders {
    return this.httpHeaders.set('Authorization', `Bearer ${this.tokenService.getAccessToken()}`);
  }

  postCustomer(newCustomer: CustomerRegistration): Observable<HttpResponse<any>> {
    return this.http.post<any>(`${this.baseUrl}/customers/register`, newCustomer, {
      headers: this.getAuthHeader(),
      observe: 'response',
    });
  }

  postCustomerLogin(loginCredentials: UserLogin): Observable<HttpResponse<any>> {
    return this.http.post<any>(`${this.baseUrl}/customers/login`, loginCredentials, {
      headers: this.getAuthHeader(),
      observe: 'response',
    });
  }

  // TODO: replace with interface
  bookTickets(bookingData: any): Observable<HttpResponse<any>> {
    return this.http.post<any>(`${this.baseUrl}/bookings`, bookingData, {
      headers: this.getAuthHeader(),
      observe: 'response',
    });
  }
  
}
