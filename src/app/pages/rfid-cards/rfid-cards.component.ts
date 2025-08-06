import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterLink, RouterModule } from '@angular/router';
import { RfidCardsService } from '../../services/rfid-cards.service';
import { UserRegisterService, User } from '../../services/user.service';

@Component({
  selector: 'app-rfid-cards',
  standalone: true,
  imports: [RouterLink, RouterModule, ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './rfid-cards.component.html',
  styleUrl: './rfid-cards.component.css'
})
export class RfidCardsComponent implements OnInit {
  rfids: any[] = [];
  filteredRfids: any[] = [];
  searchTerm: string = '';
  users: User[] = [];
  activeDropdownId: number | null = null;

  showModal = false;
  rfidToDeleteId: number | null = null;
  showSuccessToast = false;
  successMessage = '';

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
            const rfidsArray = Array.isArray(rfid) ? rfid : [rfid];

            this.rfids = rfidsArray.map((item: any) => {
              const user = this.users.find(u => u.id === item.user_id);
              return {
                ...item,
                userFullName: user ? `${user.first_name} ${user.last_name}` : 'Desconocido'
              };
            });
            this.filteredRfids = [...this.rfids];
          }
        });
      }
    });
  }

  toggleDropdown(id: number): void {
    this.activeDropdownId = this.activeDropdownId === id ? null : id;
  }

  onSearchChange(): void {
    this.filterRfids();
  }

  filterRfids(): void {
    if (!this.searchTerm || this.searchTerm.trim() === '') {
      this.filteredRfids = [...this.rfids];
    } else {
      const search = this.searchTerm.toLowerCase().trim();
      this.filteredRfids = this.rfids.filter(rfid => {
        return (rfid.rfid_code && rfid.rfid_code.toLowerCase().includes(search)) ||
               (rfid.userFullName && rfid.userFullName.toLowerCase().includes(search)) ||
               (rfid.status && rfid.status.toLowerCase().includes(search));
      });
    }
  }

  closeDropdown(): void {
    this.activeDropdownId = null;
  }

  openDeleteModal(id: number) {
    this.rfidToDeleteId = id;
    this.showModal = true;
  }

  cancelDelete() {
    this.rfidToDeleteId = null;
    this.showModal = false;
  }

  confirmDelete() {
    if (this.rfidToDeleteId !== null) {
      this.rfidService.deleteRfidCard(this.rfidToDeleteId).subscribe({
        next: (response: any) => {
          this.loadData();
          this.cancelDelete();
          this.successMessage = response.msg?.[0] || 'Operación exitosa';
          this.showSuccessToast = true;
          setTimeout(() => {
            this.showSuccessToast = false;
            this.successMessage = '';
          }, 3000);
        },
        error: (err) => {
          console.error('Error al eliminar', err);
          this.cancelDelete();
        }
      });
    }
  }
}