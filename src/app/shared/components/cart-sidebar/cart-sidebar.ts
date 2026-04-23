import { CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../../core/services/cart/cart.service';

@Component({
  selector: 'app-cart-sidebar',
  imports: [CurrencyPipe],
  templateUrl: './cart-sidebar.html',
  styleUrl: './cart-sidebar.scss',
})
export class CartSidebar {
  cartService = inject(CartService);
  private router = inject(Router);

  goToCart() {
    this.cartService.closeSidebar();
    setTimeout(() => {
      this.router.navigate(['/cart']);
    }, 50);
  }

  goToCheckout() {
    this.cartService.closeSidebar();
    setTimeout(() => {
      this.router.navigate(['/checkout']);
    }, 50);
  }
}
