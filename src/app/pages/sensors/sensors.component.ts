// sensors.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { SensorsService } from '../../services/sensors.service';
import { ClassroomsService } from '../../services/classrooms.service';
import { Sensor } from '../../interfaces/sensor';

@Component({
  selector: 'app-sensors',
  standalone: true,
  imports: [CommonModule, RouterLink, HttpClientModule, FormsModule],
  templateUrl: './sensors.component.html',
  styleUrl: './sensors.component.css'
})
export class SensorsComponent implements OnInit {
  sensors: Sensor[] = [];
  filteredSensors: Sensor[] = [];
  searchTerm: string = '';
  classrooms: { id: number, name: string }[] = [];

  constructor(
    private sensorsService: SensorsService,
    private classroomsService: ClassroomsService
  ) {}

  ngOnInit(): void {
    this.loadClassrooms();
  }

  loadClassrooms() {
    this.classroomsService.getClassrooms().subscribe({
      next: (res) => {
        this.classrooms = res.data;
        this.loadSensors();
      },
      error: (err) => {
        console.error('Error al cargar salones', err);
        this.loadSensors(); // Aun así intenta cargar sensores aunque fallen los salones
      }
    });
  }

  loadSensors() {
    this.sensorsService.getSensors().subscribe({
      next: (res) => {
        this.sensors = res.map(sensor => {
          const classroom = this.classrooms.find(c => c.id === sensor.classroom_id);
          return {
            ...sensor,
            classroom_name: classroom ? classroom.name : 'Sin asignar'
          };
        });
        this.filteredSensors = [...this.sensors];
      },
      error: (err) => {
        console.error('Error al cargar sensores', err);
      }
    });
  }

  onSearchChange(event: any) {
    this.searchTerm = event.target.value.toLowerCase();
    this.filterSensors();
  }

  filterSensors() {
    if (!this.searchTerm) {
      this.filteredSensors = [...this.sensors];
    } else {
      this.filteredSensors = this.sensors.filter(sensor =>
        sensor.name.toLowerCase().includes(this.searchTerm) ||
        sensor.type.toLowerCase().includes(this.searchTerm) ||
        sensor.esp32_code.toLowerCase().includes(this.searchTerm) ||
        (sensor.classroom_name && sensor.classroom_name.toLowerCase().includes(this.searchTerm))
      );
    }
  }
}
