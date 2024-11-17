import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IUser } from '../model/interface/user';
import { IBooking } from '../model/interface/booking';
import { TrainRegister } from '../model/class/Train';

@Injectable({
  providedIn: 'root'
})
export class AdminDashboardService {
  baseUrl: string = "http://localhost:8080/api/v1"
  username: string = localStorage.getItem('username') || 'admin';       // Set on login success in local storage
  password: string = localStorage.getItem('password') || 'admin123';    // Set on login success in local storage
  credentials: string = btoa(this.username + ':' + this.password);
  httpOptions: object = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + this.credentials
    })
  };

  constructor(private http: HttpClient) { }

  getDashboardUsers(): Observable<IUser[]> {
    return this.http.get<IUser[]>(this.baseUrl + "/customers", this.httpOptions);
  }

  getDashboardBookings(): Observable<IBooking[]> {
    return this.http.get<IBooking[]>(this.baseUrl + "/bookings", this.httpOptions);
  }

  postReisterTrain(newTrainData: TrainRegister): Observable<HttpResponse<any>> {
    let { trainNumber, ...postBody } = newTrainData;
    postBody.trainName = postBody.trainName + " " + trainNumber;

    return this.http.post<any>(this.baseUrl + "/admin/trains", postBody, {
      ...this.httpOptions,
      observe: 'response',
    });
  }

  updateTrain(trainId: number, updatedTrain: TrainRegister): Observable<HttpResponse<TrainRegister>> {
    const url = `${this.baseUrl}/admin/trains/${trainId}`;
    console.log(updatedTrain)
    // TODO : fix this
    // console.log("----------------------------------")
    // console.log({
    //   ...updatedTrain,
    //   startDateTime: updatedTrain.startDateTime.toISOString().slice(0, 19),
    //   endDateTime: updatedTrain.endDateTime.toISOString().slice(0, 19),
    // })
    // console.log(url)
    // console.log("----------------------------------")
    return this.http.put<TrainRegister>(url, {
        ...updatedTrain,
        startDateTime: updatedTrain.startDateTime.toISOString().slice(0, 19),
        endDateTime: updatedTrain.endDateTime.toISOString().slice(0, 19),
      }, {
      ...this.httpOptions,
      observe: 'response',
    });
  }
  

  deleteTrain(trainId: number): Observable<HttpResponse<any>> {
    const url = `${this.baseUrl}/admin/trains/${trainId}`;
    
    return this.http.delete<any>(url, {
      ...this.httpOptions,
      observe: 'response',
    });
  }

}
