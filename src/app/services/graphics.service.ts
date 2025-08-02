import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TopAbsencesResponse } from '../interfaces/top-absences';

@Injectable({
  providedIn: 'root'
})
export class GraphicsService {

  private baseUrl = 'http://localhost:3000/api/academic/graphics';

  constructor(private http: HttpClient) {}

  getTopAbsences(): Observable<TopAbsencesResponse> {
    return this.http.get<TopAbsencesResponse>(`${this.baseUrl}/top-absences`);
  }
}
