import { Component, inject, signal } from '@angular/core';
import { CategoryService } from '../../core/services/categories/category.service';
import { ProductService } from '../../core/services/products/product.service';
import { Category } from '../../models/category.model';
import { Product } from '../../models/product.model';
import { ProductSliderComponent } from '../../shared/components/product-slider/product-slider.component';
import { CategoryButtonsComponent } from './components/category-buttons/category-buttons.component';
import { HeroBannerComponent } from './components/hero-banner/hero-banner.component';

@Component({
  selector: 'app-home.component',
  imports: [ProductSliderComponent, HeroBannerComponent, CategoryButtonsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);

  latestProducts = signal<Product[]>([]);
  featuredCategory = signal<Category | null>(null);
  featuredProducts = signal<Product[]>([]);

  ngOnInit() {
    this.loadLatestProducts();
    this.loadFeaturedCategory();
  }

  loadLatestProducts() {
    this.productService.getProducts({ latest: true, limit: 7 }).subscribe({
      next: (products) => this.latestProducts.set(products),
    });
  }

  loadFeaturedCategory() {
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        if (categories.length > 0) {
          const first = categories[0];
          this.featuredCategory.set(first);
          this.productService.getProducts({ category_id: first.id, limit: 10 }).subscribe({
            next: (products) => this.featuredProducts.set(products),
          });
        }
      },
    });
  }
}
