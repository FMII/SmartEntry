import { CanActivateFn } from '@angular/router';

export const pendingVerificationGuard: CanActivateFn = (route, state) => {
  const pendingEmail = localStorage.getItem('pendingEmail');
  const token = localStorage.getItem('token');

  // Si ya tienes token, no tiene sentido ir a verificar código, redirige al dashboard
  if (token) {
    window.location.href = '/user-management';
    return false;
  }

  // Permitir solo si hay un email pendiente para verificar
  if (pendingEmail) {
    return true;
  } else {
    // Si no hay email pendiente, redirige a login
    window.location.href = '/login';
    return false;
  }
};
