import { Category } from './category.model';
export interface Product {
  id: number;
  category_id: number;
  name: string;
  slug: string;
  details?: string;
  description: string;
  price: number;
  stock: number;
  image: string | null;
  is_active: boolean;
  category?: Category;
}
