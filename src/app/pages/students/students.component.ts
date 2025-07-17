import { Component, OnInit } from '@angular/core';
import { GroupService } from '../../services/group.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [CommonModule, NgFor, NgIf, FormsModule],
  templateUrl: './students.component.html',
  styleUrl: './students.component.css'
})
export class StudentsComponent implements OnInit {
  students: any[] = [];
  groups: any[] = [];
  selectedGroupId: number | null = null;

  groupName: string = '';
  groupGrade: string = '';

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
        console.error('Error al cargar grupos:', err);
      }
    });
  }

  onGroupChange(): void {
    if (!this.selectedGroupId) return;

    this.groupService.getStudentsByGroup(this.selectedGroupId).subscribe({
      next: (res) => {
        if (res.status === 'success') {
          this.students = res.data.students;
          this.groupName = res.data.group.name;
          this.groupGrade = this.translateGrade(res.data.group.grade); // 👈 traducción
        } else {
          this.students = [];
          this.groupName = '';
          this.groupGrade = '';
        }
      },
      error: (err) => {
        console.error('Error al obtener estudiantes por grupo:', err);
        this.students = [];
        this.groupName = '';
        this.groupGrade = '';
      }
    });
  }

  // ✅ Traductor de grados a español
  translateGrade(grade: string): string {
    const traducciones: { [key: string]: string } = {
      'Middle_School': 'Secundaria',
      'High_School': 'Preparatoria',
      'Primary': 'Primaria',
      'Kinder': 'Kinder'
    };
    return traducciones[grade] || grade;
  }
}