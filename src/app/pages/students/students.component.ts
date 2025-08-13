import { Component, OnInit } from '@angular/core';
import { GroupService } from '../../services/group.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [CommonModule, NgFor, NgIf, FormsModule],
  templateUrl: './students.component.html',
  styleUrl: './students.component.css'
})
export class StudentsComponent implements OnInit {
  students: any[] = [];
  groups: any[] = [];
  selectedGroupId: number | null = null;

  groupName: string = '';
  groupGrade: string = '';

  // Propiedades para el botón de eliminar
  message: string = '';
  messageType: 'success' | 'error' = 'success';
  loading: boolean = false;
  deletingStudentId: number | null = null;

  constructor(private groupService: GroupService) { }

  ngOnInit(): void {
    this.loadGroups();
  }

  loadGroups(): void {
    this.groupService.getGroups().subscribe({
      next: (res) => {
        if (res.status === 'success') {
          this.groups = res.data;

          // 👉 Seleccionar automáticamente el primer grupo
          if (this.groups.length > 0) {
            this.selectedGroupId = this.groups[0].id; // selecciona el primero
            this.onGroupChange(); // carga estudiantes del primer grupo
          }
        }
      },
      error: (err) => {
        console.error('Error al cargar grupos:', err);
      }
    });
  }


  onGroupChange(): void {
    if (!this.selectedGroupId) return;

    this.groupService.getStudentsByGroup(this.selectedGroupId).subscribe({
      next: (res) => {
        if (res.status === 'success') {
          this.students = res.data.students;
          this.groupName = res.data.group.name;
          this.groupGrade = this.translateGrade(res.data.group.grade); // 👈 traducción
        } else {
          this.students = [];
          this.groupName = '';
          this.groupGrade = '';
        }
      },
      error: (err) => {
        console.error('Error al obtener estudiantes por grupo:', err);
        this.students = [];
        this.groupName = '';
        this.groupGrade = '';
      }
    });
  }

  // ✅ Traductor de grados a español
  translateGrade(grade: string): string {
    const traducciones: { [key: string]: string } = {
      'Middle_School': 'Secundaria',
      'High_School': 'Preparatoria',
      'Elementary_School': 'Primaria',
    };
    return traducciones[grade] || grade;
  }

  // Métodos para el botón de eliminar
  removeStudent(student: any): void {
    if (!this.selectedGroupId) return;

    if (confirm(`¿Estás seguro de que quieres eliminar a ${student.first_name} ${student.last_name} del grupo ${this.groupName}?`)) {
      this.deletingStudentId = student.student_id;
      this.loading = true;
      this.clearMessage();

      this.groupService.removeStudentFromGroup(
        student.student_id,
        this.selectedGroupId,
        student.academic_year
      ).subscribe({
        next: (res) => {
          if (res.status === 'success') {
            this.showMessage(res.msg[0], 'success');
            this.onGroupChange(); // Recargar la lista
          } else {
            this.showMessage('Error al eliminar el estudiante del grupo', 'error');
          }
        },
        error: (err) => {
          const errorMsg = err.error?.msg?.[0] || 'Error al eliminar el estudiante del grupo';
          this.showMessage(errorMsg, 'error');
        },
        complete: () => {
          this.loading = false;
          this.deletingStudentId = null;
        }
      });
    }
  }

  showMessage(message: string, type: 'success' | 'error'): void {
    this.message = message;
    this.messageType = type;
    setTimeout(() => this.clearMessage(), 5000); // Auto-ocultar después de 5 segundos
  }

  clearMessage(): void {
    this.message = '';
  }
  
}