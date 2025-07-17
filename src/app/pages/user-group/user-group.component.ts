import { Component, OnInit } from '@angular/core';
import { GroupService } from '../../services/group.service';
import { NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-user-group',
  standalone: true,
  imports: [NgFor, RouterLink],
  templateUrl: './user-group.component.html',
  styleUrl: './user-group.component.css'
})
export class UserGroupComponent implements OnInit {
  students: any[] = [];
  groups: any[] = [];
  constructor(private groupService: GroupService) { }

  ngOnInit(): void {
    this.loadStudents();
    this.loadGroups();
  }

  loadStudents(): void {
    this.groupService.getUsersByRole().subscribe({
      next: (res) => {
        if (res.status === 'success') {
          this.students = res.data;
        } else {
          console.error('Error al traer los maestros:', res.msg);
        }
      },
      error: (err) => {
        console.error('Error del servidor:', err);
      }
    });
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
