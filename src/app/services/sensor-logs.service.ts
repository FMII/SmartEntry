import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { SensorLogResponse } from '../interfaces/sensor-log';

export interface UserInfo {
  id: number;
  first_name: string;
  last_name: string;
  email?: string;
  role_id?: number;
  is_active?: boolean;
  roles?: {
    id: number;
    name: string;
  };
}

export interface ClassroomInfo {
  id: number;
  name: string;
  location?: string;
}

export interface UsersResponse {
  status: string;
  data: UserInfo[];
  msg: string;
}

@Injectable({
  providedIn: 'root'
})
export class SensorLogsService {
  private baseUrl = 'https://api.smartentry.space/api/academic';

  constructor(private http: HttpClient) { }

  getSensorLogs(startDate?: string, endDate?: string): Observable<SensorLogResponse> {
    let url = `${this.baseUrl}/graphics/sensor-responses`;
    const params: string[] = [];
    if (startDate) params.push(`startDate=${startDate}`);
    if (endDate) params.push(`endDate=${endDate}`);
    if (params.length > 0) {
      url += '?' + params.join('&');
    }
    return this.http.get<SensorLogResponse>(url);
  }

  // Método para obtener información de múltiples usuarios
  getUsersInfo(userIds: number[]): Observable<Map<number, UserInfo>> {
    if (userIds.length === 0) {
      return of(new Map());
    }

    // Obtener todos los usuarios de una vez
    return this.getAllUsers().pipe(
      map(users => {
        const userMap = new Map<number, UserInfo>();
        
        // Filtrar solo los usuarios que necesitamos
        users.forEach(user => {
          if (userIds.includes(user.id)) {
            userMap.set(user.id, user);
          }
        });
        
        console.log('Usuarios encontrados en la API:', users.length);
        console.log('Usuarios mapeados para IDs solicitados:', userMap.size);
        console.log('IDs solicitados:', userIds);
        console.log('IDs encontrados:', Array.from(userMap.keys()));
        
        return userMap;
      }),
      catchError(error => {
        console.error('Error al obtener usuarios:', error);
        return of(new Map());
      })
    );
  }

  // Método para obtener información de múltiples salones
  getClassroomsInfo(classroomIds: number[]): Observable<Map<number, ClassroomInfo>> {
    if (classroomIds.length === 0) {
      return of(new Map());
    }

    // Eliminar IDs duplicados
    const uniqueIds = [...new Set(classroomIds)];
    
    // Crear un array de observables para obtener cada salón
    const classroomRequests = uniqueIds.map(id => 
      this.getClassroomInfo(id).pipe(
        catchError(() => of({ id, name: `Salón ${id}`, location: 'No disponible' }))
      )
    );

    return forkJoin(classroomRequests).pipe(
      map(classrooms => {
        const classroomMap = new Map<number, ClassroomInfo>();
        classrooms.forEach(classroom => {
          if (classroom) {
            classroomMap.set(classroom.id, classroom);
          }
        });
        return classroomMap;
      })
    );
  }

  // Método para obtener todos los usuarios
  getAllUsers(): Observable<UserInfo[]> {
    return this.http.get<UsersResponse>(`${this.baseUrl}/users`).pipe(
      map(response => response.data),
      catchError(error => {
        console.error('Error al obtener todos los usuarios:', error);
        return of([]);
      })
    );
  }

  // Método para obtener información del usuario (si la API lo soporta)
  getUserInfo(userId: number): Observable<UserInfo> {
    return this.http.get<UserInfo>(`${this.baseUrl}/users/${userId}`);
  }

  // Método para obtener información del salón (si la API lo soporta)
  getClassroomInfo(classroomId: number): Observable<ClassroomInfo> {
    return this.http.get<ClassroomInfo>(`${this.baseUrl}/classrooms/${classroomId}`);
  }
}


