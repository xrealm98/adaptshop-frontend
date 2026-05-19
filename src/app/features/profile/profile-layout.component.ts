import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth/auth.service';
import { ToastComponent } from '../../shared/components/toast/toast.component';

@Component({
  selector: 'app-profile-layout.component',
  imports: [RouterOutlet, RouterLink, ToastComponent, RouterLinkActive],
  templateUrl: './profile-layout.component.html',
  styleUrl: './profile-layout.component.scss',
})
export class ProfileLayoutComponent {
  public authService = inject(AuthService);

  scrollToContent(event: Event, targetId: string): void {
    event.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      element.focus();
    }
  }
}
