import { Component, OnInit } from '@angular/core';
import { GroupService } from '../../services/group.service';
import { NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-group',
  standalone: true,
  imports: [NgFor, RouterLink, NgIf, ReactiveFormsModule],
  templateUrl: './user-group.component.html',
  styleUrl: './user-group.component.css'
})
export class UserGroupComponent implements OnInit {
  activeStudentId: number | null = null;
  openModal = false;
  students: any[] = [];
  groups: any[] = [];
  assignForm!: FormGroup;

  closeModal() {
    this.openModal = false;
    this.activeStudentId = null;
  }
  constructor(
    private groupService: GroupService,
    private fb: FormBuilder,) { }

  ngOnInit(): void {
    this.loadStudents();
    this.loadGroups();
    // Inicializar formulario
    this.assignForm = this.fb.group({
      group_id: ['', Validators.required],
      academic_year: [new Date().getFullYear(), Validators.required]
    });
  }

  loadStudents(): void {
    this.groupService.getUsersByRole().subscribe({
      next: (res) => {
        if (res.status === 'success') {
          this.students = res.data;
        } else {
          console.error('Error al traer los estudiantes:', res.msg);
        }
      },
      error: (err) => {
        console.error('Error del servidor:', err);
      }
    });
  }

  loadGroups(): void {
    this.groupService.getGroups().subscribe({
      next: (res) => {
        if (res.status === 'success') {
          this.groups = res.data;
        }
      },
      error: (err) => {
        console.error('Error al cargar grupos', err);
      }
    });
  }

  get studentId() {
    return this.activeStudentId;
  }

  successMessage: string = '';
  errorMessages: string[] = [];

  onSubmit(): void {
    if (this.assignForm.invalid || this.studentId === null) {
      this.assignForm.markAllAsTouched();
      return;
    }

    const payload = {
      student_id: this.studentId,
      group_id: Number(this.assignForm.value.group_id),
      academic_year: Number(this.assignForm.value.academic_year)
    };

    this.groupService.assignGroupToStudent(payload).subscribe({
      next: (res) => {
        if (res.status === 'success') {
          this.successMessage = typeof res.msg === 'string' ? res.msg : (res.msg?.[0] || 'Asignación exitosa');
          this.errorMessages = [];
          // Redirigir
          setTimeout(() => {
            window.location.href = '/user-group';
          }, 1500);
        } else {
          this.successMessage = '';
          this.errorMessages = Array.isArray(res.msg) ? res.msg : [res.msg || 'Ocurrió un error.'];
        }
      },
      error: (err) => {
        this.successMessage = '';
        if (err.error?.msg) {
          this.errorMessages = Array.isArray(err.error.msg) ? err.error.msg : [err.error.msg];
          setTimeout(() => {
            this.errorMessages = [];
          }, 3000);
        } else {
          this.errorMessages = ['Error en el servidor. Intenta más tarde.'];
        }
        console.error('Error en la petición:', err);
      }
    });
  }
}
