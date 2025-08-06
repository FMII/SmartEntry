import { Component, AfterViewInit, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';
import { GraphicsService } from '../../services/graphics.service';
import { GroupAttendance, TopAbsenceGroup } from '../../interfaces/top-absences';
import { GroupService } from '../../services/group.service';
import { Groups } from '../../interfaces/groups';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { AuthService } from '../../services/auth.service';

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

@Component({
  selector: 'app-teacher-assistance-panel',
  standalone: true,
  imports: [NgFor, ReactiveFormsModule, NgClass, DatePipe, NgIf],
  templateUrl: './teacher-assistance-panel.component.html',
  styleUrl: './teacher-assistance-panel.component.css'
})
export class TeacherAssistancePanelComponent implements OnInit, AfterViewInit {
  @ViewChild('barCanvas') barCanvas!: ElementRef<HTMLCanvasElement>;
  userName: string = '';
  chart!: Chart;
  groups: TopAbsenceGroup[] = [];
  groups_data: Groups[] = [];
  selectedGroupId: number | null = null;
  attendanceData: GroupAttendance[] = [];

  FormSchedule: FormGroup;

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
      this.userName = `${user.firstName} ${user.lastName}`;
    }
    this.groupService.getAllGroups().subscribe({
      next: (response) => {
        this.groups_data = response.data;
        this.selectedGroupId = this.groups_data[0]?.id ?? null;

        if (this.selectedGroupId) {
          // Carga asistencia
          this.graphicsService.getAttendanceByGroup(this.selectedGroupId).subscribe({
            next: (res) => {
              this.attendanceData = res.data;
            },
            error: (err) => {
              console.error('Error al obtener asistencia:', err);
            }
          });

          // Carga top absences filtrado
          this.graphicsService.getTopAbsences().subscribe({
            next: (res) => {
              const result = res.data.find(group => group.group_id === this.selectedGroupId);
              this.groups = result ? [result] : [];
              this.renderChart(); // renderiza la gráfica ya filtrada
            },
            error: (err) => console.error('Error al obtener top absences:', err)
          });
        }
      },
      error: (err) => console.error(err)
    });

    this.FormSchedule.get('grupoId')?.valueChanges.subscribe(value => {
      console.log('Grupo seleccionado:', value);
    });
  }

  onGroupChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedGroupId = Number(value);
    console.log('Grupo seleccionado:', this.selectedGroupId);

    // 👇 Traer asistencia filtrada por grupo
    this.graphicsService.getAttendanceByGroup(this.selectedGroupId).subscribe({
      next: (res) => {
        this.attendanceData = res.data;
      },
      error: (err) => {
        console.error('Error al obtener asistencia:', err);
      }
    });

    // 👇 Filtrar los datos de top-absences por grupo seleccionado
    this.graphicsService.getTopAbsences().subscribe({
      next: (res) => {
        const result = res.data.find(group => group.group_id === this.selectedGroupId);
        this.groups = result ? [result] : [];
        this.renderChart(); // Actualiza la gráfica con un solo grupo
      },
      error: (err) => console.error('Error al obtener top absences:', err)
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

}
