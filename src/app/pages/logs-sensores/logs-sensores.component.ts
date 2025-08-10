import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgFor, NgIf, CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { SensorLogsService } from '../../services/sensor-logs.service';
import { SensorLogEntry } from '../../interfaces/sensor-log';

@Component({
  selector: 'app-logs-sensores',
  standalone: true,
  imports: [NgFor, NgIf, CommonModule, FormsModule, HttpClientModule, ReactiveFormsModule],
  templateUrl: './logs-sensores.component.html',
  styleUrl: './logs-sensores.component.css'
})
export class LogsSensoresComponent implements OnInit {
  sensorLogs: SensorLogEntry[] = [];
  FormLog: FormGroup;

  constructor(private sensorLogsService: SensorLogsService) {
    this.FormLog = new FormGroup({
      fechaInicio: new FormControl(''),
      fechaFin: new FormControl('')
    });
  }

  ngOnInit() {
    this.obtenerLogsSensores();
  }

  obtenerLogsSensores() {
    const fechaInicio = this.FormLog.get('fechaInicio')?.value;
    const fechaFin = this.FormLog.get('fechaFin')?.value;

    this.sensorLogsService.getSensorLogs(fechaInicio, fechaFin).subscribe({
      next: (res) => {
        console.log('Respuesta completa de la API:', res);
        console.log('Datos de logs:', res.data);
        if (res.data && res.data.length > 0) {
          console.log('Primer log:', res.data[0]);
          console.log('Propiedades del primer log:', Object.keys(res.data[0]));
        }
        this.sensorLogs = res.data;
      },
      error: (err) => {
        console.error('Error al obtener los logs de sensores:', err);
        this.sensorLogs = [];
      }
    });
  }

  filtrarPorFechas() {
    this.obtenerLogsSensores();
  }

  limpiarFiltro(): void {
    this.FormLog.get('fechaInicio')?.setValue('');
    this.FormLog.get('fechaFin')?.setValue('');
    this.obtenerLogsSensores();
  }

  formatearFechaLocal(fechaStr: string): string {
    // Verificar si la fecha es válida
    if (!fechaStr || fechaStr === 'undefined' || fechaStr === 'null') {
      return 'N/A';
    }
    
    try {
      let fechaLimpia = fechaStr;
      
      fechaLimpia = fechaLimpia.replace(/[Z]$/, '').replace(/[+-]\d{2}:\d{2}$/, '');
      
      const partes = fechaLimpia.split(/[T\s]/);
      const fechaParte = partes[0];
      const horaParte = partes[1] || '00:00:00';
      
      const [año, mes, dia] = fechaParte.split('-').map(Number);
      const [horas, minutos, segundos = 0] = horaParte.split(':').map(Number);
      
      const date = new Date(año, mes - 1, dia, horas, minutos, segundos);
      
      const diaStr = date.getDate().toString().padStart(2, '0');
      const mesStr = (date.getMonth() + 1).toString().padStart(2, '0');
      const añoStr = date.getFullYear();
      const horasStr = date.getHours().toString().padStart(2, '0');
      const minutosStr = date.getMinutes().toString().padStart(2, '0');
      
      return `${diaStr}-${mesStr}-${añoStr} ${horasStr}:${minutosStr}`;
    } catch (error) {
      console.error('Error al formatear fecha:', error, fechaStr);
      return fechaStr || 'N/A';
    }
  }
}
