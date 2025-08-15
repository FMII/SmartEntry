import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, NgIf, NgFor } from '@angular/common';
import { GroupService } from '../../services/group.service';

@Component({
  selector: 'app-assign-group',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgIf, NgFor],
  templateUrl: './assign-group.component.html',
  styleUrl: './assign-group.component.css'
})
export class AssignGroupComponent implements OnInit {
  loading = false;
  assignForm!: FormGroup;
  groups: any[] = [];
  studentId!: number;
  successMessage = '';
  errorMessages: string[] = [];

  constructor(
    private fb: FormBuilder,
    private groupService: GroupService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Inicializar formulario
    this.assignForm = this.fb.group({
      group_id: ['', Validators.required],
      academic_year: [new Date().getFullYear(), Validators.required]
    });

    // Obtener ID del estudiante desde la ruta
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.studentId = Number(id);
    }

    // Cargar grupos
    this.groupService.getGroups().subscribe({
      next: (res) => {
        if (res.status === 'success') {
          this.groups = res.data;
        }
      },
      error: (err) => {
        console.error('Error al cargar grupos:', err);
      }
    });
  }

  onSubmit(): void {
    if (this.assignForm.invalid) {
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
            this.router.navigate(['/user-group']);
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
