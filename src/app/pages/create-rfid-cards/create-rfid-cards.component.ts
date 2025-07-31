import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, NgIf, NgFor } from '@angular/common';
import { Router } from '@angular/router';
import { RfidCardsService } from '../../services/rfid-cards.service';
import { UserRegisterService, User } from '../../services/user.service';

@Component({
  selector: 'app-create-rfid-cards',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgIf, NgFor],
  templateUrl: './create-rfid-cards.component.html',
  styleUrls: ['./create-rfid-cards.component.css']
})
export class CreateRfidCardComponent implements OnInit {
  registerForm: FormGroup;
  errorMessages: string[] = [];
  successMessage = '';
  users: User[] = [];

  constructor(
    private fb: FormBuilder,
    private rfidCardService: RfidCardsService,
    private userRegisterService: UserRegisterService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      uid: ['', Validators.required],
      user_id: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userRegisterService.getAllUsers().subscribe({
      next: (res) => {
        if (res.status === 'success') {
          this.users = res.data;
        }
      },
      error: () => {
        this.errorMessages = ['No se pudieron cargar los usuarios'];
        setTimeout(() => this.errorMessages = [], 3000);
      }
    });
  }

  onSubmit(): void {
    this.errorMessages = [];
    this.successMessage = '';

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    // Convertir user_id a número antes de enviar
    const formData = {
      ...this.registerForm.value,
      user_id: Number(this.registerForm.value.user_id),
    };

    this.rfidCardService.createRfid(formData).subscribe({
      next: (res) => {
        if (res.status === 'success') {
          this.successMessage = res.msg;
          this.registerForm.reset();

          setTimeout(() => {
            this.successMessage = '';
            this.router.navigate(['/rfid-cards']);
          }, 3000);
        } else {
          this.errorMessages = Array.isArray(res.msg) ? res.msg : [res.msg];
          setTimeout(() => this.errorMessages = [], 1500);
        }
      },
      error: (err) => {
        const msg = err.error?.msg;
        this.errorMessages = Array.isArray(msg) ? msg : [msg || 'Error del servidor'];
        setTimeout(() => this.errorMessages = [], 3000);
      }
    });
  }

}
