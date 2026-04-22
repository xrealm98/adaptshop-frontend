import { Component, computed, effect, inject, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';
import { CartService } from '../../../../core/services/cart/cart.service';
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
  private cartService = inject(CartService);
  private title = inject(Title);

  product = signal<Product | null>(null);
  relatedProducts = signal<Product[]>([]);

  itemQuantity = computed(() => {
    const item = this.cartService.cartItems().find((i) => i.id === this.product()?.id);
    return item?.quantity ?? 0;
  });

  quantity = signal<number>(0);

  constructor() {
    effect(
      () => {
        const cartQuantity = this.itemQuantity();
        this.quantity.set(cartQuantity);
      },
      { allowSignalWrites: true },
    );
  }

  ngOnInit() {
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          const slug = params.get('slug')!;
          return this.productService.getProductBySlug(slug);
        }),
      )
      .subscribe({
        next: (prod) => {
          this.product.set(prod);
          this.title.setTitle(`Detalle del producto | ${prod.name}`);
          this.quantity.set(this.itemQuantity());
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
    const p = this.product();
    if (!p || this.quantity() === 0) return;
    const exists = this.cartService.cartItems().some((i) => i.id === p.id);

    if (exists) {
      this.cartService.updateQuantity(p.id, this.quantity());
    } else {
      this.cartService.addCartItem(p.id, true);
      if (this.quantity() > 1) {
        this.cartService.updateQuantity(p.id, this.quantity());
      }
    }
    this.cartService.openSidebar();
  }
}
