import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/authentication/auth.service';

export const adminAuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if(authService.getLoggedInUserRole() === 'admin') {
    return true;
  }
  router.navigate(['/admin/login']);
  return false;
};
