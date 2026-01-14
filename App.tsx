
import React, { useState, useEffect } from 'react';
import { AuthState, User, Booking } from './types';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import BookingFlow from './components/BookingFlow';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import LandingPage from './components/LandingPage';
import GeminiAssistant from './components/GeminiAssistant';
import ForgotPassword from './components/ForgotPassword';
import AdminPanel from './components/AdminPanel';
import DebugUsers from './components/DebugUsers';

const App: React.FC = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
  });
  const [view, setView] = useState<'landing' | 'login' | 'register' | 'dashboard' | 'booking' | 'forgot-password' | 'admin' | 'debug'>('landing');
  const [rescheduleData, setRescheduleData] = useState<Booking | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('kamiluz_current_user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setAuthState({
          user: parsedUser,
          isAuthenticated: true,
        });
        setView(parsedUser.role === 'admin' ? 'admin' : 'dashboard');
      } catch (e) {
        localStorage.removeItem('kamiluz_current_user');
      }
    }
  }, []);

  const handleLogin = (user: User) => {
    setAuthState({ user, isAuthenticated: true });
    localStorage.setItem('kamiluz_current_user', JSON.stringify(user));
    setView(user.role === 'admin' ? 'admin' : 'dashboard');
  };

  const handleLogout = () => {
    setAuthState({ user: null, isAuthenticated: false });
    localStorage.removeItem('kamiluz_current_user');
    setView('landing');
  };

  const handleReschedule = (booking: Booking) => {
    setRescheduleData(booking);
    setView('booking');
  };

  const handleBookingBack = () => {
    setRescheduleData(null);
    setView(authState.user?.role === 'admin' ? 'admin' : 'dashboard');
  };

  const renderView = () => {
    switch (view) {
      case 'landing':
        return <LandingPage onGetStarted={() => setView('login')} onNewBooking={() => setView('booking')} />;
      case 'login':
        return (
          <Login 
            onLogin={handleLogin} 
            onGoToRegister={() => setView('register')} 
            onForgotPassword={() => setView('forgot-password')} 
          />
        );
      case 'register':
        return <Register onRegister={handleLogin} onGoToLogin={() => setView('login')} />;
      case 'dashboard':
        return <Dashboard user={authState.user!} onNewBooking={() => setView('booking')} onReschedule={handleReschedule} />;
      case 'admin':
        return <AdminPanel />;
      case 'debug':
        return <DebugUsers />;
      case 'booking':
        if (!authState.isAuthenticated) {
          setView('login');
          return null;
        }
        return <BookingFlow user={authState.user!} onBack={handleBookingBack} rescheduleBooking={rescheduleData} />;
      case 'forgot-password':
        return <ForgotPassword onBack={() => setView('login')} />;
      default:
        return <LandingPage onGetStarted={() => setView('login')} onNewBooking={() => setView('booking')} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF6F6] flex flex-col md:flex-row relative">
      {authState.isAuthenticated && (
        <Sidebar user={authState.user!} onNavigate={(v) => { setRescheduleData(null); setView(v); }} onLogout={handleLogout} activeView={view} />
      )}
      
      <main className="flex-1 overflow-y-auto relative pb-24 md:pb-12">
        <Header user={authState.user} onLogin={() => setView('login')} onNavigate={setView} onLogout={handleLogout} />
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          {renderView()}
        </div>
        
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 opacity-20 hover:opacity-100 transition-all">
          <button 
            onClick={() => setView('debug')}
            className="text-[10px] font-bold text-stone-400 hover:text-[#D14D72] uppercase tracking-[0.2em]"
          >
            Modo Depuração / Inspecionar Usuários
          </button>
        </div>

        <GeminiAssistant />
      </main>
    </div>
  );
};

export default App;
