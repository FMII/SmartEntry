import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { UserManagementComponent } from './pages/user-management/user-management.component';
import { authGuard } from './guards/auth.guard';
import { noAuthGuard } from './guards/no-auth.guard';  // importa el guard inverso
import { UpdateUserComponent } from './pages/update-user/update-user.component';

export const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    canActivate: [authGuard],  // protege dashboard y sus hijos
    children: [
      { path: 'usermanagement', component: UserManagementComponent, canActivate: [authGuard] },
      { path: 'usuarios/editar/:id', component: UpdateUserComponent }
    ]
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' }, // redirigir por defecto a login
  { path: '**', redirectTo: 'login' }, // ruta comodín
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [noAuthGuard]  // bloquea login si ya está autenticado
  }
];
