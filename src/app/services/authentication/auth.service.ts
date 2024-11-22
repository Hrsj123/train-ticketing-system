import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { TokenService } from './token.service';
import { Observable, tap } from 'rxjs';
import { UserLogin } from '../../model/class/User';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loginUrl: { [role: string]: string } = {
    admin: 'http://localhost:8080/api/v1/admin/login',
    user: 'http://localhost:8080/api/v1/customers/login'
  };

  private refreshUrl: string = 'https://example.com/api/refresh';

  private httpOptions: object = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  constructor(private http: HttpClient, private tokenService: TokenService) { }

  /**
   * Log in the user based on their role
   * @param role - 'admin' or 'user'
   * @param credentials - Login payload (e.g., username and password)
   */
  login(role: 'admin' | 'user', credentials: UserLogin): Observable<any> {
    const url = this.loginUrl[role];

    return this.http.post<{ accessToken: string; refreshToken: string }>(url, credentials, this.httpOptions).pipe(
      tap(response => {
        this.tokenService.setTokens(response.accessToken, response.refreshToken);
      })
    );
  }

  /**
   * Refresh the access token
   */
  refreshToken(): Observable<any> {
    const refreshToken = this.tokenService.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    return this.http.post<{ accessToken: string }>(this.refreshUrl, {}, {
      headers: { Authorization: `Bearer ${refreshToken}` }
    }).pipe(
      tap(response => {
        this.tokenService.setTokens(response.accessToken, refreshToken);  // refresh token remains the same
      })
    );
  }

  /**
   * Log out the user and clear tokens
   */
  logout(): void {
    this.tokenService.clearTokens();
  }
}
