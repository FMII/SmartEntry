// sensors.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { SensorsService } from '../../services/sensors.service';
import { ClassroomsService } from '../../services/classrooms.service';
import { Sensor } from '../../interfaces/sensor';

@Component({
  selector: 'app-sensors',
  standalone: true,
  imports: [CommonModule, RouterLink, HttpClientModule],
  templateUrl: './sensors.component.html',
  styleUrl: './sensors.component.css'
})
export class SensorsComponent implements OnInit {
  sensors: Sensor[] = [];
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
      },
      error: (err) => {
        console.error('Error al cargar sensores', err);
      }
    });
  }
}
