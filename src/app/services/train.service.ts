import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ITrain, ITrainDashboard } from '../model/interface/train';
import { TokenService } from './authentication/token.service';

@Injectable({
  providedIn: 'root'
})
export class TrainService {
  private baseUrl: string = 'http://localhost:8080/api/v1';
  private httpHeaders: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  constructor(private http: HttpClient, private tokenService: TokenService) { }

  private getAuthHeader(): HttpHeaders {
    return this.httpHeaders.set('Authorization', `Bearer ${this.tokenService.getAccessToken()}`);
  }

  // Train CRUD
  getTrainsData(): Observable<ITrain[]> {
    const url = `${this.baseUrl}/trains`;
    return this.http.get<ITrain[]>(url, { headers: this.getAuthHeader() })
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
