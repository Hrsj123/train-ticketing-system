import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ITrain, ITrainDashboard } from '../model/interface/train';

@Injectable({
  providedIn: 'root'
})
export class TrainService {

  constructor(private http: HttpClient) { }

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

  // Train CRUD
  getTrainsData(): Observable<ITrain[]> {
    return this.http.get<ITrain[]>(this.baseUrl + "/trains", this.httpOptions)
      .pipe(
        map((trains: ITrain[]) => {
          return trains.map((train: ITrain) => {
            return {
              ...train,
              startDateTime: new Date(train.startDateTime),
              endDateTime: new Date(train.endDateTime),
            };
          });
        })
      );
  }
}
