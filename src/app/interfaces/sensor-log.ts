export interface SensorLogResponse {
  status: string;
  data: SensorLogEntry[];
  msg: string;
}

export interface SensorLogEntry {
  sensor_name: string;
  date: string;
  user_name: string;
  classroom_name?: string;
  message: string;
}

