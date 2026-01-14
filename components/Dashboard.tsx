
import React, { useState, useEffect } from 'react';
import { User, Booking } from '../types';
import { getStoredBookings } from '../utils/storage';
import { SERVICES } from '../constants';

interface DashboardProps {
  user: User;
  onNewBooking: () => void;
  onReschedule: (booking: Booking) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onNewBooking, onReschedule }) => {
  const [myBookings, setMyBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      const all = await getStoredBookings();
      const filtered = all
        .filter(b => b.userId === user.id)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setMyBookings(filtered);
      setLoading(false);
    };
    fetchBookings();
  }, [user.id]);

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 brand-font">Olá, {user.name.split(' ')[0]}</h2>
          <p className="text-gray-500">Seus agendamentos no Espaço KamiLuz.</p>
        </div>
        <button onClick={onNewBooking} className="p-3 bg-rose-50 text-[#D14D72] rounded-2xl border border-rose-100 font-bold hover:bg-rose-100 transition-all">
          <i className="fas fa-plus mr-2"></i>Novo
        </button>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
          <i className="fas fa-history text-rose-300"></i>
          Histórico de Serviços
        </h3>
        
        <div className="space-y-4">
          {myBookings.length > 0 ? myBookings.map(booking => {
            const service = SERVICES.find(s => s.id === booking.serviceId);
            const isConfirmed = booking.status === 'pago';

            return (
              <div key={booking.id} className="p-4 bg-stone-50/50 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4 border border-transparent hover:border-rose-100 transition-all">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg ${isConfirmed ? 'bg-green-50 text-green-500' : 'bg-amber-50 text-amber-500'}`}>
                    <i className={`fas ${isConfirmed ? 'fa-check-circle' : 'fa-clock'}`}></i>
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">{service?.name}</p>
                    <p className="text-xs text-stone-400">
                      {new Date(booking.date + "T12:00:00").toLocaleDateString('pt-BR')} às {booking.time}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between w-full sm:w-auto sm:gap-6">
                  <div className="text-right">
                    <p className="font-bold text-rose-400">R$ {booking.totalPrice}</p>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold ${
                      isConfirmed ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                      {isConfirmed ? 'PAGO' : 'AGUARDANDO SINAL'}
                    </span>
                  </div>
                  
                  {isConfirmed && (
                    <button 
                      onClick={() => onReschedule(booking)}
                      className="px-3 py-1.5 bg-white border border-rose-100 text-rose-400 rounded-lg text-xs font-bold hover:bg-rose-50 transition-all"
                    >
                      <i className="fas fa-sync-alt mr-1"></i>Reagendar
                    </button>
                  )}
                </div>
              </div>
            );
          }) : (
            <div className="py-10 text-center text-stone-300 italic">Nenhum registro encontrado.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
