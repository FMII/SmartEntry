import { Component, OnInit } from '@angular/core';
import { GroupService } from '../../services/group.service';
import { NgFor, NgIf } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import { Groups } from '../../interfaces/groups';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-group-management',
  standalone: true,
  imports: [NgIf, NgFor, RouterLink, RouterModule, ReactiveFormsModule, FormsModule],
  templateUrl: './group-management.component.html',
  styleUrl: './group-management.component.css'
})
export class GroupManagementComponent implements OnInit {
  groups: Groups[] = []; // Lista de grupos
  filteredGroups: Groups[] = []; // Lista filtrada para mostrar
  searchTerm: string = ''; // Término de búsqueda

  constructor(private groupService: GroupService) { }

  ngOnInit(): void {
    this.loadGroups();
  }

  loadGroups(): void {
    this.groupService.getGroups().subscribe({
      next: (res) => {
        if (res.status === 'success') {
          this.groups = res.data;
          this.filteredGroups = [...this.groups];
        }
      },
      error: (err) => {
        console.error('Error al cargar grupos', err);
      }
    });
  }

  onSearchChange(event: any) {
    this.searchTerm = event.target.value.toLowerCase();
    this.filterGroups();
  }

  filterGroups() {
    if (!this.searchTerm) {
      this.filteredGroups = [...this.groups];
    } else {
      const term = this.searchTerm.toLowerCase();

      this.filteredGroups = this.groups.filter(group => {
        const name = group.name.toLowerCase();
        const grade = group.grade.toLowerCase();

        // Traduce grados para búsqueda
        const gradeEs = grade === 'elementary_school' ? 'primaria' :
          grade === 'middle_school' ? 'secundaria' :
            grade === 'high_school' ? 'preparatoria' : grade;

        return name.includes(term) || gradeEs.includes(term);
      });
    }
  }

}
