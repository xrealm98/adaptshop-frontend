import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-category-buttons',
  imports: [],
  templateUrl: './category-buttons.component.html',
  styleUrl: './category-buttons.component.scss',
})
export class CategoryButtonsComponent {
  private router = inject(Router);
  categories = [
    {
      id: 1,
      name: 'Ordenadores',
      icon: '💻',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-900',
      borderColor: 'border-emerald-200',
    },
    {
      id: 2,
      name: 'Móviles',
      icon: '📱',
      bgColor: 'bg-sky-50',
      textColor: 'text-sky-900',
      borderColor: 'border-sky-200',
    },
    {
      id: 3,
      name: 'Camisetas',
      icon: '👕',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-900',
      borderColor: 'border-orange-200',
    },
    {
      id: 4,
      name: 'Muebles',
      icon: '🛋️',
      bgColor: 'bg-slate-50',
      textColor: 'text-slate-900',
      borderColor: 'border-slate-200',
    },
  ];

  navigateToCategory(id: number) {
    this.router.navigate(['/catalog'], { queryParams: { category: id } });
  }
}
