import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { RfidCardsService } from '../../services/rfid-cards.service';

@Component({
  selector: 'app-create-rfid-cards',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgIf, NgFor],
  templateUrl: './create-rfid-cards.component.html',
  styleUrls: ['./create-rfid-cards.component.css']
})
export class CreateRfidCardComponent {
  registerForm: FormGroup;
  errorMessages: string[] = [];
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private rfidCardService: RfidCardsService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      uid: ['', Validators.required],
      user_id: [null, Validators.required]
    });
  }

  onSubmit(): void {
    this.errorMessages = [];
    this.successMessage = '';

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.rfidCardService.createRfid(this.registerForm.value).subscribe({
      next: (res) => {
        if (res.status === 'success') {
          this.successMessage = res.msg;
          this.registerForm.reset();

          // Oculta el mensaje después de 3 segundos y navega a la lista
          setTimeout(() => {
            this.successMessage = '';
            this.router.navigate(['/rfid-cards']);
          }, 3000);
        } else {
          this.errorMessages = Array.isArray(res.msg) ? res.msg : [res.msg];
          setTimeout(() => {
            this.errorMessages = [];
          }, 3000);
        }
      },
      error: (err: any) => {
        const msg = err.error?.msg;
        this.errorMessages = Array.isArray(msg) ? msg : [msg || 'Error del servidor'];
        setTimeout(() => {
          this.errorMessages = [];
        }, 3000);
      }
    });
  }
}
