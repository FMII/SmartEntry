import { Component, AfterViewInit, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';
import { GraphicsService } from '../../services/graphics.service';
import { GroupAttendance, TopAbsenceGroup } from '../../interfaces/top-absences';
import { GroupService } from '../../services/group.service';
import { Groups } from '../../interfaces/groups';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { AuthService } from '../../services/auth.service';

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

@Component({
  selector: 'app-teacher-assistance-panel',
  standalone: true,
  imports: [NgFor, ReactiveFormsModule, NgClass, DatePipe, NgIf, FormsModule],
  templateUrl: './teacher-assistance-panel.component.html',
  styleUrl: './teacher-assistance-panel.component.css'
})
export class TeacherAssistancePanelComponent implements OnInit, AfterViewInit {
  translateStatus(status: string): string {
    switch (status) {
      case 'late': return 'retardo';
      case 'absent': return 'ausente';
      case 'present': return 'presente';
      default: return status;
    }
  }
  // Paginación para la tabla de alumnos
  page = 1;
  pageSize = 8;
  get paginatedGroups() {
    const start = (this.page - 1) * this.pageSize;
    return this.groups.slice(start, start + this.pageSize);
  }
  get totalPages() {
    return Math.ceil(this.groups.length / this.pageSize) || 1;
  }
  goToPage(p: number) {
    if (p < 1 || p > this.totalPages) return;
    this.page = p;
  }
  @ViewChild('barCanvas') barCanvas!: ElementRef<HTMLCanvasElement>;

  userName: string = '';
  chart!: Chart;
  groups: TopAbsenceGroup[] = [];
  groups_data: Groups[] = [];
  selectedGroupId: number | null = null;
  attendanceData: GroupAttendance[] = [];

  FormSchedule: FormGroup;

  // Para el filtro de fechas
  startDate: string = '';
  endDate: string = '';

  constructor(
    private authService: AuthService,
    private graphicsService: GraphicsService,
    private groupService: GroupService,
  ) {
    this.FormSchedule = new FormGroup({
      grupoId: new FormControl('', Validators.required)
    });
  }

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.userName = `${user.first_name} ${user.last_name}`;
    }
    this.groupService.getAllGroups().subscribe({
      next: (response) => {
        this.groups_data = response.data;
        this.selectedGroupId = this.groups_data[0]?.id ?? null;

        if (this.selectedGroupId) {
          // Carga asistencia solo del grupo seleccionado
          this.getAttendance();
        }
      },
      error: (err) => console.error(err)
    });

    // Cargar la gráfica con todos los grupos (sin filtrar)
    this.graphicsService.getTopAbsences().subscribe({
      next: (res) => {
        this.groups = res.data;
        this.renderChart();
      },
      error: (err) => console.error('Error al obtener top absences:', err)
    });

    this.FormSchedule.get('grupoId')?.valueChanges.subscribe(value => {
      //console.log('Grupo seleccionado:', value);
    });
  }


  onGroupChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedGroupId = Number(value);
    this.getAttendance();
    // La gráfica NO se filtra, se mantiene mostrando todos los grupos
  }

  onDateFilter(event: Event) {
    event.preventDefault();
    this.getAttendance();
  }

  getAttendance() {
    if (!this.selectedGroupId) return;
    const start = this.startDate ? this.startDate : undefined;
    const end = this.endDate ? this.endDate : undefined;
    this.graphicsService.getAttendanceByGroup(this.selectedGroupId, start, end).subscribe({
      next: (res) => {
        this.attendanceData = res.data;
      },
      error: (err) => {
        console.error('Error al obtener asistencia:', err);
      }
    });
  }


  ngAfterViewInit(): void {
    // Ya no generamos la gráfica aquí directamente
    // Solo esperamos a que el canvas esté disponible
  }

  renderChart(): void {
    if (!this.barCanvas) return;

    const ctx = this.barCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    // Destruir la gráfica anterior si ya existe
    if (this.chart) {
      this.chart.destroy();
    }
    const capitalizeWords = (text: string | undefined | null): string => {
      if (!text) return '';
      return text
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    };

    const labels = this.groups.map(group => capitalizeWords(group.top_student?.name));
    const data = this.groups.map(group => group.top_student?.absences ?? 0);

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Inasistencias',
            data,
            hoverBackgroundColor: 'rgba(222, 222, 222, 0.7)',
            backgroundColor: 'rgba(222, 222, 222, 0.5)',
            borderRadius: 20,
          }
        ]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            text: 'Estudiantes con más ausencias',
          }
        },
        scales: {
          x: {
            beginAtZero: true
          }
        }
      }
    });
  }
  formatearHoraUTC(fechaStr: string): string {
    const date = new Date(fechaStr);
    const dia = date.getUTCDate().toString().padStart(2, '0');
    const mes = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const año = date.getUTCFullYear();
    const horas = date.getUTCHours().toString().padStart(2, '0');
    const minutos = date.getUTCMinutes().toString().padStart(2, '0');
    const segundos = date.getUTCSeconds().toString().padStart(2, '0');
    return `${dia}-${mes}-${año} ${horas}:${minutos}:${segundos}`;
  }
}
