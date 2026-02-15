
import React, { useState, useEffect } from 'react';
import { DataService } from '../services/mockDataService';
import { Ingredient, Order, OrderStatus } from '../types';
import { STOCK_THRESHOLD } from '../constants';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'orders'>('orders');
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setIngredients(DataService.getIngredients());
    setOrders(DataService.getOrders().sort((a, b) => b.createdAt - a.createdAt));
  };

  const handleUpdateStock = (id: string, newStock: number) => {
    DataService.updateIngredientStock(id, newStock);
    refreshData();
  };

  const handleStatusChange = (orderId: string, status: OrderStatus) => {
    DataService.updateOrderStatus(orderId, status);
    refreshData();
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold">Admin Panel</h2>
        <div className="flex bg-gray-100 p-1 rounded-lg">
          <button 
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-2 rounded-md font-medium transition-all ${activeTab === 'orders' ? 'bg-white shadow-sm text-orange-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Manage Orders
          </button>
          <button 
            onClick={() => setActiveTab('inventory')}
            className={`px-6 py-2 rounded-md font-medium transition-all ${activeTab === 'inventory' ? 'bg-white shadow-sm text-orange-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Inventory
          </button>
        </div>
      </div>

      {activeTab === 'orders' ? (
        <div className="space-y-6">
          {orders.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
              <p className="text-gray-400">No orders received yet.</p>
            </div>
          ) : (
            orders.map(order => (
              <div key={order.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-bold text-lg text-orange-600">{order.id}</span>
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-xs font-semibold uppercase">{order.status}</span>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">Customer: {order.userEmail} | {new Date(order.createdAt).toLocaleString()}</p>
                  <div className="space-y-1">
                    <p className="text-sm"><strong>Base:</strong> {order.items.base?.name}</p>
                    <p className="text-sm"><strong>Toppings:</strong> {order.items.veggies.map(v => v.name).join(', ') || 'No extra toppings'}</p>
                  </div>
                  <p className="mt-4 font-bold text-lg">Total: ₹{order.total}</p>
                </div>
                <div className="flex flex-col justify-between gap-4">
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-gray-400 uppercase">Update Status</label>
                    <div className="flex flex-wrap gap-2">
                      {Object.values(OrderStatus).map(status => (
                        <button
                          key={status}
                          onClick={() => handleStatusChange(order.id, status)}
                          disabled={order.status === status}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${order.status === status ? 'bg-orange-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-sm font-bold text-gray-500 uppercase">Ingredient</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-500 uppercase">Category</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-500 uppercase">Stock Status</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-500 uppercase">Price</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {ingredients.map(ing => (
                <tr key={ing.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-semibold">{ing.name}</td>
                  <td className="px-6 py-4"><span className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600 font-medium uppercase">{ing.category}</span></td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${ing.stock < STOCK_THRESHOLD ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`} />
                      <span className={ing.stock < STOCK_THRESHOLD ? 'text-red-600 font-bold' : 'text-gray-700'}>{ing.stock} left</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">₹{ing.price}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleUpdateStock(ing.id, Math.max(0, ing.stock - 10))}
                        className="px-3 py-1 bg-red-50 text-red-600 rounded-md hover:bg-red-100"
                      >
                        -10
                      </button>
                      <button 
                        onClick={() => handleUpdateStock(ing.id, ing.stock + 10)}
                        className="px-3 py-1 bg-green-50 text-green-600 rounded-md hover:bg-green-100"
                      >
                        +10
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
