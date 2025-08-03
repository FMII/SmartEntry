import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

interface Sensor {
  id: number;
  name: string;
  esp32_code: string;
  type: string;
  classroom_id: number | null;
  is_active: boolean;
  ip_address: string | null;
}

interface ApiResponse<T> {
  status: string;
  data: T;
  msg: string[];
}

@Injectable({
  providedIn: 'root'
})
export class SensorsService {

  private baseUrl = 'https://api.smartentry.space/api/academic/hardware';

  constructor(private http: HttpClient) { }

  // Obtener sensores
  getSensors(): Observable<Sensor[]> {
    return this.http.get<ApiResponse<Sensor[]>>(this.baseUrl).pipe(
      map(response => response.data)
    );
  }

  updateSensor(id: number, body: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, body);
  }

  createSensor(sensorData: {
    name: string;
    esp32_code: string;
    type: string;
    classroom_id?: number | null;
  }): Observable<ApiResponse<Sensor>> {
    return this.http.post<ApiResponse<Sensor>>(this.baseUrl, sensorData);
  }
}
