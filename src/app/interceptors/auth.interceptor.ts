import { inject } from '@angular/core';
import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpErrorResponse
} from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
  const token = localStorage.getItem('token');
  const cloned = token ? req.clone({
    setHeaders: { Authorization: `Bearer ${token}` }
  }) : req;

  const router = inject(Router);

  return next(cloned).pipe(
    catchError((error: HttpErrorResponse) => {
      // Error de conexión (servidor caído, sin internet, etc.)
      if (error.status === 0 || error.status >= 500) {
        router.navigate(['/maintenance']);
        return throwError(() => error);
      }
      
      // Error de autenticación
      if (error.status === 401 || error.status === 403) {
        localStorage.removeItem('token');
        router.navigate(['/login']);
      }
      
      return throwError(() => error);
    })
  );
};
