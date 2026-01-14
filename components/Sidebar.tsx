
import React from 'react';
import { User } from '../types';

interface SidebarProps {
  user: User;
  onNavigate: (view: any) => void;
  onLogout: () => void;
  activeView: string;
}

const Sidebar: React.FC<SidebarProps> = ({ user, onNavigate, onLogout, activeView }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Meu Espaço', icon: 'fa-home', show: user.role !== 'admin' },
    { id: 'admin', label: 'Painel Admin', icon: 'fa-shield-halved', show: user.role === 'admin' },
    { id: 'booking', label: 'Agendar Horário', icon: 'fa-calendar-plus', show: true },
  ];

  return (
    <>
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-100 min-h-screen">
        <div className="p-8 border-b border-gray-50">
          <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-6">Menu</p>
          <nav className="space-y-2">
            {menuItems.filter(i => i.show).map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id as any)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeView === item.id 
                    ? 'bg-rose-50 text-rose-500 font-semibold' 
                    : 'text-stone-500 hover:bg-stone-50'
                }`}
              >
                <i className={`fas ${item.icon} w-5`}></i>
                {item.label}
              </button>
            ))}
          </nav>
        </div>
        
        <div className="mt-auto p-8">
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-stone-400 hover:bg-rose-50 hover:text-rose-400 transition-all"
          >
            <i className="fas fa-sign-out-alt w-5"></i>
            Sair
          </button>
        </div>
      </aside>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex justify-around items-center p-3 z-50 shadow-lg">
        {menuItems.filter(i => i.show).map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id as any)}
            className={`flex flex-col items-center gap-1 ${
              activeView === item.id ? 'text-rose-400' : 'text-stone-400'
            }`}
          >
            <i className={`fas ${item.icon} text-xl`}></i>
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        ))}
        <button
          onClick={onLogout}
          className="flex flex-col items-center gap-1 text-stone-400"
        >
          <i className="fas fa-sign-out-alt text-xl"></i>
          <span className="text-[10px] font-medium">Sair</span>
        </button>
      </nav>
    </>
  );
};

export default Sidebar;
