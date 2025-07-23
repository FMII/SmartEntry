import { CanActivateFn } from '@angular/router';

export const noAuthGuard: CanActivateFn = (route, state) => {
  const token = localStorage.getItem('token');

  if (token) {
    window.location.href = '/user-management';
    return false;
  }

  return true;
};
