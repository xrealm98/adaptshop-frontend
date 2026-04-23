import { Order } from './order.model';

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  street: string | null;
  city: string | null;
  province: string | null;
  postal_code: string | null;
  country: string | null;
  role?: 'client' | 'admin';
  is_blocked?: boolean;
  orders?: Order[];
}
