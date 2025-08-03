export interface TopAbsencesResponse {
    status: string;
    data: TopAbsenceGroup[];
    msg: string;
}

export interface TopAbsenceGroup {
    group_id: number;
    group_name: string;
    top_student: TopStudent | null;
}

export interface TopStudent {
    student_id: number;
    name: string;
    email: string;
    absences: number;
}

//

export interface GroupAttendanceResponse {
    status: string;
    data: GroupAttendance[];
    msg: string;
}

export interface GroupAttendance {
    first_name: string;
    last_name: string;
    date: string;
    status: 'present' | 'absent' | 'late';
}
