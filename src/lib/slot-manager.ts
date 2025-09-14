/**
 * 🎯 SLOT MANAGER - Sistema Completo de Gestão de Slots
 * 
 * Este módulo implementa todo o sistema de slots baseado em blocos de 30 minutos.
 * Cada slot representa um período de 30 minutos, permitindo agendamentos precisos e organizados.
 * 
 * CONCEITOS:
 * - 1 dia = 48 slots (24h × 2 slots por hora)
 * - Slot 0 = 00:00-00:30, Slot 1 = 00:30-01:00, etc.
 * - Slot 18 = 09:00-09:30, Slot 19 = 09:30-10:00, etc.
 */

import { format, parseISO, addMinutes, startOfDay, isSameDay } from 'date-fns';

// ===================================
// 🏗️ TIPOS E INTERFACES
// ===================================

export interface TimeSlot {
  slotIndex: number;
  startTime: string;    // "HH:mm" format
  endTime: string;      // "HH:mm" format
  date: string;         // "YYYY-MM-DD" format
  available: boolean;
}

export interface SlotRange {
  startSlot: number;
  endSlot: number;      // Exclusivo (não incluído)
  slotsUsed: number;
  startTime: string;    // "HH:mm"
  endTime: string;      // "HH:mm"
  date: string;         // "YYYY-MM-DD"
}

export interface ServiceSlotRequirement {
  serviceId: string;
  serviceName: string;
  slotsNeeded: number;
  duration: number;     // Em minutos (calculado automaticamente)
}

export interface AppointmentSlotData {
  appointmentId: string;
  startSlot: number;
  endSlot: number;
  slotsUsed: number;
  date: string;
  staffId: string;
  clientId: string;
  serviceId: string;
  slotDetails: {
    startTime: string;
    endTime: string;
    slotsBreakdown?: {
      preparation?: number;
      execution?: number;
      cleanup?: number;
    };
  };
}

export interface StaffSlotAvailability {
  staffId: string;
  date: string;
  availableSlots: number[];       // Array de índices de slots disponíveis
  workingSlots: number[];         // Array de slots de trabalho
  unavailableSlots: number[];     // Array de slots indisponíveis
  lunchBreakSlots?: number[];     // Array de slots de almoço
}

export interface BusinessSlotConfig {
  businessId: string;
  slotDurationMinutes: number;    // Padrão: 30
  slotsPerDay: number;           // Padrão: 48 (24h × 2)
  startHour: number;             // Padrão: 0 (00:00)
  endHour: number;               // Padrão: 24 (24:00)
  timeZone: string;              // Padrão: "UTC"
  workingHours: {
    start: number;               // Slot de início do expediente
    end: number;                 // Slot de fim do expediente
  };
}

// ===================================
// 🛠️ FUNÇÕES CORE DE CONVERSÃO
// ===================================

/**
 * Converte um horário (HH:mm) para índice de slot
 * Exemplo: "09:00" → 18, "09:30" → 19, "14:00" → 28
 */
export function timeToSlotIndex(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  
  if (isNaN(hours) || isNaN(minutes)) {
    throw new Error(`Invalid time format: ${time}. Expected HH:mm`);
  }
  
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    throw new Error(`Invalid time values: ${time}. Hours: 0-23, Minutes: 0-59`);
  }
  
  // Arredondar minutos para o slot mais próximo (0 ou 30)
  const slotMinutes = minutes < 30 ? 0 : 30;
  return hours * 2 + (slotMinutes / 30);
}

/**
 * Converte um índice de slot para horário (HH:mm)
 * Exemplo: 18 → "09:00", 19 → "09:30", 28 → "14:00"
 */
export function slotIndexToTime(slotIndex: number): string {
  if (slotIndex < 0 || slotIndex >= 48) {
    throw new Error(`Invalid slot index: ${slotIndex}. Must be between 0-47`);
  }
  
  const hours = Math.floor(slotIndex / 2);
  const minutes = (slotIndex % 2) * 30;
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

/**
 * Converte duração em minutos para número de slots necessários
 * Exemplo: 30min → 1 slot, 60min → 2 slots, 90min → 3 slots
 */
export function durationToSlots(durationMinutes: number): number {
  if (durationMinutes <= 0) {
    throw new Error(`Invalid duration: ${durationMinutes}. Must be positive`);
  }
  
  // Arredondar para cima para o número de slots necessário
  return Math.ceil(durationMinutes / 30);
}

/**
 * Converte número de slots para duração em minutos
 * Exemplo: 1 slot → 30min, 2 slots → 60min, 3 slots → 90min
 */
export function slotsToDuration(slots: number): number {
  if (slots <= 0) {
    throw new Error(`Invalid slot count: ${slots}. Must be positive`);
  }
  
  return slots * 30;
}

/**
 * Converte DateTime para slot baseado na data e hora
 */
export function dateTimeToSlot(dateTime: Date | string): { date: string; slotIndex: number } {
  const date = typeof dateTime === 'string' ? parseISO(dateTime) : dateTime;
  
  return {
    date: format(date, 'yyyy-MM-dd'),
    slotIndex: timeToSlotIndex(format(date, 'HH:mm'))
  };
}

// ===================================
// 🕐 FUNÇÕES DE GERAÇÃO DE SLOTS
// ===================================

/**
 * Gera todos os slots para um dia específico
 */
export function generateDaySlots(date: string, config?: Partial<BusinessSlotConfig>): TimeSlot[] {
  const slotsPerDay = config?.slotsPerDay || 48;
  const slots: TimeSlot[] = [];
  
  for (let i = 0; i < slotsPerDay; i++) {
    const startTime = slotIndexToTime(i);
    const endTime = slotIndexToTime(i + 1 < slotsPerDay ? i + 1 : 0);
    
    slots.push({
      slotIndex: i,
      startTime,
      endTime: i + 1 < slotsPerDay ? endTime : '24:00',
      date,
      available: true  // Será calculado posteriormente baseado na disponibilidade
    });
  }
  
  return slots;
}

/**
 * Gera slot ranges disponíveis para um serviço específico
 */
export function generateAvailableSlotRanges(
  availableSlots: number[],
  slotsNeeded: number,
  date: string
): SlotRange[] {
  const ranges: SlotRange[] = [];
  
  // Encontrar sequências consecutivas de slots disponíveis
  for (let i = 0; i <= availableSlots.length - slotsNeeded; i++) {
    const startSlot = availableSlots[i];
    let consecutiveSlots = 1;
    
    // Verificar se temos slots consecutivos suficientes
    for (let j = i + 1; j < availableSlots.length && consecutiveSlots < slotsNeeded; j++) {
      if (availableSlots[j] === availableSlots[j - 1] + 1) {
        consecutiveSlots++;
      } else {
        break;
      }
    }
    
    // Se encontrou slots consecutivos suficientes, criar um range
    if (consecutiveSlots >= slotsNeeded) {
      const endSlot = startSlot + slotsNeeded;
      
      ranges.push({
        startSlot,
        endSlot,
        slotsUsed: slotsNeeded,
        startTime: slotIndexToTime(startSlot),
        endTime: slotIndexToTime(endSlot),
        date
      });
    }
  }
  
  return ranges;
}

// ===================================
// 📅 FUNÇÕES DE DISPONIBILIDADE
// ===================================

/**
 * Verifica se um range de slots está disponível
 */
export function isSlotRangeAvailable(
  startSlot: number,
  slotsNeeded: number,
  occupiedSlots: number[]
): boolean {
  const endSlot = startSlot + slotsNeeded;
  
  for (let slot = startSlot; slot < endSlot; slot++) {
    if (occupiedSlots.includes(slot)) {
      return false;
    }
  }
  
  return true;
}

/**
 * Calcula slots ocupados por appointments existentes
 */
export function calculateOccupiedSlots(appointments: AppointmentSlotData[]): number[] {
  const occupiedSlots: number[] = [];
  
  appointments.forEach(appointment => {
    for (let slot = appointment.startSlot; slot < appointment.endSlot; slot++) {
      occupiedSlots.push(slot);
    }
  });
  
  return [...new Set(occupiedSlots)].sort((a, b) => a - b);
}

/**
 * Filtra slots disponíveis removendo os ocupados
 */
export function filterAvailableSlots(
  allSlots: number[],
  occupiedSlots: number[]
): number[] {
  return allSlots.filter(slot => !occupiedSlots.includes(slot));
}

// ===================================
// 🏢 FUNÇÕES DE CONFIGURAÇÃO DE NEGÓCIO
// ===================================

/**
 * Obtém configuração padrão de slots para um negócio
 */
export function getDefaultBusinessSlotConfig(): BusinessSlotConfig {
  return {
    businessId: '',
    slotDurationMinutes: 30,
    slotsPerDay: 48,
    startHour: 0,
    endHour: 24,
    timeZone: 'UTC',
    workingHours: {
      start: 18,  // 09:00 (slot 18)
      end: 36     // 18:00 (slot 36)
    }
  };
}

/**
 * Converte configuração de horário de trabalho para slots
 */
export function workingHoursToSlots(startTime: string, endTime: string): { start: number; end: number } {
  return {
    start: timeToSlotIndex(startTime),
    end: timeToSlotIndex(endTime)
  };
}

/**
 * Gera slots de trabalho para um dia baseado na configuração
 */
export function generateWorkingSlots(config: BusinessSlotConfig): number[] {
  const slots: number[] = [];
  
  for (let i = config.workingHours.start; i < config.workingHours.end; i++) {
    slots.push(i);
  }
  
  return slots;
}

// ===================================
// 🔧 FUNÇÕES DE VALIDAÇÃO
// ===================================

/**
 * Valida se um slot index é válido
 */
export function isValidSlotIndex(slotIndex: number): boolean {
  return Number.isInteger(slotIndex) && slotIndex >= 0 && slotIndex < 48;
}

/**
 * Valida se um range de slots é válido
 */
export function isValidSlotRange(startSlot: number, endSlot: number): boolean {
  return (
    isValidSlotIndex(startSlot) &&
    isValidSlotIndex(endSlot - 1) && // endSlot é exclusivo
    startSlot < endSlot &&
    endSlot <= 48
  );
}

/**
 * Valida formato de tempo (HH:mm)
 */
export function isValidTimeFormat(time: string): boolean {
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
}

// ===================================
// 📊 FUNÇÕES DE UTILIDADE
// ===================================

/**
 * Formata um slot range para exibição amigável
 */
export function formatSlotRange(range: SlotRange): string {
  return `${range.startTime} - ${range.endTime} (${range.slotsUsed} slots)`;
}

/**
 * Calcula ocupação percentual dos slots em um dia
 */
export function calculateSlotOccupancy(
  totalSlots: number,
  occupiedSlots: number[]
): { occupiedCount: number; occupancyPercentage: number } {
  const occupiedCount = occupiedSlots.length;
  const occupancyPercentage = totalSlots > 0 ? (occupiedCount / totalSlots) * 100 : 0;
  
  return {
    occupiedCount,
    occupancyPercentage: Math.round(occupancyPercentage * 100) / 100
  };
}

/**
 * Encontra o próximo slot disponível após um determinado slot
 */
export function findNextAvailableSlot(
  startFromSlot: number,
  availableSlots: number[]
): number | null {
  const nextSlots = availableSlots.filter(slot => slot >= startFromSlot);
  return nextSlots.length > 0 ? nextSlots[0] : null;
}

/**
 * Agrupa slots consecutivos em ranges
 */
export function groupConsecutiveSlots(slots: number[]): { start: number; end: number; count: number }[] {
  if (slots.length === 0) return [];
  
  const sortedSlots = [...slots].sort((a, b) => a - b);
  const groups: { start: number; end: number; count: number }[] = [];
  
  let currentStart = sortedSlots[0];
  let currentEnd = sortedSlots[0];
  
  for (let i = 1; i < sortedSlots.length; i++) {
    if (sortedSlots[i] === currentEnd + 1) {
      currentEnd = sortedSlots[i];
    } else {
      groups.push({
        start: currentStart,
        end: currentEnd + 1, // Tornar exclusivo
        count: currentEnd - currentStart + 1
      });
      currentStart = sortedSlots[i];
      currentEnd = sortedSlots[i];
    }
  }
  
  // Adicionar o último grupo
  groups.push({
    start: currentStart,
    end: currentEnd + 1, // Tornar exclusivo
    count: currentEnd - currentStart + 1
  });
  
  return groups;
}

// ===================================
// 🚀 EXPORTAÇÃO DAS CONSTANTES
// ===================================

export const SLOT_CONSTANTS = {
  SLOT_DURATION_MINUTES: 30,
  SLOTS_PER_DAY: 48,
  SLOTS_PER_HOUR: 2,
  HOURS_PER_DAY: 24,
  DEFAULT_WORKING_START_SLOT: 18, // 09:00
  DEFAULT_WORKING_END_SLOT: 36,   // 18:00
} as const;
