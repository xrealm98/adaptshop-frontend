import { Component, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from './components/sidebar/sidebar';

@Component({
  selector: 'app-admin',
  imports: [RouterOutlet, Sidebar],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
})
export class AdminComponent {
  private title = inject(Title);
  constructor() {
    this.title.setTitle(`Administración`);
  }
}
