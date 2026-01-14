
import React, { useState } from 'react';
import { sendPasswordResetEmail } from '../services/emailService';

interface ForgotPasswordProps {
  onBack: () => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onBack }) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await sendPasswordResetEmail(email);
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Não foi possível enviar o e-mail de recuperação.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-10 rounded-[2.5rem] shadow-xl shadow-rose-50 border border-rose-50 animate-fadeIn">
      <div className="text-center mb-10">
        <div className="w-16 h-16 bg-rose-50 text-[#D14D72] rounded-3xl flex items-center justify-center text-2xl mx-auto mb-6">
          <i className="fas fa-key"></i>
        </div>
        <h2 className="text-3xl font-bold text-gray-800 brand-font">Recuperar Senha</h2>
        <p className="text-stone-500 mt-2">Informe seu e-mail para receber as instruções.</p>
      </div>

      {!submitted ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-stone-600 mb-2">Seu E-mail cadastrado</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-4 rounded-2xl border border-stone-100 bg-stone-50 text-gray-800 focus:ring-2 focus:ring-rose-200 outline-none transition-all"
              placeholder="exemplo@email.com"
            />
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-xs font-bold flex items-center gap-3 animate-fadeIn">
              <i className="fas fa-exclamation-circle text-lg"></i>
              {error}
            </div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-[#D14D72] text-white rounded-2xl font-bold hover:bg-[#b03d5d] transition-all shadow-lg shadow-rose-50 flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {loading ? (
              <i className="fas fa-circle-notch animate-spin"></i>
            ) : (
              'Enviar Instruções Reais'
            )}
          </button>
        </form>
      ) : (
        <div className="text-center space-y-6 animate-fadeIn">
          <div className="p-6 bg-green-50 text-green-700 rounded-[2rem] border border-green-100">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl">
              <i className="fas fa-paper-plane"></i>
            </div>
            <p className="font-bold text-lg mb-2">E-mail Enviado!</p>
            <p className="text-sm opacity-90">
              Enviamos um link de recuperação para: <br/>
              <strong className="block mt-1">{email}</strong>
            </p>
          </div>
          <div className="p-4 bg-stone-50 rounded-2xl text-xs text-stone-500 text-left leading-relaxed">
            <p className="font-bold mb-1"><i className="fas fa-info-circle mr-1"></i> Próximos passos:</p>
            <ul className="list-disc ml-4 space-y-1">
              <li>Verifique sua caixa de entrada e pasta de SPAM.</li>
              <li>O link expira em 24 horas por segurança.</li>
              <li>Siga as instruções no e-mail para criar uma nova senha.</li>
            </ul>
          </div>
        </div>
      )}

      <div className="mt-10 text-center">
        <button 
          onClick={onBack}
          className="text-stone-400 font-bold hover:text-[#D14D72] transition-colors flex items-center justify-center gap-2 mx-auto"
        >
          <i className="fas fa-arrow-left text-xs"></i>
          Voltar para o Login
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;
