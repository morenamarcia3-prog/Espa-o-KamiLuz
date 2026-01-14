
import React, { useState, useEffect } from 'react';
import { getLocalUsers, clearAllData } from '../utils/storage';
import { User } from '../types';

const DebugUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    setUsers(getLocalUsers());
  }, []);

  const handleCopyJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(users, null, 2));
    alert("JSON copiado para a área de transferência!");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-[2rem] shadow-xl border border-gray-100 animate-fadeIn">
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-50">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 brand-font">Depurador de Dados</h2>
          <p className="text-sm text-gray-400">Verifique os usuários salvos no navegador (kamiluz_users)</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleCopyJSON} className="px-4 py-2 bg-stone-100 text-stone-600 rounded-xl font-bold text-xs hover:bg-stone-200 transition-all">
            <i className="fas fa-copy mr-2"></i>COPIAR JSON
          </button>
          <button onClick={() => { if(confirm("Deseja apagar TUDO?")) clearAllData(); }} className="px-4 py-2 bg-red-50 text-red-500 rounded-xl font-bold text-xs hover:bg-red-100 transition-all">
            <i className="fas fa-trash-alt mr-2"></i>LIMPAR TUDO
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="py-4 font-bold text-gray-500 uppercase tracking-widest text-[10px]">Nome</th>
              <th className="py-4 font-bold text-gray-500 uppercase tracking-widest text-[10px]">E-mail</th>
              <th className="py-4 font-bold text-gray-500 uppercase tracking-widest text-[10px]">Senha</th>
              <th className="py-4 font-bold text-gray-500 uppercase tracking-widest text-[10px]">Telefone</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {users.length > 0 ? users.map((u, i) => (
              <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                <td className="py-4 font-bold text-gray-700">{u.name}</td>
                <td className="py-4 text-gray-500">{u.email}</td>
                <td className="py-4 font-mono text-rose-400 text-xs">{u.password || '---'}</td>
                <td className="py-4 text-gray-500">{u.phone}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan={4} className="py-20 text-center text-gray-300 italic">Nenhum usuário cadastrado localmente.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-8 p-4 bg-stone-50 rounded-2xl">
        <h4 className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">Dica de Debug:</h4>
        <p className="text-xs text-gray-500 leading-relaxed">
          Se o login falhar mesmo com o usuário aparecendo acima, certifique-se de que não há espaços extras no e-mail ou na senha durante o login.
          O sistema normaliza e-mails para minúsculo automaticamente.
        </p>
      </div>
    </div>
  );
};

export default DebugUsers;
