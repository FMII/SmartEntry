import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SensorLogResponse } from '../interfaces/sensor-log';

@Injectable({
  providedIn: 'root'
})
export class SensorLogsService {
  private baseUrl = 'https://api.smartentry.space/api/academic';

  constructor(private http: HttpClient) { }

  getSensorLogs(startDate?: string, endDate?: string): Observable<SensorLogResponse> {
    let url = `${this.baseUrl}/graphics/sensor-responses`;
    const params: string[] = [];

    if (startDate) params.push(`startDate=${startDate}`);
    if (endDate) params.push(`endDate=${endDate}`);

    if (params.length > 0) {
      url += '?' + params.join('&');
    }

    return this.http.get<SensorLogResponse>(url);
  }
}

