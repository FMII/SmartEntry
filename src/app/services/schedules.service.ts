import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SchedulesService {
  private apiUrl = 'http://localhost:3000/api/academic/teacher-subject-groups';

  constructor(private http: HttpClient) {}

  getSchedulesByGroup(groupId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/group/${groupId}`);
  }
  updateStudentGroup(data: { id: number, group_id?: number }) {
  return this.http.put(`${this.apiUrl}/student/update`, data);
}

}
