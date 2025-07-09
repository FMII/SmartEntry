import { Component, OnInit } from '@angular/core';
import { GroupService } from '../../services/group.service';
import { NgFor, NgIf } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-group-management',
  standalone: true,
  imports: [NgIf, NgFor, RouterLink, RouterModule],
  templateUrl: './group-management.component.html',
  styleUrl: './group-management.component.css'
})
export class GroupManagementComponent implements OnInit {
  groups: any[] = [];

  constructor(private groupService: GroupService) {}

  ngOnInit(): void {
    this.loadGroups();
  }

  loadGroups(): void {
    this.groupService.getGroups().subscribe({
      next: (res) => {
        if (res.status === 'success') {
          this.groups = res.data;
        }
      },
      error: (err) => {
        console.error('Error al cargar grupos', err);
      }
    });
  }
}
