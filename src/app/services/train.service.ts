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
  httpOptions: object = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
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
