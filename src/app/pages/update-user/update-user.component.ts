import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserRegisterService, User } from '../../services/user.service';

@Component({
  selector: 'app-update-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './update-user.component.html',
  styleUrl: './update-user.component.css'
})
export class UpdateUserComponent implements OnInit {
  registerForm: FormGroup;
  userId!: number;
  errorMessages: string[] = [];
  successMessage = '';
  loading = false;

  roles = [
    { id: 1, name: 'Administrador' },
    { id: 2, name: 'Secretaria' },
    { id: 3, name: 'Estudiante' },
    { id: 4, name: 'Maestro' }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private userService: UserRegisterService
  ) {
    this.registerForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role_id: ['', Validators.required],
      is_active: [true]
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const idParam = params['id'];
      if (idParam) {
        this.userId = +idParam;
        this.loadUserData(this.userId);
      }
    });
  }

  loadUserData(id: number) {
    this.userService.getAllUsers().subscribe({
      next: (response) => {
        if (response.status === 'success' && Array.isArray(response.data)) {
          const user = response.data.find((u: User) => u.id === id);
          if (user) {
            this.registerForm.patchValue({
              first_name: user.first_name,
              last_name: user.last_name,
              email: user.email,
              role_id: user.role_id,
              is_active: user.is_active
            });
          } else {
            this.errorMessages = ['Usuario no encontrado'];
          }
        } else {
          this.errorMessages = ['Error al obtener usuarios'];
        }
      },
      error: () => {
        this.errorMessages = ['Error al cargar los datos del usuario'];
      }
    });
  }

  onSubmit() {
    this.errorMessages = [];
    this.successMessage = '';

    if (this.registerForm.invalid) {
      this.errorMessages.push('Por favor completa todos los campos correctamente.');
      return;
    }

    this.loading = true;

    const formValue = {
      ...this.registerForm.value,
      role_id: Number(this.registerForm.value.role_id)
    };

    this.userService.updateUser(this.userId, formValue).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.status === 'success') {
          this.successMessage = Array.isArray(response.msg) ? response.msg.join(', ') : response.msg;

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
        if (err.error?.msg) {
          this.errorMessages = Array.isArray(err.error.msg) ? err.error.msg : [err.error.msg];
        } else {
          this.errorMessages = ['Error del servidor, intenta más tarde.'];
        }
      }
    });
  }

}
