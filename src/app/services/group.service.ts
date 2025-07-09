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
  private apiUrl = 'http://localhost:3000/api/groups/create';
  private listUrl = 'http://localhost:3000/api/groups/list';

  constructor(private http: HttpClient) { }

  createGroup(group: Group): Observable<any> {
    return this.http.post(this.apiUrl, group);
  }

  getGroups(): Observable<any> {
    return this.http.get(this.listUrl);
  }
}
