export interface User {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    role_id: number;
    is_active: boolean;
    verification_code: string | null;
    verification_code_expires: string | null;
    reset_password_token: string | null;
    reset_password_expires: string | null;
    roles: Role;
}

export interface UsersResponse {
    status: string;
    data: User[];
}
export interface Role {
    id: number;
    name: string;
}

