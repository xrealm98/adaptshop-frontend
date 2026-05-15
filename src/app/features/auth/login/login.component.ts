import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';
import { NotificationService } from '../../../core/services/notification/notification.service';
import { FormInputComponent } from '../../../shared/components/form-controls/form-input/form-input.component';

@Component({
  selector: 'app-login.component',
  imports: [ReactiveFormsModule, FormInputComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);
  private title = inject(Title);
  errorMessage = '';

  loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  constructor() {
    this.title.setTitle(`Inicio de sesión`);
  }

  ngOnInit() {
    this.loginForm.valueChanges.subscribe(() => {
      this.errorMessage = '';
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const credentials = this.loginForm.getRawValue();
      this.authService.login(credentials).subscribe({
        next: () => {
          this.notificationService.showInfo('Sesión iniciada. Bienvenido.');
          this.router.navigate(['/']);
        },
        error: (err) => {
          if (err.message === 'USER_BLOCKED') {
            this.errorMessage = 'La cuenta ha sido bloqueada.';
            this.notificationService.showError(
              `Tu cuenta ha sido bloqueada. Contacta con soporte.`,
            );
          } else {
            this.errorMessage = 'Credenciales incorrectas.';
            this.notificationService.showError(`Credenciales incorrectas. Inténtalo de nuevo.`);
          }
        },
      });
    }
  }
}
