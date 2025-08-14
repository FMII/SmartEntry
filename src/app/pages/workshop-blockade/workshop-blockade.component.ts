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
  showModal = false;
  showSuccessToast = false;
  successMessage = '';

  openDropdownId: number | null = null;
  selectedClassroomId: number | null = null;
  editClassroomName: string = '';
  editClassroomBlocked: boolean = false;

  constructor(private classroomsService: ClassroomsService) { }

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

  toggleDropdown(id: number): void {
    this.openDropdownId = this.openDropdownId === id ? null : id;
  }

  openEditModal(classroom: any): void {
    this.selectedClassroomId = classroom.id;
    this.editClassroomName = classroom.name;
    this.editClassroomBlocked = classroom.is_blocked;
    this.showModal = true;
    this.openDropdownId = null;
  }

  cancelUpdate(): void {
    this.showModal = false;
    this.selectedClassroomId = null;
  }

  saveClassroom(): void {
    if (this.selectedClassroomId !== null) {
      this.classroomsService.updateClassroomStatus(
        this.selectedClassroomId,
        this.editClassroomBlocked,
        this.editClassroomName
      ).subscribe({
        next: (res: any) => {
          // Actualiza el estado localmente
          const idx = this.classrooms.findIndex(c => c.id === this.selectedClassroomId);
          if (idx !== -1) {
            this.classrooms[idx].is_blocked = this.editClassroomBlocked;
            this.classrooms[idx].name = this.editClassroomName;
          }
          this.filterClassrooms();
          this.showModal = false;
          this.selectedClassroomId = null;
          this.successMessage = res.msg && res.msg[0] ? res.msg[0] : 'Aula actualizada exitosamente';
          this.showSuccessToast = true;
          setTimeout(() => {
            this.showSuccessToast = false;
            this.successMessage = '';
          }, 3000);
        },
        error: (err) => {
          console.error('Error al actualizar aula:', err);
        }
      });
    }
  }
}
