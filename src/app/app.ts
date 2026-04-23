import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CartSidebar } from './shared/components/cart-sidebar/cart-sidebar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CartSidebar],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('adaptshop-frontend');
}
