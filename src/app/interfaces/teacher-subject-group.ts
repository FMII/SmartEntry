export interface TeacherSubjectGroupCreate {
    teacher_id: number;
    subject_id: number;
    group_id: number;
    classroom_id: number;
    schedule_id: number;
}

export interface TeacherSubjectGroupResponse {
    status: string;
    data: {
        teacherSubjectGroup: {
            id: number;
            teacher_id: number;
            subject_id: number;
            group_id: number;
            classroom_id: number;
            schedule_id: number;
            users: {
                id: number;
                first_name: string;
                last_name: string;
            };
            subjects: {
                id: number;
                name: string;
                code: string;
            };
            groups: {
                id: number;
                name: string;
                grade: string;
            };
            classrooms: {
                id: number;
                name: string;
            };
            schedules: {
                id: number;
                weekday: string;
                start_time: string;
                end_time: string;
            };
        };
    };
    msg: string;
}
