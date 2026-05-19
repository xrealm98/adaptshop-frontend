import { Component, inject, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';
import { SpinnerComponent } from '../../shared/components/spinner/spinner.component';
import { ToastComponent } from '../../shared/components/toast/toast.component';
import { Sidebar } from './components/sidebar/sidebar';

@Component({
  selector: 'app-admin',
  imports: [RouterOutlet, ToastComponent, SpinnerComponent, Sidebar],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
})
export class AdminComponent {
  private title = inject(Title);
  isSidebarOpen = signal<boolean>(false);
  constructor() {
    this.title.setTitle(`Administración`);
  }

  scrollToContent(event: Event, targetId: string): void {
    event.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      element.focus();
    }
  }
}
