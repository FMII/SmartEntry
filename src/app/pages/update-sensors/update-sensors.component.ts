import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, NgIf, NgFor } from '@angular/common';
import { SensorsService } from '../../services/sensors.service';
import { ClassroomsService } from '../../services/classrooms.service';
import { Classroom } from '../../interfaces/classroom';

@Component({
  selector: 'app-update-sensor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgIf, NgFor],
  templateUrl: './update-sensors.component.html',
  styleUrl: './update-sensors.component.css'
})
export class UpdateSensorComponent implements OnInit {
  sensorForm: FormGroup;
  successMessage = '';
  errorMessages: string[] = [];
  sensorId!: number;
  classrooms: Classroom[] = [];

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private sensorService: SensorsService,
    private classroomsService: ClassroomsService,
    private router: Router
  ) {
    this.sensorForm = this.fb.group({
      name: ['', [Validators.maxLength(100)]],
      esp32_code: ['', [Validators.maxLength(100)]],
      type: ['', Validators.required],
      classroom_id: [null]  // <-- agregado aquí
    });
  }

  ngOnInit(): void {
    this.sensorId = +this.route.snapshot.paramMap.get('id')!;

    this.classroomsService.getClassrooms().subscribe({
      next: (res) => {
        if (Array.isArray(res.data)) {
          this.classrooms = res.data;
        } else if (res.data?.classrooms) {
          this.classrooms = res.data.classrooms;
        } else {
          this.errorMessages = ['Error en la carga de salones'];
        }
      },
      error: () => {
        this.errorMessages = ['No se pudieron cargar los salones'];
      }
    });

    this.loadSensor();
  }

  loadSensor(): void {
    this.sensorService.getSensors().subscribe({
      next: (sensors) => {
        const sensor = sensors.find((s) => s.id === this.sensorId);
        if (sensor) {
          this.sensorForm.patchValue({
            name: sensor.name,
            esp32_code: sensor.esp32_code,
            type: sensor.type,
            classroom_id: sensor.classroom_id ?? null  // <-- patch classroom_id
          });
        } else {
          this.errorMessages = ['Sensor no encontrado'];
        }
      },
      error: () => {
        this.errorMessages = ['No se pudieron cargar los sensores'];
      }
    });
  }

  onSubmit(): void {
    if (this.sensorForm.invalid) {
      this.sensorForm.markAllAsTouched();
      return;
    }

    const formValue = { ...this.sensorForm.value };

    // Elimina classroom_id si no tiene valor o es falsy
    if (!formValue.classroom_id) {
      delete formValue.classroom_id;
    }

    this.sensorService.updateSensor(this.sensorId, formValue).subscribe({
      next: (res) => {
        if (res.status === 'success') {
          this.successMessage = Array.isArray(res.msg) ? res.msg.join(', ') : res.msg;
          this.errorMessages = [];
          setTimeout(() => {
            this.successMessage = '';
            this.router.navigate(['/sensors']);
          }, 3000);
        } else {
          this.errorMessages = Array.isArray(res.msg) ? res.msg : [res.msg];
          setTimeout(() => (this.errorMessages = []), 3000);
        }
      },
      error: (err) => {
        const msg = err.error?.msg;
        this.errorMessages = Array.isArray(msg) ? msg : [msg || 'Error del servidor'];
        setTimeout(() => (this.errorMessages = []), 3000);
      }
    });
  }
}
