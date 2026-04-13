import { Component, ElementRef, HostListener, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  public authService = inject(AuthService);
  public router = inject(Router);
  isMenuOpen = signal(false);
  private eRef = inject(ElementRef);

  toggleMenu() {
    this.isMenuOpen.update((isMenuOpen) => !isMenuOpen);
  }
  @HostListener('document:click', ['$event'])
  clickout(event: any) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.isMenuOpen.set(false);
    }
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => this.router.navigate(['/']),
    });
  }
}
