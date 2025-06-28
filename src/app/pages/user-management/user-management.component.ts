import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserRegisterService, User } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule, RouterLink],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  errorMessages: string[] = [];
  successMessage = '';
  users: User[] = [];

  // Para manejo de edición
  isEditMode = false;
  editingUserId: number | null = null;

  roles = [
    { id: 1, name: 'Administrador' },
    { id: 2, name: 'Secretaria' },
    { id: 3, name: 'Estudiante' },
    { id: 4, name: 'Maestro' }
  ];

  constructor(
    private fb: FormBuilder,
    private userRegisterService: UserRegisterService
  ) {
    this.registerForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          // Solo requerido en modo registro, no en edición
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/),
        ],
      ],
      role_id: [3, Validators.required],
      is_active: [true] // agregar para edición de estado
    });
  }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.userRegisterService.getAllUsers().subscribe({
      next: (response) => {
        if (response.status === 'success') {
          this.users = response.data;
        } else {
          this.errorMessages = ['Error al cargar usuarios.'];
        }
      },
      error: () => {
        this.errorMessages = ['Error al cargar usuarios.'];
      }
    });
  }

  // Cargar datos del usuario en el formulario para editar
  editUser(user: User) {
    this.isEditMode = true;
    this.editingUserId = user.id;

    this.registerForm.patchValue({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      password: '', // no obligar a cambiar contraseña aquí
      role_id: user.role_id,
      is_active: user.is_active
    });

    // En modo edición, la contraseña no es requerida
    this.registerForm.get('password')?.clearValidators();
    this.registerForm.get('password')?.updateValueAndValidity();
  }

  cancelEdit() {
    this.isEditMode = false;
    this.editingUserId = null;
    this.registerForm.reset({
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      role_id: 3,
      is_active: true
    });

    // Restaurar validadores de password para registro
    this.registerForm.get('password')?.setValidators([
      Validators.minLength(8),
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/),
    ]);
    this.registerForm.get('password')?.updateValueAndValidity();

    this.errorMessages = [];
    this.successMessage = '';
  }

  onSubmit() {
    this.errorMessages = [];
    this.successMessage = '';

    // Marca todos los campos como tocados para mostrar errores de frontend
    this.registerForm.markAllAsTouched();

    this.loading = true;

    const formValue = {
      ...this.registerForm.value,
      role_id: Number(this.registerForm.value.role_id)
    };

    if (this.isEditMode && this.editingUserId !== null) {
      if (!formValue.password) {
        delete formValue.password;
      }

      this.userRegisterService.updateUser(this.editingUserId, formValue).subscribe({
        next: (response) => {
          this.loading = false;

          if (response.status === 'success') {
            this.successMessage = Array.isArray(response.msg) ? response.msg.join(', ') : response.msg;
            this.loadUsers();
            this.cancelEdit();
          } else if (response.status === 'error') {
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
    } else {
      this.userRegisterService.registerUser(formValue).subscribe({
        next: (response) => {
          this.loading = false;

          if (response.status === 'success') {
            this.successMessage = Array.isArray(response.msg) ? response.msg.join(', ') : response.msg;
            this.loadUsers();
            this.registerForm.reset({ role_id: 3, is_active: true });
          } else if (response.status === 'error') {
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
}
