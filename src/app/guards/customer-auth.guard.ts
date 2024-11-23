import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/authentication/auth.service';

export const customerAuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if(authService.getLoggedInUserRole() === 'user') {
    return true;
  }
  router.navigate(['/user/login']);
  return false;
};
