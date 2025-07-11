'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { ChevronLeft, Loader2 } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const customerDetailsSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().optional(),
  notes: z.string().optional(),
});

type CustomerDetailsForm = z.infer<typeof customerDetailsSchema>;

export default function CustomerDetailsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const serviceId = searchParams.get('serviceId');
  const staffId = searchParams.get('staffId');
  const businessSlug = searchParams.get('businessSlug') || sessionStorage.getItem('businessSlug') || 'advogados-bla-bla';

  const form = useForm<CustomerDetailsForm>({
    resolver: zodResolver(customerDetailsSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      notes: '',
    },
  });

  const handleBack = () => {
    router.push(`/book/datetime?businessSlug=${businessSlug}&serviceId=${serviceId}&staffId=${staffId}`);
  };

  const onSubmit = async (data: CustomerDetailsForm) => {
    if (!serviceId || !staffId) {
      toast({
        title: 'Erro',
        description: 'Informação de agendamento em falta. Comece novamente.',
        variant: 'destructive',
      });
      router.push(`/book?businessSlug=${businessSlug}`);
      return;
    }

    // Get stored date and time
    const selectedDate = sessionStorage.getItem('selectedDate');
    const selectedTime = sessionStorage.getItem('selectedTime');

    if (!selectedDate || !selectedTime) {
      toast({
        title: 'Erro',
        description: 'Data e hora não selecionadas. Volte ao passo anterior.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      console.log('🔄 Creating appointment with:', {
        businessSlug,
        clientName: data.name,
        clientEmail: data.email,
        clientPhone: data.phone,
        serviceId,
        staffId,
        scheduledFor: `${selectedDate}T${selectedTime}:00`,
        notes: data.notes,
      });

      const response = await fetch('/api/client/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          businessSlug,
          clientName: data.name,
          clientEmail: data.email,
          clientPhone: data.phone,
          serviceId,
          staffId,
          scheduledFor: `${selectedDate}T${selectedTime}:00`,
          notes: data.notes,
        }),
      });

      const result = await response.json();
      console.log('📝 Appointment creation response:', result);

      if (response.ok && result.success) {
        console.log('✅ Appointment created successfully:', result.data.id);
        
        // Store appointment details for success page
        sessionStorage.setItem('appointmentData', JSON.stringify(result.data));
        
        // Clear other stored data
        sessionStorage.removeItem('selectedService');
        sessionStorage.removeItem('selectedStaff');
        sessionStorage.removeItem('selectedDate');
        sessionStorage.removeItem('selectedTime');

        // Navigate to success page
        router.push(`/book/success?businessSlug=${businessSlug}`);
      } else {
        // Handle error response
        const errorMsg = result.error?.message || `Erro ${response.status}: ${response.statusText}`;
        toast({
          title: 'Erro ao Criar Agendamento',
          description: errorMsg,
          variant: 'destructive',
        });
        console.error('❌ Failed to create appointment:', result.error || response.statusText);
      }
    } catch (error) {
      console.error('❌ Network error creating appointment:', error);
      toast({
        title: 'Erro de Conexão',
        description: 'Falha na conexão. Verifique sua internet e tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

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
          <h1 className="text-2xl font-bold mb-2">Seus Dados</h1>
          <p className="text-gray-600">Por favor forneça as suas informações de contacto</p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome Completo</FormLabel>
                  <FormControl>
                    <Input placeholder="João Silva" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="joao@exemplo.com" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone (opcional)</FormLabel>
                  <FormControl>
                    <Input placeholder="+351 912 345 678" type="tel" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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