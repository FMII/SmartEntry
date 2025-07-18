import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SubjectsService } from '../../services/subjects.service';
import { NgFor, NgIf } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-subjects',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, NgFor],
  templateUrl: './create-subjects.component.html',
  styleUrl: './create-subjects.component.css'
})
export class CreateSubjectComponent {
  registerForm: FormGroup;
  loading = false;
  successMessage = '';
  errorMessages: string[] = [];

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private subjectsService: SubjectsService
  ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      code: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[A-Z0-9-]+$/) // Solo mayúsculas, números y guiones
        ]
      ]
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) return;

    this.loading = true;
    this.successMessage = '';
    this.errorMessages = [];

    const subjectData = {
      name: this.registerForm.value.name,
      code: this.registerForm.value.code
    };

    this.subjectsService.createSubject(subjectData).subscribe({
      next: (res) => {
        if (res.status === 'success') {
          this.successMessage = 'Materia creada exitosamente.';
          this.registerForm.reset();

          // Redirigir
          setTimeout(() => {
            this.router.navigate(['/subjects']);
          }, 1500);
        } else {
          this.errorMessages = ['Ocurrió un error inesperado.'];
        }
      },
      error: (err) => {
        const msg = err?.error?.msg || err?.error?.message || 'Error del servidor.';
        this.errorMessages = Array.isArray(msg) ? msg : [msg];

        this.loading = false;

        setTimeout(() => {
          this.errorMessages = [];
        }, 3000);
      }

    });
  }
}
