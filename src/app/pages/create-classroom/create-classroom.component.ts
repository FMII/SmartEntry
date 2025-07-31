import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClassroomsService } from '../../services/classrooms.service';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-classroom',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, NgFor],
  templateUrl: './create-classroom.component.html',
  styleUrl: './create-classroom.component.css',
})
export class CreateClassroomComponent {
  registerForm: FormGroup;
  errorMessages: string[] = [];
  successMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private classroomsService: ClassroomsService,
    private router: Router

  ) {
    this.registerForm = this.fb.group({
      name: [''],
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.errorMessages = ['Nombre inválido'];
      this.successMessage = '';
      return;
    }

    const formData = this.registerForm.value;

    this.classroomsService.createClassroom(formData).subscribe({
      next: (response) => {
        this.successMessage = response.msg?.[0] || 'Aula creada correctamente';
        this.errorMessages = [];
        this.registerForm.reset();

        setTimeout(() => {
          this.successMessage = '';
          this.router.navigate(['/workshop-blockade']);
        }, 3000);
      },
      error: (err) => {
        this.successMessage = '';
        this.errorMessages = err.error?.msg || ['Error al crear aula'];
        setTimeout(() => {
          this.errorMessages = [];
        }, 3000);
      },
    });
  }
}
