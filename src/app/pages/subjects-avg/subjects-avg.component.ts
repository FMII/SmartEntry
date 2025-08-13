import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubjectsAvgService } from '../../services/subjects-avg.service';
import { GroupSubjectAvg, SubjectAvg, SubjectsAvgResponse } from '../../interfaces/subject-avg';
import { Classroom } from '../../interfaces/classroom';
import { ClassroomsService } from '../../services/classrooms.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-subjects-avg',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './subjects-avg.component.html',
  styleUrl: './subjects-avg.component.css'
})
export class SubjectsAvgComponent implements OnInit {
  classrooms: Classroom[] = [];
  selectedClassroomId: number | null = null;
  subjectsAvg: GroupSubjectAvg[] = [];
  isLoading = true;

  FormClassroom: FormGroup;

  constructor(
    private subjectsAvgService: SubjectsAvgService,
    private classroomService: ClassroomsService,
  ) {
    this.FormClassroom = new FormGroup({
      grupoId: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    this.subjectsAvgService.getSubjectsAverage().subscribe({
      next: (response) => {
        this.subjectsAvg = response.data.map(group => {
          const avg = group.lowest_subject?.average;

          return {
            ...group,
            lowest_subject: {
              ...group.lowest_subject,
              average: avg != null ? Number(avg.toFixed(2)) : avg
            }
          };
        });

        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al obtener los promedios:', error);
        this.isLoading = false;
      }
    });

    this.classroomService.getAllClassrooms().subscribe({
      next: (response) => {
        this.classrooms = response.data;
        this.selectedClassroomId = this.classrooms[0]?.id ?? null;
      },
      error: (err) => console.error(err)
    });
  }

  onGroupChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedClassroomId = Number(value);
    //console.log('Grupo seleccionado:', this.selectedClassroomId);
  }
}
