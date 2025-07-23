import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap, catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/login';

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
    return this.http.post<any>('http://localhost:3000/api/users/verify', {
      email,
      code
    }).pipe(
      tap((res) => {
        if (res.status === 'success') {
          localStorage.setItem('token', res.data.token);
          localStorage.setItem('email', res.data.email);
          localStorage.setItem('userId', res.data.id);
          localStorage.removeItem('pendingEmail');
          localStorage.removeItem('pendingUserId');
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

  // Método para manejar errores
  private handleError(error: HttpErrorResponse) {
    let errorMsg = 'Ocurrió un error inesperado.';

    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMsg = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      errorMsg = error.error?.msg?.[0] || error.error?.msg || `Código de error: ${error.status}`;
    }

    return throwError(() => new Error(errorMsg));
  }
}
