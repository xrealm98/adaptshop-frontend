import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';
import { NotificationService } from '../../../core/services/notification/notification.service';
import { FormInputComponent } from '../../../shared/components/form-controls/form-input/form-input.component';
@Component({
  selector: 'app-register.component',
  imports: [ReactiveFormsModule, FormInputComponent, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);
  private title = inject(Title);
  errorMessage = '';
  registerForm = this.fb.nonNullable.group(
    {
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      password_confirmation: ['', [Validators.required]],
    },
    {
      validators: this.passwordMatchValidator,
    },
  );
  constructor() {
    this.title.setTitle(`Registro`);
  }
  ngOnInit() {
    this.registerForm.valueChanges.subscribe(() => {
      this.errorMessage = '';
    });
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirm = control.get('password_confirmation');

    return password && confirm && password.value !== confirm.value
      ? { passwordMismatch: true }
      : null;
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const userData = this.registerForm.getRawValue();
      this.authService.register(userData).subscribe({
        next: () => {
          this.notificationService.showSuccess(
            `Cuenta creada correctamente.¡Bienvenido ${userData.first_name}!`,
          );
          this.router.navigate(['/']);
        },
        error: (err) => {
          this.notificationService.showError(
            'Se ha encontrado un problema al crear la cuenta. Revisa los datos.',
          );
          this.errorMessage = 'Error al registrar el usuario';
        },
      });
    }
  }
}
