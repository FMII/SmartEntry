export interface Classroom {
  id: number;
  name: string;
  is_blocked: boolean;
}

export interface ClassroomResponse {
  status: string;
  data: Classroom[];
  msg: string[];
}