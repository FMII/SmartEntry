import { Component, OnInit } from '@angular/core';
import { SubjectsService, Subject } from '../../services/subjects.service';
import { NgFor, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-subjects',
  standalone: true,
  imports: [NgFor, CommonModule, FormsModule],
  templateUrl: './subjects.component.html',
  styleUrl: './subjects.component.css'
})
export class SubjectsComponent implements OnInit {
  subjects: Subject[] = [];
  filteredSubjects: Subject[] = [];
  searchTerm: string = '';

  constructor(private subjectsService: SubjectsService) { }

  ngOnInit(): void {
    this.subjectsService.getAllSubjects().subscribe({
      next: (response: any) => {
        this.subjects = response.data;
        this.filteredSubjects = [...this.subjects];
      },
      error: (error) => {
        console.error('Error al obtener materias:', error);
      }
    });
  }

  onSearchChange(event: any) {
    this.searchTerm = event.target.value.toLowerCase();
    this.filterSubjects();
  }

  filterSubjects() {
    if (!this.searchTerm) {
      this.filteredSubjects = [...this.subjects];
    } else {
      this.filteredSubjects = this.subjects.filter(subject =>
        subject.name.toLowerCase().includes(this.searchTerm) ||
        subject.code.toLowerCase().includes(this.searchTerm)
      );
    }
  }
}

