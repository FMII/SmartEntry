export interface AccessLogResponse {
    status: string;
    data: AccessLogEntry[];
    msg: string;
}
export interface AccessLogEntry {
    first_name: string;
    last_name: string;
    role: 'student' | 'teacher' | 'admin';
    access_time: string;
}
