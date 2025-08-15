export interface Restriction {
  id: number;
  user_id: number;
  classroom_id: number;
  created_at: string;
  users: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
  classrooms: {
    id: number;
    name: string;
  };
}

export interface RestrictionResponse {
  status: string;
  data: Restriction[];
  msg: string[];
}
