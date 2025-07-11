'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, Calendar, Clock, User, Mail, Phone } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface AppointmentData {
  id: string;
  client: {
    id: string;
    name: string;
    email: string;
  };
  service: {
    id: string;
    name: string;
    duration: number;
    price?: number;
  };
  staff: {
    id: string;
    name: string;
  };
  scheduledFor: string;
  status: string;
  notes?: string;
}

export default function BookingSuccessPage() {
  const searchParams = useSearchParams();
  const businessSlug = searchParams.get('businessSlug');
  const [appointmentData, setAppointmentData] = useState<AppointmentData | null>(null);

  useEffect(() => {
    // Get appointment data from session storage
    const storedData = sessionStorage.getItem('appointmentData');
    if (storedData) {
      try {
        const parsed = JSON.parse(storedData);
        setAppointmentData(parsed);
        // Clear from session storage
        sessionStorage.removeItem('appointmentData');
      } catch (error) {
        console.error('Error parsing appointment data:', error);
      }
    }
  }, []);

  if (!appointmentData) {
    return (
      <div className="container mx-auto py-16">
        <div className="max-w-xl mx-auto text-center">
          <div className="text-gray-500">Carregando detalhes do agendamento...</div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "d 'de' MMMM, yyyy 'às' HH:mm", { locale: ptBR });
  };

  const formatDuration = (duration: number) => {
    if (duration >= 60) {
      const hours = Math.floor(duration / 60);
      const minutes = duration % 60;
      if (minutes === 0) return `${hours}h`;
      return `${hours}h ${minutes}min`;
    }
    return `${duration}min`;
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <CheckCircle2 className="mx-auto h-16 w-16 text-green-500 mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Agendamento Confirmado!
          </h1>
          <p className="text-lg text-gray-600">
            O seu agendamento foi criado com sucesso. Receberá uma confirmação por email em breve.
          </p>
        </div>

        {/* Appointment Details */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Detalhes do Agendamento</h2>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-blue-600" />
              <div>
                <span className="font-medium">Data e Hora:</span>
                <div className="text-gray-600">{formatDate(appointmentData.scheduledFor)}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-blue-600" />
              <div>
                <span className="font-medium">Serviço:</span>
                <div className="text-gray-600">
                  {appointmentData.service.name} ({formatDuration(appointmentData.service.duration)})
                  {appointmentData.service.price && (
                    <span className="ml-2">• €{appointmentData.service.price}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-blue-600" />
              <div>
                <span className="font-medium">Funcionário:</span>
                <div className="text-gray-600">{appointmentData.staff.name}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-blue-600" />
              <div>
                <span className="font-medium">Cliente:</span>
                <div className="text-gray-600">
                  {appointmentData.client.name} ({appointmentData.client.email})
                </div>
              </div>
            </div>

            {appointmentData.notes && (
              <div className="flex items-start gap-3">
                <div className="h-5 w-5 text-blue-600 mt-0.5">📝</div>
                <div>
                  <span className="font-medium">Notas:</span>
                  <div className="text-gray-600">{appointmentData.notes}</div>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Reference Number */}
        <Card className="p-4 mb-6 bg-blue-50 border-blue-200">
          <div className="text-center">
            <div className="text-sm text-blue-600 font-medium">Número de Referência</div>
            <div className="text-lg font-mono text-blue-800">{appointmentData.id}</div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            asChild
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Link href={`/book?businessSlug=${businessSlug}`}>
              Agendar Novamente
            </Link>
          </Button>
          <Button
            variant="outline"
            asChild
          >
            <Link href="/">
              Voltar ao Início
            </Link>
          </Button>
        </div>

        {/* Additional Information */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-2">Informações Importantes</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Receberá um email de confirmação em breve</li>
            <li>• Chegue 10 minutos antes da hora marcada</li>
            <li>• Para cancelar ou remarcar, contacte-nos com pelo menos 24h de antecedência</li>
            <li>• Guarde o número de referência para futuras comunicações</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 