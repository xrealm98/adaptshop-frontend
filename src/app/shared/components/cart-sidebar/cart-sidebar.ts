import { CurrencyPipe } from '@angular/common';
import { Component, ElementRef, HostListener, inject, ViewChild } from '@angular/core';
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

  @ViewChild('closeBtn') closeBtn!: ElementRef<HTMLButtonElement>;

  @HostListener('document:keydown.escape')
  handleEscapeKey() {
    if (this.cartService.isOpen()) {
      this.cartService.closeSidebar();
    }
  }

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
