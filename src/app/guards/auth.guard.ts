import { CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const token = localStorage.getItem('token');
  if (token) {
    return true; // Permite acceso
  } else {
    // Redirige al login si no hay token
    window.location.href = '/login';
    return false;
  }
};
