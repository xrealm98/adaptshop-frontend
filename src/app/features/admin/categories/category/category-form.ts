import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../../../../core/services/categories/category.service';
import { NotificationService } from '../../../../core/services/notification/notification.service';
import { FormInputComponent } from '../../../../shared/components/form-controls/form-input/form-input.component';

@Component({
  selector: 'app-category-form',
  imports: [ReactiveFormsModule, FormInputComponent],
  templateUrl: './category-form.html',
  styleUrl: './category-form.scss',
})
export class CategoryForm {
  private fb = inject(FormBuilder);
  private categoryService = inject(CategoryService);
  private notificationService = inject(NotificationService);
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
        next: () => {
          this.notificationService.showSuccess('Categoría actualizada correctamente');
          this.router.navigate(['/admin/categories']);
        },
        error: (err) => {
          console.error(err);
          this.notificationService.showError('Error al actualizar la categoría');
        },
      });
    } else {
      this.categoryService.createCategory({ name }).subscribe({
        next: () => {
          this.notificationService.showSuccess('Categoría creada con éxito');
          this.router.navigate(['/admin/categories']);
        },
        error: (err) => {
          console.error(err);
          this.notificationService.showError('No se ha creado la categoría');
        },
      });
    }
  }

  goBack() {
    this.router.navigate(['/admin/categories']);
  }
}
