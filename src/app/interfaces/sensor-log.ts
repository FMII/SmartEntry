export interface SensorLogResponse {
  status: string;
  data: SensorLogEntry[];
  msg: string;
}

export interface SensorLogEntry {
  id: number;
  sensor_id: number;
  response: {
    msg: string;
    data: {
      accessLog?: {
        id: number;
        user_id: number;
        sensor_id: number;
        access_time: string;
        classroom_id: number;
      };
      shift?: {
        id: number;
        date: string;
        user_id: number;
        sensor_id: number;
        check_in_time: string;
        check_out_time: string | null;
      };
    };
    status: string;
  };
  created_at: string;
  sensors: {
    name: string;
  };
}

// Interfaz para mapear los datos mostrados en la tabla
export interface SensorLogDisplay {
  sensorName: string;
  date: string;
  userName: string;
  classroomName: string;
  message: string;
  status: string;
}


