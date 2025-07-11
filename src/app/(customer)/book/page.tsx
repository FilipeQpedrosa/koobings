'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

interface Service {
  id: string;
  name: string;
  description?: string;
  duration: number;
  price?: number;
}

interface Business {
  id: string;
  name: string;
}

export default function ServiceSelectionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [business, setBusiness] = useState<Business | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Get business slug from URL parameter
  const businessSlug = searchParams.get('businessSlug') || 'advogados-bla-bla'; // Default for testing

  useEffect(() => {
    async function fetchServices() {
      try {
        console.log('🔍 Fetching services for business:', businessSlug);
        
        const response = await fetch(`/api/client/services?businessSlug=${businessSlug}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch services: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('📋 Services response:', data);
        
        if (data.success) {
          setServices(data.data.services || []);
          setBusiness(data.data.business);
          console.log('✅ Services loaded:', data.data.services.length);
        } else {
          throw new Error(data.error?.message || 'Failed to load services');
        }
      } catch (error) {
        console.error('❌ Error fetching services:', error);
        toast({
          title: 'Erro',
          description: 'Falha ao carregar serviços. Tente novamente.',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    }

    if (businessSlug) {
      fetchServices();
    }
  }, [businessSlug, toast]);

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatPrice = (price?: number) => {
    if (!price) return 'Consultar preço';
    return `€${price}`;
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

  const handleContinue = () => {
    if (!selectedService) return;
    
    // Store selection in session storage
    sessionStorage.setItem('selectedService', selectedService);
    sessionStorage.setItem('businessSlug', businessSlug);
    
    // Navigate to staff selection
    router.push(`/book/staff?businessSlug=${businessSlug}&serviceId=${selectedService}`);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-10 bg-gray-200 animate-pulse rounded-md" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-3">
            <div className="h-32 bg-gray-200 animate-pulse rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">
          {business ? `Agendar em ${business.name}` : 'Escolha o Serviço'}
        </h1>
        <p className="text-gray-600">Selecione o serviço que deseja agendar</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
        <Input
          type="text"
          placeholder="Procurar serviços..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <AnimatePresence>
        {filteredServices.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="text-center py-8"
          >
            <p className="text-gray-500">
              {services.length === 0 
                ? 'Nenhum serviço disponível para agendamento.'
                : 'Nenhum serviço encontrado com a sua pesquisa.'
              }
            </p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {filteredServices.map((service) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
              >
                <Card
                  className={`p-4 cursor-pointer transition-all hover:shadow-md border-2 ${
                    selectedService === service.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedService(service.id)}
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-2 flex-1">
                      <h3 className="font-semibold text-lg">{service.name}</h3>
                      {service.description && (
                        <p className="text-sm text-gray-600">{service.description}</p>
                      )}
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="font-medium">⏱️ {formatDuration(service.duration)}</span>
                        <span className="font-medium">💰 {formatPrice(service.price)}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-gray-300 flex-shrink-0 ml-4">
                      {selectedService === service.id && (
                        <div className="w-3 h-3 rounded-full bg-blue-500" />
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      <div className="flex justify-end pt-6">
        <Button
          onClick={handleContinue}
          disabled={!selectedService}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-2"
        >
          Continuar
        </Button>
      </div>
    </div>
  );
} 