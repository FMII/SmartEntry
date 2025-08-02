import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';
import { GraphicsService } from '../../services/graphics.service';
import { TopAbsenceGroup } from '../../interfaces/top-absences';

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

@Component({
  selector: 'app-teacher-assistance-panel',
  standalone: true,
  imports: [],
  templateUrl: './teacher-assistance-panel.component.html',
  styleUrl: './teacher-assistance-panel.component.css'
})
export class TeacherAssistancePanelComponent implements AfterViewInit {
  @ViewChild('barCanvas') barCanvas!: ElementRef<HTMLCanvasElement>;
  chart!: Chart;
  groups: TopAbsenceGroup[] = [];

  constructor(private graphicsService: GraphicsService) {}

  ngOnInit(): void {
    this.graphicsService.getTopAbsences().subscribe({
      next: (response) => {
        this.groups = response.data;
        this.renderChart(); // 👈 agregado: renderiza la gráfica después de cargar los datos
      },
      error: (err) => {
        console.error('Error cargando los datos:', err);
      }
    });
  }

  ngAfterViewInit(): void {
    // Ya no generamos la gráfica aquí directamente
    // Solo esperamos a que el canvas esté disponible
  }

  renderChart(): void { // 👈 agregado: función que genera la gráfica con los datos reales
    if (!this.barCanvas) return;

    const ctx = this.barCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    // Destruir la gráfica anterior si ya existe
    if (this.chart) {
      this.chart.destroy();
    }

    const labels = this.groups.map(group => group.top_student?.name); // 👈 agregado
    const data = this.groups.map(group => group.top_student?.absences ?? 0); // 👈 agregado

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Estudiante con más ausencias',
            data,
            backgroundColor: 'rgba(255, 99, 132, 0.5)', // 👈 personalizado
            borderRadius: 10
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
