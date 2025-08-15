import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Restriction } from '../interfaces/restriction';

@Injectable({
  providedIn: 'root'
})
export class RestrictionsService {
  private apiUrl = 'https://api.smartentry.space/api/academic/restrictions';

  constructor(private http: HttpClient) { }

  getRestrictions(): Observable<{ status: string; data: Restriction[]; msg: string[] }> {
    return this.http.get<{ status: string; data: Restriction[]; msg: string[] }>(this.apiUrl);
  }
}
