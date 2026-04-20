import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { CartItem, StoredCartItem } from '../../../models/cart-item.model';
import { Product } from '../../../models/product.model';
import { ProductService } from '../products/product.service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private productService = inject(ProductService);
  private localStorageItems = signal<StoredCartItem[]>(this.loadFromStorage());
  cartItems = signal<CartItem[]>([]);
  isOpen = signal<boolean>(false);

  totalItems = computed(() => {
    return this.cartItems().reduce((total, item) => total + item.quantity, 0);
  });

  totalPrice = computed(() => {
    return this.cartItems().reduce((total, item) => total + (item.price ?? 0) * item.quantity, 0);
  });

  constructor() {
    this.refreshCartFromBackend();
    effect(() => {
      localStorage.setItem('cart', JSON.stringify(this.localStorageItems()));
    });
  }
  refreshCartFromBackend() {
    const ids = this.localStorageItems().map((i) => i.id);
    if (ids.length === 0) return this.cartItems.set([]);

    this.productService.getProductsByIds(ids).subscribe((products) => {
      this.cartItems.set(this.mapEnrichedItems(products));
    });
  }

  addCartItem(productId: number, openSidebar: boolean = true) {
    this.localStorageItems.update((items) => this.getUpdatedStoredList(items, productId));
    this.refreshCartFromBackend();
    if (openSidebar) this.isOpen.set(true);
  }

  updateQuantity(productId: number, quantity: number) {
    if (quantity <= 0) return this.removeCartItem(productId);
    this.applyQuantityUpdate(productId, quantity);
  }

  removeCartItem(productId: number) {
    this.localStorageItems.update((items) => items.filter((i) => i.id !== productId));
    this.cartItems.update((items) => items.filter((i) => i.id !== productId));
  }

  private mapEnrichedItems(products: Product[]): CartItem[] {
    // Se crea un map para filtrar de manera eficiente los productos.
    const productMap = new Map(products.map((p) => [p.id, p]));
    // Si el producto no existe en la DB o no esta disponible, se quita del carrito. Sí existe, se crea un objeto (toCartItem).
    return this.localStorageItems()
      .filter((item) => this.isAvailable(productMap.get(item.id)))
      .map((item) => this.toCartItem(item, productMap.get(item.id)!));
  }

  private isAvailable(p: Product | undefined): boolean {
    return !!(p && p.is_active && p.stock > 0);
  }

  private toCartItem(stored: StoredCartItem, dbProduct: Product): CartItem {
    return {
      id: dbProduct.id,
      name: dbProduct.name,
      price: dbProduct.price,
      image: dbProduct.image,
      quantity: Math.min(stored.quantity, dbProduct.stock),
      stock: dbProduct.stock,
    };
  }

  private getUpdatedStoredList(items: StoredCartItem[], id: number) {
    // Se busca si existe ya en el localstorage
    const existing = items.find((i) => i.id === id);
    // Si es producto nuevo se añade. Se usa spread para actualizar el signal localStorageItems
    if (!existing) return [...items, { id, quantity: 1 }];
    // Si existe, se recorre la lista y se le suma 1.
    return items.map((i) => (i.id === id ? { ...i, quantity: i.quantity + 1 } : i));
  }

  private applyQuantityUpdate(id: number, qty: number) {
    // Se busca el producto en la lista.
    const item = this.cartItems().find((i) => i.id === id);
    // Limitamos la cantidfad al stock
    const finalQuantity = Math.min(qty, item?.stock ?? qty);

    // Actualizamos el localStorage con la cantidad validada
    this.localStorageItems.update((items) =>
      items.map((i) => (i.id === id ? { ...i, quantity: finalQuantity } : i)),
    );
    // Actualizamos el signal con todos los productos.
    this.cartItems.update((items) =>
      items.map((i) => (i.id === id ? { ...i, quantity: finalQuantity } : i)),
    );
  }

  private loadFromStorage() {
    const stored = localStorage.getItem('cart');
    return stored ? JSON.parse(stored) : [];
  }

  clearCart() {
    this.localStorageItems.set([]);
    this.cartItems.set([]);
  }

  openSidebar() {
    this.isOpen.set(true);
  }
  closeSidebar() {
    this.isOpen.set(false);
  }
  toggleSidebar() {
    this.isOpen.set(!this.isOpen());
  }
}
