import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GroupService } from '../../services/group.service';

@Component({
  selector: 'app-update-group',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './update-group.component.html',
  styleUrl: './update-group.component.css'
})
export class UpdateGroupComponent implements OnInit {
  groupForm!: FormGroup;
  groupId!: number;
  successMessage = '';
  errorMessages: string[] = [];

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
  ) {}

  ngOnInit(): void {
    this.groupForm = this.fb.group({
      name: ['', [Validators.required]],
      grade: ['', [Validators.required]]
    });

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.groupId = +id;
        this.groupService.getGroupById(this.groupId).subscribe({
          next: (res) => {
            const data = res.data;
            this.groupForm.patchValue({
              name: data.name,
              grade: data.grade
            });
          },
          error: (err) => {
            this.errorMessages = ['No se pudo obtener el grupo'];
            setTimeout(() => this.errorMessages = [], 3000);
          }
        });
      }
    });
  }

  onSubmit() {
    this.errorMessages = [];
    this.successMessage = '';

    if (this.groupForm.invalid) {
      this.groupForm.markAllAsTouched();
      return;
    }

    this.groupService.updateGroup(this.groupId, this.groupForm.value).subscribe({
      next: (res) => {
        if (res.status === 'success') {
          this.successMessage = 'Grupo actualizado correctamente';
          setTimeout(() => {
            this.successMessage = '';
            this.router.navigate(['/group-management']);
          }, 3000);
        } else {
          this.errorMessages = Array.isArray(res.msg) ? res.msg : [res.msg || 'Error al actualizar'];
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
