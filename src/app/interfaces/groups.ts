
export interface ApiResponse {
    status: string;
    data: Groups[];
    msg: string[];
}
export interface Groups {
    id: number;
    name: string;
    grade: string;
}
