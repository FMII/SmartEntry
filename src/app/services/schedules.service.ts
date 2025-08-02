import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SchedulesResponse, TeacherSubjectGroup } from '../interfaces/schedule';
import { TeacherSubjectGroupCreate, TeacherSubjectGroupResponse } from '../interfaces/teacher-subject-group';

@Injectable({
  providedIn: 'root'
})
export class SchedulesService {
  private apiUrl = 'http://localhost:3000/api/academic/teacher-subject-groups';
  private apiGetSchedules = 'http://localhost:3000/api/academic/schedules';
  private apiCreateUrl = 'http://localhost:3000/api/academic/teacher-subject-groups/create';
  private apiUpdateUrl = 'http://localhost:3000/api/academic/teacher-subject-groups';
  private apischeduleById = 'http://localhost:3000/api/academic/teacher-subject-groups';

  constructor(private http: HttpClient) { }

  getSchedulesByGroup(groupId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/group/${groupId}`);
  }
  updateStudentGroup(data: { id: number, group_id?: number }) {
    return this.http.put(`${this.apiUrl}/student/update`, data);
  }
  getAllSchedules(): Observable<SchedulesResponse> {
    return this.http.get<SchedulesResponse>(this.apiGetSchedules);
  }
  createAssignment(data: TeacherSubjectGroupCreate): Observable<TeacherSubjectGroupResponse> {
    return this.http.post<TeacherSubjectGroupResponse>(this.apiCreateUrl, data);
  }
  updateAssignment(id: number, data: TeacherSubjectGroupCreate): Observable<any> {
    const url = `${this.apiUpdateUrl}/${id}`;
    return this.http.put<any>(url, data);
  }
  getAssignmentById(id: number): Observable<any> {
    return this.http.get(`${this.apischeduleById}/${id}`);
  }

  //Obtener horarios para mostrar en la tabla
  getAllSchedulesToShow(): Observable<{ status: string; data: { teacherSubjectGroups: TeacherSubjectGroup[] }; msg: string }> {
    return this.http.get<{ status: string; data: { teacherSubjectGroups: TeacherSubjectGroup[] }; msg: string }>(this.apiUrl);
  }
}
