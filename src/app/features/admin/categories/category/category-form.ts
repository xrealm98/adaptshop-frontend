import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../../../../core/services/categories/category.service';

@Component({
  selector: 'app-category-form',
  imports: [ReactiveFormsModule],
  templateUrl: './category-form.html',
  styleUrl: './category-form.scss',
})
export class CategoryForm {
  private fb = inject(FormBuilder);
  private categoryService = inject(CategoryService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  isEditMode = false;
  categoryId: number | null = null;

  form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
  });

  ngOnInit() {
    this.categoryId = this.route.snapshot.params['id'] ?? null;
    this.isEditMode = !!this.categoryId;
    if (this.isEditMode) {
      this.categoryService.getCategoryById(this.categoryId!).subscribe({
        next: (category) => this.form.patchValue({ name: category.name }),
        error: (err) => console.error(err),
      });
    }
  }

  onSubmit() {
    if (this.form.invalid) return;
    const { name } = this.form.getRawValue();

    if (this.isEditMode) {
      this.categoryService.updateCategory(this.categoryId!, { name }).subscribe({
        next: () => this.router.navigate(['/admin/categories']),
        error: (err) => console.error(err),
      });
    } else {
      this.categoryService.createCategory({ name }).subscribe({
        next: () => this.router.navigate(['/admin/categories']),
        error: (err) => console.error(err),
      });
    }
  }

  goBack() {
    this.router.navigate(['/admin/categories']);
  }
}
