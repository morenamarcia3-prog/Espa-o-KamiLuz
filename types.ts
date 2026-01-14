
export enum ServiceType {
  FIBER_PLACEMENT = 'Colocação de Fibra',
  FIBER_MAINTENANCE = 'Manutenção de Fibra',
  GEL_NATURAL = 'Gel na Unha Natural',
  SEMI_PERMANENT = 'Esmaltação Semipermanente',
  REMOVAL = 'Retirada de Serviço'
}

export interface Service {
  id: string;
  name: ServiceType;
  duration: number; // em minutos
  price: number;
  description: string;
}

export interface Booking {
  id: string;
  userId: string;
  serviceId: string;
  date: string; // ISO string
  time: string; // "HH:mm"
  endTime: string; // "HH:mm"
  status: 'pendente' | 'pago' | 'concluído' | 'cancelado';
  depositPaid: number;
  totalPrice: number;
  reminderSent?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  password?: string; // Campo adicionado para persistência de credencial
  role: 'client' | 'admin';
  serviceHistory: string[]; // IDs de agendamentos
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}
