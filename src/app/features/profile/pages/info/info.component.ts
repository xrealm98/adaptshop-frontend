import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { UserService } from '../../../../core/services/users/user.service';
import { User } from '../../../../models/user.model';

@Component({
  selector: 'app-info.component',
  imports: [ReactiveFormsModule],
  templateUrl: './info.component.html',
  styleUrl: './info.component.scss',
})
export class InfoComponent {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  public authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  isEditing = signal(false);

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
  });

  ngOnInit() {
    this.loadUser();
  }
  loadUser() {
    const currentUser = this.authService.user();
    if (currentUser) {
      this.form.patchValue({
        first_name: currentUser.first_name,
        last_name: currentUser.last_name,
        email: currentUser.email,
        phone: currentUser.phone ?? '',
        street: currentUser.street ?? '',
        city: currentUser.city ?? '',
        province: currentUser.province ?? '',
        postal_code: currentUser.postal_code ?? '',
        country: currentUser.country ?? 'España',
      });
    }
  }
  toggleEdit() {
    if (this.isEditing()) {
      this.loadUser();
    }
    this.isEditing.update((v) => !v);
  }
  isFieldInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  onSubmit() {
    const currentUser = this.authService.user();
    if (this.form.invalid || !currentUser) return;
    const data = this.form.getRawValue() as Partial<User>;
    this.userService.updateProfile(data).subscribe({
      next: (updatedUser) => {
        this.isEditing.set(false);
        this.authService.updateCurrentUser(updatedUser);
      },
      error: (err) => {
        console.error('Error al actualizar el perfil', err);
      },
    });
  }
}
