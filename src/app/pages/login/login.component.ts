import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  errorMessage = '';

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) { }

  onSubmit() {
    this.errorMessage = ''; // limpia el mensaje anterior si lo hubiera

    if (this.loginForm.invalid) return;

    const { email, password } = this.loginForm.value;

    this.auth.login(email!, password!).subscribe({
      next: () => this.router.navigate(['user-management']),
      error: (err) => {
        this.errorMessage = err.message || 'Error en login';

        setTimeout(() => {
          this.errorMessage = '';
        }, 3000);
      },
    });
  }
}
