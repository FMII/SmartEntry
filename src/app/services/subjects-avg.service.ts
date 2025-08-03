import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SubjectsAvgResponse } from '../interfaces/subject-avg';

@Injectable({
  providedIn: 'root'
})
export class SubjectsAvgService {
  private apiUrl = 'https://api.smartentry.space/api/academic/graphics/subject-average';

  constructor(private http: HttpClient) {}

  getSubjectsAverage(): Observable<SubjectsAvgResponse> {
    return this.http.get<SubjectsAvgResponse>(this.apiUrl);
  }
}
