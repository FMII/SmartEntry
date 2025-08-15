import { Component } from '@angular/core';
import { RestrictionsService } from '../../services/restrictions.service';
import { Restriction } from '../../interfaces/restriction';
import { DatePipe, NgFor, NgIf } from '@angular/common';
@Component({
  selector: 'app-restrictions',
  standalone: true,
  imports: [DatePipe, NgFor, NgIf],
  templateUrl: './restrictions.component.html',
  styleUrl: './restrictions.component.css'
})
export class RestrictionsComponent {
  restrictions: Restriction[] = [];
  loading = true;
  error = '';

  constructor(private restrictionsService: RestrictionsService) { }

  ngOnInit(): void {
    this.restrictionsService.getRestrictions().subscribe({
      next: (res) => {
        if (res.status === 'success') {
          this.restrictions = res.data;
          console.log(res.data)
        } else {
          this.error = res.msg?.[0] || 'Error al obtener restricciones';
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al obtener restricciones';
        this.loading = false;
      }
    });
  }
}