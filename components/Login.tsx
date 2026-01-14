
import React, { useState } from 'react';
import { verifyLogin } from '../utils/storage';
import { User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
  onGoToRegister: () => void;
  onForgotPassword: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onGoToRegister, onForgotPassword }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const cleanEmail = email.toLowerCase().trim();

    if (!cleanEmail || !password) {
      setError('Preencha todos os campos.');
      return;
    }

    setLoading(true);
    try {
      const user = await verifyLogin(cleanEmail);
      
      if (!user) {
        setError('E-mail não cadastrado neste dispositivo.');
      } else if (user.password !== password) {
        setError('Senha incorreta.');
      } else {
        console.log("[DEBUG] Login realizado com sucesso para:", cleanEmail);
        onLogin(user);
      }
    } catch (err) {
      setError('Erro ao processar login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-10 rounded-[2.5rem] shadow-xl shadow-rose-50 border border-rose-50 animate-fadeIn">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold text-[#1e293b] brand-font mb-2">Bem-vinda de volta</h2>
        <p className="text-stone-400 mt-2">Sua agenda de beleza a um clique.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        <div>
          <label className="block text-sm font-semibold text-stone-600 mb-2">E-mail</label>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-5 py-4 rounded-2xl border border-stone-100 bg-stone-50/50 text-gray-800 focus:ring-2 focus:ring-rose-200 outline-none transition-all"
            placeholder="Digite seu e-mail"
          />
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-semibold text-stone-600">Senha</label>
            <button type="button" onClick={onForgotPassword} className="text-xs font-bold text-rose-400">Esqueceu a senha?</button>
          </div>
          <div className="relative">
            <input 
              type={showPassword ? "text" : "password"} 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-4 rounded-2xl border border-stone-100 bg-stone-50/50 text-gray-800 focus:ring-2 focus:ring-rose-200 outline-none transition-all pr-12"
              placeholder="Sua senha"
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-stone-400">
              <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
            </button>
          </div>
        </div>

        {error && (
          <p className="text-[#f87171] text-sm font-medium text-center bg-red-50 py-2 rounded-xl border border-red-100 animate-fadeIn">
            <i className="fas fa-exclamation-triangle mr-2"></i>{error}
          </p>
        )}

        <button 
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-[#D14D72] text-white rounded-2xl font-bold hover:bg-[#b03d5d] transition-all flex items-center justify-center gap-2"
        >
          {loading ? <i className="fas fa-circle-notch animate-spin"></i> : 'Acessar Minha Conta'}
        </button>
      </form>

      <div className="mt-10 text-center">
        <p className="text-stone-400 text-sm">Ainda não tem conta?</p>
        <button onClick={onGoToRegister} className="text-[#D14D72] font-bold hover:underline">Cadastre-se gratuitamente</button>
      </div>
    </div>
  );
};

export default Login;
