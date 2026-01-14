
import { Service, ServiceType } from './types';

export const SERVICES: Service[] = [
  {
    id: '1',
    name: ServiceType.FIBER_PLACEMENT,
    duration: 180, // 3 horas
    price: 200,
    description: 'Técnica premium de extensão com fios de fibra de vidro para máxima resistência e naturalidade.'
  },
  {
    id: '2',
    name: ServiceType.FIBER_MAINTENANCE,
    duration: 120, // 2 horas
    price: 130,
    description: 'Cuidado e preenchimento das suas unhas de fibra para manter a estrutura e o brilho.'
  },
  {
    id: '3',
    name: ServiceType.GEL_NATURAL,
    duration: 120, // 2 horas
    price: 150,
    description: 'Reforço de gel sobre a sua unha natural para evitar quebras e dar um acabamento impecável.'
  },
  {
    id: '4',
    name: ServiceType.SEMI_PERMANENT,
    duration: 60, // 1 hora
    price: 80,
    description: 'Cor duradoura por até 21 dias com um brilho espelhado espetacular.'
  }
];

export const DEPOSIT_PERCENTAGE = 0.30;

export const WORKING_HOURS = {
  start: 8, // 08:00
  end: 19,  // 19:00
};

export const BANK_DETAILS = {
  owner: "KAMILA FERREIRA DE PROENCA TERRAS DA LUZ",
  cpf: "08533500947",
  bank: "Neon Pagamentos - IP",
  agency: "0655",
  account: "36558826-1"
};
