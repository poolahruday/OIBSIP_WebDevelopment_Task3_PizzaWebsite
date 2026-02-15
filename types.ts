
export enum OrderStatus {
  RECEIVED = 'Order Received',
  KITCHEN = 'In the Kitchen',
  DELIVERY = 'Sent to Delivery',
  DELIVERED = 'Delivered'
}

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin'
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  isVerified: boolean;
  fullName: string;
}

export interface Ingredient {
  id: string;
  name: string;
  price: number;
  category: 'base' | 'sauce' | 'cheese' | 'veggie' | 'meat';
  stock: number;
  image?: string;
}

export interface PizzaSelection {
  base: Ingredient | null;
  sauce: Ingredient | null;
  cheese: Ingredient | null;
  veggies: Ingredient[];
}

export interface Order {
  id: string;
  userId: string;
  userEmail: string;
  items: PizzaSelection;
  total: number;
  status: OrderStatus;
  createdAt: number;
  paymentId: string;
}

export interface InventoryThreshold {
  itemType: string;
  threshold: number;
}
