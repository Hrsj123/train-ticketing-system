import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/authentication/auth.service';
import { TokenService } from '../services/authentication/token.service';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, switchMap, throwError } from 'rxjs';
import { Router } from '@angular/router';

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
        // Access token expired; attempt to refresh
        return authService.refreshToken().pipe(
          switchMap((response) => {
            // Retry the failed request with the new access token
            const newAccessToken = response.accessToken;
            const newRefreshToken = response.refreshToken;

            tokenService.setTokens(newAccessToken, newRefreshToken);
            const retryReq = req.clone({
              setHeaders: { Authorization: `Bearer ${newAccessToken}` }
            });
            return next(retryReq);
          }),
          catchError(err => {
            // If refreshing fails, logout
            authService.logout();
            authService.setLoggedInUserRole(null);
            router.navigate(['/']);
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