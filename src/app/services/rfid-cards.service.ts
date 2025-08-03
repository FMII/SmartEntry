import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RfidCardsService {

  private baseUrl = 'https://api.smartentry.space/api/academic/rfid';

  constructor(private http: HttpClient) { }

  getAllRfids(): Observable<any> {
    return this.http.get(this.baseUrl);
  }
  createRfid(data: { uid: string; user_id: number }): Observable<any> {
    return this.http.post(`${this.baseUrl}/create`, data);
  }

  updateRfid(id: number, data: { uid: string; user_id: number }): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, data);
  }

  deleteRfidCard(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
