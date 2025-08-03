import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterOutlet, NgClass, NgIf],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})

export class DashboardComponent implements OnInit {
  openMenu = false;
  isAdmin = false;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.checkAdminRole();
  }

  checkAdminRole() {
    // Verificar desde localStorage primero
    const userRole = this.authService.getUserRole();
    const roleId = this.authService.getUserRoleId();
    
    if (userRole === 'Administrador' || roleId === 1) {
      this.isAdmin = true;
      return;
    }

    // Si no está en localStorage, obtener del servidor
    this.authService.getUserProfile().subscribe({
      next: (response) => {
        if (response.status === 'success') {
          const user = response.data;
          this.isAdmin = user.role_id === 1 || user.roles.name === 'Administrador';
        }
      },
      error: (error) => {
        console.error('Error al verificar rol:', error);
        this.isAdmin = false;
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']); // Redirige al login
  }
}
