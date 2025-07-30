// workshop-blockade.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ClassroomsService } from '../../services/classrooms.service';

@Component({
  selector: 'app-workshop-blockade',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './workshop-blockade.component.html',
  styleUrl: './workshop-blockade.component.css'
})
export class WorkshopBlockadeComponent implements OnInit {
  classrooms: any[] = [];

  constructor(private classroomsService: ClassroomsService) {}

  ngOnInit(): void {
    this.classroomsService.getClassrooms().subscribe({
      next: (res) => {
        this.classrooms = res.data;
      },
      error: (err) => {
        console.error('Error al cargar aulas:', err);
      }
    });
  }
}
