
import { User, Booking } from '../types';
import { supabase } from './supabaseClient';

const USERS_LOCAL_KEY = 'kamiluz_users';
const BOOKINGS_LOCAL_KEY = 'kamiluz_local_bookings';
const CURRENT_USER_KEY = 'kamiluz_current_user';

export const isSupabaseConfigured = () => {
  try {
    const url = (process.env as any).SUPABASE_URL;
    const key = (process.env as any).SUPABASE_ANON_KEY;
    return !!url && !url.includes('placeholder') && !!key && key.length > 20;
  } catch (e) {
    return false;
  }
};

export const clearAllData = () => {
  localStorage.clear();
  console.log("[DEBUG] Todos os dados foram limpos.");
  window.location.reload();
};

export const getLocalUsers = (): User[] => {
  try {
    const stored = localStorage.getItem(USERS_LOCAL_KEY);
    let users = stored ? JSON.parse(stored) : [];
    
    // Injeção de usuário padrão se o banco estiver vazio (Para evitar erro de login)
    if (users.length === 0) {
      const defaultAdmin: User = {
        id: 'admin-001',
        name: 'Kamila Luz',
        email: 'admin@kamiluz.com',
        phone: '(41) 99283-4660',
        password: 'admin',
        role: 'admin',
        serviceHistory: []
      };
      users = [defaultAdmin];
      localStorage.setItem(USERS_LOCAL_KEY, JSON.stringify(users));
    }
    
    return users;
  } catch (e) {
    return [];
  }
};

export const verifyLogin = async (email: string): Promise<User | null> => {
  const cleanEmail = email.toLowerCase().trim();
  const users = getLocalUsers();
  const match = users.find(u => u.email.toLowerCase().trim() === cleanEmail);
  
  console.log(`[DEBUG] Buscando: ${cleanEmail} | Total no banco: ${users.length}`);
  return match || null;
};

export const saveUser = async (user: User) => {
  const normalizedUser = { 
    ...user, 
    email: user.email.toLowerCase().trim() 
  };
  
  const users = getLocalUsers();
  const index = users.findIndex(u => u.email === normalizedUser.email);
  
  if (index >= 0) {
    users[index] = { ...users[index], ...normalizedUser };
  } else {
    users.push(normalizedUser);
  }
  
  localStorage.setItem(USERS_LOCAL_KEY, JSON.stringify(users));
  console.log("[DEBUG] Usuário salvo:", normalizedUser.email);
};

export const getStoredBookings = async (): Promise<Booking[]> => {
  try {
    const stored = localStorage.getItem(BOOKINGS_LOCAL_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const saveBooking = async (booking: Booking) => {
  const bookings = await getStoredBookings();
  bookings.push(booking);
  localStorage.setItem(BOOKINGS_LOCAL_KEY, JSON.stringify(bookings));
};

export const updateBooking = async (booking: Booking) => {
  const bookings = await getStoredBookings();
  const index = bookings.findIndex(b => b.id === booking.id);
  if (index >= 0) {
    bookings[index] = booking;
    localStorage.setItem(BOOKINGS_LOCAL_KEY, JSON.stringify(bookings));
  }
};

export const isTimeSlotAvailable = async (date: string, time: string, duration: number, ignoreBookingId?: string): Promise<boolean> => {
  const dayBookings = await getStoredBookings();
  
  const timeToMinutes = (t: string) => {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
  };

  const requestedStart = timeToMinutes(time);
  const requestedEnd = requestedStart + duration;

  // Filtra agendamentos ativos no mesmo dia
  const activeBookings = dayBookings.filter(b => 
    b.date === date && 
    b.status !== 'cancelado' && 
    b.id !== ignoreBookingId
  );

  for (const b of activeBookings) {
    const existingStart = timeToMinutes(b.time);
    const existingEnd = timeToMinutes(b.endTime);

    // Lógica de colisão: se o intervalo solicitado sobrepõe um existente
    if (requestedStart < existingEnd && requestedEnd > existingStart) {
      return false;
    }
  }
  return true;
};

export const minutesToTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};

export const getStoredUsers = async (): Promise<User[]> => {
  return getLocalUsers();
};

export const isEmailRegistered = async (email: string): Promise<boolean> => {
  const user = await verifyLogin(email);
  return !!user;
};
