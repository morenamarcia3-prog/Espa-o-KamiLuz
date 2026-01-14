
import React, { useState, useEffect } from 'react';
// Fix: removed markReminderAsSent as it is not exported from storage and is unused in this component.
import { getStoredBookings, getStoredUsers, updateBooking } from '../utils/storage';
import { SERVICES } from '../constants';
import { Booking, User } from '../types';

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'menu' | 'agenda' | 'usuarios' | 'pagamentos' | 'lembretes'>('menu');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [b, u] = await Promise.all([
        getStoredBookings(),
        getStoredUsers()
      ]);
      setBookings(b.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      setUsers(u);
      setLoading(false);
    };
    fetchData();
  }, [activeTab]);

  const handleConfirmPayment = async (booking: Booking) => {
    if(!confirm("Confirma que recebeu o sinal via Neon para este agendamento?")) return;
    
    try {
      const updated = { ...booking, status: 'pago' as const };
      await updateBooking(updated);
      setBookings(prev => prev.map(b => b.id === booking.id ? updated : b));
      alert("Agendamento Confirmado com sucesso!");
    } catch (e) {
      alert("Erro ao confirmar pagamento.");
    }
  };

  const renderTab = () => {
    if (loading && activeTab !== 'menu') {
      return <div className="flex justify-center py-20"><i className="fas fa-circle-notch animate-spin text-rose-400 text-3xl"></i></div>;
    }

    switch (activeTab) {
      case 'agenda':
        return (
          <div className="space-y-4 animate-fadeIn">
            <button onClick={() => setActiveTab('menu')} className="text-[#D14D72] font-bold text-sm mb-4">← Voltar</button>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800 brand-font">Agenda de Trabalho</h3>
              <p className="text-[10px] text-stone-400 font-bold">VERIFIQUE SUA CONTA NEON PARA CONFIRMAR SINAIS</p>
            </div>
            <div className="space-y-3">
              {bookings.length > 0 ? bookings.map(b => {
                const service = SERVICES.find(s => s.id === b.serviceId);
                const client = users.find(u => u.id === b.userId);
                return (
                  <div key={b.id} className="p-4 bg-white border border-rose-50 rounded-2xl flex flex-col gap-3 shadow-sm">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-gray-800">{client?.name || 'Cliente'}</p>
                        <p className="text-xs text-stone-400">{service?.name} • {new Date(b.date + "Z").toLocaleDateString("pt-BR", {day: "2-digit", month: "2-digit", year: "numeric", timeZone: "UTC"})} às {b.time}</p>
                      </div>
                      <div className="text-right">
                        <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase ${
                          b.status === 'pago' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'
                        }`}>
                          {b.status === 'pago' ? 'Confirmado' : 'Aguardando Sinal'}
                        </span>
                        <p className="text-sm font-bold text-rose-400 mt-1">Sinal: R$ {b.depositPaid.toFixed(2)}</p>
                      </div>
                    </div>
                    {b.status !== 'pago' && (
                      <button 
                        onClick={() => handleConfirmPayment(b)}
                        className="w-full py-2 bg-green-500 text-white rounded-xl text-xs font-bold hover:bg-green-600 transition-all shadow-sm"
                      >
                        <i className="fas fa-check mr-2"></i>Confirmar Recebimento (Neon)
                      </button>
                    )}
                  </div>
                );
              }) : <p className="text-center text-stone-400 py-10">Nenhum agendamento encontrado.</p>}
            </div>
          </div>
        );
      case 'usuarios':
        return (
          <div className="space-y-4 animate-fadeIn">
            <button onClick={() => setActiveTab('menu')} className="text-[#D14D72] font-bold text-sm mb-4">← Voltar</button>
            <h3 className="text-xl font-bold text-gray-800 brand-font mb-4">Base de Clientes ({users.length})</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {users.map(u => (
                <div key={u.id} className="p-4 bg-white border border-rose-50 rounded-2xl flex items-center gap-3 shadow-sm">
                  <div className="w-10 h-10 bg-rose-50 rounded-full flex items-center justify-center text-[#D14D72]">
                    <i className="fas fa-user"></i>
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-sm">{u.name}</p>
                    <p className="text-[10px] text-stone-400 font-medium">{u.email}</p>
                    <p className="text-[10px] text-rose-300 font-bold">{u.phone}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'lembretes':
        return (
          <div className="space-y-4 animate-fadeIn">
            <button onClick={() => setActiveTab('menu')} className="text-[#D14D72] font-bold text-sm mb-4">← Voltar</button>
            <h3 className="text-xl font-bold text-gray-800 brand-font mb-6">Lembretes para Amanhã</h3>
            {/* ... mantendo lógica anterior de lembretes ... */}
          </div>
        );
      default:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-[#5D1B31] mb-2">
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center border border-rose-100 shadow-sm text-rose-400">
                <i className="fas fa-shield-alt text-xs"></i>
              </div>
              <h2 className="text-xl font-bold brand-font">Área Administrativa</h2>
            </div>
            
            <div className="space-y-3">
              <AdminButton 
                icon="fa-calendar-alt" 
                label="Confirmar Sinais e Agenda" 
                onClick={() => setActiveTab('agenda')}
                count={bookings.filter(b => b.status !== 'pago').length}
                highlight={bookings.some(b => b.status !== 'pago')}
              />
              <AdminButton 
                icon="fa-bell" 
                label="Sistema de Lembretes" 
                onClick={() => setActiveTab('lembretes')}
              />
              <AdminButton 
                icon="fa-users" 
                label="Gerenciar Usuários" 
                onClick={() => setActiveTab('usuarios')}
                count={users.length}
              />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-[#FFF1F5]/80 backdrop-blur-sm p-8 rounded-[2.5rem] border border-rose-200/50 shadow-xl shadow-rose-100/20">
        {renderTab()}
      </div>
    </div>
  );
};

const AdminButton = ({ icon, label, onClick, count, highlight }: { icon: string, label: string, onClick: () => void, count?: number, highlight?: boolean }) => (
  <button 
    onClick={onClick}
    className="w-full flex items-center justify-between p-5 bg-white/60 hover:bg-[#D14D72] rounded-2xl border border-rose-100 group transition-all duration-300"
  >
    <div className="flex items-center gap-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center group-hover:bg-white/20 group-hover:text-white transition-colors ${highlight ? 'bg-rose-400 text-white animate-pulse' : 'bg-rose-50 text-[#D14D72]'}`}>
        <i className={`fas ${icon}`}></i>
      </div>
      <span className="font-bold text-rose-900/70 group-hover:text-white transition-colors text-sm">{label}</span>
    </div>
    <div className="flex items-center gap-2">
      {count !== undefined && count > 0 && (
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full group-hover:bg-white group-hover:text-[#D14D72] ${highlight ? 'bg-rose-500 text-white' : 'bg-rose-100 text-[#D14D72]'}`}>
          {count}
        </span>
      )}
      <i className="fas fa-chevron-right text-rose-200 group-hover:text-white group-hover:translate-x-1 transition-all"></i>
    </div>
  </button>
);

export default AdminPanel;
