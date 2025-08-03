import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TeacherResponse } from '../interfaces/teacher';

interface ApiResponse {
  status: string;
  msg: string | string[];
  data: any;
}

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role_id: number;
  is_active: boolean;
  roles: {
    id: number;
    name: string;
  };
}

export interface UsersResponse {
  status: string;
  data: User[];
}

@Injectable({
  providedIn: 'root'
})
export class UserRegisterService {

  private apiUrl = 'https://api.smartentry.space/api/academic/register';
  private usersUrl = 'https://api.smartentry.space/api/academic/users';
  private teachersUrl = 'https://api.smartentry.space/api/academic/users/roles/4';

  constructor(private http: HttpClient) { }

  registerUser(userData: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    role_id: number;
  }): Observable<ApiResponse> {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<ApiResponse>(this.apiUrl, userData, { headers });
  }

  getAllUsers(): Observable<UsersResponse> {
    return this.http.get<UsersResponse>(this.usersUrl);
  }

  updateUser(id: number, updatedData: {
    first_name?: string;
    last_name?: string;
    email?: string;
    role_id?: number;
    is_active?: boolean;
  }): Observable<ApiResponse> {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.put<ApiResponse>(`https://api.smartentry.space/api/academic/update/${id}`, updatedData, { headers });
  }

  getUserById(id: number): Observable<ApiResponse> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<ApiResponse>(`https://api.smartentry.space/api/academic/update/${id}`, { headers });
  }

  getTeachers(): Observable<TeacherResponse> {
    return this.http.get<TeacherResponse>(this.teachersUrl);
  }
}