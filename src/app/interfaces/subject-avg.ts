export interface SubjectsAvgResponse {
  status: string;
  data: GroupSubjectAvg[];
  msg: string;
}

export interface GroupSubjectAvg {
  group_id: number;
  group_name: string;
  lowest_subject: SubjectAvg | null;
}

export interface SubjectAvg {
  subject_id?: number;
  subject_name?: string;
  average?: number;
}

