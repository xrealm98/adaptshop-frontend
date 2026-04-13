import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ProductService } from '../../../core/services/products/product.service';
import { Product } from '../../../models/product.model';
import { TableHeader } from '../components/table-header/table-header';
@Component({
  selector: 'app-products.component',
  imports: [TableHeader, RouterLink],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent {
  private productService = inject(ProductService);
  private router = inject(Router);
  products = signal<Product[]>([]);
  searchTerm = signal('');

  filteredProducts = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) return this.products();
    return this.products().filter((p) => p.name.toLowerCase().includes(term));
  });

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products.set(products);
      },
      error: (error) => {
        1;
        console.error('Error loading products', error);
      },
    });
  }

  onSearch(value: string) {
    this.searchTerm.set(value);
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
}
