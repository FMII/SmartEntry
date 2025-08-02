export interface Role {
  id: number;
  name: string;
}

export interface Teacher {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role_id: number;
  is_active: boolean;
  verification_code: string | null;
  verification_code_expires: string | null;
  roles: Role;
}

export interface TeacherResponse {
  status: string;
  data: Teacher[];
  msg: string[];
}
