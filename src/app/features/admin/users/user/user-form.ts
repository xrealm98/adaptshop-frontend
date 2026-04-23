import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../../core/services/users/user.service';
import { User } from '../../../../models/user.model';

@Component({
  selector: 'app-user-form',
  imports: [ReactiveFormsModule],
  templateUrl: './user-form.html',
  styleUrl: './user-form.scss',
})
export class UserForm {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  userId: number | null = null;
  form = this.fb.nonNullable.group({
    first_name: ['', [Validators.required]],
    last_name: ['', [Validators.required]],
    email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
    phone: [''],
    street: [''],
    city: [''],
    province: [''],
    postal_code: [''],
    country: ['España'],
    role: ['client'],
    is_blocked: [false],
  });

  ngOnInit() {
    this.userId = Number(this.route.snapshot.params['id']);

    if (this.userId) {
      this.userService.getUserById(this.userId).subscribe({
        next: (user) => {
          this.form.patchValue({
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            phone: user.phone ?? '',
            street: user.street ?? '',
            city: user.city ?? '',
            province: user.province ?? '',
            postal_code: user.postal_code ?? '',
            country: user.country ?? 'España',
            role: user.role,
            is_blocked: user.is_blocked,
          });
        },
        error: (err) => console.error('Error al cargar usuario', err),
      });
    }
  }

  isFieldInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  onSubmit() {
    if (this.form.invalid || !this.userId) return;

    const data = this.form.getRawValue() as Partial<User>;

    this.userService.updateUser(this.userId, data).subscribe({
      next: () => this.router.navigate(['/admin/users']),
      error: (err) => console.error('Error al actualizar', err),
    });
  }

  goBack() {
    this.router.navigate(['/admin/users']);
  }
}
