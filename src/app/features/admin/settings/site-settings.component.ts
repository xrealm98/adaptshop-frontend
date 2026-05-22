import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryService } from '../../../core/services/categories/category.service';
import { NotificationService } from '../../../core/services/notification/notification.service';
import { SiteSettingsService } from '../../../core/services/settings/site-settings.service';
import { Category } from '../../../models/category.model';
import { HomeBanner, HomeCategoryButton, HomeSettings } from '../../../models/settings.model';
import { FormInputComponent } from '../../../shared/components/form-controls/form-input/form-input.component';

@Component({
  selector: 'app-site-settings.component',
  imports: [ReactiveFormsModule, FormInputComponent],
  templateUrl: './site-settings.component.html',
  styleUrl: './site-settings.component.scss',
})
export class SiteSettingsComponent {
  private settingsService = inject(SiteSettingsService);
  private categoryService = inject(CategoryService);
  private notificationService = inject(NotificationService);
  private fb = inject(FormBuilder);

  activeTab = signal<'site' | 'home' | 'footer'>('site');

  categories = signal<Category[]>([]);

  categoryButtons = signal<HomeCategoryButton[]>([
    { category_id: 0, color: 'emerald' },
    { category_id: 0, color: 'sky' },
    { category_id: 0, color: 'orange' },
    { category_id: 0, color: 'slate' },
  ]);

  homeBanners = signal<HomeBanner[]>([
    {
      title: '',
      subtitle: '',
      image: '',
      buttonText: '',
    },
    {
      title: '',
      subtitle: '',
      image: '',
      buttonText: '',
    },
    {
      title: '',
      subtitle: '',
      image: '',
      buttonText: '',
    },
  ]);

  siteForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
    header_color: ['#797676'],
    header_text_color: ['#000000'],
  });

  homeForm = this.fb.nonNullable.group({
    featured_category_id: [null as number | null],
  });

  footerForm = this.fb.nonNullable.group({
    phone: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    faq_url: [''],
    about_url: [''],
    legal_url: [''],
    privacy_url: [''],
    footer_color: ['#000000'],
    footer_text_color: ['#FFFFFF'],
  });

  ngOnInit() {
    this.loadCategories();
    this.loadSiteSettings();
  }

  private loadCategories() {
    this.categoryService.getAllCategories().subscribe({
      next: (cats) => this.categories.set(cats),
      error: (err) => console.error('Error cargando categorías', err),
    });
  }

  private loadSiteSettings() {
    this.settingsService.loadSettings().subscribe({
      next: (settings) => {
        if (settings.site) this.siteForm.patchValue(settings.site);
        if (settings.home) this.setupHomeSection(settings.home);
        if (settings.footer) this.footerForm.patchValue(settings.footer);
      },
      error: (err) => console.error('Error al cargar configuraciones', err),
    });
  }

  private setupHomeSection(homeSettings: any) {
    this.homeForm.patchValue({
      featured_category_id: homeSettings.featured_category_id ?? null,
    });

    const startButtons = this.normalizeCategoryButtons(homeSettings.category_buttons);
    this.categoryButtons.set(startButtons);

    const normalizedBanners = this.normalizeBanners(homeSettings.banners);
    this.homeBanners.set(normalizedBanners);
  }

  private normalizeCategoryButtons(savedButtons: HomeCategoryButton[] = []): HomeCategoryButton[] {
    return Array.from({ length: 4 }, (_, i) => {
      return savedButtons[i] || { category_id: 0, color: '' };
    });
  }
  private normalizeBanners(savedBanners: HomeBanner[] = []): HomeBanner[] {
    return Array.from({ length: 3 }, (_, i) => {
      return savedBanners[i] || { title: '', subtitle: '', image: '', buttonText: '' };
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

  onSubmitHome() {
    if (this.homeForm.invalid) return;
    const homeData: HomeSettings = {
      featured_category_id: this.homeForm.value.featured_category_id ?? null,
      category_buttons: this.categoryButtons().filter((b) => b.category_id > 0),
      banners: this.homeBanners().filter((b) => b.title.trim() !== ''),
    };
    this.settingsService.updateSettings('home', homeData).subscribe({
      next: () => this.notificationService.showSuccess(`Configuración del home actualizada.`),
      error: (err) => {
        this.notificationService.showError(`Error al actualizar la configuración .`);
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

  updateCategoryButton(index: number, field: keyof HomeCategoryButton, event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.categoryButtons.update((btns) =>
      btns.map((btn, i) =>
        i === index ? { ...btn, [field]: field === 'category_id' ? +value : value } : btn,
      ),
    );
  }
  updateHomeBanner(index: number, field: keyof HomeBanner, event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.homeBanners.update((banners) =>
      banners.map((banner, i) => (i === index ? { ...banner, [field]: value } : banner)),
    );
  }
}
