import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../../../../core/services/categories/category.service';
import { ProductService } from '../../../../core/services/products/product.service';
import { Category } from '../../../../models/category.model';

@Component({
  selector: 'app-product-form',
  imports: [ReactiveFormsModule],
  templateUrl: './product-form.html',
  styleUrl: './product-form.scss',
})
export class ProductForm {
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  isEditMode = false;
  productId: number | null = null;
  categories = signal<Category[]>([]);

  form = this.fb.nonNullable.group({
    category_id: [0, [Validators.required, Validators.min(1)]],
    name: ['', [Validators.required]],
    description: ['', [Validators.required]],
    price: [0, [Validators.required, Validators.min(0)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    image: [''],
    is_active: [true],
  });
  ngOnInit() {
    this.loadCategories();

    this.productId = this.route.snapshot.params['id'] ?? null;
    this.isEditMode = !!this.productId;

    if (this.isEditMode) {
      this.productService.getProductById(this.productId!).subscribe({
        next: (product) => {
          this.form.patchValue({
            category_id: product.category_id,
            name: product.name,
            description: product.description,
            price: product.price,
            stock: product.stock,
            image: product.image ?? '',
            is_active: product.is_active,
          });
        },
        error: (err) => console.error(err),
      });
    }
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (categories) => this.categories.set(categories),
      error: (err) => console.error(err),
    });
  }

  onSubmit() {
    if (this.form.invalid) return;
    const data = this.form.getRawValue();

    if (this.isEditMode) {
      this.productService.updateProduct(this.productId!, data).subscribe({
        next: () => this.router.navigate(['/admin/products']),
        error: (err) => console.error(err),
      });
    } else {
      this.productService.createProduct(data).subscribe({
        next: () => this.router.navigate(['/admin/products']),
        error: (err) => console.error(err),
      });
    }
  }

  goBack() {
    this.router.navigate(['/admin/products']);
  }
}
