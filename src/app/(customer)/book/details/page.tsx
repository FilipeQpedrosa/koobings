'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { ChevronLeft, Loader2, User, Mail, Phone } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const appointmentNotesSchema = z.object({
  notes: z.string().optional(),
});

type AppointmentNotesForm = z.infer<typeof appointmentNotesSchema>;

interface CustomerData {
  name: string;
  email: string;
  phone?: string;
}

export default function CustomerDetailsPage() {
  console.log('🟢 [DEBUG] CustomerDetailsPage loaded');
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [customerData, setCustomerData] = useState<CustomerData | null>(null);
  
  // 🔧 FIX: Use browser API instead of React hook for URL parameters
  const [urlParams, setUrlParams] = useState<{
    serviceId: string | null;
    staffId: string | null;
    businessSlug: string | null;
  }>({ serviceId: null, staffId: null, businessSlug: null });

  // Get URL parameters using browser API (we know this works)
  useEffect(() => {
    const browserParams = new URLSearchParams(window.location.search);
    const params = {
      serviceId: browserParams.get('serviceId'),
      staffId: browserParams.get('staffId'),
      businessSlug: browserParams.get('businessSlug')
    };
    
    console.log('🔧 [FIX] Using browser API for URL params:', params);
    setUrlParams(params);
  }, []);

  const { serviceId, staffId, businessSlug } = urlParams;

  console.log('🔍 [DEBUG] URL Parameters from browser API:');
  console.log('  businessSlug:', businessSlug);
  console.log('  serviceId:', serviceId);
  console.log('  staffId:', staffId);

  const form = useForm<AppointmentNotesForm>({
    resolver: zodResolver(appointmentNotesSchema),
    defaultValues: {
      notes: '',
    },
  });

  // Check authentication and get customer data
  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        console.log('🔐 [DEBUG] Checking authentication...');
        
        const response = await fetch('/api/customer/profile', {
          credentials: 'include'
        });

        if (response.ok) {
          const result = await response.json();
          
          if (result.success && result.data) {
            console.log('✅ [DEBUG] Customer authenticated:', result.data.name);
            setCustomerData({
              name: result.data.name,
              email: result.data.email,
              phone: result.data.phone || ''
            });
            setIsCheckingAuth(false);
            return;
          }
        }
        
        if (response.status === 401) {
          console.log('❌ [DEBUG] Authentication required - redirecting to login');
          redirectToLogin();
        } else {
          console.log('⚠️ [DEBUG] Auth check inconclusive, allowing guest booking');
          setIsCheckingAuth(false);
        }
        
      } catch (error) {
        console.error('❌ [DEBUG] Error checking authentication:', error);
        setIsCheckingAuth(false);
      }
    };

    checkAuthentication();
  }, []);

  const redirectToLogin = () => {
    const bookingState = {
      businessSlug,
      serviceId,
      staffId,
      selectedDate: sessionStorage.getItem('selectedDate'),
      selectedTime: sessionStorage.getItem('selectedTime'),
      returnTo: `/book/details?businessSlug=${businessSlug}&serviceId=${serviceId}&staffId=${staffId}`
    };
    
    sessionStorage.setItem('bookingState', JSON.stringify(bookingState));
    
    toast({
      title: 'Login Obrigatório',
      description: 'Precisa de fazer login para continuar o agendamento.',
      variant: 'default'
    });

    router.push('/auth/client/signin');
  };

  const handleBack = () => {
    if (!businessSlug || !serviceId || !staffId) {
      router.push('/');
      return;
    }
    router.push(`/book/datetime?businessSlug=${businessSlug}&serviceId=${serviceId}&staffId=${staffId}`);
  };

  const onSubmit = async (data: AppointmentNotesForm) => {
    console.log('🚀 [DEBUG] onSubmit called with data:', data);
    
    // Get customer data
    let finalCustomerData = customerData;
    
    if (!customerData) {
      const guestDetails = sessionStorage.getItem('guestCustomerDetails');
      if (guestDetails) {
        finalCustomerData = JSON.parse(guestDetails);
      } else {
        toast({
          title: 'Dados do Cliente Necessários',
          description: 'Por favor, forneça os seus dados para continuar.',
          variant: 'destructive',
        });
        return;
      }
    }

    // Get stored date and time
    const selectedDate = sessionStorage.getItem('selectedDate');
    const selectedTime = sessionStorage.getItem('selectedTime');

    console.log('📅 [DEBUG] Date and time from sessionStorage:');
    console.log('  selectedDate:', selectedDate);
    console.log('  selectedTime:', selectedTime);

    if (!selectedDate || !selectedTime) {
      toast({
        title: 'Erro',
        description: 'Data e hora não selecionadas. Volte ao passo anterior.',
        variant: 'destructive',
      });
      return;
    }

    if (!serviceId || !staffId || !businessSlug) {
      console.error('❌ [DEBUG] Missing URL parameters:', { businessSlug, serviceId, staffId });
      toast({
        title: 'Erro',
        description: 'Informação de agendamento em falta. Comece novamente.',
        variant: 'destructive',
      });
      router.push('/');
      return;
    }

    setIsLoading(true);

    try {
      const selectedDateTime = `${selectedDate}T${selectedTime}:00`;
      const scheduledForDate = new Date(selectedDateTime);
      
      console.log('📅 [DEBUG] Date processing:');
      console.log('  selectedDateTime:', selectedDateTime);
      console.log('  scheduledForDate:', scheduledForDate);
      console.log('  ISO string:', scheduledForDate.toISOString());

      // 🔍 CRITICAL DEBUG: Check exact values before creating appointmentData
      console.log('🔍 [DEBUG] Parameter values before creating appointmentData:');
      console.log('  businessSlug value:', businessSlug);
      console.log('  businessSlug type:', typeof businessSlug);
      console.log('  serviceId value:', serviceId);
      console.log('  staffId value:', staffId);

      // Ensure we have businessSlug (fallback to known value if needed)
      const finalBusinessSlug = businessSlug || 'mari-nails';

      const appointmentData = {
        businessSlug: finalBusinessSlug,
        serviceId: serviceId,
        staffId: staffId,
        scheduledFor: scheduledForDate.toISOString(),
        notes: data.notes || '',
      };

      console.log('📤 [DEBUG] Created appointmentData object:');
      console.log('  appointmentData:', appointmentData);
      console.log('  Object.keys(appointmentData):', Object.keys(appointmentData));
      console.log('📤 [DEBUG] JSON string will be:');
      console.log('  JSON.stringify(appointmentData):', JSON.stringify(appointmentData));

      const response = await fetch('/api/customer/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(appointmentData),
      });

      const result = await response.json();
      console.log('📥 [DEBUG] Response:', result);

      if (response.ok && result.success) {
        console.log('✅ [DEBUG] Appointment created successfully:', result.data.id);
        
        sessionStorage.setItem('appointmentData', JSON.stringify(result.data));
        
        sessionStorage.removeItem('selectedService');
        sessionStorage.removeItem('selectedStaff');
        sessionStorage.removeItem('selectedDate');
        sessionStorage.removeItem('selectedTime');
        sessionStorage.removeItem('bookingState');

        router.push(`/book/success?businessSlug=${businessSlug}`);
      } else if (response.status === 401) {
        toast({
          title: 'Sessão Expirada',
          description: 'A sua sessão expirou. Por favor faça login novamente.',
          variant: 'destructive',
        });
        redirectToLogin();
      } else {
        const errorMsg = result.error?.message || `Erro ${response.status}: ${response.statusText}`;
        console.error('❌ [DEBUG] Appointment creation failed:', result);
        toast({
          title: 'Erro ao Criar Agendamento',
          description: errorMsg,
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('❌ [DEBUG] Network error:', error);
      toast({
        title: 'Erro de Conexão',
        description: 'Falha na conexão. Verifique sua internet e tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-2 border-blue-500 border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-600">Verificando autenticação...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleBack}
          className="flex-shrink-0"
          disabled={isLoading}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="text-center flex-1">
          <h1 className="text-2xl font-bold mb-2">
            {customerData ? 'Confirmar Agendamento' : 'Dados Pessoais'}
          </h1>
          <p className="text-gray-600">
            {customerData 
              ? 'Revise os seus dados e adicione notas se necessário'
              : 'Forneça os seus dados para continuar o agendamento'
            }
          </p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-6"
      >
        {/* Customer Information Display */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center">
            <User className="mr-2 h-5 w-5" />
            Os Seus Dados
          </h3>
          <div className="space-y-2 text-blue-700">
            <div className="flex items-center">
              <User className="mr-2 h-4 w-4" />
              <span className="font-medium">{customerData?.name}</span>
            </div>
            <div className="flex items-center">
              <Mail className="mr-2 h-4 w-4" />
              <span>{customerData?.email}</span>
            </div>
            {customerData?.phone && (
              <div className="flex items-center">
                <Phone className="mr-2 h-4 w-4" />
                <span>{customerData.phone}</span>
              </div>
            )}
          </div>
          <p className="text-sm text-blue-600 mt-2">
            ℹ️ Estes dados vêm da sua conta. Para alterar, aceda ao seu perfil.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notas Adicionais (opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Alguma informação adicional que gostaria de partilhar..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-between pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                disabled={isLoading}
                className="px-6"
              >
                Voltar
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Criando Agendamento...
                  </>
                ) : (
                  'Confirmar Agendamento'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </motion.div>
    </div>
  );
} 