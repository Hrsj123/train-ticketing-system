import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/authentication/auth.service';
import { TokenService } from '../services/authentication/token.service';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, switchMap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Inject dependencies
  const authService = inject(AuthService);
  const tokenService = inject(TokenService);
  
  // Fetch the current access token
  const accessToken = tokenService.getAccessToken();
  
  // If an access token exists, clone the request and add the Authorization header
  let authReq = req;
  console.log("--------------------------------------AUTH TOKEN")
  console.log(accessToken)
  console.log("--------------------------------------AUTH TOKEN")
  if (accessToken) {
    authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${accessToken}` }
    });
  }

  // Handle the request and check for errors
  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && tokenService.getRefreshToken()) {
        // Access token expired; attempt to refresh
        return authService.refreshToken().pipe(
          switchMap(() => {
            // Retry the failed request with the new access token
            const newAccessToken = tokenService.getAccessToken();
            const retryReq = req.clone({
              setHeaders: { Authorization: `Bearer ${newAccessToken}` }
            });
            return next(retryReq);
          }),
          catchError(err => {
            // If refreshing fails, logout
            authService.logout();
            return throwError(() => err);
          })
        );
      }
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