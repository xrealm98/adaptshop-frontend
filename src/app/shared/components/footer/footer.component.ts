import { Component, inject } from '@angular/core';
import { SiteSettingsService } from '../../../core/services/settings/site-settings.service';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  settingsService = inject(SiteSettingsService);
}
