import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { GroupService } from '../../services/group.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-create-group',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgIf, NgFor],
  templateUrl: './create-group.component.html',
  styleUrl: './create-group.component.css'
})
export class CreateGroupComponent {
  groupForm: FormGroup;
  errorMessages: string[] = [];
  successMessage = '';

  grades = [
    { label: 'Primaria', value: 'Elementary_School' },
    { label: 'Secundaria', value: 'Middle_School' },
    { label: 'Preparatoria', value: 'High_School' }
  ];


  constructor(
    private fb: FormBuilder,
    private groupService: GroupService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.groupForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(/^[A-Za-z0-9\-]{1,20}$/)]],
      grade: ['', Validators.required]
    });
  }

  onSubmit() {
    this.errorMessages = [];
    this.successMessage = '';

    if (this.groupForm.invalid) {
      this.groupForm.markAllAsTouched();
      return;
    }

    this.groupService.createGroup(this.groupForm.value).subscribe({
      next: (res) => {
        if (res.status === 'success') {
          this.successMessage = res.msg;
          this.groupForm.reset();

          // Oculta el mensaje después de 3 segundos
          setTimeout(() => {
            this.successMessage = '';
            this.router.navigate(['/group-management']);
          }, 3000);
        } else {
          this.errorMessages = Array.isArray(res.msg) ? res.msg : [res.msg];

          setTimeout(() => {
            this.errorMessages = [];
          }, 1500);
        }
      },
      error: (err) => {
        const msg = err.error?.msg;
        this.errorMessages = Array.isArray(msg) ? msg : [msg || 'Error del servidor'];

        setTimeout(() => {
          this.errorMessages = [];
        }, 3000);
      }
    });
  }
}
