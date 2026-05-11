import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ProductService } from '../../../core/services/products/product.service';
import { Product } from '../../../models/product.model';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { TableHeader } from '../components/table-header/table-header';
import { TableComponent } from '../components/table/table.component';
@Component({
  selector: 'app-products.component',
  imports: [TableHeader, TableComponent, PaginationComponent, RouterLink],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent {
  private productService = inject(ProductService);
  private router = inject(Router);
  products = signal<Product[]>([]);
  searchTerm = signal('');
  currentPage = signal<number>(1);
  totalPages = signal<number>(1);

  columns = [
    { key: 'image', header: 'Imagen', sortable: false },
    { key: 'name', header: 'Nombre', sortable: true },
    { key: 'category.name', header: 'Categoría', sortable: true },
    { key: 'stock', header: 'Stock', sortable: true },
    { key: 'is_active', header: 'Estado', sortable: true },
    { key: 'price', header: 'Precio', sortable: true },
    { key: 'actions', header: 'Acciones', sortable: false },
  ];

  filteredProducts = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) return this.products();
    return this.products().filter((p) => p.name.toLowerCase().includes(term));
  });

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProducts({ page: this.currentPage(), per_page: 10 }).subscribe({
      next: (res) => {
        this.products.set(res.data);
        this.totalPages.set(res.last_page);
      },
      error: (error) => {
        1;
        console.error('Error loading products', error);
      },
    });
  }

  onSearch(value: string) {
    this.searchTerm.set(value);
    this.currentPage.set(1);
  }

  deleteProduct(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.products.update((prev) => prev.filter((p) => p.id !== id));
        },
      });
    }
  }

  goToCreate() {
    this.router.navigate(['/admin/products/create']);
  }

  onPageChange(page: number) {
    this.currentPage.set(page);
    this.loadProducts();
  }
}
