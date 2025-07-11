'use client';

import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Users, Sparkles, TrendingUp, Plus } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';

interface BusinessInfo {
  id: string;
  name: string;
  logo?: string;
}

export default function JuUnhaDashboard() {
  const { user, loading, authenticated } = useAuth();
  const router = useRouter();
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (loading) return;

    if (!authenticated || !user) {
      router.push('/auth/signin');
      return;
    }

    // SECURITY CHECK: Validate this is for Ju-unha business
    const isJuUnhaUser = user.businessName?.toLowerCase() === 'ju-unha';

    if (!isJuUnhaUser) {
      router.push('/auth/signin');
      return;
    }

    // Fetch business info
    fetchBusinessInfo();
  }, [user, loading, authenticated, router]);

  const fetchBusinessInfo = async () => {
    try {
      const response = await fetch('/api/business/info');
      const data = await response.json();
      
      if (data.success) {
        setBusinessInfo(data.data);
      }
    } catch (error) {
      console.error('Error fetching business info:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (loading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  if (!authenticated || !user) {
    return null;
  }

  return (
    <DashboardLayout 
      businessSlug="ju-unha" 
      user={{
        name: user.name || '',
        role: 'Admin',
        businessName: user.businessName || ''
      }}
    >
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Ju-unha Dashboard
          </h1>
          <p className="text-gray-600">
            Bem-vinda de volta, {user.name}! Aqui está uma visão geral da sua agenda
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-pink-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-pink-100">
                  <Calendar className="h-6 w-6 text-pink-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Agendamentos Hoje</p>
                  <p className="text-2xl font-bold text-pink-700">8</p>
                  <p className="text-xs text-gray-500">+1 desde ontem</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-purple-100">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Clientes Ativas</p>
                  <p className="text-2xl font-bold text-purple-700">92</p>
                  <p className="text-xs text-gray-500">+15% este mês</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-pink-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-pink-100">
                  <Sparkles className="h-6 w-6 text-pink-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Serviços Realizados</p>
                  <p className="text-2xl font-bold text-pink-700">156</p>
                  <p className="text-xs text-gray-500">Esta semana</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-purple-100">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Taxa de Satisfação</p>
                  <p className="text-2xl font-bold text-purple-700">98%</p>
                  <p className="text-xs text-gray-500">Últimos 30 dias</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Appointments */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Agendamentos Recentes</CardTitle>
              <Button className="bg-pink-600 hover:bg-pink-700">
                <Plus className="h-4 w-4 mr-2" />
                Novo Agendamento
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg border-pink-100">
                <div>
                  <p className="font-medium">Maria Silva</p>
                  <p className="text-sm text-gray-500">Manicure + Pedicure • Hoje às 14:00</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                    Confirmado
                  </span>
                  <Button variant="outline" size="sm">Ver Detalhes</Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg border-pink-100">
                <div>
                  <p className="font-medium">Ana Costa</p>
                  <p className="text-sm text-gray-500">Unhas de Gel • Amanhã às 10:30</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                    Pendente
                  </span>
                  <Button variant="outline" size="sm">Ver Detalhes</Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg border-pink-100">
                <div>
                  <p className="font-medium">Carla Santos</p>
                  <p className="text-sm text-gray-500">Pedicure • Amanhã às 15:00</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                    Agendado
                  </span>
                  <Button variant="outline" size="sm">Ver Detalhes</Button>
                </div>
              </div>

              <div className="text-center py-4">
                <p className="text-gray-500">Mais agendamentos na agenda</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
} 