import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserRegisterService } from '../../services/user.service';

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.css'
})
export class CreateUserComponent implements OnInit {
  showPassword = false;
  registerForm: FormGroup;
  loading = false;
  errorMessages: string[] = [];
  successMessage = '';

  roles = [
    { id: 1, name: 'Administrador' },
    { id: 2, name: 'Secretaria' },
    { id: 3, name: 'Estudiante' },
    { id: 4, name: 'Maestro' }
  ];

  constructor(
    private fb: FormBuilder,
    private userRegisterService: UserRegisterService,
    private router: Router,
  ) {
    this.registerForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/),
        ],
      ],
      role_id: [3, Validators.required],
      is_active: [true]
    });
  }

  ngOnInit(): void { }

  onSubmit(): void {
    this.errorMessages = [];
    this.successMessage = '';
    this.registerForm.markAllAsTouched();

    if (this.registerForm.invalid) return;

    this.loading = true;

    const formValue = {
      ...this.registerForm.value,
      role_id: Number(this.registerForm.value.role_id)
    };

    this.userRegisterService.registerUser(formValue).subscribe({
      next: (response) => {
        this.loading = false;

        if (response.status === 'success') {
          this.successMessage = Array.isArray(response.msg) ? response.msg.join(', ') : response.msg;
          this.registerForm.reset({ role_id: 3, is_active: true });

          // Redirigir
          setTimeout(() => {
            this.router.navigate(['/user-management']);
          }, 1500);
        } else {
          this.errorMessages = Array.isArray(response.msg) ? response.msg : [response.msg];
        }
      },
      error: (err) => {
        this.loading = false;

        if (err.error && err.error.msg) {
          this.errorMessages = Array.isArray(err.error.msg) ? err.error.msg : [err.error.msg];
        } else {
          this.errorMessages = ['Error del servidor, intenta más tarde.'];
        }
      },
    });
  }
}
