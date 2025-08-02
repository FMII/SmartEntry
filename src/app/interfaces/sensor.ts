export interface Sensor {
  id: number;
  name: string;
  esp32_code: string;
  type: string;
  classroom_id: number | null;
  is_active: boolean;
  ip_address: string | null;
  classroom_name?: string;
}
