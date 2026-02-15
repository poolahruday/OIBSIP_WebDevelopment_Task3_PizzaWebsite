
import React from 'react';
import { Ingredient } from './types';

export const INITIAL_INGREDIENTS: Ingredient[] = [
  // Bases
  { id: 'b1', name: 'Thin Crust', price: 150, category: 'base', stock: 50 },
  { id: 'b2', name: 'Hand Tossed', price: 180, category: 'base', stock: 45 },
  { id: 'b3', name: 'Pan Pizza', price: 200, category: 'base', stock: 40 },
  { id: 'b4', name: 'Cheese Burst', price: 250, category: 'base', stock: 35 },
  { id: 'b5', name: 'Gluten Free', price: 220, category: 'base', stock: 25 },
  
  // Sauces
  { id: 's1', name: 'Classic Tomato', price: 20, category: 'sauce', stock: 60 },
  { id: 's2', name: 'Spicy Marinara', price: 25, category: 'sauce', stock: 55 },
  { id: 's3', name: 'Creamy Garlic', price: 30, category: 'sauce', stock: 50 },
  { id: 's4', name: 'BBQ Sauce', price: 35, category: 'sauce', stock: 45 },
  { id: 's5', name: 'Pesto', price: 40, category: 'sauce', stock: 30 },

  // Cheese
  { id: 'c1', name: 'Mozzarella', price: 50, category: 'cheese', stock: 70 },
  { id: 'c2', name: 'Cheddar', price: 60, category: 'cheese', stock: 65 },
  { id: 'c3', name: 'Parmesan', price: 70, category: 'cheese', stock: 60 },
  { id: 'c4', name: 'Feta', price: 80, category: 'cheese', stock: 40 },

  // Veggies
  { id: 'v1', name: 'Onions', price: 15, category: 'veggie', stock: 100 },
  { id: 'v2', name: 'Bell Peppers', price: 20, category: 'veggie', stock: 90 },
  { id: 'v3', name: 'Olives', price: 30, category: 'veggie', stock: 80 },
  { id: 'v4', name: 'Mushrooms', price: 35, category: 'veggie', stock: 75 },
  { id: 'v5', name: 'Jalapenos', price: 25, category: 'veggie', stock: 85 },
  { id: 'v6', name: 'Spinach', price: 20, category: 'veggie', stock: 60 },

  // Meats
  { id: 'm1', name: 'Pepperoni', price: 60, category: 'meat', stock: 50 },
  { id: 'm2', name: 'Grilled Chicken', price: 70, category: 'meat', stock: 45 },
  { id: 'm3', name: 'Sausage', price: 65, category: 'meat', stock: 40 },
];

export const STOCK_THRESHOLD = 20;

export const Icons = {
  Pizza: () => (
    <svg className="w-8 h-8 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2L2 12h3v8h14v-8h3L12 2zM12 17v-4m0 0V9m0 4h-4m4 0h4" />
    </svg>
  ),
  User: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  Admin: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  )
};
