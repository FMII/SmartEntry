// classrooms.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ClassroomResponse } from '../interfaces/classroom';

@Injectable({
  providedIn: 'root',
})
export class ClassroomsService {
  private baseUrl = 'https://api.smartentry.space/api/academic/classrooms';

  constructor(private http: HttpClient) { }

  // Obtener todos los salones
  getClassrooms(): Observable<any> {
    return this.http.get(this.baseUrl);
  }

  //Obtener todos los salones, usando la interfaz
  getAllClassrooms(): Observable<ClassroomResponse> {
    return this.http.get<ClassroomResponse>(this.baseUrl);
  }

  // Crear aula
  createClassroom(data: { name: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/create`, data);
  }

  updateClassroomStatus(id: number, isBlocked: boolean) {
    return this.http.patch(`https://api.smartentry.space/api/academic/classrooms/${id}`, {
      is_blocked: isBlocked
    });
  }
}
