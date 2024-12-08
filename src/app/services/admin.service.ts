import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IUser } from '../model/interface/user';
import { IBooking } from '../model/interface/booking';
import { TrainRegister } from '../model/class/Train';
import { TokenService } from './authentication/token.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private baseUrl: string = environment.API_URL;
  private httpHeaders: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
  });
  private accessToken: string | null;

  constructor(private http: HttpClient, private tokenService: TokenService) {
    this.accessToken = tokenService.getAccessToken();
  }

  getDashboardUsers(): Observable<IUser[]> {
    const httpOptions: object = {
      headers: this.httpHeaders.set('Authorization', `Bearer ${this.accessToken}`),
    }
    return this.http.get<IUser[]>(this.baseUrl + "/customers", httpOptions);
  }
  
  getDashboardBookings(): Observable<IBooking[]> {
    const httpOptions: object = {
      headers: this.httpHeaders.set('Authorization', `Bearer ${this.accessToken}`),
    }
    return this.http.get<IBooking[]>(this.baseUrl + "/bookings", httpOptions);
  }
  
  postReisterTrain(newTrainData: TrainRegister): Observable<HttpResponse<any>> {
    const httpOptions: object = {
      headers: this.httpHeaders.set('Authorization', `Bearer ${this.accessToken}`).set('observe', 'response'),
    }
    
    let { trainNumber, ...postBody } = newTrainData;
    postBody.trainName = postBody.trainName + " " + trainNumber;
    
    return this.http.post<any>(this.baseUrl + "/admin/trains", postBody, {
      ...httpOptions,
      observe: 'response',
    });
  }
  
  updateTrain(trainId: number, updatedTrain: TrainRegister): Observable<HttpResponse<any>> {
    const httpOptions: object = {
      headers: this.httpHeaders.set('Authorization', `Bearer ${this.accessToken}`),
    }
    const url = `${this.baseUrl}/admin/trains/${trainId}`;
    // TODO : fix this
    // console.log("----------------------------------")
    // console.log({
      //   ...updatedTrain,
      //   startDateTime: updatedTrain.startDateTime.toISOString().slice(0, 19),
      //   endDateTime: updatedTrain.endDateTime.toISOString().slice(0, 19),
      // })
    // console.log(url)
    // console.log("----------------------------------")
    return this.http.put<any>(url, {
      ...updatedTrain,
      startDateTime: updatedTrain.startDateTime.toISOString().slice(0, 19),
      endDateTime: updatedTrain.endDateTime.toISOString().slice(0, 19),
    }, {
      ...httpOptions,
      observe: 'response',
    });
  }

  
  deleteTrain(trainId: number): Observable<HttpResponse<any>> {
    const httpOptions: object = {
      headers: this.httpHeaders.set('Authorization', `Bearer ${this.accessToken}`),
    }
    const url = `${this.baseUrl}/admin/trains/${trainId}`;

    return this.http.delete<any>(url, {
      ...httpOptions,
      observe: 'response',
    });
  }

}
