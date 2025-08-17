import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Restriction } from '../interfaces/restriction';

@Injectable({
  providedIn: 'root'
})
export class RestrictionsService {
  private apiUrl = 'https://api.smartentry.space/api/academic/restrictions';

  private createUrl = 'https://api.smartentry.space/api/academic/restrictions/create';

  constructor(private http: HttpClient) { }

  getRestrictions(): Observable<{ status: string; data: Restriction[]; msg: string[] }> {
    return this.http.get<{ status: string; data: Restriction[]; msg: string[] }>(this.apiUrl);
  }

  createRestriction(payload: { user_id: number; classroom_id: number }): Observable<{ status: string; data: Restriction; msg: string[] }> {
    return this.http.post<{ status: string; data: Restriction; msg: string[] }>(this.createUrl, payload);
  }
  deleteRestriction(id: number): Observable<{ status: string; data: {}; msg: string[] }> {
    return this.http.delete<{ status: string; data: {}; msg: string[] }>(`${this.apiUrl}/${id}`);
  }
}
