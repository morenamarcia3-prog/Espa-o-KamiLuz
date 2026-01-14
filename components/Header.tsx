
import React from 'react';
import { User } from '../types';

interface HeaderProps {
  user: User | null;
  onLogin: () => void;
  onNavigate: (view: any) => void;
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogin, onNavigate, onLogout }) => {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-rose-50 py-4 px-6 md:px-12 flex justify-between items-center sticky top-0 z-40">
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('landing')}>
        <div className="w-10 h-10 bg-[#D14D72] rounded-full flex items-center justify-center shadow-inner">
          <i className="fas fa-sparkles text-white"></i>
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tighter text-gray-800 brand-font leading-tight">
            Espaço KamiLuz
          </h1>
          <p className="text-[10px] uppercase tracking-widest text-stone-400 font-semibold">Nail Studio</p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        {user ? (
          <div className="flex items-center gap-3">
            <div className="text-right flex flex-col items-end">
              <span className="text-sm font-bold text-gray-800 leading-tight">{user.name}</span>
              <span className="text-[10px] text-stone-400 font-bold uppercase tracking-tighter mb-1">
                {user.role === 'admin' ? 'Administradora' : 'Cliente'}
              </span>
              <button 
                onClick={onLogout}
                className="text-[10px] font-bold text-rose-400 hover:text-rose-600 transition-colors py-0.5 px-2 bg-rose-50 rounded-md border border-rose-100/50"
              >
                <i className="fas fa-sign-out-alt mr-1 text-[8px]"></i>SAIR
              </button>
            </div>
            <img 
              src={`https://ui-avatars.com/api/?name=${user.name}&background=fff1f2&color=D14D72`} 
              className="w-10 h-10 rounded-full border-2 border-rose-100 shadow-sm" 
              alt="Avatar" 
            />
          </div>
        ) : (
          <button 
            onClick={onLogin}
            className="px-6 py-2.5 bg-[#D14D72] text-white rounded-xl font-bold hover:bg-[#b03d5d] transition-all shadow-md shadow-rose-100"
          >
            Entrar
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
