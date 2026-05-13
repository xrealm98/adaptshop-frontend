import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NotificationService } from '../../../core/services/notification/notification.service';
import { SiteSettingsService } from '../../../core/services/settings/site-settings.service';
import { FormInputComponent } from '../../../shared/components/form-controls/form-input/form-input.component';

@Component({
  selector: 'app-site-settings.component',
  imports: [ReactiveFormsModule, FormInputComponent],
  templateUrl: './site-settings.component.html',
  styleUrl: './site-settings.component.scss',
})
export class SiteSettingsComponent {
  private settingsService = inject(SiteSettingsService);
  private notificationService = inject(NotificationService);
  private fb = inject(FormBuilder);

  activeTab = signal<'site' | 'footer'>('site');

  siteForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
  });

  footerForm = this.fb.nonNullable.group({
    phone: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    faq_url: [''],
    about_url: [''],
    legal_url: [''],
    privacy_url: [''],
  });

  ngOnInit() {
    this.settingsService.loadSettings().subscribe({
      next: (settings) => {
        if (settings.site) {
          this.siteForm.patchValue({ name: settings.site.name });
        }
        if (settings.footer) {
          this.footerForm.patchValue(settings.footer);
        }
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  onSubmitSite() {
    if (this.siteForm.invalid) return;
    this.settingsService.updateSettings('site', this.siteForm.getRawValue()).subscribe({
      next: () =>
        this.notificationService.showSuccess(`Datos del sitio actualizados correctamente.`),
      error: (err) => {
        this.notificationService.showError(`Error al actualizar los datos del sitio.`);
        console.error(err);
      },
    });
  }

  onSubmitFooter() {
    if (this.footerForm.invalid) return;
    this.settingsService.updateSettings('footer', this.footerForm.getRawValue()).subscribe({
      next: () =>
        this.notificationService.showSuccess(`Datos del footer actualizados correctamente.`),
      error: (err) => {
        this.notificationService.showError(`Error al actualizar los datos del footer.`);
        console.error(err);
      },
    });
  }
}
