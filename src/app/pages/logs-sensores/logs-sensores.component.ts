import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgIf, NgFor, CommonModule } from '@angular/common';
import { SensorLogsService, UserInfo, ClassroomInfo } from '../../services/sensor-logs.service';
import { SensorLogEntry, SensorLogDisplay } from '../../interfaces/sensor-log';
import { forkJoin, Subscription, interval } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-logs-sensores',
  standalone: true,
  imports: [NgIf, NgFor, CommonModule, ReactiveFormsModule],
  templateUrl: './logs-sensores.component.html',
  styleUrls: ['./logs-sensores.component.css']
})
export class LogsSensoresComponent implements OnInit, OnDestroy {
  sensorLogs: SensorLogEntry[] = [];
  sensorLogsDisplay: SensorLogDisplay[] = [];
  filterForm: FormGroup;
  isLoading = false;
  isLoadingDetails = false;
  usersMap = new Map<number, UserInfo>();
  classroomsMap = new Map<number, ClassroomInfo>();
  
  // Propiedades para el polling
  isPollingActive = true;
  pollingInterval = 30000; // 30 segundos
  lastUpdateTime: Date | null = null;
  private pollingSubscription: Subscription | null = null;

  constructor(
    private fb: FormBuilder,
    private sensorLogsService: SensorLogsService
  ) {
    this.filterForm = this.fb.group({
      fechaInicio: [''],
      fechaFin: ['']
    });
  }

  ngOnInit(): void {
    this.obtenerLogsSensores();
    this.iniciarPolling();
  }

  ngOnDestroy(): void {
    this.detenerPolling();
  }

  // Método para iniciar el polling automático
  iniciarPolling() {
    if (this.pollingSubscription) {
      this.detenerPolling();
    }

    this.pollingSubscription = interval(this.pollingInterval)
      .pipe(
        takeWhile(() => this.isPollingActive)
      )
      .subscribe(() => {
        console.log('Polling automático: Actualizando logs...');
        this.obtenerLogsSensores(true); // true = es actualización automática
      });
  }

  // Método para detener el polling
  detenerPolling() {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
      this.pollingSubscription = null;
    }
  }

  // Método para alternar el polling
  alternarPolling() {
    this.isPollingActive = !this.isPollingActive;
    
    if (this.isPollingActive) {
      this.iniciarPolling();
      console.log('Polling activado');
    } else {
      this.detenerPolling();
      console.log('Polling pausado');
    }
  }

  obtenerLogsSensores(esActualizacionAutomatica = false) {
    if (!esActualizacionAutomatica) {
      this.isLoading = true;
    }
    
    const fechaInicio = this.filterForm.get('fechaInicio')?.value;
    const fechaFin = this.filterForm.get('fechaFin')?.value;

    this.sensorLogsService.getSensorLogs(fechaInicio, fechaFin).subscribe({
      next: (res) => {
        if (!esActualizacionAutomatica) {
          console.log('Respuesta completa de la API:', res);
          console.log('Datos de logs:', res.data);
          if (res.data && res.data.length > 0) {
            console.log('Primer log:', res.data[0]);
            console.log('Propiedades del primer log:', Object.keys(res.data[0]));
            console.log('Primer log expandido:', JSON.stringify(res.data[0], null, 2));
            if (res.data[0].response) {
              console.log('Estructura de response:', JSON.stringify(res.data[0].response, null, 2));
            }
            if (res.data[0].sensors) {
              console.log('Estructura de sensors:', JSON.stringify(res.data[0].sensors, null, 2));
            }
          }
        } else {
          console.log('Actualización automática completada');
        }
        
        this.sensorLogs = res.data;
        this.lastUpdateTime = new Date();
        
        if (!esActualizacionAutomatica) {
          this.obtenerInformacionDetallada();
        } else {
          // Para actualizaciones automáticas, solo actualizar si ya tenemos la información de usuarios/salones
          if (this.usersMap.size > 0 && this.classroomsMap.size > 0) {
            this.mapearDatosParaTabla();
          } else {
            this.obtenerInformacionDetallada();
          }
        }
        
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al obtener los logs de sensores:', err);
        if (!esActualizacionAutomatica) {
          this.sensorLogs = [];
          this.sensorLogsDisplay = [];
        }
        this.isLoading = false;
      }
    });
  }

  obtenerInformacionDetallada() {
    this.isLoadingDetails = true;
    const userIds: number[] = [];
    const classroomIds: number[] = [];

    this.sensorLogs.forEach(log => {
      if (log.response.data.accessLog) {
        userIds.push(log.response.data.accessLog.user_id);
        if (log.response.data.accessLog.classroom_id) {
          classroomIds.push(log.response.data.accessLog.classroom_id);
        }
      }
      if (log.response.data.shift) {
        userIds.push(log.response.data.shift.user_id);
      }
    });

    console.log('IDs de usuarios encontrados:', userIds);
    console.log('IDs de salones encontrados:', classroomIds);

    const userRequest = this.sensorLogsService.getUsersInfo(userIds);
    const classroomRequest = this.sensorLogsService.getClassroomsInfo(classroomIds);

    console.log('Iniciando llamadas a APIs de usuarios y salones...');

    forkJoin([userRequest, classroomRequest]).subscribe({
      next: ([users, classrooms]) => {
        this.usersMap = users;
        this.classroomsMap = classrooms;
        console.log('Información de usuarios obtenida:', users);
        console.log('Información de salones obtenida:', classrooms);
        console.log('Mapeo de usuarios:', Array.from(users.entries()));
        console.log('Mapeo de salones:', Array.from(classrooms.entries()));
        this.mapearDatosParaTabla();
        this.isLoadingDetails = false;
      },
      error: (err) => {
        console.error('Error al obtener información detallada:', err);
        console.error('Detalles del error:', {
          message: err.message,
          status: err.status,
          url: err.url
        });
        this.isLoadingDetails = false;
        this.mapearDatosParaTabla();
      }
    });
  }

  mapearDatosParaTabla() {
    this.sensorLogsDisplay = this.sensorLogs.map(log => {
      return {
        sensorName: this.obtenerNombreSensor(log),
        date: this.formatearFechaLocal(log.created_at),
        userName: this.obtenerNombreUsuario(log),
        classroomName: this.obtenerNombreSalon(log),
        message: this.obtenerMensaje(log),
        status: log.response.status
      };
    });
  }

  obtenerNombreSensor(log: SensorLogEntry): string {
    return log.sensors.name || `Sensor ${log.sensor_id}`;
  }

  obtenerNombreUsuario(log: SensorLogEntry): string {
    // Intentar obtener el user_id del accessLog o shift
    let userId: number | null = null;
    
    if (log.response.data.accessLog) {
      userId = log.response.data.accessLog.user_id;
    } else if (log.response.data.shift) {
      userId = log.response.data.shift.user_id;
    }
    
    if (userId) {
      const userInfo = this.usersMap.get(userId);
      if (userInfo) {
        // Mostrar nombre completo: "Angel Guevara"
        return `${userInfo.first_name} ${userInfo.last_name}`;
      }
      return `Usuario ${userId}`;
    }
    
    return 'Usuario no identificado';
  }

  obtenerNombreSalon(log: SensorLogEntry): string {
    if (log.response.data.accessLog && log.response.data.accessLog.classroom_id) {
      const classroomId = log.response.data.accessLog.classroom_id;
      const classroomInfo = this.classroomsMap.get(classroomId);
      if (classroomInfo) {
        return classroomInfo.name;
      }
      return `Salón ${classroomId}`;
    }
    return '-';
  }

  obtenerMensaje(log: SensorLogEntry): string {
    return log.response.msg || 'Sin mensaje';
  }

  formatearFechaLocal(fechaStr: string): string {
    if (!fechaStr || fechaStr === 'undefined' || fechaStr === 'null') {
      return 'Fecha no disponible';
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
      return 'Fecha inválida';
    }
  }

  limpiarFiltros() {
    this.filterForm.reset();
    this.obtenerLogsSensores();
  }

  // Método para formatear la hora de última actualización
  obtenerHoraUltimaActualizacion(): string {
    if (!this.lastUpdateTime) return 'Nunca';
    
    const ahora = new Date();
    const diffMs = ahora.getTime() - this.lastUpdateTime.getTime();
    const diffSegs = Math.floor(diffMs / 1000);
    
    if (diffSegs < 60) return `Hace ${diffSegs} segundos`;
    if (diffSegs < 3600) return `Hace ${Math.floor(diffSegs / 60)} minutos`;
    return `Hace ${Math.floor(diffSegs / 3600)} horas`;
  }
}
