import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { TokenService } from './token.service';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { UserLogin } from '../../model/class/User';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loginUrl: { [role: string]: string } = {
    admin: 'http://localhost:8080/api/v1/admin/login',
    user: 'http://localhost:8080/api/v1/customers/login'
  };

  private refreshUrl: string = 'http://localhost:8080/api/v1/customers/refresh';

  private httpOptions: object = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  private loggedInUserRole: string | null = null;

  constructor(private http: HttpClient, private tokenService: TokenService) {
    const userRole = localStorage.getItem('userType');
    if (userRole !== 'userType') {
      this.setLoggedInUserRole(userRole);
    }
  }

  /**
   * Log in the user based on their role
   * @param role - 'admin' or 'user'
   * @param credentials - Login payload (e.g., username and password)
   */
  login(role: 'admin' | 'user', credentials: UserLogin): Observable<any> {
    const url = this.loginUrl[role];

    return this.http.post<{ accessToken: string; refreshToken: string }>(url, credentials, this.httpOptions).pipe(
      tap(response => {
        this.loggedInUserRole = role;
        this.tokenService.setTokens(response.accessToken, response.refreshToken);
      }),
      catchError(error => {
        this.logout();
        console.error('Error occurred:', error); // Executed for errors (e.g., 401, 500)
        return throwError(() => error);
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
    
    return this.http.post<{ accessToken: string, refreshToken: string }>(this.refreshUrl, {}, {
      headers: { Authorization: `Bearer ${refreshToken}` }
    }).pipe(
      tap(response => {
        this.setLoggedInUserRole(null);
        this.tokenService.setTokens(response.accessToken, response.refreshToken);  // refresh token remains the same
      }),
      catchError(error => {
        this.logout();
        this.setLoggedInUserRole(null);
        console.error('Error occurred:', error); // Executed for errors (e.g., 401, 500)
        return throwError(() => error);
      })
    );
  }

  /**
   * Log out the user and clear tokens
   */
  logout(): void {
    this.tokenService.clearTokens();
    localStorage.clear();
  }

  /**
   * Check User Role
   */
  getLoggedInUserRole(): string | null {
    return this.loggedInUserRole;
  }

  /**
   * Set User Role
   */
  setLoggedInUserRole(userRole: string | null): void {
    if (userRole === null) {
      localStorage.removeItem('userType');
      this.loggedInUserRole = null;
    } else {
      localStorage.setItem('userType', userRole);
      this.loggedInUserRole = userRole;
    }
  }


}
