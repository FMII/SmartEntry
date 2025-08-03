import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubjectsAvgService } from '../../services/subjects-avg.service';
import { GroupSubjectAvg, SubjectAvg, SubjectsAvgResponse } from '../../interfaces/subject-avg';

@Component({
  selector: 'app-subjects-avg',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './subjects-avg.component.html',
  styleUrl: './subjects-avg.component.css'
})
export class SubjectsAvgComponent implements OnInit {
  subjectsAvg: GroupSubjectAvg[] = [];
  isLoading = true;

  constructor(private subjectsAvgService: SubjectsAvgService) {}

  ngOnInit(): void {
    this.subjectsAvgService.getSubjectsAverage().subscribe({
      next: (response) => {
        this.subjectsAvg = response.data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al obtener los promedios:', error);
        this.isLoading = false;
      }
    });
  }
}
