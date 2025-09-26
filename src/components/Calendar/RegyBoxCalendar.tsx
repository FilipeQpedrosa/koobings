"use client";

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock, Users, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

interface Slot {
  id: string;
  startTime: string;
  endTime: string;
  serviceName: string;
  staffName: string;
  capacity: number;
  booked: number;
  available: boolean;
}

interface DaySlots {
  date: string;
  slots: Slot[];
}

interface RegyBoxCalendarProps {
  onDateSelect: (date: string) => void;
  onSlotSelect: (slot: Slot) => void;
  selectedDate?: string;
  businessSlug: string;
  onSlotsChange?: (slots: Slot[]) => void;
}

export default function RegyBoxCalendar({ 
  onDateSelect, 
  onSlotSelect, 
  selectedDate,
  businessSlug,
  onSlotsChange
}: RegyBoxCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [daySlots, setDaySlots] = useState<DaySlots[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string | null>(selectedDate || null);
  const [enrolling, setEnrolling] = useState<string | null>(null);
  
  const { user } = useAuth();
  const router = useRouter();
  const isStaff = user?.role === 'STAFF' || user?.role === 'BUSINESS_OWNER' || user?.isAdmin;

  // Generate calendar days with correct mapping
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    // Get first day of the month and its day of week (0 = Sunday, 1 = Monday, etc.)
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    
    // Calculate how many days from previous month to show
    const firstDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    const days = [];
    
    // Add days from previous month
    const prevMonth = new Date(year, month - 1, 0);
    const prevMonthLastDay = prevMonth.getDate();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const day = new Date(year, month - 1, prevMonthLastDay - i);
      days.push(day);
    }
    
    // Add days from current month
    for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
      days.push(new Date(year, month, day));
    }
    
    // Add days from next month to complete the grid (6 weeks = 42 days)
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      days.push(new Date(year, month + 1, day));
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();

  // Fetch slots for the current month
  useEffect(() => {
    fetchMonthSlots();
  }, [currentMonth, businessSlug]);

  // Notify parent component when slots change
  useEffect(() => {
    if (onSlotsChange && selectedDay) {
      const slots = getSlotsForDate(new Date(selectedDay));
      onSlotsChange(slots);
    }
  }, [selectedDay, daySlots, onSlotsChange]);

  const fetchMonthSlots = async () => {
    try {
      setLoading(true);
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth() + 1;
      
      const response = await fetch(
        `/api/business/services/slots/availability?year=${year}&month=${month}&businessSlug=${businessSlug}`,
        {
          credentials: 'include',
          cache: 'no-store'
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Convert the monthly availability object to array format
          const monthlyData = data.data || {};
          const daySlotsArray = Object.entries(monthlyData).map(([date, slots]) => ({
            date,
            slots: slots || []
          }));
          setDaySlots(daySlotsArray);
        }
      }
    } catch (error) {
      console.error('Error fetching month slots:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateClick = (date: Date) => {
    // Use local date to avoid timezone issues
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;
    
    console.log(`🔍 [CALENDAR] Date clicked: ${dateString} (${date.toString()})`);
    setSelectedDay(dateString);
    onDateSelect(dateString);
  };

  const handleSlotClick = async (slot: Slot, date: Date) => {
    // Use local date to avoid timezone issues
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;
    
    if (isStaff) {
      // Staff: Navigate to slot details page
      router.push(`/${businessSlug}/staff/slots/${slot.id}`);
    } else {
      // Client: Direct enrollment
      await handleDirectEnrollment(slot, dateString);
    }
  };

  const handleDirectEnrollment = async (slot: Slot, date: string) => {
    if (!user?.isEligible) {
      alert('Você não está apto para participar de aulas. Contacte o staff.');
      return;
    }

    // Check if slot time has passed
    const slotDateTime = new Date(`${date}T${slot.startTime}:00`);
    const now = new Date();
    if (now >= slotDateTime) {
      alert('Este horário já passou e não está mais disponível para inscrição.');
      return;
    }

    setEnrolling(slot.id);
    try {
      const response = await fetch('/api/slots/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          slotId: slot.id,
          date: date
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          alert('Inscrito com sucesso!');
          // Refresh slots
          fetchMonthSlots();
        } else {
          alert(data.error?.message || 'Erro ao inscrever');
        }
      } else {
        alert('Erro ao inscrever');
      }
    } catch (error) {
      console.error('Error enrolling:', error);
      alert('Erro ao inscrever');
    } finally {
      setEnrolling(null);
    }
  };

  const getSlotsForDate = (date: Date) => {
    // Use local date to avoid timezone issues
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;
    
    console.log(`🔍 [CALENDAR] Getting slots for ${dateString} (${date.toString()})`);
    const slots = daySlots.find(day => day.date === dateString)?.slots || [];
    console.log(`🔍 [CALENDAR] Found ${slots.length} slots for ${dateString}`);
    return slots;
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentMonth.getMonth();
  };

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('pt-PT', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMonthName = () => {
    return currentMonth.toLocaleDateString('pt-PT', {
      month: 'long',
      year: 'numeric'
    });
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1);
    }
    setCurrentMonth(newMonth);
  };

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-3 sm:p-6 w-full max-w-6xl mx-auto">
      {/* Header - Mobile Optimized */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center gap-2 sm:gap-4">
          <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
          <h2 className="text-lg sm:text-2xl font-bold text-gray-900">
            {getMonthName()}
          </h2>
        </div>
        
        <div className="flex items-center gap-1 sm:gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigateMonth('prev')}
            className="h-8 w-8 sm:h-10 sm:w-10"
          >
            <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigateMonth('next')}
            className="h-8 w-8 sm:h-10 sm:w-10"
          >
            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </div>
      </div>

      {/* Calendar Grid - Mobile Optimized */}
      <div className="grid grid-cols-7 gap-1 mb-2 sm:mb-4">
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
          <div key={day} className="p-1 sm:p-3 text-center font-semibold text-gray-600 bg-gray-50 rounded-lg text-xs sm:text-sm">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((date, index) => {
          const slots = getSlotsForDate(date);
          const hasSlots = slots.length > 0;
          
          // Use local date to avoid timezone issues
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          const dateString = `${year}-${month}-${day}`;
          
          const isSelected = selectedDay === dateString;
          const isCurrentDay = isToday(date);
          const isCurrentMonthDay = isCurrentMonth(date);

          return (
            <div
              key={index}
              className={`
                min-h-[60px] sm:min-h-[120px] p-1 sm:p-2 border rounded-lg cursor-pointer transition-all duration-200
                ${isCurrentMonthDay ? 'bg-white' : 'bg-gray-50'}
                ${isCurrentDay ? 'ring-2 ring-blue-500 bg-blue-50' : ''}
                ${isSelected ? 'ring-2 ring-green-500 bg-green-50' : ''}
                ${hasSlots ? 'hover:bg-blue-50 hover:shadow-md' : 'hover:bg-gray-100'}
                ${!isCurrentMonthDay ? 'opacity-50' : ''}
              `}
              onClick={() => handleDateClick(date)}
            >
              <div className="flex flex-col h-full">
                {/* Date Number */}
                <div className={`
                  text-sm sm:text-sm font-semibold mb-1
                  ${isCurrentDay ? 'text-blue-600' : 'text-gray-900'}
                  ${!isCurrentMonthDay ? 'text-gray-400' : ''}
                `}>
                  {date.getDate()}
                </div>

                {/* Availability Indicator - Simple green dot */}
                {hasSlots && (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {loading && (
        <div className="mt-4 text-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-500 mt-2">Carregando horários...</p>
        </div>
      )}
    </div>
  );
}
