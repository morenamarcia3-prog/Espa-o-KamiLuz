
import { supabase } from '../utils/supabaseClient';
import { isEmailRegistered } from '../utils/storage';

/**
 * Serviço responsável por gerenciar solicitações de recuperação de senha.
 * Utiliza o Supabase Auth para envio de e-mails reais.
 */
export const sendPasswordResetEmail = async (email: string) => {
  const cleanEmail = email.toLowerCase().trim();

  // 1. Validação prévia na nossa base de dados
  const exists = await isEmailRegistered(cleanEmail);
  if (!exists) {
    throw new Error('Este e-mail não consta em nossa base de clientes. Verifique se digitou corretamente.');
  }

  try {
    // 2. Solicitação ao Supabase Auth para envio do e-mail de recuperação
    // O Supabase gerencia o token, a expiração e o template do e-mail.
    // O redirectTo define para onde a usuária será levada ao clicar no link do e-mail.
    const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
      redirectTo: `${window.location.origin}/?view=reset-password`,
    });

    if (error) {
      throw error;
    }

    // 3. Registro de auditoria local conforme solicitado
    const recoveryLog = {
      email: cleanEmail,
      timestamp: new Date().toISOString(),
      status: 'sent_via_supabase',
      // Token interno para debug (o real é gerenciado pelo Supabase)
      debugToken: Math.random().toString(36).substring(2, 15)
    };
    localStorage.setItem('kamiluz_last_reset_request', JSON.stringify(recoveryLog));

    console.log("[Debug] Solicitação de recuperação registrada localmente:", recoveryLog);
    
    return { success: true };
  } catch (error: any) {
    console.error("Erro no serviço de e-mail:", error);
    throw new Error(error.message || 'Falha ao processar recuperação de senha via servidor.');
  }
};
