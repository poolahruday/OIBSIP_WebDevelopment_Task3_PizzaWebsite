
import { User, Ingredient, Order, OrderStatus, UserRole } from '../types';
import { INITIAL_INGREDIENTS, STOCK_THRESHOLD } from '../constants';
import { GoogleGenAI } from "@google/genai";

const STORAGE_KEY_USERS = 'pizzacraft_users';
const STORAGE_KEY_INGREDIENTS = 'pizzacraft_ingredients';
const STORAGE_KEY_ORDERS = 'pizzacraft_orders';
const STORAGE_KEY_SESSION = 'pizzacraft_session';

export class DataService {
  private static ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

  static init() {
    if (!localStorage.getItem(STORAGE_KEY_USERS)) {
      const defaultAdmin: User = {
        id: 'admin-1',
        email: 'admin@pizzacraft.com',
        role: UserRole.ADMIN,
        isVerified: true,
        fullName: 'System Admin'
      };
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify([defaultAdmin]));
    }
    if (!localStorage.getItem(STORAGE_KEY_INGREDIENTS)) {
      localStorage.setItem(STORAGE_KEY_INGREDIENTS, JSON.stringify(INITIAL_INGREDIENTS));
    }
    if (!localStorage.getItem(STORAGE_KEY_ORDERS)) {
      localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify([]));
    }
  }

  // Auth
  static async login(email: string, password: string): Promise<User | null> {
    // Basic mock login: password is "password" for any registered email
    const users: User[] = JSON.parse(localStorage.getItem(STORAGE_KEY_USERS) || '[]');
    const user = users.find(u => u.email === email);
    if (user && password === 'password') {
      localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(user));
      return user;
    }
    return null;
  }

  static logout() {
    localStorage.removeItem(STORAGE_KEY_SESSION);
  }

  static getSession(): User | null {
    const session = localStorage.getItem(STORAGE_KEY_SESSION);
    return session ? JSON.parse(session) : null;
  }

  static async register(fullName: string, email: string, role: UserRole): Promise<User> {
    const users: User[] = JSON.parse(localStorage.getItem(STORAGE_KEY_USERS) || '[]');
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      fullName,
      role,
      isVerified: false // Verification flow simulation
    };
    users.push(newUser);
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
    return newUser;
  }

  // Inventory
  static getIngredients(): Ingredient[] {
    return JSON.parse(localStorage.getItem(STORAGE_KEY_INGREDIENTS) || '[]');
  }

  static updateIngredientStock(id: string, newStock: number) {
    const ingredients = this.getIngredients();
    const updated = ingredients.map(ing => {
      if (ing.id === id) {
        if (newStock < STOCK_THRESHOLD) {
          this.notifyAdminThreshold(ing);
        }
        return { ...ing, stock: newStock };
      }
      return ing;
    });
    localStorage.setItem(STORAGE_KEY_INGREDIENTS, JSON.stringify(updated));
  }

  private static async notifyAdminThreshold(ingredient: Ingredient) {
    try {
      // Simulate Gemini generating a professional email notification
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Generate a short urgent email alert for an admin: The stock of "${ingredient.name}" (${ingredient.category}) is low. Current stock: ${ingredient.stock}. Threshold: ${STOCK_THRESHOLD}.`
      });
      console.log("%c[ADMIN EMAIL NOTIFICATION]", "color: red; font-weight: bold;", response.text);
    } catch (e) {
      console.log(`Low stock alert for ${ingredient.name}`);
    }
  }

  // Orders
  static getOrders(): Order[] {
    return JSON.parse(localStorage.getItem(STORAGE_KEY_ORDERS) || '[]');
  }

  static createOrder(order: Omit<Order, 'id' | 'createdAt' | 'status'>): Order {
    const orders = this.getOrders();
    const newOrder: Order = {
      ...order,
      id: 'ORD-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
      createdAt: Date.now(),
      status: OrderStatus.RECEIVED
    };
    
    // Deduct Stock
    const ingredients = this.getIngredients();
    const items = [order.items.base, order.items.sauce, order.items.cheese, ...order.items.veggies];
    
    items.forEach(item => {
      if (item) {
        const found = ingredients.find(i => i.id === item.id);
        if (found) {
          this.updateIngredientStock(found.id, found.stock - 1);
        }
      }
    });

    orders.push(newOrder);
    localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(orders));
    return newOrder;
  }

  static updateOrderStatus(orderId: string, status: OrderStatus) {
    const orders = this.getOrders();
    const updated = orders.map(o => o.id === orderId ? { ...o, status } : o);
    localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(updated));
  }
}
