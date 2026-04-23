import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CategoryService } from '../../../core/services/categories/category.service';
import { Category } from '../../../models/category.model';
import { TableHeader } from '../components/table-header/table-header';

@Component({
  selector: 'app-categories',
  imports: [CommonModule, TableHeader, RouterLink],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
})
export class CategoriesComponent {
  private categoryService = inject(CategoryService);
  private router = inject(Router);
  categories = signal<Category[]>([]);
  searchTerm = signal('');

  filteredCategories = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) return this.categories();
    return this.categories().filter((c) => c.name.toLowerCase().includes(term));
  });

  ngOnInit() {
    this.loadCategories();
  }
  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories.set(categories);
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      },
    });
  }

  onSearch(value: string) {
    this.searchTerm.set(value);
  }

  deleteCategory(id: number) {
    if (confirm('¿Estás seguro?')) {
      this.categoryService.deleteCategory(id).subscribe({
        next: () => {
          this.categories.update((prev) => prev.filter((cat) => cat.id !== id));
        },
      });
    }
  }
  goToCreate() {
    this.router.navigate(['/admin/categories/create']);
  }
}
