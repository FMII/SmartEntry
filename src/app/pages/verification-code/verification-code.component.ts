import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-verification-code',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './verification-code.component.html',
  styleUrls: ['./verification-code.component.css']
})
export class VerificationCodeComponent implements OnInit {
  codeForm: FormGroup;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.codeForm = this.fb.group({
      code: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
    });
  }

  ngOnInit() {}

  onSubmit() {
    if (this.codeForm.invalid) {
      this.errorMessage = 'Por favor ingresa un código válido de 6 dígitos.';
      return;
    }

    const email = localStorage.getItem('pendingEmail');
    const code = this.codeForm.value.code;

    if (!email) {
      this.errorMessage = 'No hay correo pendiente para verificar.';
      this.router.navigate(['/login']);
      return;
    }

    this.authService.verifyCode(email, code).subscribe({
      next: () => {
        localStorage.removeItem('pendingEmail');
        this.router.navigate(['/control-panel']);
      },
      error: (err) => {
        this.errorMessage = err.message || 'Error al verificar el código';
      }
    });
  }
}
