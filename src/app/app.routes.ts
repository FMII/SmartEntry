import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { UserManagementComponent } from './pages/user-management/user-management.component';
import { authGuard } from './guards/auth.guard';
import { noAuthGuard } from './guards/no-auth.guard';  // importa el guard inverso
import { UpdateUserComponent } from './pages/update-user/update-user.component';
import { WorkshopBlockadeComponent } from './pages/workshop-blockade/workshop-blockade.component';
import { AcademicManagmentComponent } from './pages/academic-managment/academic-managment.component';
import { SchedulesComponent } from './pages/schedules/schedules.component';
import { StudentAssistancePanelComponent } from './pages/student-assistance-panel/student-assistance-panel.component';
import { TeacherAssistancePanelComponent } from './pages/teacher-assistance-panel/teacher-assistance-panel.component';

export const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    canActivate: [authGuard],
    children: [
      { path: 'student-assistance', component: StudentAssistancePanelComponent },
      { path: 'teacher-assistance', component: TeacherAssistancePanelComponent },
      { path: 'user-management', component: UserManagementComponent },
      { path: 'academic-management', component: AcademicManagmentComponent },
      { path: 'schedule', component: SchedulesComponent },
      { path: 'workshop-blockade', component: WorkshopBlockadeComponent },

      { path: 'usuarios/editar/:id', component: UpdateUserComponent },
      { path: '', redirectTo: 'usermanagement', pathMatch: 'full' },
    ],
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [noAuthGuard]
  },
  // Ruta comodín general al final (redirige al login si no está autenticado)
  {
    path: '**',
    redirectTo: 'login'
  }
];