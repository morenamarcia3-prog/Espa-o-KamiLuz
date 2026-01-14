
import { Booking, User, Service } from '../types';

const RECIPIENT_NUMBER = '554199283460'; // (41) 9928-3460 formatado para Internacional

export const sendBookingNotification = async (booking: Booking, user: User, service: Service) => {
  // Garantimos que a data seja lida em UTC para evitar o erro de fuso horário (-1 dia)
  const dateFormatted = new Date(booking.date + "T12:00:00Z").toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'UTC'
  });

  const message = `*NOVO AGENDAMENTO - ESPAÇO KAMILUZ* 💅✨\n\n` +
                  `👤 *Cliente:* ${user.name}\n` +
                  `📞 *WhatsApp:* ${user.phone}\n` +
                  `💅 *Serviço:* ${service.name}\n` +
                  `📅 *Data:* ${dateFormatted}\n` +
                  `⏰ *Horário:* ${booking.time}\n\n` +
                  `_Mensagem gerada automaticamente pelo sistema._`;

  const whatsappToken = (process.env as any).WHATSAPP_TOKEN;
  const phoneId = (process.env as any).WHATSAPP_PHONE_ID;

  // Se houver configuração de API Cloud, tentamos o envio direto (Silent)
  if (whatsappToken && phoneId && phoneId !== 'placeholder') {
    try {
      const response = await fetch(`https://graph.facebook.com/v17.0/${phoneId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${whatsappToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: RECIPIENT_NUMBER,
          type: "text",
          text: { body: message }
        })
      });

      if (response.ok) return { success: true, method: 'api' };
    } catch (error) {
      console.error("Erro ao enviar via API WhatsApp:", error);
    }
  }

  // Fallback para Link Direto (Click-to-Chat)
  // Usamos encodeURIComponent para garantir que emojis e quebras de linha não virem caracteres estranhos
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${RECIPIENT_NUMBER}?text=${encodedMessage}`;
  window.open(whatsappUrl, '_blank');
  
  return { success: true, method: 'link' };
};
