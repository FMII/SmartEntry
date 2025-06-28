import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

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

  private apiUrl = 'http://localhost:3000/api/register';
  private usersUrl = 'http://localhost:3000/api/users';

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

    return this.http.put<ApiResponse>(`http://localhost:3000/api/update/${id}`, updatedData, { headers });
  }

  getUserById(id: number): Observable<ApiResponse> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<ApiResponse>(`http://localhost:3000/api/update/${id}`, { headers });
  }


}