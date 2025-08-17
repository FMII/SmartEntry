import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GroupAttendanceResponse, TopAbsencesResponse } from '../interfaces/top-absences';

@Injectable({
  providedIn: 'root'
})
export class GraphicsService {

  private baseUrl = 'https://api.smartentry.space/api/academic/graphics';

  constructor(private http: HttpClient) { }

  getTopAbsences(): Observable<TopAbsencesResponse> {
    return this.http.get<TopAbsencesResponse>(`${this.baseUrl}/top-absences`);
  }

  getAttendanceByGroup(groupId: number, startDate?: string, endDate?: string): Observable<GroupAttendanceResponse> {
    let url = `${this.baseUrl}/attendance-by-group/${groupId}`;
    if (startDate && endDate) {
      url += `?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`;
    } else if (startDate) {
      url += `?startDate=${encodeURIComponent(startDate)}`;
    } else if (endDate) {
      url += `?endDate=${encodeURIComponent(endDate)}`;
    }
    return this.http.get<GroupAttendanceResponse>(url);
  }

}
