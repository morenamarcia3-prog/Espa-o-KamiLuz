
import React, { useState } from 'react';
import { saveUser, verifyLogin } from '../utils/storage';
import { User } from '../types';

interface RegisterProps {
  onRegister: (user: User) => void;
  onGoToLogin: () => void;
}

const Register: React.FC<RegisterProps> = ({ onRegister, onGoToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!formData.name || !formData.email || !formData.password) {
      setError('Preencha os campos obrigatórios.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    setLoading(true);
    try {
      const existing = await verifyLogin(formData.email);
      if (existing) {
        setError('Este e-mail já está em uso neste dispositivo.');
        setLoading(false);
        return;
      }

      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        name: formData.name.trim(),
        email: formData.email.toLowerCase().trim(),
        phone: formData.phone.trim(),
        password: formData.password, // CRÍTICO: Salvando a senha no objeto
        role: 'client',
        serviceHistory: [],
      };

      await saveUser(newUser);
      onRegister(newUser);
    } catch (err) {
      setError('Erro ao criar conta.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-[2.5rem] shadow-xl shadow-rose-50 border border-rose-50 animate-fadeIn">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 brand-font">Criar Novo Perfil</h2>
        <p className="text-gray-500 mt-2 text-sm">Entre para o time de unhas perfeitas.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input 
          placeholder="Seu Nome"
          className="w-full px-4 py-3 rounded-2xl border border-gray-100 bg-stone-50 outline-none focus:ring-2 focus:ring-rose-200"
          value={formData.name}
          onChange={e => setFormData({...formData, name: e.target.value})}
        />
        <input 
          placeholder="Seu E-mail"
          type="email"
          className="w-full px-4 py-3 rounded-2xl border border-gray-100 bg-stone-50 outline-none focus:ring-2 focus:ring-rose-200"
          value={formData.email}
          onChange={e => setFormData({...formData, email: e.target.value})}
        />
        <input 
          placeholder="Telefone"
          className="w-full px-4 py-3 rounded-2xl border border-gray-100 bg-stone-50 outline-none focus:ring-2 focus:ring-rose-200"
          value={formData.phone}
          onChange={e => setFormData({...formData, phone: e.target.value})}
        />
        <input 
          placeholder="Senha"
          type="password"
          className="w-full px-4 py-3 rounded-2xl border border-gray-100 bg-stone-50 outline-none focus:ring-2 focus:ring-rose-200"
          value={formData.password}
          onChange={e => setFormData({...formData, password: e.target.value})}
        />
        <input 
          placeholder="Confirmar Senha"
          type="password"
          className="w-full px-4 py-3 rounded-2xl border border-gray-100 bg-stone-50 outline-none focus:ring-2 focus:ring-rose-200"
          value={formData.confirmPassword}
          onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
        />

        {error && <p className="text-red-500 text-xs font-bold text-center">{error}</p>}

        <button 
          disabled={loading}
          className="w-full py-4 bg-[#D14D72] text-white rounded-2xl font-bold hover:bg-[#b03d5d] transition-all mt-4"
        >
          {loading ? 'Processando...' : 'Finalizar Cadastro'}
        </button>
      </form>

      <button onClick={onGoToLogin} className="w-full text-center text-rose-400 font-bold mt-6 text-sm">Já tenho login</button>
    </div>
  );
};

export default Register;
