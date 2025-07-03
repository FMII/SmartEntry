import { CanActivateFn } from '@angular/router';

export const noAuthGuard: CanActivateFn = (route, state) => {
  const token = localStorage.getItem('token');
  if (token) {
    // Usuario ya logueado: redirigir a usermanagement
    window.location.href = '/user-management';
    return false; // bloquea el acceso a la ruta actual
  }
  // No está logueado, permite el acceso (por ejemplo, al login)
  return true;
};
