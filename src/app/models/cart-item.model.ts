export interface CartItem {
  id: number;
  name?: string;
  price?: number;
  image?: string | null;
  quantity: number;
  stock?: number;
  is_active?: boolean;
}

export interface StoredCartItem {
  id: number;
  quantity: number;
}
