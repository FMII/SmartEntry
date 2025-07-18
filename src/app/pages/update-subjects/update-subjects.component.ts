import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SubjectsService, Subject } from '../../services/subjects.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-update-subjects',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './update-subjects.component.html',
  styleUrl: './update-subjects.component.css'
})
export class UpdateSubjectsComponent implements OnInit {
  registerForm!: FormGroup;
  loading = false;
  successMessage = '';
  errorMessages: string[] = [];
  subjectId!: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private subjectService: SubjectsService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.subjectId = +this.route.snapshot.paramMap.get('id')!;
    this.initForm();

    this.subjectService.getAllSubjects().subscribe({
      next: (res) => {
        const subject = res.data.find((s: Subject) => s.id === this.subjectId);
        if (subject) {
          this.registerForm.patchValue({
            name: subject.name,
            code: subject.code
          });
        }
      },
      error: (err) => {
        this.errorMessages = ['Error al cargar la materia'];
        console.error(err);
      }
    });
  }

  initForm(): void {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      code: ['', [Validators.required, Validators.pattern(/^[A-Z0-9-]+$/)]]
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) return;

    this.loading = true;
    this.errorMessages = [];
    this.successMessage = '';

    const formData = this.registerForm.value;

    this.subjectService.updateSubject(this.subjectId, formData).subscribe({
      next: (res) => {
        this.successMessage = res.msg?.[0] || 'Materia actualizada correctamente';
        this.loading = false;
        setTimeout(() => this.router.navigate(['/subjects']), 2000);
      },
      error: (err) => {
        this.loading = false;

        if (err.error && err.error.msg && Array.isArray(err.error.msg)) {
          this.errorMessages = err.error.msg;
        } else {
          this.errorMessages = ['Error al actualizar la materia'];
        }

        console.error(err);
      }
    });
  }
}