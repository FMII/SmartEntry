import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Subject {
  id: number;
  name: string;
  code: string;
}

@Injectable({
  providedIn: 'root'
})
export class SubjectsService {
  private apiUrl = 'http://localhost:3000/api/subjects';

  constructor(private http: HttpClient) { }

  // Crear materia
  createSubject(subjectData: { name: string; code: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, subjectData).pipe(
      catchError(this.handleError)
    );
  }

  // Obtener todas las materias
  getAllSubjects(): Observable<{ status: string; data: Subject[] }> {
    return this.http.get<{ status: string; data: Subject[] }>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  // Actualizar materia
  updateSubject(id: number, subjectData: { name: string; code: string }): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, subjectData).pipe(
      catchError(this.handleError)
    );
  }

  // Manejo de errores
  private handleError(error: HttpErrorResponse) {
    console.error('Error en el servicio de materias:', error);
    return throwError(() => error);
  }
}