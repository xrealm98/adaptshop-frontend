import { Component, computed, effect, inject, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../../core/services/categories/category.service';
import { ProductService } from '../../core/services/products/product.service';
import { calculateVisiblePages } from '../../core/utils/pagination.util';
import { Breadcrumb } from '../../models/breadcrumb.model';
import { Category } from '../../models/category.model';
import { Product } from '../../models/product.model';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';

@Component({
  selector: 'app-catalog',
  imports: [ProductCardComponent, BreadcrumbComponent],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.scss',
})
export class CatalogComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private title = inject(Title);

  products = signal<Product[]>([]);
  categories = signal<Category[]>([]);

  searchTerm = signal<string>('');

  filterSelectedCategory = signal<number | null>(null);
  filterMinPrice = signal<number | null>(null);
  filterMaxPrice = signal<number | null>(null);
  filterSortBy = signal<'default' | 'price_asc' | 'price_desc'>('default');

  totalResults = signal<number>(0);
  currentPage = signal<number>(1);
  totalPages = signal<number>(1);

  visiblePages = computed(() => {
    const current = this.currentPage();
    const total = this.totalPages();

    return calculateVisiblePages(current, total);
  });
  selectedCategoryName = computed(() => {
    const id = this.filterSelectedCategory();
    if (!id) return null;

    const category = this.categories().find((c) => c.id === id);
    return category ? category.name : null;
  });

  breadcrumbs = computed<Breadcrumb[]>(() => {
    const catName = this.selectedCategoryName();
    return catName ? [{ label: catName }] : [{ label: 'Todos los productos' }];
  });

  private titleEffect = effect(() => {
    const categoryName = this.selectedCategoryName();
    const baseTitle = categoryName ? `Catálogo | ${categoryName}` : 'Catálogo';
    this.title.setTitle(`${baseTitle}`);
  });

  ngOnInit() {
    this.loadCategories();
    this.route.queryParams.subscribe((params) => {
      this.filterSelectedCategory.set(params['category'] ? +params['category'] : null);
      this.searchTerm.set(params['search'] ?? '');
      const pageFromUrl = params['page'] ? +params['page'] : 1;
      this.loadProducts(pageFromUrl);
    });
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (categories) => this.categories.set(categories),
    });
  }
  loadProducts(page: number = 1) {
    const filters = this.buildFilters(page);
    this.productService.getProducts(filters).subscribe({
      next: (response: any) => this.handleResponse(response),
      error: (err) => console.error('Error:', err),
    });
  }

  private buildFilters(page: number) {
    return {
      page,
      per_page: 16,
      category_id: this.filterSelectedCategory() || undefined,
      min_price: this.filterMinPrice() ?? undefined,
      max_price: this.filterMaxPrice() ?? undefined,
      search: this.searchTerm() || undefined,
    };
  }

  private handleResponse(res: any) {
    const processed = this.productService.processCollection(res, this.filterSortBy());
    this.products.set(processed.items);
    this.totalResults.set(processed.total);
    this.currentPage.set(processed.currentPage);
    this.totalPages.set(processed.totalPages);
  }

  updateMinPrice(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.filterMinPrice.set(value ? Number(value) : null);
    this.loadProducts(1);
  }

  updateMaxPrice(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.filterMaxPrice.set(value ? Number(value) : null);
    this.loadProducts(1);
  }

  updateSort(event: Event) {
    const value = (event.target as HTMLSelectElement).value as
      | 'default'
      | 'price_asc'
      | 'price_desc';
    this.filterSortBy.set(value);
    this.loadProducts(this.currentPage());
  }

  selectCategory(categoryId: number | null) {
    this.router.navigate([], {
      queryParams: { category: categoryId || null, search: null, page: 1 },
      queryParamsHandling: 'merge',
    });
  }

  goToPage(page: number) {
    this.router.navigate([], {
      queryParams: { page },
      queryParamsHandling: 'merge',
    });
  }

  clearFilters() {
    this.filterSelectedCategory.set(null);
    this.searchTerm.set('');
    this.filterMinPrice.set(null);
    this.filterMaxPrice.set(null);
    this.filterSortBy.set('default');
    this.router.navigate(['/catalog']);
  }
}
