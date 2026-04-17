import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';
import { ProductService } from '../../../../core/services/products/product.service';
import { Breadcrumb } from '../../../../models/breadcrumb.model';
import { Product } from '../../../../models/product.model';
import { BreadcrumbComponent } from '../../../../shared/components/breadcrumb/breadcrumb.component';
import { ProductSliderComponent } from '../../../../shared/components/product-slider/product-slider.component';

@Component({
  selector: 'app-product-detail',
  imports: [ProductSliderComponent, BreadcrumbComponent],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss',
})
export class ProductDetailComponent {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);

  product = signal<Product | null>(null);
  relatedProducts = signal<Product[]>([]);
  quantity = signal<number>(0);

  ngOnInit() {
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          const id = Number(params.get('id'));
          return this.productService.getProductById(id);
        }),
      )
      .subscribe({
        next: (prod) => {
          this.product.set(prod);
          this.quantity.set(0);
          this.loadRelatedProducts(prod.category_id);
        },
        error: (err) => console.error('Error cargando el producto', err),
      });
  }
  loadRelatedProducts(categoryId: number) {
    this.productService.getProducts({ category_id: categoryId, limit: 5 }).subscribe({
      next: (products: Product[]) => {
        // Excluir el mismo producto mostrado
        const filtered = products.filter((p) => p.id !== this.product()?.id);
        this.relatedProducts.set(filtered);
      },
    });
  }

  breadcrumbs = computed<Breadcrumb[]>(() => {
    const p = this.product();
    if (!p) return [];
    return [
      {
        label: p.category?.name || 'Categoría',
        url: '/catalog',
        queryParams: { category: p.category_id },
      },
      { label: p.name },
    ];
  });

  increaseQuantity() {
    if (this.product() && this.quantity() < this.product()!.stock) {
      this.quantity.update((q) => q + 1);
    }
  }

  decreaseQuantity() {
    if (this.quantity() > 0) {
      this.quantity.update((q) => q - 1);
    }
  }

  addToCart() {
    console.log(`Añadido al carrito: ${this.quantity()} unidades de ${this.product()?.name}`);
  }
}
