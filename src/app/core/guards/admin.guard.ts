import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ApiService } from '../services/api.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const api = inject(ApiService);
  const router = inject(Router);

  if (!api.isAuthenticated()) {
    router.navigate(['/auth/login']);
    return false;
  }

  if (api.isAdmin()) {
    return true; // Pasa, es el jefe
  } else {
    // Si intenta entrar al panel y no es admin
    router.navigate(['/']); 
    return false;
  }
};
