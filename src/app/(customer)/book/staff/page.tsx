'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { ChevronLeft, User } from 'lucide-react';

interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

interface Business {
  id: string;
  name: string;
}

export default function StaffSelectionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  const serviceId = searchParams.get('serviceId');
  const businessSlug = searchParams.get('businessSlug');

  const [selectedStaff, setSelectedStaff] = useState<string | null>(null);
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [business, setBusiness] = useState<Business | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Validate required parameters
    if (!serviceId || !businessSlug) {
      toast({
        title: 'Erro',
        description: 'Informação de agendamento em falta. Comece novamente.',
        variant: 'destructive'
      });
      router.push('/');
      return;
    }

    async function fetchStaff() {
      try {
        console.log('👥 Fetching staff for business:', businessSlug);
        
        const response = await fetch(`/api/client/staff?businessSlug=${businessSlug}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            toast({
              title: 'Negócio Não Encontrado',
              description: 'O negócio solicitado não foi encontrado.',
              variant: 'destructive'
            });
            router.push('/');
            return;
          }
          throw new Error(`Failed to fetch staff: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('👥 Staff response:', data);
        
        if (data.success) {
          setStaffMembers(data.data.staff || []);
          setBusiness(data.data.business);
          console.log('✅ Staff loaded:', data.data.staff.length);
        } else {
          throw new Error(data.error?.message || 'Failed to load staff');
        }
      } catch (error) {
        console.error('❌ Error fetching staff:', error);
        toast({
          title: 'Erro',
          description: 'Falha ao carregar funcionários. Tente novamente.',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchStaff();
  }, [serviceId, businessSlug, toast, router]);

  const handleBack = () => {
    if (!businessSlug) {
      router.push('/');
      return;
    }
    router.push(`/book?businessSlug=${businessSlug}`);
  };

  const handleContinue = () => {
    if (!selectedStaff) return;

    // Store selection in session storage
    sessionStorage.setItem('selectedStaff', selectedStaff);

    // Navigate to datetime selection
    router.push(`/book/datetime?businessSlug=${businessSlug}&serviceId=${serviceId}&staffId=${selectedStaff}`);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-gray-200 animate-pulse rounded-lg" />
        ))}
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
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="text-center flex-1">
          <h1 className="text-2xl font-bold mb-2">Escolher Funcionário</h1>
          <p className="text-gray-600">Selecione quem prefere que realize o serviço</p>
        </div>
      </div>

      <AnimatePresence>
        {staffMembers.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="text-center py-8"
          >
            <p className="text-gray-500">Nenhum funcionário disponível.</p>
            <Button
              variant="link"
              onClick={handleBack}
              className="mt-2"
            >
              Voltar à seleção de serviços
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {staffMembers.map((staff) => (
              <motion.div
                key={staff.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
              >
                <Card
                  className={`p-4 cursor-pointer transition-all hover:shadow-md border-2 ${
                    selectedStaff === staff.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedStaff(staff.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <User className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{staff.name}</h3>
                      <p className="text-sm text-gray-600">{staff.email}</p>
                      {staff.phone && (
                        <p className="text-sm text-gray-500">{staff.phone}</p>
                      )}
                    </div>
                    <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-gray-300 flex-shrink-0">
                      {selectedStaff === staff.id && (
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
          disabled={!selectedStaff}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2"
        >
          Continuar
        </Button>
      </div>
    </div>
  );
} 