
import React, { useState, useEffect } from 'react';
import { Ingredient, PizzaSelection, User } from '../types';
import { DataService } from '../services/mockDataService';

interface PizzaBuilderProps {
  user: User;
  onOrderComplete: () => void;
}

export const PizzaBuilder: React.FC<PizzaBuilderProps> = ({ user, onOrderComplete }) => {
  const [step, setStep] = useState(1);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [selection, setSelection] = useState<PizzaSelection>({
    base: null,
    sauce: null,
    cheese: null,
    veggies: []
  });

  useEffect(() => {
    setIngredients(DataService.getIngredients());
  }, []);

  const handleCheckout = () => {
    const total = (selection.base?.price || 0) + 
                  (selection.sauce?.price || 0) + 
                  (selection.cheese?.price || 0) + 
                  selection.veggies.reduce((sum, v) => sum + v.price, 0);

    const options = {
      key: "rzp_test_dummy", // Simulated
      amount: total * 100,
      currency: "INR",
      name: "PizzaCraft Pro",
      description: "Custom Pizza Order",
      handler: (response: any) => {
        DataService.createOrder({
          userId: user.id,
          userEmail: user.email,
          items: selection,
          total: total,
          paymentId: response.razorpay_payment_id || 'MOCK_PAY_ID_' + Date.now()
        });
        alert('Order placed successfully!');
        onOrderComplete();
      },
      prefill: {
        name: user.fullName,
        email: user.email
      },
      theme: { color: "#ea580c" }
    };

    // Simulate Razorpay trigger since we're in a sandbox
    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  };

  const toggleVeggie = (v: Ingredient) => {
    setSelection(prev => ({
      ...prev,
      veggies: prev.veggies.find(item => item.id === v.id)
        ? prev.veggies.filter(item => item.id !== v.id)
        : [...prev.veggies, v]
    }));
  };

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div className="animate-fade-in">
            <h3 className="text-xl font-bold mb-4">Step 1: Choose Your Base</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ingredients.filter(i => i.category === 'base').map(item => (
                <button
                  key={item.id}
                  onClick={() => { setSelection({ ...selection, base: item }); setStep(2); }}
                  className={`p-6 border-2 rounded-xl text-left transition-all ${selection.base?.id === item.id ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-orange-200'}`}
                >
                  <div className="font-bold text-lg">{item.name}</div>
                  <div className="text-gray-500">₹{item.price}</div>
                  <div className="text-xs mt-2 text-gray-400">Stock: {item.stock} left</div>
                </button>
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="animate-fade-in">
            <h3 className="text-xl font-bold mb-4">Step 2: Select Your Sauce</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ingredients.filter(i => i.category === 'sauce').map(item => (
                <button
                  key={item.id}
                  onClick={() => { setSelection({ ...selection, sauce: item }); setStep(3); }}
                  className={`p-6 border-2 rounded-xl text-left transition-all ${selection.sauce?.id === item.id ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-orange-200'}`}
                >
                  <div className="font-bold text-lg">{item.name}</div>
                  <div className="text-gray-500">₹{item.price}</div>
                </button>
              ))}
            </div>
            <button onClick={() => setStep(1)} className="mt-8 text-orange-600 font-medium hover:underline">← Back to Base</button>
          </div>
        );
      case 3:
        return (
          <div className="animate-fade-in">
            <h3 className="text-xl font-bold mb-4">Step 3: Pick Your Cheese</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ingredients.filter(i => i.category === 'cheese').map(item => (
                <button
                  key={item.id}
                  onClick={() => { setSelection({ ...selection, cheese: item }); setStep(4); }}
                  className={`p-6 border-2 rounded-xl text-left transition-all ${selection.cheese?.id === item.id ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-orange-200'}`}
                >
                  <div className="font-bold text-lg">{item.name}</div>
                  <div className="text-gray-500">₹{item.price}</div>
                </button>
              ))}
            </div>
            <button onClick={() => setStep(2)} className="mt-8 text-orange-600 font-medium hover:underline">← Back to Sauce</button>
          </div>
        );
      case 4:
        return (
          <div className="animate-fade-in">
            <h3 className="text-xl font-bold mb-4">Step 4: Load with Veggies & Meat</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {ingredients.filter(i => i.category === 'veggie' || i.category === 'meat').map(item => (
                <button
                  key={item.id}
                  onClick={() => toggleVeggie(item)}
                  className={`p-4 border-2 rounded-xl text-left transition-all ${selection.veggies.find(v => v.id === item.id) ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-orange-200'}`}
                >
                  <div className="font-bold">{item.name}</div>
                  <div className="text-sm text-gray-500">₹{item.price}</div>
                </button>
              ))}
            </div>
            <div className="flex justify-between mt-8 items-center">
              <button onClick={() => setStep(3)} className="text-orange-600 font-medium hover:underline">← Back to Cheese</button>
              <button onClick={() => setStep(5)} className="px-8 py-3 bg-orange-600 text-white rounded-xl font-bold hover:shadow-lg transition-all">Review Order</button>
            </div>
          </div>
        );
      case 5:
        const total = (selection.base?.price || 0) + (selection.sauce?.price || 0) + (selection.cheese?.price || 0) + selection.veggies.reduce((sum, v) => sum + v.price, 0);
        return (
          <div className="animate-fade-in">
            <h3 className="text-2xl font-bold mb-6">Review Your Pizza</h3>
            <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100 mb-8 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Base:</span>
                <span className="font-semibold">{selection.base?.name} (₹{selection.base?.price})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Sauce:</span>
                <span className="font-semibold">{selection.sauce?.name} (₹{selection.sauce?.price})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Cheese:</span>
                <span className="font-semibold">{selection.cheese?.name} (₹{selection.cheese?.price})</span>
              </div>
              <div>
                <span className="text-gray-600 block mb-1">Toppings:</span>
                <div className="flex flex-wrap gap-2">
                  {selection.veggies.map(v => (
                    <span key={v.id} className="bg-white px-2 py-1 rounded-md text-sm border border-orange-200">{v.name} (₹{v.price})</span>
                  ))}
                </div>
              </div>
              <div className="pt-4 border-t border-orange-200 flex justify-between text-xl font-bold">
                <span>Total Amount</span>
                <span className="text-orange-600">₹{total}</span>
              </div>
            </div>
            <div className="flex justify-between gap-4">
              <button onClick={() => setStep(4)} className="flex-1 py-4 border-2 border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50">Modify Items</button>
              <button onClick={handleCheckout} className="flex-1 py-4 bg-orange-600 text-white rounded-xl font-bold shadow-lg hover:bg-orange-700">Pay & Order Now</button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8 overflow-x-auto pb-4 gap-4">
        {[1, 2, 3, 4, 5].map((s) => (
          <div key={s} className="flex items-center gap-2 shrink-0">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 transition-all ${step >= s ? 'bg-orange-600 border-orange-600 text-white' : 'border-gray-300 text-gray-400'}`}>
              {s}
            </div>
            <div className={`h-1 w-12 md:w-20 rounded-full ${step > s ? 'bg-orange-600' : 'bg-gray-200'}`} />
          </div>
        ))}
      </div>
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        {renderStep()}
      </div>
    </div>
  );
};
