// src/app/services/group.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Group {
  name: string;
  grade: string;
}

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private apiUrl = 'http://localhost:3000/api/academic/groups/create';
  private listUrl = 'http://localhost:3000/api/academic/groups/list';

  constructor(private http: HttpClient) { }


  createGroup(group: Group): Observable<any> {
    return this.http.post(this.apiUrl, group);
  }

  getGroups(): Observable<any> {
    return this.http.get(this.listUrl);
  }

  getGroupById(id: number): Observable<any> {
    return this.http.get(`http://localhost:3000/api/academic/groups/${id}`);
  }
  updateGroup(id: number, group: Group): Observable<any> {
    return this.http.put(`http://localhost:3000/api/academic/groups/${id}`, group);
  }
  getUsersByRole(): Observable<any> {
    return this.http.get('http://localhost:3000/api/academic/users/roles/3');
  }
  assignGroupToStudent(payload: { student_id: number; group_id: number; academic_year: number }): Observable<any> {
    return this.http.post('http://localhost:3000/api/academic/student-groups/assign', payload);
  }
  getStudentsByGroup(groupId: number): Observable<any> {
    return this.http.get(`http://localhost:3000/api/academic/student-groups/${groupId}/students`);
  }

}