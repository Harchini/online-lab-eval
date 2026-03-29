import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

// Advanced Angular Technique: Functional Route Guard (Angular 15+)
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.isLoggedIn()) {
    return true;
  }
  router.navigate(['/login']);
  return false;
};
