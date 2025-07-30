// classrooms.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ClassroomsService {
  private baseUrl = 'http://localhost:3000/api/academic/classrooms';

  constructor(private http: HttpClient) { }

  // Obtener todos los salones
  getClassrooms(): Observable<any> {
    return this.http.get(this.baseUrl);
  }

  // Crear aula
  createClassroom(data: { name: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/create`, data);
  }

  updateClassroomStatus(id: number, isBlocked: boolean) {
    return this.http.patch(`http://localhost:3000/api/academic/classrooms/${id}`, {
      is_blocked: isBlocked
    });
  }
}
