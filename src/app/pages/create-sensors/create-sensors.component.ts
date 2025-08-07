// create-sensors.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SensorsService } from '../../services/sensors.service';
import { Router } from '@angular/router';
import { ClassroomsService } from '../../services/classrooms.service';
import { Classroom } from '../../interfaces/classroom';

@Component({
  selector: 'app-create-sensors',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-sensors.component.html',
  styleUrl: './create-sensors.component.css'
})
export class CreateSensorsComponent implements OnInit {
  sensorForm: FormGroup;
  successMessage = '';
  errorMessages: string[] = [];
  classrooms: Classroom[] = [];
  constructor(

    private fb: FormBuilder,
    private sensorsService: SensorsService,
    private classroomsService: ClassroomsService,
    private router: Router
  ) {
    this.sensorForm = this.fb.group({
      name: ['', Validators.required],
      esp32_code: ['', Validators.required],
      type: ['', Validators.required],

      classroom_id: [null] // <- agregado aquí
    });
  }

  ngOnInit() {
    this.classroomsService.getClassrooms().subscribe({
      next: (res) => {
        console.log('Respuesta salones:', res); // Ver para depurar

        // Caso 1: data es un array directamente
        if (Array.isArray(res.data)) {
          this.classrooms = res.data;
        }
        // Caso 2: data es un objeto que contiene un array classrooms
        else if (res.data && Array.isArray(res.data.classrooms)) {
          this.classrooms = res.data.classrooms;
        }
        else {
          this.classrooms = []; // vacío por defecto
          this.errorMessages = ['Formato inesperado en respuesta de salones'];
          setTimeout(() => this.errorMessages = [], 3000);
        }
      },
      error: () => {
        this.errorMessages = ['No se pudieron cargar los salones'];
        setTimeout(() => this.errorMessages = [], 3000);
      }
    });

    this.sensorForm = this.fb.group({
      name: ['', Validators.required],
      esp32_code: ['', Validators.required],
      type: ['', Validators.required],
      classroom_id: [null],
    });
  }

  onSubmit() {
    if (this.sensorForm.invalid) return;

    const formData = { ...this.sensorForm.value };

    // Si classroom_id es null, undefined o una cadena vacía, lo eliminamos
    if (!formData.classroom_id) {
      delete formData.classroom_id;
    }

    this.sensorsService.createSensor(formData).subscribe({
      next: (res) => {
        this.successMessage = res.msg[0];
        this.errorMessages = [];
        this.sensorForm.reset();

        setTimeout(() => {
          this.successMessage = '';
          this.router.navigate(['/sensors']);
        }, 3000);
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