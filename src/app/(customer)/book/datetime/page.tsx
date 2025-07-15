'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { format, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Calendar } from '@/components/ui/calendar';
import { ChevronLeft } from 'lucide-react';

export default function BookingDateTime() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  const serviceId = searchParams.get('serviceId');
  const staffId = searchParams.get('staffId');
  const businessSlug = searchParams.get('businessSlug');
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

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
  }, [serviceId, staffId, businessSlug, router, toast]);

  // Generate available time slots (basic implementation)
  const getTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(timeString);
      }
    }
    return slots;
  };

  const timeSlots = getTimeSlots();

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
    // Disable past dates and weekends for simplicity
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today || date.getDay() === 0 || date.getDay() === 6;
  };

  const formatDateForDisplay = (date: Date) => {
    return format(date, "d 'de' MMMM, yyyy", { locale: ptBR });
  };

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
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2">
              {timeSlots.map((time) => (
                <Button
                  key={time}
                  variant={selectedTime === time ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTime(time)}
                  className={`text-xs ${
                    selectedTime === time 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                      : 'hover:bg-blue-50'
                  }`}
                >
                  {time}
                </Button>
              ))}
            </div>
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
          disabled={!selectedDate || !selectedTime || isLoading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2"
        >
          {isLoading ? 'Processando...' : 'Continuar'}
        </Button>
      </div>
    </div>
  );
} 