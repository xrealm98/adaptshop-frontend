import { Component, inject } from '@angular/core';
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
  constructor() {
    this.title.setTitle(`Administración`);
  }
}
