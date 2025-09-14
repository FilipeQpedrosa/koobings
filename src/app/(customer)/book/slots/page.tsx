'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { ChevronLeft, Loader2, Calendar, User, Clock, CheckCircle } from 'lucide-react';
import CustomerSlotPicker from '@/components/customer/CustomerSlotPicker';

interface SelectedSlot {
  startSlot: number;
  endSlot: number;
  startTime: string;
  endTime: string;
  slotsNeeded: number;
  duration: number;
}

interface CustomerData {
  name: string;
  email: string;
  phone?: string;
}

interface ServiceData {
  id: string;
  name: string;
  duration: number;
  price: number;
}

interface StaffData {
  id: string;
  name: string;
  email: string;
}

export default function CustomerBookingSlotsPage() {
  console.log('🟢 [DEBUG] CustomerBookingSlotsPage loaded');
  
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [customerData, setCustomerData] = useState<CustomerData | null>(null);
  const [serviceData, setServiceData] = useState<ServiceData | null>(null);
  const [staffData, setStaffData] = useState<StaffData | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<SelectedSlot | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  
  // URL parameters
  const [urlParams, setUrlParams] = useState<{
    serviceId: string | null;
    staffId: string | null;
    businessSlug: string | null;
    date: string | null;
  }>({ serviceId: null, staffId: null, businessSlug: null, date: null });

  // Get URL parameters
  useEffect(() => {
    const browserParams = new URLSearchParams(window.location.search);
    const params = {
      serviceId: browserParams.get('serviceId'),
      staffId: browserParams.get('staffId'),
      businessSlug: browserParams.get('businessSlug'),
      date: browserParams.get('date')
    };
    
    console.log('🔧 [SLOTS_PAGE] URL params:', params);
    setUrlParams(params);
    
    // Set default date if provided
    if (params.date) {
      setSelectedDate(params.date);
    } else {
      // Default to today
      setSelectedDate(new Date().toISOString().split('T')[0]);
    }
  }, []);

  const { serviceId, staffId, businessSlug, date } = urlParams;

  // Check authentication and get customer data
  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        console.log('🔐 [SLOTS_PAGE] Checking authentication...');
        
        const response = await fetch('/api/customer/profile', {
          credentials: 'include'
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data) {
            console.log('✅ [SLOTS_PAGE] Customer authenticated:', result.data.email);
            setCustomerData({
              name: result.data.name || result.data.email.split('@')[0],
              email: result.data.email,
              phone: result.data.phone
            });
          } else {
            throw new Error('Invalid customer data');
          }
        } else {
          throw new Error('Not authenticated');
        }
      } catch (error) {
        console.error('❌ [SLOTS_PAGE] Authentication failed:', error);
        toast({
          title: "Acesso negado",
          description: "Por favor, faça login para continuar",
          variant: "destructive",
        });
        // Redirect to login with return URL
        const returnUrl = encodeURIComponent(window.location.pathname + window.location.search);
        router.push(`/customer/login?returnUrl=${returnUrl}`);
        return;
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuthentication();
  }, [router, toast]);

  // Fetch service and staff data
  useEffect(() => {
    const fetchServiceAndStaffData = async () => {
      if (!serviceId || !staffId) return;

      try {
        console.log('📊 [SLOTS_PAGE] Fetching service and staff data...');

        // Fetch service data
        const serviceResponse = await fetch(`/api/customer/services/${serviceId}`, {
          credentials: 'include'
        });
        
        if (serviceResponse.ok) {
          const serviceResult = await serviceResponse.json();
          if (serviceResult.success) {
            setServiceData(serviceResult.data);
            console.log('✅ [SLOTS_PAGE] Service data:', serviceResult.data);
          }
        }

        // Fetch staff data
        const staffResponse = await fetch(`/api/customer/staff/${staffId}`, {
          credentials: 'include'
        });
        
        if (staffResponse.ok) {
          const staffResult = await staffResponse.json();
          if (staffResult.success) {
            setStaffData(staffResult.data);
            console.log('✅ [SLOTS_PAGE] Staff data:', staffResult.data);
          }
        }

      } catch (error) {
        console.error('❌ [SLOTS_PAGE] Error fetching data:', error);
      }
    };

    fetchServiceAndStaffData();
  }, [serviceId, staffId]);

  // Handle back navigation
  const handleBack = () => {
    if (businessSlug && serviceId && staffId) {
      router.push(`/book/time?businessSlug=${businessSlug}&serviceId=${serviceId}&staffId=${staffId}`);
    } else {
      router.back();
    }
  };

  // Handle slot selection
  const handleSlotSelect = (slot: SelectedSlot) => {
    console.log('🎯 [SLOTS_PAGE] Slot selected:', slot);
    setSelectedSlot(slot);
  };

  // Handle booking confirmation
  const handleBookingConfirm = async () => {
    if (!selectedSlot || !serviceId || !staffId || !selectedDate || !customerData) {
      toast({
        title: "Erro",
        description: "Dados incompletos para criar a reserva",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      console.log('🚀 [SLOTS_PAGE] Creating slot-based appointment...');

      const appointmentData = {
        clientId: customerData.email, // Use email as clientId for customer bookings
        serviceId: serviceId,
        staffId: staffId,
        date: selectedDate,
        startSlot: selectedSlot.startSlot,
        slotsNeeded: selectedSlot.slotsNeeded,
        notes: ''
      };

      console.log('📤 [SLOTS_PAGE] Appointment data:', appointmentData);

      const response = await fetch('/api/appointments/slots-v2', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(appointmentData),
      });

      const result = await response.json();
      console.log('📥 [SLOTS_PAGE] Response:', result);

      if (response.ok && result.success) {
        console.log('✅ [SLOTS_PAGE] Appointment created successfully!');
        
        toast({
          title: "Reserva confirmada!",
          description: `Seu horário foi marcado para ${selectedSlot.startTime} - ${selectedSlot.endTime}`,
        });

        // Redirect to success page or summary
        router.push(`/book/success?appointmentId=${result.data.id}`);
      } else {
        throw new Error(result.error?.message || 'Erro ao criar reserva');
      }

    } catch (error: any) {
      console.error('❌ [SLOTS_PAGE] Booking error:', error);
      toast({
        title: "Erro ao criar reserva",
        description: error.message || "Tente novamente",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Verificando acesso...</p>
        </div>
      </div>
    );
  }

  if (!serviceId || !staffId || !businessSlug) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Parâmetros inválidos</p>
          <Button onClick={() => router.push('/')} variant="outline">
            Voltar ao início
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            onClick={handleBack}
            variant="ghost"
            className="mb-4 text-gray-600 hover:text-gray-900"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Escolha o seu horário
            </h1>
            <p className="text-gray-600">
              Sistema de slots de 30 minutos para maior precisão
            </p>
          </motion.div>
        </div>

        {/* Service and Staff Info */}
        {(serviceData || staffData) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-lg shadow-sm border p-6 mb-6"
          >
            <div className="space-y-4">
              {serviceData && (
                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg">{serviceData.name}</h3>
                    <p className="text-gray-600">
                      {serviceData.duration} minutos • €{serviceData.price.toFixed(2)}
                    </p>
                  </div>
                </div>
              )}
              
              {staffData && (
                <div className="flex items-start space-x-3">
                  <User className="w-5 h-5 text-green-600 mt-1" />
                  <div>
                    <h4 className="font-medium">{staffData.name}</h4>
                    <p className="text-gray-600 text-sm">{staffData.email}</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Date Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm border p-6 mb-6"
        >
          <label className="block text-sm font-medium text-gray-700 mb-3">
            <Calendar className="w-4 h-4 inline mr-2" />
            Escolha a data
          </label>
          <input
            type="date"
            value={selectedDate}
            min={new Date().toISOString().split('T')[0]}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </motion.div>

        {/* Slot Picker */}
        {selectedDate && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white rounded-lg shadow-sm border p-6 mb-6"
          >
            <CustomerSlotPicker
              businessSlug={businessSlug}
              serviceId={serviceId}
              staffId={staffId}
              date={selectedDate}
              onSlotSelect={handleSlotSelect}
              selectedSlot={selectedSlot}
            />
          </motion.div>
        )}

        {/* Confirm Button */}
        {selectedSlot && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white rounded-lg shadow-sm border p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-lg text-gray-900">
                  Confirmar reserva
                </div>
                <div className="text-gray-600">
                  {selectedSlot.startTime} - {selectedSlot.endTime} • {selectedDate}
                </div>
              </div>
              <Button
                onClick={handleBookingConfirm}
                disabled={isLoading}
                size="lg"
                className="bg-green-600 hover:bg-green-700"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Confirmando...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Confirmar Reserva
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
