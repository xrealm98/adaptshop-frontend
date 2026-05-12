import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CategoryService } from '../../../core/services/categories/category.service';
import { Category } from '../../../models/category.model';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { TableHeader } from '../components/table-header/table-header';
import { TableComponent } from '../components/table/table.component';

@Component({
  selector: 'app-categories',
  imports: [CommonModule, TableHeader, TableComponent, PaginationComponent, RouterLink],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
})
export class CategoriesComponent {
  private categoryService = inject(CategoryService);
  private router = inject(Router);
  categories = signal<Category[]>([]);
  searchTerm = signal('');
  currentPage = signal<number>(1);
  totalPages = signal<number>(1);

  columns = [
    { key: 'id', header: 'ID', sortable: true },
    { key: 'name', header: 'Nombre', sortable: true },
    { key: 'slug', header: 'Slug', sortable: true },
    { key: 'actions', header: 'Acciones', sortable: false },
  ];

  ngOnInit() {
    this.loadCategories();
  }
  loadCategories() {
    const params: any = { page: this.currentPage(), per_page: 10 };
    if (this.searchTerm()) params.search = this.searchTerm();
    this.categoryService.getCategories(params).subscribe({
      next: (res) => {
        this.categories.set(res.data);
        this.totalPages.set(res.last_page);
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      },
    });
  }

  onSearch(value: string) {
    this.searchTerm.set(value);
    this.currentPage.set(1);
    this.loadCategories();
  }

  onPageChange(page: number) {
    this.currentPage.set(page);
    this.loadCategories();
  }

  deleteCategory(id: number) {
    if (confirm('¿Estás seguro?')) {
      this.categoryService.deleteCategory(id).subscribe({
        next: () => {
          this.loadCategories();
        },
      });
    }
  }
  goToCreate() {
    this.router.navigate(['/admin/categories/create']);
  }
}
