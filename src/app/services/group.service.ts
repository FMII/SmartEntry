// src/app/services/group.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, Groups } from '../interfaces/groups';

interface Group {
  name: string;
  grade: string;
}

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private apiUrl = 'https://api.smartentry.space/api/academic/groups/create';
  private listUrl = 'https://api.smartentry.space/api/academic/groups/list';

  constructor(private http: HttpClient) { }


  createGroup(group: Group): Observable<any> {
    return this.http.post(this.apiUrl, group);
  }

  getGroups(): Observable<any> {
    return this.http.get(this.listUrl);
  }
  
  getAllGroups(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(this.listUrl);
  }


  getGroupById(id: number): Observable<any> {
    return this.http.get(`https://api.smartentry.space/api/academic/groups/${id}`);
  }
  updateGroup(id: number, group: Group): Observable<any> {
    return this.http.put(`https://api.smartentry.space/api/academic/groups/${id}`, group);
  }
  
  
  getUsersByRole(): Observable<any> {
    return this.http.get('https://api.smartentry.space/api/academic/users/roles/3');
  }

  getStudents(): Observable<any> {
    return this.http.get('https://api.smartentry.space/api/academic/users/roles/3');
  }

  assignGroupToStudent(payload: { student_id: number; group_id: number; academic_year: number }): Observable<any> {
    return this.http.post('https://api.smartentry.space/api/academic/student-groups/assign', payload);
  }
  getStudentsByGroup(groupId: number): Observable<any> {
    return this.http.get(`https://api.smartentry.space/api/academic/student-groups/${groupId}/students`);
  }

  removeStudentFromGroup(studentId: number, groupId: number, academicYear: number): Observable<any> {
    return this.http.delete(`https://api.smartentry.space/api/academic/student-groups/${studentId}/${groupId}/${academicYear}`);
  }

}