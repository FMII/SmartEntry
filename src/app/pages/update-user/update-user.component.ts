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
  showPassword: boolean = false;
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
      is_active: [true],
      password: ['', [this.passwordValidator]] // Campo opcional para nueva contraseña
    });
  }
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
  // Validador personalizado para la contraseña (solo valida si hay valor)
  passwordValidator(control: any) {
    if (!control.value) {
      return null; // Si está vacío, es válido (es opcional)
    }

    const password = control.value;

    // Validar longitud mínima de 8 caracteres
    if (password.length < 8) {
      return { passwordInvalid: 'La contraseña debe tener al menos 8 caracteres' };
    }

    // Validar que contenga al menos una minúscula
    if (!/[a-z]/.test(password)) {
      return { passwordInvalid: 'La contraseña debe contener al menos una minúscula' };
    }

    // Validar que contenga al menos una mayúscula
    if (!/[A-Z]/.test(password)) {
      return { passwordInvalid: 'La contraseña debe contener al menos una mayúscula' };
    }

    // Validar que contenga al menos un número
    if (!/\d/.test(password)) {
      return { passwordInvalid: 'La contraseña debe contener al menos un número' };
    }

    // Validar que contenga al menos un caracter especial
    if (!/[\W_]/.test(password)) {
      return { passwordInvalid: 'La contraseña debe contener al menos un caracter especial' };
    }

    return null; // Contraseña válida
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

    // Eliminar campos de contraseña si están vacíos
    if (!formValue.password) {
      delete formValue.password;
    }

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
