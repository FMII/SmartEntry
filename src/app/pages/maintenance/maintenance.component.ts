import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-maintenance',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './maintenance.component.html',
  styleUrls: ['./maintenance.component.css']
})
export class MaintenanceComponent {
  
  constructor(private router: Router) {}

  // Método para intentar reconectar
  tryAgain() {
    // Recargar la página para intentar conectar de nuevo
    window.location.reload();
  }

  // Volver al login
  goToLogin() {
    this.router.navigate(['/login']);
  }
}
