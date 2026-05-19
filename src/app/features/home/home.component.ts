import { Component, computed, inject, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CategoryService } from '../../core/services/categories/category.service';
import { ProductService } from '../../core/services/products/product.service';
import { SiteSettingsService } from '../../core/services/settings/site-settings.service';
import { Category } from '../../models/category.model';
import { Product } from '../../models/product.model';
import { HomeCategoryButton } from '../../models/settings.model';
import { ProductSliderComponent } from '../../shared/components/product-slider/product-slider.component';
import {
  CategoryButtonItem,
  CategoryButtonsComponent,
} from './components/category-buttons/category-buttons.component';
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
  private settingsService = inject(SiteSettingsService);
  private title = inject(Title);

  latestProducts = signal<Product[]>([]);
  featuredCategory = signal<Category | null>(null);
  featuredProducts = signal<Product[]>([]);
  categoryButtonItems = signal<CategoryButtonItem[]>([]);
  categories = signal<Category[]>([]);
  homeBanners = computed(() => this.settingsService.settings()?.home?.banners || []);

  ngOnInit() {
    this.title.setTitle(`Inicio`);
    this.loadLatestProducts();
    this.loadCategoriesAndFeatured();
  }

  loadLatestProducts() {
    this.productService.getProducts({ latest: true, limit: 7 }).subscribe({
      next: (products) => this.latestProducts.set(products),
    });
  }

  loadCategoriesAndFeatured() {
    this.categoryService.getAllCategories().subscribe({
      next: (allCategories) => {
        const homeSettings = this.settingsService.settings().home;

        this.startFeaturedSlider(allCategories, homeSettings?.featured_category_id);
        this.startCategoryButtons(allCategories, homeSettings?.category_buttons);
      },
      error: (err) => console.error('Error al cargar la configuración de inicio:', err),
    });
  }

  // Busca e inicia la categoría destacada
  private startFeaturedSlider(allCategories: Category[], featuredId?: number | string | null) {
    // Se busca la categoría guardada en la db. Si no hay, se muestra la primera categoría.
    const featuredCat = featuredId
      ? allCategories.find((c) => c.id === +featuredId)
      : allCategories[0];

    if (!featuredCat) return;

    this.featuredCategory.set(featuredCat);
    this.productService.getProducts({ category_id: featuredCat.id, limit: 10 }).subscribe({
      next: (products) => this.featuredProducts.set(products),
    });
  }

  // Inicia los botones de las categorías destacadas
  private startCategoryButtons(allCategories: Category[], buttons?: HomeCategoryButton[]) {
    //Si hay botones guardados, se buscan y guardan en items. Si no hay, no se renderiza nada.
    if (buttons?.length) {
      const items = buttons
        .map((btn) => {
          const cat = allCategories.find((c) => c.id === btn.category_id);
          return cat ? { category: cat, color: btn.color } : null;
        })
        .filter(Boolean) as CategoryButtonItem[];

      this.categoryButtonItems.set(items);
    } else {
      this.categoryButtonItems.set([]);
    }
  }
}
