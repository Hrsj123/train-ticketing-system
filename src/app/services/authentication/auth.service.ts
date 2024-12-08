import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { TokenService } from './token.service';
import { BehaviorSubject, catchError, filter, Observable, of, switchMap, take, tap, throwError } from 'rxjs';
import { UserLogin } from '../../model/class/User';
import { IUser } from '../../model/interface/user';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  
  private loginUrl: { [role: string]: string } = {
    admin: `${environment.API_URL}/admin/login`,
    user: `${environment.API_URL}/customers/login`
  };

  private refreshUrl: string = `${environment.API_URL}/admin/refresh`;            // Check this url...

  private httpOptions: object = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  private loggedInUserRole: string | null = null;

  private userData: object | null = null; 

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

    return this.http.post<{ tokens: {accessToken: string; refreshToken: string}, user: IUser }>(url, credentials, this.httpOptions).pipe(
      tap(response => {
        this.setLoggedInUserRole(role);
        this.tokenService.setTokens(response.tokens.accessToken, response.tokens.refreshToken);
        this.setUserData(response.user);
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

    if (this.isRefreshing) {
      // If a refresh is already in progress, return the subject as an observable
      return this.refreshTokenSubject.pipe(
        filter(token => token !== null), // Wait until the refreshTokenSubject has a value
        take(1), // Only take the next emitted value
        switchMap(() => of(null)) // Use the new access token
      );
    } else {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null); // Reset the subject

      return this.http.post<{ accessToken: string; refreshToken: string }>(this.refreshUrl, {}, {
        headers: { Authorization: `Bearer ${refreshToken}` }
      }).pipe(
        tap(response => {
          this.tokenService.setTokens(response.accessToken, refreshToken);    // TODO: Also apply refresh token rotation...
          this.refreshTokenSubject.next(response.accessToken); // Emit the new token
        }),
        catchError(error => {
          this.logout();
          this.setLoggedInUserRole(null);
          this.refreshTokenSubject.next(null); // Reset the subject
          return throwError(() => error);
        }),
        tap(() => {
          this.isRefreshing = false;
        })
      );
    }
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

  /**
   * Get the userData
   */
  getUserData(): object | null {
    return this.userData;
  }

  /**
   * Set the userData
   */
  setUserData(userData: object | null): void {
    localStorage.setItem("userData", JSON.stringify(userData));
    this.userData = userData;
  }


}
