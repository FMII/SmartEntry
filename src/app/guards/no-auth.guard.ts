import { CanActivateFn } from '@angular/router';

export const noAuthGuard: CanActivateFn = (route, state) => {
  const token = localStorage.getItem('token');

  if (token) {
    window.location.href = '/control-panel';
    return false;
  }

  return true;
};
