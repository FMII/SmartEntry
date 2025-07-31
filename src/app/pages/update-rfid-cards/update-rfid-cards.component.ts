import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, NgIf, NgFor } from '@angular/common';
import { RfidCardsService } from '../../services/rfid-cards.service';
import { UserRegisterService, User } from '../../services/user.service';

@Component({
  selector: 'app-update-rfid-cards',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgIf, NgFor],
  templateUrl: './update-rfid-cards.component.html',
  styleUrls: ['./update-rfid-cards.component.css']
})
export class UpdateRfidCardsComponent implements OnInit {
  registerForm: FormGroup;
  successMessage = '';
  errorMessages: string[] = [];
  users: User[] = [];
  rfidId!: number;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private rfidCardService: RfidCardsService,
    private userService: UserRegisterService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      uid: ['', [Validators.required, Validators.pattern(/^[0-9A-F]{8,20}$/)]],
      user_id: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.rfidId = +this.route.snapshot.paramMap.get('id')!;
    this.loadUsers();
    this.loadRfid();
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (res) => {
        if (res.status === 'success') {
          this.users = res.data;
        }
      },
      error: () => {
        this.errorMessages = ['No se pudieron cargar los usuarios'];
      }
    });
  }

  loadRfid(): void {
    this.rfidCardService.getAllRfids().subscribe({
      next: (res) => {
        if (res.status === 'success') {
          const rfid = res.data.find((item: any) => item.id === this.rfidId);
          if (rfid) {
            this.registerForm.patchValue({
              uid: rfid.uid,
              user_id: rfid.user_id
            });
          } else {
            this.errorMessages = ['Tarjeta RFID no encontrada'];
          }
        } else {
          this.errorMessages = ['Error al cargar las tarjetas RFID'];
        }
      },
      error: () => {
        this.errorMessages = ['No se pudieron cargar las tarjetas RFID'];
      }
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const formValue = {
      ...this.registerForm.value,
      user_id: +this.registerForm.value.user_id // Asegura que user_id sea number
    };

    this.rfidCardService.updateRfid(this.rfidId, formValue).subscribe({
      next: (res) => {
        if (res.status === 'success') {
          this.successMessage = Array.isArray(res.msg) ? res.msg.join(', ') : res.msg || 'Actualizado correctamente';
          setTimeout(() => {
            this.successMessage = '';
            this.router.navigate(['/rfid-cards']);
          }, 3000);
        } else {
          this.errorMessages = Array.isArray(res.msg) ? res.msg : [res.msg];
          setTimeout(() => this.errorMessages = [], 3000);
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
