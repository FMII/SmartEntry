import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap, catchError, map } from 'rxjs/operators';
import { throwError, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://api.smartentry.space/api/academic/login';

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, {
      email,
      password,
      client: "web"
    }).pipe(
      tap((res) => {
        if (res.status === 'success') {
          localStorage.setItem('pendingEmail', res.data.email);
          localStorage.setItem('pendingUserId', res.data.id);
        } else {
          throw new Error(res.msg?.[0] || 'Ocurrió un error en el login');
        }
      }),
      catchError(this.handleError)
    );
  }

  verifyCode(email: string, code: string): Observable<any> {
    return this.http.post<any>('https://api.smartentry.space/api/academic/users/verify', {
      email,
      code
    }).pipe(
      tap((res) => {
        if (res.status === 'success') {
          localStorage.setItem('token', res.data.token);
          localStorage.setItem('first_name', res.data.first_name);
          localStorage.setItem('last_name', res.data.last_name);
          localStorage.setItem('email', res.data.email);
          localStorage.setItem('userId', res.data.id);
          localStorage.removeItem('pendingEmail');
          localStorage.removeItem('pendingUserId');
          
          // Obtener inmediatamente el perfil del usuario para guardar el rol
          this.getUserProfile().subscribe({
            next: (profileRes) => {
              if (profileRes.status === 'success') {
                localStorage.setItem('userRole', profileRes.data.roles.name);
                localStorage.setItem('roleId', profileRes.data.role_id.toString());
              }
            },
            error: (error) => {
              console.error('Error al obtener perfil después del login:', error);
            }
          });
        } else {
          throw new Error(res.msg || 'Código incorrecto');
        }
      }),
      catchError(this.handleError)
    );
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.clear();
  }

  // Método para solicitar recuperación de contraseña
  forgotPassword(email: string): Observable<any> {
    return this.http.post<any>('https://api.smartentry.space/api/academic/forgot-password', {
      email
    }).pipe(
      catchError(this.handleError)
    );
  }
  getCurrentUser(): any {
    const userId = localStorage.getItem('userId');
    const email = localStorage.getItem('email');
    const firstName = localStorage.getItem('first_name');
    const lastName = localStorage.getItem('last_name');

    console.log('AuthService.getCurrentUser() - userId:', userId);
    console.log('AuthService.getCurrentUser() - email:', email);

    if (userId && email) {
      const user = {
        id: userId,
        email: email,
        first_name: firstName,
        last_name: lastName
      };
      console.log('AuthService.getCurrentUser() - usuario encontrado:', user);
      return user;
    }

    console.log('AuthService.getCurrentUser() - no hay usuario autenticado');
    return null;
  }

  // Método para obtener el perfil completo del usuario actual incluyendo el rol
  getUserProfile(): Observable<any> {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    
    if (!userId || !token) {
      return throwError(() => new Error('Usuario no autenticado'));
    }

    const headers = {
      'Authorization': `Bearer ${token}`
    };

    return this.http.get<any>(`https://api.smartentry.space/api/academic/users/${userId}`, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Método para verificar si el usuario actual es administrador
  isAdmin(): Observable<boolean> {
    return this.getUserProfile().pipe(
      map(response => {
        if (response.status === 'success') {
          // Almacenar el rol en localStorage para uso posterior
          localStorage.setItem('userRole', response.data.roles.name);
          localStorage.setItem('roleId', response.data.role_id.toString());
          
          // Verificar si es administrador (role_id = 1 o roles.name = 'Administrador')
          return response.data.role_id === 1 || response.data.roles.name === 'Administrador';
        }
        return false;
      }),
      catchError(error => {
        console.error('Error al obtener perfil de usuario:', error);
        return of(false);
      })
    );
  }

  // Método sincrónico para verificar rol desde localStorage
  getUserRole(): string | null {
    return localStorage.getItem('userRole');
  }

  getUserRoleId(): number | null {
    const roleId = localStorage.getItem('roleId');
    return roleId ? parseInt(roleId) : null;
  }

  // Método para restablecer contraseña
  resetPassword(email: string, token: string, newPassword: string): Observable<any> {
    return this.http.post<any>('https://api.smartentry.space/api/academic/reset-password', {
      email,
      token,
      newPassword
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Método para reenviar código de verificación
  resendCode(email: string): Observable<any> {
    return this.http.post<any>('https://api.smartentry.space/api/academic/resend', {
      email
    }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMsg = 'Ocurrió un error inesperado.';

    if (error.error instanceof ErrorEvent) {
      errorMsg = `Error: ${error.error.message}`;
    } else {
      const msg = error.error?.msg;
      if (Array.isArray(msg)) {
        errorMsg = msg[0];
      } else if (typeof msg === 'string') {
        errorMsg = msg;
      } else {
        errorMsg = `Código de error: ${error.status}`;
      }
    }

    return throwError(() => new Error(errorMsg));
  }
}
