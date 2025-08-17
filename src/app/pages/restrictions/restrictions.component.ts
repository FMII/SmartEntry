import { Component } from '@angular/core';
import { RestrictionsService } from '../../services/restrictions.service';
import { Restriction } from '../../interfaces/restriction';
import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Classroom, ClassroomResponse } from '../../interfaces/classroom';

// 👇 Importamos las interfaces directamente del servicio
import { User, UsersResponse, UserRegisterService } from '../../services/user.service';
import { ClassroomsService } from '../../services/classrooms.service';

@Component({
  selector: 'app-restrictions',
  standalone: true,
  imports: [DatePipe, NgFor, NgIf, FormsModule, NgClass],
  templateUrl: './restrictions.component.html',
  styleUrl: './restrictions.component.css'
})
export class RestrictionsComponent {
  searchTerm: string = '';
  restrictions: Restriction[] = [];
  loading = true;
  error = '';
  showModal = false;

  // Formulario de creación
  newUserId: number | null = null;
  newClassroomId: number | null = null;
  creating = false;
  formMsg = '';
  formMsgType: 'success' | 'error' = 'success';

  users: User[] = [];
  classrooms: Classroom[] = [];

  // Toast
  successMessage = '';
  errorMessages: string[] = [];
  toastTimeout: any;

  constructor(
    private restrictionsService: RestrictionsService,
    private userService: UserRegisterService,
    private classroomsService: ClassroomsService
  ) { }

  get filteredRestrictions() {
    if (!this.searchTerm.trim()) return this.restrictions;
    const search = this.searchTerm.toLowerCase();
    return this.restrictions.filter(r =>
      (r.users.first_name + ' ' + r.users.last_name).toLowerCase().includes(search) ||
      r.users.email.toLowerCase().includes(search) ||
      r.classrooms.name.toLowerCase().includes(search)
    );
  }

  ngOnInit(): void {
    this.restrictionsService.getRestrictions().subscribe({
      next: (res) => {
        if (res.status === 'success') {
          this.restrictions = res.data;
        } else {
          this.error = res.msg?.[0] || 'Error al obtener restricciones';
        }
        this.loading = false;
      },
      error: () => {
        this.error = 'Error al obtener restricciones';
        this.loading = false;
      }
    });

    // 👇 Cargar usuarios desde el servicio
    this.userService.getAllUsers().subscribe({
      next: (res: UsersResponse) => {
        this.users = res.data;
      },
      error: (err) => {
        console.error('Error al cargar usuarios', err);
      }
    });

    // 👇 Cargar aulas
    this.classroomsService.getAllClassrooms().subscribe({
      next: (res: ClassroomResponse) => {
        this.classrooms = res.data;
      },
      error: (err) => {
        console.error('Error al cargar aulas', err);
      }
    });
  }

  createRestriction() {
    if (!this.newUserId || !this.newClassroomId) return;

    this.creating = true;
    this.formMsg = '';
    this.formMsgType = 'success';

    this.restrictionsService.createRestriction({
      user_id: this.newUserId,
      classroom_id: this.newClassroomId
    }).subscribe({
      next: (res) => {
        if (res.status === 'success') {
          this.showSuccessToast(res.msg);
          // Refrescar lista
          this.restrictionsService.getRestrictions().subscribe({
            next: (r) => { this.restrictions = r.data; },
            complete: () => { this.closeModal(); }
          });
        } else {
          this.showErrorToast(res.msg);
        }
        this.creating = false;
      },
      error: (err) => {
        this.showErrorToast(err.error?.msg || ['Error al crear restricción']);
        this.creating = false;
      }
    });
  }

  showSuccessToast(msg: string[] | string) {
    this.clearToasts();
    this.successMessage = Array.isArray(msg) ? msg[0] : msg;
    this.toastTimeout = setTimeout(() => this.successMessage = '', 3500);
  }

  showErrorToast(msg: string[] | string) {
    this.clearToasts();
    this.errorMessages = Array.isArray(msg) ? msg : [msg];
    this.toastTimeout = setTimeout(() => this.errorMessages = [], 4000);
  }

  clearToasts() {
    this.successMessage = '';
    this.errorMessages = [];
    if (this.toastTimeout) clearTimeout(this.toastTimeout);
  }

  closeModal() {
    this.showModal = false;
    this.newUserId = null;
    this.newClassroomId = null;
    this.formMsg = '';
    this.creating = false;
  }
  showDeleteModal = false;
  restrictionToDeleteId: number | null = null;

  openDeleteModal(id: number) {
    this.restrictionToDeleteId = id;
    this.showDeleteModal = true;
  }

  cancelDelete() {
    this.restrictionToDeleteId = null;
    this.showDeleteModal = false;
  }

  confirmDelete() {
    if (this.restrictionToDeleteId === null) return;
    this.restrictionsService.deleteRestriction(this.restrictionToDeleteId).subscribe({
      next: (res) => {
        if (res.status === 'success') {
          this.showSuccessToast(res.msg);
          this.restrictions = this.restrictions.filter(r => r.id !== this.restrictionToDeleteId);
        } else {
          this.showErrorToast(res.msg);
        }
        this.cancelDelete();
      },
      error: (err) => {
        this.showErrorToast(err.error?.msg || ['Error al eliminar restricción']);
        this.cancelDelete();
      }
    });
  }

}
