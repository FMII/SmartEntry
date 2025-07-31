import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink, RouterModule } from '@angular/router';
import { RfidCardsService } from '../../services/rfid-cards.service';
import { UserRegisterService, User } from '../../services/user.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-rfid-cards',
  standalone: true,
  imports: [RouterLink, RouterModule, ReactiveFormsModule, CommonModule],
  templateUrl: './rfid-cards.component.html',
  styleUrl: './rfid-cards.component.css'
})

export class RfidCardsComponent implements OnInit {

  rfids: any[] = []; // Aquí almacenamos los datos RFID con nombre de usuario
  users: User[] = [];
  activeDropdownId: number | null = null;

  constructor(
    private rfidService: RfidCardsService,
    private userService: UserRegisterService
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.userService.getAllUsers().subscribe({
      next: (usersResponse) => {
        this.users = usersResponse.data;

        this.rfidService.getAllRfids().subscribe({
          next: (rfidResponse) => {
            const rfid = rfidResponse.data;

            // Si la API devuelve un solo objeto, lo convertimos en arreglo para iterarlo
            const rfidsArray = Array.isArray(rfid) ? rfid : [rfid];

            this.rfids = rfidsArray.map((item: any) => {
              const user = this.users.find(u => u.id === item.user_id);
              return {
                ...item,
                userFullName: user ? `${user.first_name} ${user.last_name}` : 'Desconocido'
              };
            });
          }
        });
      }
    });
  }
  toggleDropdown(id: number): void {
    this.activeDropdownId = this.activeDropdownId === id ? null : id;
  }
  closeDropdown(): void {
    this.activeDropdownId = null;
  }
}