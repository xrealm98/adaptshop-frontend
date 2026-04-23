import { Component, inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Category } from '../../../../models/category.model';

@Component({
  selector: 'app-category-buttons',
  imports: [],
  templateUrl: './category-buttons.component.html',
  styleUrl: './category-buttons.component.scss',
})
export class CategoryButtonsComponent {
  private router = inject(Router);
  @Input({ required: true }) categories: Category[] = [];

  colors = [
    { bgColor: 'bg-emerald-50', textColor: 'text-emerald-900', borderColor: 'border-emerald-200' },
    { bgColor: 'bg-sky-50', textColor: 'text-sky-900', borderColor: 'border-sky-200' },
    { bgColor: 'bg-orange-50', textColor: 'text-orange-900', borderColor: 'border-orange-200' },
    { bgColor: 'bg-slate-50', textColor: 'text-slate-900', borderColor: 'border-slate-200' },
  ];

  navigateToCategory(id: number) {
    this.router.navigate(['/catalog'], { queryParams: { category: id } });
  }
}
