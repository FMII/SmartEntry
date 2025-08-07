import { Component } from '@angular/core';
import { GroupService } from '../../services/group.service';
import { Groups } from '../../interfaces/groups';
import { NgFor, NgIf } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Schedule } from '../../interfaces/schedule';
import { SchedulesService } from '../../services/schedules.service';
import { Subject } from '../../interfaces/subject';
import { SubjectsService } from '../../services/subjects.service';
import { ClassroomsService } from '../../services/classrooms.service';
import { Classroom } from '../../interfaces/classroom';
import { UserRegisterService } from '../../services/user.service';
import { Teacher } from '../../interfaces/teacher';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-schedules',
  standalone: true,
  imports: [NgFor, NgIf, ReactiveFormsModule],
  templateUrl: './create-schedules.component.html',
  styleUrl: './create-schedules.component.css'
})
export class CreateSchedulesComponent {
  groups: Groups[] = [];
  schedules: Schedule[] = [];
  subjects: Subject[] = [];
  classrooms: Classroom[] = [];
  teachers: Teacher[] = [];
  successMessage: string = '';
  errorMessages: string[] = [];


  FormSchedule: FormGroup;

  constructor(
    private schedulesService: SchedulesService,
    private groupService: GroupService,
    private subjectsService: SubjectsService,
    private classroomsService: ClassroomsService,
    private teacherService: UserRegisterService,
    private router: Router
  ) {
    this.FormSchedule = new FormGroup({
      grupoId: new FormControl('', Validators.required),
      scheduleId: new FormControl('', Validators.required),
      subjectId: new FormControl('', Validators.required),
      classroomId: new FormControl('', Validators.required),
      teacherId: new FormControl('', Validators.required)
    });
  }

  ngOnInit() {
    //Grupos
    this.groupService.getAllGroups().subscribe({
      next: (response) => {
        this.groups = response.data;
      },
      error: (err) => console.error(err)
    });

    //Horarios
    this.schedulesService.getAllSchedules().subscribe({
      next: (response) => {
        this.schedules = response.data.schedules.map(sch => ({
          ...sch,
          weekday: this.translateDay(sch.weekday),
          start_time: this.formatearHoraUTC(sch.start_time),
          end_time: this.formatearHoraUTC(sch.end_time)
        }));

      },
      error: (err) => console.error(err)
    });

    //Salones
    this.classroomsService.getAllClassrooms().subscribe({
      next: (response) => {
        this.classrooms = response.data;
      },
      error: (err) => {
        console.error('Error al obtener salones', err);
      }
    });

    //Materias
    this.subjectsService.getSubjects().subscribe({
      next: (response) => {
        this.subjects = response.data;
      },
      error: (err) => {
        console.error('Error al obtener materias', err);
      }
    });

    //Maestros
    this.teacherService.getTeachers().subscribe({
      next: (response) => {
        this.teachers = response.data;
      },
      error: (err) => {
        console.error('Error al obtener materias', err);
      }
    });

    /*
    CONSOLE LOGS ->
    this.FormSchedule.get('grupoId')?.valueChanges.subscribe(value => {
      console.log('Grupo seleccionado:', value);
    });
    this.FormSchedule.get('scheduleId')?.valueChanges.subscribe(value => {
      console.log('Horario seleccionado:', value);
    });
    this.FormSchedule.get('subjectId')?.valueChanges.subscribe(value => {
      console.log('Materia seleccionada:', value);
    });
    this.FormSchedule.get('classroomId')?.valueChanges.subscribe(value => {
      console.log('Salón seleccionada:', value);
    });
    this.FormSchedule.get('teacherId')?.valueChanges.subscribe(value => {
      console.log('Maestro seleccionado:', value);
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

  translateDay(day: string): string {
    const days: { [key: string]: string } = {
      Monday: 'Lunes',
      Tuesday: 'Martes',
      Wednesday: 'Miércoles',
      Thursday: 'Jueves',
      Friday: 'Viernes',
      Saturday: 'Sábado',
      Sunday: 'Domingo',
    };
    return days[day] || day;
  }

  onSubmit() {
    if (this.FormSchedule.valid) {
      const payload = {
        teacher_id: Number(this.FormSchedule.value.teacherId),
        subject_id: Number(this.FormSchedule.value.subjectId),
        group_id: Number(this.FormSchedule.value.grupoId),
        classroom_id: Number(this.FormSchedule.value.classroomId),
        schedule_id: Number(this.FormSchedule.value.scheduleId)
      };

      this.schedulesService.createAssignment(payload).subscribe({
        next: (response) => {
          if (response.status === 'success') {
            this.successMessage = response.msg; // muestra mensaje éxito
            this.errorMessages = []; // limpia errores

            setTimeout(() => {
              this.successMessage = '';
              this.router.navigate(['/schedules']);

            }, 3000);
          } else {
            this.successMessage = '';
            this.errorMessages = [response.msg || 'Error desconocido'];
          }
        },
        error: (err) => {
          this.successMessage = '';
          // Intenta obtener mensaje de error o usa mensaje por defecto
          const errorMsg = err?.error?.msg || 'Error al crear asignación';
          this.errorMessages = [errorMsg];
        }
      });
    } else {
      this.successMessage = '';
      this.errorMessages = ['Formulario inválido, verifica los campos'];
    }
  }
}
