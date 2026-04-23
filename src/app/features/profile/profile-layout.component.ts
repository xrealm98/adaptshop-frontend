import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth/auth.service';

@Component({
  selector: 'app-profile-layout.component',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './profile-layout.component.html',
  styleUrl: './profile-layout.component.scss',
})
export class ProfileLayoutComponent {
  public authService = inject(AuthService);
}
