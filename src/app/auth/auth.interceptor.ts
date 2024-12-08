import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/authentication/auth.service';
import { TokenService } from '../services/authentication/token.service';
import { HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, catchError, filter, switchMap, take, throwError } from 'rxjs';
import { Router } from '@angular/router';

// Subject to synchronize token refresh
const refreshTokenSubject = new BehaviorSubject<string | null>(null);
let isRefreshing = false;

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Inject dependencies
  const authService = inject(AuthService);
  const tokenService = inject(TokenService);
  const router = inject(Router);
  
  // Fetch the current access token
  const accessToken = tokenService.getAccessToken();
  
  // If an access token exists, clone the request and add the Authorization header
  let authReq = req;
  if (accessToken) {
    authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${accessToken}` }
    });
  }

  // Handle the request and check for errors
  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && tokenService.getRefreshToken()) {
        if (!isRefreshing) {
          isRefreshing = true;
          refreshTokenSubject.next(null); // Reset the subject

          // Access token expired; attempt to refresh
          return authService.refreshToken().pipe(
            switchMap((response) => {
              const newAccessToken = response.accessToken;
              const newRefreshToken = response.refreshToken;

              tokenService.setTokens(newAccessToken, newRefreshToken);

              refreshTokenSubject.next(newAccessToken);  // Emit the new access token...
              isRefreshing = false;

              // Retry the failed request with the new access token
              const retryReq = req.clone({
                setHeaders: { Authorization: `Bearer ${newAccessToken}` }
              });
              return next(retryReq);
            }),
            catchError(err => {
              // If refreshing fails, logout
              isRefreshing = false;
              authService.logout();
              authService.setLoggedInUserRole(null);
              authService.setUserData(null);
              router.navigate(['/']);
              refreshTokenSubject.next(null); // Reset the subject
              return throwError(() => err);
            })
          );
        } else {
          // Wait for the ongoing refresh process to complete
          return refreshTokenSubject.pipe(
            filter(token => token !== null), // Wait until the subject emits a non-null token
            take(1), // Only take the next emitted token
            switchMap((newAccessToken) => {
              // Retry the failed request with the new access token
              const retryReq = req.clone({
                setHeaders: { Authorization: `Bearer ${newAccessToken}` }
              });
              return next(retryReq);
            })
          );
        }
      }

      // Handle other errors or if no refresh token is available
      authService.logout();
      authService.setLoggedInUserRole(null);
      authService.setUserData(null);
      router.navigate(['/']);
      return throwError(() => error);
    })
  );
};


/**
 * Example of logging in...

  this.authService.login('admin', { username: 'adminUser', password: 'adminPass' }).subscribe(response => {
    console.log('Admin logged in');
  });

  this.authService.login('user', { username: 'userUser', password: 'userPass' }).subscribe(response => {
    console.log('User logged in');
  });

 */