import { Component, NgModule, OnInit } from '@angular/core';
import { Classroom } from '../../interfaces/classroom';
import { FormControl, FormGroup, FormsModule, NgModel, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClassroomsService } from '../../services/classrooms.service';
import { LogsService } from '../../services/logs.service';
import { AccessLogEntry } from '../../interfaces/log';
import { NgFor, AsyncPipe, NgIf, CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-logs',
  standalone: true,
  imports: [NgFor, NgIf, CommonModule, FormsModule, HttpClientModule, ReactiveFormsModule],
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

  // Método para formatear la fecha y hora completa sin conversión de zona horaria
  formatearFechaLocal(fechaStr: string): string {
    try {
      // Si la fecha viene con información de zona horaria, removerla para tratarla como local
      let fechaLimpia = fechaStr;
      
      // Remover información de zona horaria si existe (Z, +00:00, etc.)
      fechaLimpia = fechaLimpia.replace(/[Z]$/, '').replace(/[+-]\d{2}:\d{2}$/, '');
      
      // Crear fecha tratándola como si fuera local (no UTC)
      const partes = fechaLimpia.split(/[T\s]/);
      const fechaParte = partes[0];
      const horaParte = partes[1] || '00:00:00';
      
      const [año, mes, dia] = fechaParte.split('-').map(Number);
      const [horas, minutos, segundos = 0] = horaParte.split(':').map(Number);
      
      // Crear fecha directamente sin conversión de zona horaria
      const date = new Date(año, mes - 1, dia, horas, minutos, segundos);
      
      // Formatear
      const diaStr = date.getDate().toString().padStart(2, '0');
      const mesStr = (date.getMonth() + 1).toString().padStart(2, '0');
      const añoStr = date.getFullYear();
      const horasStr = date.getHours().toString().padStart(2, '0');
      const minutosStr = date.getMinutes().toString().padStart(2, '0');
      
      return `${diaStr}-${mesStr}-${añoStr} ${horasStr}:${minutosStr}`;
    } catch (error) {
      console.error('Error al formatear fecha:', error, fechaStr);
      return fechaStr; // Devolver la fecha original si hay error
    }
  }

  getRoleDisplayName(role: string): string {
    switch (role) {
      case 'student':
        return 'Estudiante';
      case 'teacher':
        return 'Docente';
      case 'secretary':
        return 'Secretaria';
      case 'personal':
        return 'Personal';
      case 'admin':
        return 'Administrador';
      default:
        return 'Desconocido';
    }
  }

}
