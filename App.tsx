
import React, { useState, useEffect } from 'react';
import { DataService } from './services/mockDataService';
import { User, UserRole } from './types';
import { AuthUI } from './components/AuthUI';
import { UserDashboard } from './components/UserDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { Icons } from './constants';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    DataService.init();
    const session = DataService.getSession();
    if (session) {
      setUser(session);
    }
    setIsInitializing(false);
  }, []);

  const handleAuthSuccess = (authenticatedUser: User) => {
    setUser(authenticatedUser);
  };

  const handleLogout = () => {
    DataService.logout();
    setUser(null);
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-bounce">
          <Icons.Pizza />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-18 flex items-center justify-between py-4">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.reload()}>
            <Icons.Pizza />
            <span className="text-xl font-black tracking-tight text-gray-900">PIZZA<span className="text-orange-600">CRAFT</span></span>
          </div>

          {user && (
            <div className="flex items-center gap-6">
              <div className="hidden md:flex flex-col items-end">
                <span className="text-sm font-bold text-gray-900">{user.fullName}</span>
                <span className="text-xs text-gray-500 capitalize">{user.role} Account</span>
              </div>
              <button 
                onClick={handleLogout}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-200 transition-colors"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        {!user ? (
          <AuthUI onAuthSuccess={handleAuthSuccess} />
        ) : user.role === UserRole.ADMIN ? (
          <AdminDashboard />
        ) : (
          <UserDashboard user={user} />
        )}
      </main>

      {/* Footer */}
      <footer className="py-8 bg-white border-t border-gray-100 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400 text-sm">© 2024 PizzaCraft Pro. Handcrafted with passion.</p>
          <div className="flex justify-center gap-4 mt-4 text-xs font-bold text-gray-300 uppercase tracking-widest">
            <span>Privacy</span>
            <span>Terms</span>
            <span>Contact</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
