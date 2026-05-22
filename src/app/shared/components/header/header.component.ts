import { Component, ElementRef, HostListener, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';
import { CartService } from '../../../core/services/cart/cart.service';
import { CategoryService } from '../../../core/services/categories/category.service';
import { SiteSettingsService } from '../../../core/services/settings/site-settings.service';
import { Category } from '../../../models/category.model';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  public authService = inject(AuthService);
  cartService = inject(CartService);
  siteConfig = inject(SiteSettingsService);
  public router = inject(Router);
  private categoryService = inject(CategoryService);
  private eRef = inject(ElementRef);

  categories = signal<Category[]>([]);
  searchTerm = signal('');
  isProfileMenuOpen = signal(false);

  isMobileMenuOpen = signal(false);
  isSearchOpen = signal(false);

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getAllCategories().subscribe({
      next: (categories) => this.categories.set(categories.slice(0, 6)),
    });
  }

  onSearch(term: string, inputElement: HTMLInputElement) {
    if (term.trim()) {
      this.router.navigate(['/catalog'], {
        queryParams: { search: term },
      });
      inputElement.value = '';
      inputElement.blur();
    }
  }

  toggleMenu() {
    this.isProfileMenuOpen.update((isProfileMenuOpen) => !isProfileMenuOpen);
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen.update((v) => !v);
  }

  toggleSearch() {
    this.isSearchOpen.update((v) => !v);
  }

  // Cerrar el desplegable del perfil
  @HostListener('document:click', ['$event'])
  clickout(event: any) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.isProfileMenuOpen.set(false);
    }
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => this.router.navigate(['/']),
    });
  }
}
