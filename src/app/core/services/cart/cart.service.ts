import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { map, of, switchMap } from 'rxjs';
import { CartItem, StoredCartItem } from '../../../models/cart-item.model';
import { Product } from '../../../models/product.model';
import { ProductService } from '../products/product.service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private productService = inject(ProductService);
  private localStorageItems = signal<StoredCartItem[]>(this.loadFromStorage());
  isOpen = signal<boolean>(false);

  public cartItems = toSignal(
    toObservable(this.localStorageItems).pipe(
      switchMap((storedItems) => {
        const ids = storedItems.map((i) => i.id);
        if (ids.length === 0) {
          return of([]);
        }

        return this.productService.getProductsByIds(ids).pipe(
          map((products) => {
            return this.mapEnrichedItems(products, storedItems);
          }),
        );
      }),
    ),
    { initialValue: [] },
  );

  totalItems = computed(() => {
    return this.cartItems().reduce((total, item) => total + item.quantity, 0);
  });

  totalPrice = computed(() => {
    return this.cartItems().reduce((total, item) => total + (item.price ?? 0) * item.quantity, 0);
  });

  constructor() {
    effect(() => {
      localStorage.setItem('cart', JSON.stringify(this.localStorageItems()));
    });
  }

  addCartItem(productId: number, openSidebar: boolean = true) {
    this.localStorageItems.update((items) => this.getUpdatedStoredList(items, productId));
    if (openSidebar) this.isOpen.set(true);
  }

  updateQuantity(productId: number, quantity: number) {
    if (quantity <= 0) return this.removeCartItem(productId);

    this.localStorageItems.update((items) =>
      items.map((i) => (i.id === productId ? { ...i, quantity } : i)),
    );
  }

  removeCartItem(productId: number) {
    this.localStorageItems.update((items) => items.filter((i) => i.id !== productId));
  }
  private mapEnrichedItems(products: Product[], storedItems: StoredCartItem[]): CartItem[] {
    // Se crea un map para filtrar de manera eficiente los productos.
    const productMap = new Map(products.map((p) => [p.id, p]));
    // Si el producto no existe en la DB o no esta disponible, se quita del carrito. Sí existe, se crea un objeto (toCartItem).
    return storedItems
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

  private loadFromStorage(): StoredCartItem[] {
    const stored = localStorage.getItem('cart');
    return stored ? JSON.parse(stored) : [];
  }

  clearCart() {
    this.localStorageItems.set([]);
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
