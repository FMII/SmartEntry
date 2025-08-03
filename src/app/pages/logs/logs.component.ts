import { Component, NgModule, OnInit } from '@angular/core';
import { Classroom } from '../../interfaces/classroom';
import { FormControl, FormGroup, FormsModule, NgModel, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClassroomsService } from '../../services/classrooms.service';
import { LogsService } from '../../services/logs.service';
import { AccessLogEntry } from '../../interfaces/log';
import { NgFor, AsyncPipe, NgIf, DatePipe, CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-logs',
  standalone: true,
  imports: [NgFor, NgIf, DatePipe, CommonModule, FormsModule, HttpClientModule, ReactiveFormsModule],
  templateUrl: './logs.component.html',
  styleUrl: './logs.component.css'
})
export class LogsComponent implements OnInit {
  classrooms: Classroom[] = [];
  selectedClassroomId: number | null = null;
  FormLog: FormGroup;

  accessLogs: AccessLogEntry[] = [];

  constructor(
    private classroomService: ClassroomsService,
    private logsService: LogsService
  ) {
    this.FormLog = new FormGroup({
      classroomId: new FormControl('', Validators.required),
      fechaInicio: new FormControl(''),
      fechaFin: new FormControl('')
    });
  }

  ngOnInit() {
    this.classroomService.getAllClassrooms().subscribe({
      next: (response) => {
        this.classrooms = response.data;
        this.selectedClassroomId = this.classrooms[0]?.id ?? null;

        if (this.selectedClassroomId !== null) {
          this.FormLog.get('classroomId')?.setValue(this.selectedClassroomId);
          this.obtenerAccesos();
        }
      },
      error: (err) => console.error(err)
    });
  }

  onGroupChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedClassroomId = Number(value);
    this.FormLog.get('classroomId')?.setValue(this.selectedClassroomId);
    if (this.selectedClassroomId) {
      this.obtenerAccesos();
    }
  }

  obtenerAccesos() {
    const classroomId = this.FormLog.get('classroomId')?.value;
    const fechaInicio = this.FormLog.get('fechaInicio')?.value;
    const fechaFin = this.FormLog.get('fechaFin')?.value;

    this.logsService.getAccessLogs(classroomId, fechaInicio, fechaFin).subscribe({
      next: (res) => {
        this.accessLogs = res.data;
      },
      error: (err) => {
        console.error('Error al obtener los accesos:', err);
        this.accessLogs = [];
      }
    });
  }

  filtrarPorFechas() {
    if (!this.selectedClassroomId) {
      console.warn('Por favor selecciona un salón antes de filtrar por fechas.');
      return;
    }

    this.obtenerAccesos();
  }

  limpiarFiltro(): void {
    this.FormLog.get('fechaInicio')?.setValue('');
    this.FormLog.get('fechaFin')?.setValue('');
    this.obtenerAccesos(); // vuelve a cargar todos los accesos
  }
  formatearHoraUTC(fechaStr: string): string {
    const date = new Date(fechaStr);
    const horas = date.getUTCHours().toString().padStart(2, '0');
    const minutos = date.getUTCMinutes().toString().padStart(2, '0');
    const segundos = date.getUTCSeconds().toString().padStart(2, '0');
    return `${horas}:${minutos}:${segundos}`;
  }

}
