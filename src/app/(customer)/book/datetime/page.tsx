'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { format, isToday, isTomorrow, startOfWeek, endOfWeek } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Calendar } from '@/components/ui/calendar';
import { ChevronLeft } from 'lucide-react';

interface TimeSlot {
  time: string;
  available: boolean;
}

export default function BookingDateTime() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  const serviceId = searchParams.get('serviceId');
  const staffId = searchParams.get('staffId');
  const businessSlug = searchParams.get('businessSlug');
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  useEffect(() => {
    // Validate all required parameters
    if (!serviceId || !staffId || !businessSlug) {
      toast({
        title: 'Erro',
        description: 'Informação de agendamento em falta. Comece novamente.',
        variant: 'destructive'
      });
      router.push('/');
      return;
    }
  }, []); // Removed dependencies to prevent loops

  useEffect(() => {
    if (selectedDate && serviceId && staffId) {
      fetchAvailableSlots();
    }
  }, [selectedDate, serviceId, staffId]);

  const fetchAvailableSlots = async () => {
    if (!selectedDate || !serviceId || !staffId) return;
    
    setLoadingSlots(true);
    try {
      console.log('🔍 [BOOKING] Fetching available slots for:', {
        date: format(selectedDate, 'yyyy-MM-dd'),
        serviceId,
        staffId
      });

      const response = await fetch(
        `/api/customer/availability?serviceId=${serviceId}&staffId=${staffId}&date=${format(selectedDate, 'yyyy-MM-dd')}`
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch time slots: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('📅 [BOOKING] Available slots response:', result);
      
      if (result.success && result.data) {
        setTimeSlots(result.data);
        console.log('✅ [BOOKING] Loaded slots:', result.data.length);
      } else {
        throw new Error(result.error?.message || 'Failed to load time slots');
      }
    } catch (error) {
      console.error('❌ [BOOKING] Error fetching slots:', error);
      toast({
        title: 'Erro',
        description: 'Falha ao carregar horários disponíveis. Tente novamente.',
        variant: 'destructive'
      });
      // Fallback to empty array
      setTimeSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleBack = () => {
    if (!businessSlug || !serviceId) {
      router.push('/');
      return;
    }
    router.push(`/book/staff?businessSlug=${businessSlug}&serviceId=${serviceId}`);
  };

  const handleContinue = () => {
    if (!selectedDate || !selectedTime) {
      toast({
        title: 'Erro',
        description: 'Por favor selecione data e hora.',
        variant: 'destructive'
      });
      return;
    }

    if (!businessSlug || !serviceId || !staffId) {
      toast({
        title: 'Erro',
        description: 'Informação de agendamento em falta.',
        variant: 'destructive'
      });
      router.push('/');
      return;
    }

    // Store selections
    sessionStorage.setItem('selectedDate', format(selectedDate, 'yyyy-MM-dd'));
    sessionStorage.setItem('selectedTime', selectedTime);

    // Navigate to client details
    router.push(`/book/details?businessSlug=${businessSlug}&serviceId=${serviceId}&staffId=${staffId}`);
  };

  const isDateDisabled = (date: Date) => {
    // Disable past dates and only Sundays (not Saturdays)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today || date.getDay() === 0; // Only block Sundays (0), allow Saturdays (6)
  };

  const formatDateForDisplay = (date: Date) => {
    return format(date, "d 'de' MMMM, yyyy", { locale: ptBR });
  };

  // Filter only available time slots
  const availableTimeSlots = timeSlots.filter(slot => slot.available);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleBack}
          className="flex-shrink-0"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="text-center flex-1">
          <h1 className="text-2xl font-bold mb-2">Escolher Data e Hora</h1>
          <p className="text-gray-600">Selecione quando pretende o agendamento</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Date Selection */}
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4">📅 Selecionar Data</h3>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border mx-auto"
            disabled={isDateDisabled}
            locale={ptBR}
          />
          {selectedDate && (
            <p className="text-center text-sm text-blue-600 mt-3 font-medium">
              Data selecionada: {formatDateForDisplay(selectedDate)}
            </p>
          )}
        </Card>

        {/* Time Selection */}
        {selectedDate && (
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">🕒 Selecionar Hora</h3>
            
            {loadingSlots ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-2 text-sm text-gray-600">Carregando horários disponíveis...</p>
              </div>
            ) : availableTimeSlots.length > 0 ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2">
                {availableTimeSlots.map((slot) => (
                  <Button
                    key={slot.time}
                    variant={selectedTime === slot.time ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedTime(slot.time)}
                    className={`text-xs ${
                      selectedTime === slot.time 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                        : 'hover:bg-blue-50'
                    }`}
                  >
                    {slot.time}
                  </Button>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Nenhum horário disponível para esta data.</p>
                <p className="text-sm text-gray-400 mt-1">Tente selecionar outra data.</p>
              </div>
            )}
            
            {selectedTime && (
              <p className="text-center text-sm text-blue-600 mt-3 font-medium">
                Hora selecionada: {selectedTime}
              </p>
            )}
          </Card>
        )}

        {/* Summary */}
        {selectedDate && selectedTime && (
          <Card className="p-4 bg-blue-50 border-blue-200">
            <h3 className="text-lg font-semibold mb-2 text-blue-800">📋 Resumo</h3>
            <div className="space-y-1 text-sm text-blue-700">
              <p><strong>Data:</strong> {formatDateForDisplay(selectedDate)}</p>
              <p><strong>Hora:</strong> {selectedTime}</p>
            </div>
          </Card>
        )}
      </div>

      <div className="flex justify-between pt-6">
        <Button
          variant="outline"
          onClick={handleBack}
          className="px-6"
        >
          Voltar
        </Button>
        <Button
          onClick={handleContinue}
          disabled={!selectedDate || !selectedTime || loadingSlots}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2"
        >
          {loadingSlots ? 'Processando...' : 'Continuar'}
        </Button>
      </div>
    </div>
  );
} 