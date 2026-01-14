
import React, { useState, useEffect } from 'react';
import { User, Service, Booking } from '../types';
import { SERVICES, DEPOSIT_PERCENTAGE, WORKING_HOURS, BANK_DETAILS } from '../constants';
import { isTimeSlotAvailable, minutesToTime, saveBooking, updateBooking } from '../utils/storage';
import { sendBookingNotification } from '../services/whatsappService';

interface BookingFlowProps {
  user: User;
  onBack: () => void;
  rescheduleBooking?: Booking | null;
}

const BookingFlow: React.FC<BookingFlowProps> = ({ user, onBack, rescheduleBooking }) => {
  const [step, setStep] = useState(rescheduleBooking ? 2 : 1);
  const [selectedService, setSelectedService] = useState<Service | null>(
    rescheduleBooking ? SERVICES.find(s => s.id === rescheduleBooking.serviceId) || null : null
  );
  const [selectedDate, setSelectedDate] = useState(rescheduleBooking?.date || '');
  const [selectedTime, setSelectedTime] = useState(rescheduleBooking?.time || '');
  const [availableSlots, setAvailableSlots] = useState<{time: string, available: boolean}[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card'>('pix');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isNotifying, setIsNotifying] = useState(false);
  const [notificationSent, setNotificationSent] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [lastCreatedBooking, setLastCreatedBooking] = useState<Booking | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (selectedDate && selectedService) {
      loadTimeSlots();
    }
  }, [selectedDate, selectedService]);

  const loadTimeSlots = async () => {
    if (!selectedService || !selectedDate) return;
    setLoadingSlots(true);
    const slots = [];
    const ignoreId = rescheduleBooking?.id;
    for (let h = WORKING_HOURS.start; h <= WORKING_HOURS.end; h++) {
      for (let m of [0, 30]) {
        const time = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
        // Só adiciona se o serviço couber no tempo restante do dia
        const [hour, min] = time.split(':').map(Number);
        if ((hour * 60 + min) + selectedService.duration <= WORKING_HOURS.end * 60) {
          const available = await isTimeSlotAvailable(selectedDate, time, selectedService.duration, ignoreId);
          slots.push({ time, available });
        }
      }
    }
    setAvailableSlots(slots);
    setLoadingSlots(false);
  };

  const handleCopyPix = () => {
    navigator.clipboard.writeText(BANK_DETAILS.cpf);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFinish = async () => {
    if (!selectedService || !selectedDate || !selectedTime || !acceptedTerms) return;
    
    setIsProcessing(true);
    try {
      const [h, m] = selectedTime.split(':').map(Number);
      const endMinutes = (h * 60 + m) + selectedService.duration;
      const endTime = minutesToTime(endMinutes);

      let bookingToSave: Booking;

      if (rescheduleBooking) {
        bookingToSave = {
          ...rescheduleBooking,
          serviceId: selectedService.id,
          date: selectedDate,
          time: selectedTime,
          endTime: endTime,
          status: 'pendente', // Volta a ser pendente se reagendar
        };
        await updateBooking(bookingToSave);
      } else {
        bookingToSave = {
          id: Math.random().toString(36).substr(2, 9),
          userId: user.id,
          serviceId: selectedService.id,
          date: selectedDate,
          time: selectedTime,
          endTime: endTime,
          status: 'pendente', // Inicialmente pendente até confirmação do sinal
          depositPaid: selectedService.price * DEPOSIT_PERCENTAGE,
          totalPrice: selectedService.price,
        };
        await saveBooking(bookingToSave);
      }
      setLastCreatedBooking(bookingToSave);
      setIsCompleted(true);
    } catch (e) {
      alert('Erro ao salvar agendamento.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleWhatsAppAction = async () => {
    if (!lastCreatedBooking || !selectedService) return;
    setIsNotifying(true);
    try {
      await sendBookingNotification(lastCreatedBooking, user, selectedService);
      setNotificationSent(true);
    } catch (error) {
      console.error("Erro ao disparar notificação WhatsApp", error);
    } finally {
      setIsNotifying(false);
    }
  };

  if (isCompleted) {
    return (
      <div className="max-w-xl mx-auto text-center space-y-8 animate-fadeIn py-12">
        <div className="w-24 h-24 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto text-4xl shadow-md shadow-amber-50">
          <i className="fas fa-clock"></i>
        </div>
        <div className="space-y-4">
          <h2 className="text-4xl font-bold text-gray-800 brand-font">
            {rescheduleBooking ? 'Reagendamento Solicitado!' : 'Quase lá!'}
          </h2>
          <p className="text-gray-500 text-lg">
            Seu horário foi reservado. O agendamento será <strong>Confirmado</strong> assim que validarmos o recebimento do seu sinal via conta vinculada.
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-3xl border border-rose-100 shadow-sm text-left">
          <p className="text-xs uppercase tracking-widest font-bold text-rose-400 mb-4">Aguardando Confirmação</p>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-500">Serviço:</span>
              <span className="font-bold text-gray-800 text-right">{selectedService?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Data e Hora:</span>
              <span className="font-bold text-gray-800">{new Date(selectedDate + "Z").toLocaleDateString("pt-BR", {day: "2-digit", month: "2-digit", year: "numeric", timeZone: "UTC"})} às {selectedTime}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-stone-50">
              <span className="text-gray-500 font-semibold">Valor do Sinal:</span>
              <span className="font-bold text-rose-500">R$ {lastCreatedBooking?.depositPaid.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <button 
            onClick={handleWhatsAppAction}
            disabled={isNotifying}
            className={`w-full py-4 rounded-2xl font-bold shadow-lg flex items-center justify-center gap-3 transition-all hover:scale-[1.02] ${
              notificationSent ? 'bg-stone-100 text-stone-500' : 'bg-[#25D366] text-white shadow-green-100'
            }`}
          >
            {isNotifying ? (
              <i className="fas fa-circle-notch animate-spin text-2xl"></i>
            ) : (
              <>
                <i className="fab fa-whatsapp text-2xl"></i>
                {notificationSent ? 'Comprovante já notificado' : 'Enviar Comprovante via WhatsApp'}
              </>
            )}
          </button>
          
          <button 
            onClick={onBack}
            className="w-full py-4 bg-white text-rose-400 border border-rose-100 rounded-2xl font-bold transition-all hover:bg-rose-50"
          >
            Voltar ao Meu Painel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto pb-12">
      <div className="flex justify-between items-center mb-12">
        {[1, 2, 3].map(s => (
          <div key={s} className="flex flex-col items-center gap-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
              step >= s ? 'bg-[#D14D72] text-white shadow-md shadow-rose-50' : 'bg-stone-100 text-stone-400'
            }`}>
              {s}
            </div>
            <span className={`text-xs font-semibold ${step >= s ? 'text-rose-900' : 'text-stone-400'}`}>
              {s === 1 ? 'Serviço' : s === 2 ? 'Data e Hora' : 'Sinal de Garantia'}
            </span>
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-6 animate-fadeIn">
          <h2 className="text-2xl font-bold text-gray-800 brand-font mb-4">Selecione seu Serviço</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {SERVICES.map(s => (
              <button 
                key={s.id}
                onClick={() => { setSelectedService(s); setStep(2); }}
                className={`p-6 rounded-3xl text-left transition-all border-2 ${
                  selectedService?.id === s.id ? 'border-rose-300 bg-rose-50' : 'border-gray-100 bg-white hover:border-rose-200'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-stone-50 rounded-2xl flex items-center justify-center text-rose-300 shadow-sm">
                    <i className={`fas ${s.name.includes('Fibra') ? 'fa-magic' : 'fa-tint'}`}></i>
                  </div>
                  <p className="text-xl font-bold text-rose-400">R$ {s.price}</p>
                </div>
                <h3 className="font-bold text-lg text-gray-800 mb-1">{s.name}</h3>
                <p className="text-sm text-gray-500 line-clamp-2">{s.description}</p>
                <div className="mt-4 flex items-center gap-2 text-xs font-bold text-stone-400 uppercase tracking-wider">
                  <i className="fas fa-clock"></i>
                  {s.duration / 60} {s.duration / 60 === 1 ? 'Hora' : 'Horas'}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-8 animate-fadeIn">
          <button onClick={() => setStep(1)} className="text-[#D14D72] font-bold flex items-center gap-2 mb-4 hover:underline">
            <i className="fas fa-arrow-left"></i> Voltar para serviços
          </button>
          
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Selecione um dia</label>
              <input 
                type="date" 
                min={new Date().toISOString().split('T')[0]}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-stone-50 text-gray-800 focus:ring-2 focus:ring-rose-200 outline-none"
              />
            </div>

            {selectedDate && (
              <div className="space-y-4">
                <label className="block text-sm font-bold text-gray-700">Horários Disponíveis (Respeitando tempo do serviço)</label>
                {loadingSlots ? (
                  <div className="flex justify-center py-4"><i className="fas fa-circle-notch animate-spin text-[#D14D72]"></i></div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                    {availableSlots.map(slot => (
                      <button
                        key={slot.time}
                        disabled={!slot.available}
                        onClick={() => setSelectedTime(slot.time)}
                        className={`py-3 rounded-xl text-sm font-bold transition-all border ${
                          !slot.available 
                            ? 'bg-stone-50 text-stone-300 cursor-not-allowed border-stone-50' 
                            : selectedTime === slot.time
                              ? 'bg-[#D14D72] text-white border-[#D14D72] shadow-md shadow-rose-50'
                              : 'bg-white text-gray-600 border-gray-100 hover:border-rose-200'
                        }`}
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <button 
            disabled={!selectedTime}
            onClick={() => setStep(3)}
            className="w-full py-4 bg-[#D14D72] text-white rounded-2xl font-bold shadow-md shadow-rose-50 disabled:opacity-50 transition-all hover:bg-[#b03d5d]"
          >
            Revisar e Pagar Sinal
          </button>
        </div>
      )}

      {step === 3 && selectedService && (
        <div className="space-y-8 animate-fadeIn">
          <button onClick={() => setStep(2)} className="text-[#D14D72] font-bold flex items-center gap-2 mb-4 hover:underline">
            <i className="fas fa-arrow-left"></i> Voltar para o calendário
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">Resumo da Reserva</h3>
                <div className="space-y-3 pb-4 border-b border-stone-50 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Serviço</span>
                    <span className="font-semibold text-gray-800">{selectedService.name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Data</span>
                    <span className="font-semibold text-gray-800">{new Date(selectedDate + "Z").toLocaleDateString("pt-BR", {day: "2-digit", month: "2-digit", year: "numeric", timeZone: "UTC"})}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Hora</span>
                    <span className="font-semibold text-gray-800">{selectedTime}</span>
                  </div>
                </div>
                {!rescheduleBooking && (
                  <div className="space-y-2">
                    <div className="flex justify-between font-bold text-gray-900">
                      <span>Total do Serviço</span>
                      <span>R$ {selectedService.price}</span>
                    </div>
                    <div className="flex flex-col gap-1 p-3 bg-rose-50 rounded-2xl text-center border border-rose-100">
                      <span className="text-[10px] uppercase font-bold text-rose-400">Pagar agora (30% via Pix)</span>
                      <span className="text-xl font-bold text-[#D14D72]">R$ {(selectedService.price * DEPOSIT_PERCENTAGE).toFixed(2)}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <h3 className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-widest">Termos de Atendimento</h3>
                <div className="h-32 overflow-y-auto p-4 bg-stone-50 rounded-2xl text-[10px] leading-relaxed text-gray-600 space-y-2 border border-stone-100 mb-4">
                  <p>• O sinal é obrigatório para bloqueio e confirmação definitiva do horário.</p>
                  <p>• Sem o sinal, o horário pode ser liberado para outras clientes em 1 hora.</p>
                  <p>• Reagendamentos permitidos com até 24h de antecedência para manter o valor do sinal.</p>
                </div>
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="mt-1 w-5 h-5 rounded border-gray-300 text-[#D14D72] focus:ring-[#D14D72]"
                  />
                  <span className="text-xs font-semibold text-gray-600">
                    Estou ciente que o agendamento só será <strong>Confirmado</strong> após o pagamento do sinal via Pix Neon.
                  </span>
                </label>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6 h-fit">
              <h3 className="text-lg font-bold text-gray-800">Pagamento Via Pix Neon</h3>
              
              <div className="p-4 bg-stone-50 rounded-2xl border border-dashed border-rose-200 space-y-3 animate-fadeIn">
                 <p className="text-[10px] font-bold text-rose-400 uppercase tracking-widest text-center">Conta Vinculada para Depósito</p>
                 <div className="text-xs space-y-1 text-gray-600">
                   <p><strong>Nome:</strong> {BANK_DETAILS.owner}</p>
                   <p><strong>Banco:</strong> {BANK_DETAILS.bank}</p>
                   <p><strong>Ag:</strong> {BANK_DETAILS.agency} | <strong>Conta:</strong> {BANK_DETAILS.account}</p>
                 </div>
                 
                 <div className="pt-2 border-t border-rose-100">
                   <p className="text-[10px] font-bold text-stone-400 mb-1">CHAVE PIX (CPF)</p>
                   <div className="flex items-center gap-2">
                     <code className="flex-1 bg-white p-2 rounded-lg border border-stone-100 text-sm font-bold text-gray-700">{BANK_DETAILS.cpf}</code>
                     <button 
                      onClick={handleCopyPix}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${copied ? 'bg-green-500 text-white' : 'bg-rose-100 text-[#D14D72]'}`}
                     >
                       <i className={`fas ${copied ? 'fa-check' : 'fa-copy'}`}></i>
                     </button>
                   </div>
                   {copied && <p className="text-[10px] text-green-500 font-bold mt-1 animate-fadeIn">Copiado para o seu banco!</p>}
                 </div>
              </div>

              <button 
                onClick={handleFinish}
                disabled={isProcessing || !acceptedTerms}
                className="w-full py-4 bg-[#D14D72] text-white rounded-2xl font-bold shadow-md shadow-rose-100 flex items-center justify-center gap-2 disabled:opacity-50 transition-all hover:bg-[#b03d5d]"
              >
                {isProcessing ? (
                  <i className="fas fa-circle-notch animate-spin"></i>
                ) : (
                  `Solicitar Agendamento`
                )}
              </button>
              <p className="text-[10px] text-gray-400 text-center">Após confirmar, seu horário será pré-reservado aguardando o sinal.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingFlow;
