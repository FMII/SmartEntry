import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { UserManagementComponent } from './pages/user-management/user-management.component';
import { authGuard } from './guards/auth.guard';
import { noAuthGuard } from './guards/no-auth.guard';
import { UpdateUserComponent } from './pages/update-user/update-user.component';
import { WorkshopBlockadeComponent } from './pages/workshop-blockade/workshop-blockade.component';
import { AcademicManagmentComponent } from './pages/academic-managment/academic-managment.component';
import { SchedulesComponent } from './pages/schedules/schedules.component';
import { StudentAssistancePanelComponent } from './pages/student-assistance-panel/student-assistance-panel.component';
import { TeacherAssistancePanelComponent } from './pages/teacher-assistance-panel/teacher-assistance-panel.component';
import { GroupManagementComponent } from './pages/group-management/group-management.component';
import { CreateUserComponent } from './pages/create-user/create-user.component';
import { UserGroupComponent } from './pages/user-group/user-group.component';
import { CreateGroupComponent } from './pages/create-group/create-group.component';
import { UpdateGroupComponent } from './pages/update-group/update-group.component';
import { StudentsComponent } from './pages/students/students.component';
import { AssignGroupComponent } from './pages/assign-group/assign-group.component';
import { SubjectsComponent } from './pages/subjects/subjects.component';
import { CreateSubjectComponent } from './pages/create-subjects/create-subjects.component';
import { UpdateSubjectsComponent } from './pages/update-subjects/update-subjects.component';
import { VerificationCodeComponent } from './pages/verification-code/verification-code.component';
import { pendingVerificationGuard } from './guards/pending-verification.guard';
import { CreateClassroomComponent } from './pages/create-classroom/create-classroom.component';
import { RfidCardsComponent } from './pages/rfid-cards/rfid-cards.component';
import { CreateRfidCardComponent } from './pages/create-rfid-cards/create-rfid-cards.component';
import { UpdateRfidCardsComponent } from './pages/update-rfid-cards/update-rfid-cards.component';
import { SensorsComponent } from './pages/sensors/sensors.component';
import { CreateSensorsComponent } from './pages/create-sensors/create-sensors.component';
import { UpdateSensorComponent } from './pages/update-sensors/update-sensors.component';
import { CreateSchedulesComponent } from './pages/create-schedules/create-schedules.component';
import { UpdateSchedulesComponent } from './pages/update-schedules/update-schedules.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { LogsComponent } from './pages/logs/logs.component';
import { SubjectsAvgComponent } from './pages/subjects-avg/subjects-avg.component';

export const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'control-panel', pathMatch: 'full' },
      { path: 'student-assistance', component: StudentAssistancePanelComponent },
      { path: 'control-panel', component: TeacherAssistancePanelComponent },
      { path: 'user-management', component: UserManagementComponent },
      { path: 'group-management', component: GroupManagementComponent },
      { path: 'user-group', component: UserGroupComponent },
      { path: 'academic-management', component: AcademicManagmentComponent },
      { path: 'group-management', component: GroupManagementComponent },
      { path: 'schedules', component: SchedulesComponent },
      { path: 'workshop-blockade', component: WorkshopBlockadeComponent },
      { path: 'students', component: StudentsComponent },
      { path: 'subjects', component: SubjectsComponent },
      { path: 'rfid-cards', component: RfidCardsComponent },
      { path: 'sensors', component: SensorsComponent },
      { path: 'logs', component: LogsComponent },
      { path: 'subjects-avg', component: SubjectsAvgComponent },

      { path: 'schedules/edit/:id', component: UpdateSchedulesComponent },
      { path: 'schedules/create', component: CreateSchedulesComponent },
      { path: 'sensors/edit/:id', component: UpdateSensorComponent },
      { path: 'sensors/create', component: CreateSensorsComponent },
      { path: 'rfid-card/edit/:id', component: UpdateRfidCardsComponent },
      { path: 'rfid-card/create', component: CreateRfidCardComponent },
      { path: 'classrooms/create', component: CreateClassroomComponent },
      { path: 'subjects/edit/:id', component: UpdateSubjectsComponent },
      { path: 'subjects/create', component: CreateSubjectComponent },
      { path: 'groups/assign/:id', component: AssignGroupComponent },
      { path: 'groups/edit/:id', component: UpdateGroupComponent },
      { path: 'users/create', component: CreateUserComponent },
      { path: 'groups/create', component: CreateGroupComponent },
      { path: 'users/edit/:id', component: UpdateUserComponent },
      { path: '', redirectTo: 'usermanagement', pathMatch: 'full' },
    ],
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [noAuthGuard]
  },
  {
    path: 'verification-code',
    component: VerificationCodeComponent,
    canActivate: [pendingVerificationGuard]
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
    canActivate: [noAuthGuard]
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent,
    canActivate: [noAuthGuard]
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
