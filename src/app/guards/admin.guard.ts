import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Verificar si está autenticado primero
  if (!authService.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }

  // Verificar rol desde localStorage primero
  const userRole = authService.getUserRole();
  const roleId = authService.getUserRoleId();
  
  // Si ya tenemos el rol en localStorage y es admin (role_id = 1)
  if (userRole === 'Administrador' || roleId === 1) {
    return true;
  }

  // Si no tenemos el rol, obtenerlo del servidor
  return authService.getUserProfile().pipe(
    map(response => {
      if (response.status === 'success') {
        const user = response.data;
        // Verificar si es administrador (role_id = 1 o roles.name = 'Administrador')
        if (user.role_id === 1 || user.roles.name === 'Administrador') {
          return true;
        }
      }
      
      // Si no es administrador, redirigir al panel de control
      router.navigate(['/control-panel']);
      return false;
    }),
    catchError(error => {
      console.error('Error al verificar rol de administrador:', error);
      router.navigate(['/control-panel']);
      return of(false);
    })
  );
};
