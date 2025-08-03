import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AccessLogResponse } from '../interfaces/log';

@Injectable({
  providedIn: 'root'
})
export class LogsService {
  private baseUrl = 'https://api.smartentry.space/api/academic';

  constructor(private http: HttpClient) { }

  getAccessLogs(salonId: number, startDate?: string, endDate?: string): Observable<AccessLogResponse> {
    let url = `${this.baseUrl}/graphics/access-logs/${salonId}`;
    const params: string[] = [];

    if (startDate) params.push(`startDate=${startDate}`);
    if (endDate) params.push(`endDate=${endDate}`);

    if (params.length > 0) {
      url += '?' + params.join('&');
    }

    return this.http.get<AccessLogResponse>(url);
  }

}