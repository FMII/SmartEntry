import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SchedulesService } from '../../services/schedules.service';
import { HttpClientModule } from '@angular/common/http';
import { GroupService } from '../../services/group.service';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-schedules',
  standalone: true,
  imports: [CommonModule, RouterLink, HttpClientModule, FormsModule],
  templateUrl: './schedules.component.html',
  styleUrl: './schedules.component.css'
})
export class SchedulesComponent implements OnInit {
  groups: any[] = [];
  selectedGroupId: number | null = null;
  schedulesByDay: any = {};
  groupName: string = '';

  scheduleDetails: any[] = [];
  Object: any;
  weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  weekdayMap: any = {
    Monday: 'Lunes',
    Tuesday: 'Martes',
    Wednesday: 'Miércoles',
    Thursday: 'Jueves',
    Friday: 'Viernes'
  };

  constructor(
    private schedulesService: SchedulesService,
    private groupService: GroupService
  ) { }

  ngOnInit(): void {
    this.loadGroups();
  }

  loadGroups(): void {
    this.groupService.getGroups().subscribe({
      next: (res) => {
        if (res.status === 'success') {
          this.groups = res.data;
        }
      },
      error: (err) => {
        console.error('Error al cargar grupos:', err);
      }
    });
  }

  onGroupChange(): void {
    if (!this.selectedGroupId) return;

    this.schedulesService.getSchedulesByGroup(this.selectedGroupId).subscribe({
      next: (res) => {
        if (res.status === 'success') {
          const rawData = res.data.teacherSubjectGroups;
          this.scheduleDetails = rawData;

          this.schedulesByDay = {};

          for (const item of rawData) {
            const start = this.formatTime(item.schedules.start_time);
            const end = this.formatTime(item.schedules.end_time);
            const timeSlot = `${start} - ${end}`;
            const weekday = item.schedules.weekday;

            if (!this.schedulesByDay[timeSlot]) {
              this.schedulesByDay[timeSlot] = {};
            }

            this.schedulesByDay[timeSlot][weekday] = {
              name: item.subjects.name,
              id: item.id
            };
          }

        } else {
          this.scheduleDetails = [];
          this.schedulesByDay = {};
        }
      },
      error: (err) => {
        console.error('Error al obtener horarios por grupo:', err);
        this.scheduleDetails = [];
        this.schedulesByDay = {};
      }
    });
  }


  getKeys(obj: any): string[] {
    return obj ? Object.keys(obj) : [];
  }

  formatTime(iso: string): string {
    const date = new Date(iso);
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }
}
