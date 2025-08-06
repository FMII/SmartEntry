// workshop-blockade.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ClassroomsService } from '../../services/classrooms.service';

@Component({
  selector: 'app-workshop-blockade',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './workshop-blockade.component.html',
  styleUrl: './workshop-blockade.component.css'
})
export class WorkshopBlockadeComponent implements OnInit {
  classrooms: any[] = [];
  filteredClassrooms: any[] = [];
  searchTerm: string = '';

  constructor(private classroomsService: ClassroomsService) {}

  ngOnInit(): void {
    this.classroomsService.getClassrooms().subscribe({
      next: (res) => {
        this.classrooms = res.data;
        this.filteredClassrooms = [...this.classrooms];
      },
      error: (err) => {
        console.error('Error al cargar aulas:', err);
      }
    });
  }

  onSearchChange(): void {
    this.filterClassrooms();
  }

  filterClassrooms(): void {
    if (!this.searchTerm || this.searchTerm.trim() === '') {
      this.filteredClassrooms = [...this.classrooms];
    } else {
      const search = this.searchTerm.toLowerCase().trim();
      this.filteredClassrooms = this.classrooms.filter(classroom => 
        classroom.name && classroom.name.toLowerCase().includes(search)
      );
    }
  }
}
