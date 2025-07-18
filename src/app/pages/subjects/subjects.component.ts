import { Component, OnInit } from '@angular/core';
import { SubjectsService, Subject } from '../../services/subjects.service';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-subjects',
  standalone: true,
  imports: [NgFor],
  templateUrl: './subjects.component.html',
  styleUrl: './subjects.component.css'
})
export class SubjectsComponent implements OnInit {
  subjects: Subject[] = [];

  constructor(private subjectsService: SubjectsService) { }

  ngOnInit(): void {
    this.subjectsService.getAllSubjects().subscribe({
      next: (response: any) => {
        this.subjects = response.data;
      },
      error: (error) => {
        console.error('Error al obtener materias:', error);
      }
    });
  }
}

