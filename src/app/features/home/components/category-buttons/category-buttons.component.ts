import { Component, inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Category } from '../../../../models/category.model';

export interface CategoryButtonItem {
  category: Category;
  color: string;
}
@Component({
  selector: 'app-category-buttons',
  imports: [],
  templateUrl: './category-buttons.component.html',
  styleUrl: './category-buttons.component.scss',
})
export class CategoryButtonsComponent {
  private router = inject(Router);
  @Input({ required: true }) items: CategoryButtonItem[] = [];

  colorMap: Record<string, { bgColor: string; textColor: string; borderColor: string }> = {
    emerald: {
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-900',
      borderColor: 'border-emerald-200',
    },
    sky: { bgColor: 'bg-sky-50', textColor: 'text-sky-900', borderColor: 'border-sky-200' },
    orange: {
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-900',
      borderColor: 'border-orange-200',
    },
    slate: { bgColor: 'bg-slate-50', textColor: 'text-slate-900', borderColor: 'border-slate-200' },
    purple: {
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-900',
      borderColor: 'border-purple-200',
    },
    rose: { bgColor: 'bg-rose-50', textColor: 'text-rose-900', borderColor: 'border-rose-200' },
  };

  defaultColors = ['emerald', 'sky', 'orange', 'slate'];

  getColors(color: string, index: number) {
    return this.colorMap[color] ?? this.colorMap[this.defaultColors[index % 4]];
  }

  navigateToCategory(id: number) {
    this.router.navigate(['/catalog'], { queryParams: { category: id } });
  }
}
