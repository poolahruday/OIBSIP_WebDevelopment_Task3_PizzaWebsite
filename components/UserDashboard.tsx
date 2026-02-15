
import React, { useState, useEffect } from 'react';
import { DataService } from '../services/mockDataService';
import { User, Order, OrderStatus } from '../types';
import { PizzaBuilder } from './PizzaBuilder';

interface UserDashboardProps {
  user: User;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({ user }) => {
  const [view, setView] = useState<'home' | 'builder' | 'orders'>('home');
  const [myOrders, setMyOrders] = useState<Order[]>([]);

  useEffect(() => {
    refreshOrders();
    // Poll for status changes every 10 seconds (simulated live updates)
    const interval = setInterval(refreshOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  const refreshOrders = () => {
    const all = DataService.getOrders();
    setMyOrders(all.filter(o => o.userId === user.id).sort((a, b) => b.createdAt - a.createdAt));
  };

  const getStatusColor = (status: OrderStatus) => {
    switch(status) {
      case OrderStatus.RECEIVED: return 'text-blue-600 bg-blue-50';
      case OrderStatus.KITCHEN: return 'text-orange-600 bg-orange-50';
      case OrderStatus.DELIVERY: return 'text-purple-600 bg-purple-50';
      case OrderStatus.DELIVERED: return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const recommendations = [
    { 
      name: 'Margherita Pro', 
      desc: 'Classic thin crust with double mozzarella and fresh basil leaves.', 
      img: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?auto=format&fit=crop&q=80&w=600&h=450',
      badge: 'Bestseller'
    },
    { 
      name: 'Spicy Garden', 
      desc: 'A vibrant mix of jalapenos, bell peppers, and our signature spicy marinara.', 
      img: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?auto=format&fit=crop&q=80&w=600&h=450',
      badge: 'Vegetarian'
    },
    { 
      name: 'Meat Feast', 
      desc: 'For the protein lovers: pepperoni, grilled chicken, and savory sausage.', 
      img: 'https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?auto=format&fit=crop&q=80&w=600&h=450',
      badge: 'Popular'
    },
    { 
      name: 'BBQ Chicken', 
      desc: 'Smoky BBQ sauce, grilled chicken breast, and red onions on a hand-tossed base.', 
      img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=600&h=450',
      badge: 'Chef Choice'
    },
    { 
      name: 'Truffle Fusion', 
      desc: 'Earthy truffle oil, wild mushrooms, and aged parmesan for a gourmet experience.', 
      img: 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?auto=format&fit=crop&q=80&w=600&h=450',
      badge: 'Premium'
    },
    { 
      name: 'Mediterranean', 
      desc: 'Pesto base, sun-dried tomatoes, kalamata olives, and crumbled feta cheese.', 
      img: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&q=80&w=600&h=450',
      badge: 'New'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      {/* Tab Navigation */}
      <div className="flex gap-4 mb-8">
        <button 
          onClick={() => setView('home')} 
          className={`flex-1 md:flex-none px-8 py-3 rounded-2xl font-bold transition-all ${view === 'home' ? 'bg-orange-600 text-white shadow-lg' : 'bg-white text-gray-500 border border-gray-100 hover:bg-gray-50'}`}
        >
          Menu
        </button>
        <button 
          onClick={() => setView('orders')} 
          className={`flex-1 md:flex-none px-8 py-3 rounded-2xl font-bold transition-all ${view === 'orders' ? 'bg-orange-600 text-white shadow-lg' : 'bg-white text-gray-500 border border-gray-100 hover:bg-gray-50'}`}
        >
          My Orders {myOrders.length > 0 && <span className="ml-2 px-2 py-0.5 bg-white text-orange-600 rounded-full text-xs">{myOrders.length}</span>}
        </button>
      </div>

      {view === 'home' && (
        <div className="space-y-12">
          {/* Hero Section */}
          <div className="relative h-64 md:h-96 rounded-[2.5rem] overflow-hidden shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=1200&h=600" 
              className="w-full h-full object-cover brightness-75 scale-105" 
              alt="Delicious Artisanal Pizza" 
            />
            <div className="absolute inset-0 flex flex-col justify-center px-12 text-white bg-gradient-to-r from-black/60 to-transparent">
              <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight">Craft Your <br /><span className="text-orange-400">Perfection</span></h1>
              <p className="text-lg opacity-90 max-w-md mb-8">Fresh ingredients, artisanal dough, and unlimited possibilities. Start building your dream pizza now.</p>
              <button 
                onClick={() => setView('builder')}
                className="bg-orange-600 text-white w-fit px-10 py-4 rounded-2xl font-bold shadow-xl hover:bg-orange-700 hover:scale-105 transition-all duration-300"
              >
                Build Custom Pizza
              </button>
            </div>
          </div>

          {/* Popular Pre-sets */}
          <div>
            <h3 className="text-3xl font-black text-gray-900 mb-8 tracking-tight">Chef's Recommendations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recommendations.map((p, i) => (
                <div key={i} className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-gray-100 group hover:shadow-xl transition-all duration-500 flex flex-col">
                  <div className="h-56 overflow-hidden relative">
                    <img 
                      src={p.img} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                      alt={p.name} 
                    />
                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-orange-600 shadow-sm">
                      {p.badge}
                    </div>
                  </div>
                  <div className="p-8 flex-1 flex flex-col">
                    <h4 className="text-2xl font-bold mb-2 text-gray-800">{p.name}</h4>
                    <p className="text-gray-500 text-sm mb-8 leading-relaxed flex-1">{p.desc}</p>
                    <button 
                      onClick={() => setView('builder')}
                      className="w-full py-4 bg-gray-50 text-orange-600 rounded-2xl font-bold hover:bg-orange-600 hover:text-white transition-all duration-300 border border-orange-50"
                    >
                      Customize This
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {view === 'builder' && (
        <PizzaBuilder user={user} onOrderComplete={() => setView('orders')} />
      )}

      {view === 'orders' && (
        <div className="space-y-6">
          <h2 className="text-3xl font-black mb-8">Tracking Your Pizzas</h2>
          {myOrders.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-[3rem] border border-gray-100 shadow-inner">
              <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-orange-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 11-8 0m-3 10h12a2 2 0 002-2v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-400">Your oven is empty!</h3>
              <button 
                onClick={() => setView('builder')} 
                className="mt-6 px-8 py-3 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 transition-colors shadow-lg shadow-orange-200"
              >
                Start Your First Order
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {myOrders.map(order => (
                <div key={order.id} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col justify-between relative overflow-hidden hover:shadow-md transition-shadow">
                  <div className="absolute top-0 right-0 p-6">
                    <span className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider shadow-sm ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-6">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Tracking #</span>
                      <span className="font-mono text-gray-900 font-bold bg-gray-50 px-2 py-1 rounded">{order.id}</span>
                    </div>
                    <div className="space-y-4 mb-8">
                      <div className="flex items-start gap-5">
                        <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center shrink-0">
                          <svg className="w-8 h-8 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-black text-xl text-gray-800">{order.items.base?.name}</p>
                          <p className="text-sm text-gray-500 font-medium">With {order.items.sauce?.name} & {order.items.veggies.length} toppings</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="pt-8 border-t border-gray-50 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">Total Amount</p>
                      <p className="text-3xl font-black text-orange-600">₹{order.total}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">Placed On</p>
                      <p className="text-sm font-bold text-gray-800">{new Date(order.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
