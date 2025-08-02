export interface Subject {
    id: number;
    name: string;
    code: string;
}

export interface SubjectsResponse {
    status: string;
    data: Subject[];
    msg: string[];
}
