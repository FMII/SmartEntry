import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GroupAttendanceResponse, TopAbsencesResponse } from '../interfaces/top-absences';

@Injectable({
  providedIn: 'root'
})
export class GraphicsService {

  private baseUrl = 'http://localhost:3000/api/academic/graphics';

  constructor(private http: HttpClient) { }

  getTopAbsences(): Observable<TopAbsencesResponse> {
    return this.http.get<TopAbsencesResponse>(`${this.baseUrl}/top-absences`);
  }

  getAttendanceByGroup(groupId: number): Observable<GroupAttendanceResponse> {
    const url = `${this.baseUrl}/attendance-by-group/${groupId}`;
    return this.http.get<GroupAttendanceResponse>(url);
  }

}
