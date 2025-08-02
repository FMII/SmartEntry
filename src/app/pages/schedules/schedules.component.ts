import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { SchedulesService } from '../../services/schedules.service';
import { HttpClientModule } from '@angular/common/http';
import { GroupService } from '../../services/group.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Groups } from '../../interfaces/groups';
import { TeacherSubjectGroup } from '../../interfaces/schedule';
@Component({
  selector: 'app-schedules',
  standalone: true,
  imports: [CommonModule, RouterLink, HttpClientModule, FormsModule, ReactiveFormsModule],
  templateUrl: './schedules.component.html',
  styleUrl: './schedules.component.css'
})
export class SchedulesComponent {
  groups: Groups[] = [];
  selectedGroupId: number | null = null;
  showSchedules: TeacherSubjectGroup[] = [];

  FormSchedule: FormGroup;

  constructor(
    private schedulesService: SchedulesService,
    private groupService: GroupService,
    private router: Router
  ) {
    this.FormSchedule = new FormGroup({
      grupoId: new FormControl('', Validators.required),
    });
  }

  ngOnInit() {
    //Grupos
    this.groupService.getAllGroups().subscribe({
      next: (response) => {
        this.groups = response.data;
        this.selectedGroupId = this.groups[0]?.id ?? null;
      },
      error: (err) => console.error(err)
    });

    this.schedulesService.getAllSchedulesToShow().subscribe({
      next: (res) => {
        this.showSchedules = res.data.teacherSubjectGroups;
        //console.log(this.showSchedules);
      },
      error: (err) => console.error('Error al obtener horarios:', err)
    });
    /*
    this.FormSchedule.get('grupoId')?.valueChanges.subscribe(value => {
      console.log('Grupo seleccionado:', value);
    });
    */
  }
  formatearHoraUTC(fechaStr: string): string {
    const date = new Date(fechaStr);
    const horas = date.getUTCHours().toString().padStart(2, '0');
    const minutos = date.getUTCMinutes().toString().padStart(2, '0');
    const segundos = date.getUTCSeconds().toString().padStart(2, '0');
    return `${horas}:${minutos}:${segundos}`;
  }
  
  get filteredSchedules(): TeacherSubjectGroup[] {
    if (!this.selectedGroupId) return [];
    return this.showSchedules.filter(s => s.group_id === this.selectedGroupId);
  }
  onGroupChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedGroupId = Number(value);
    //console.log('Grupo seleccionado:', this.selectedGroupId);
  }
}