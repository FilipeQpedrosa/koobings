'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Users, Scissors, TrendingUp, AlertTriangle } from 'lucide-react';

interface BusinessInfo {
  id: string;
  name: string;
  logo?: string;
}

export default function BarbeariaOrlandoDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('🏢 [Orlando Dashboard] Session status:', status);
    console.log('🏢 [Orlando Dashboard] Session data:', session);
    console.log('🏢 [Orlando Dashboard] useSession hook available:', typeof useSession);
    console.log('🏢 [Orlando Dashboard] Window location:', typeof window !== 'undefined' ? window.location.href : 'SSR');

    if (status === 'loading') {
      console.log('🏢 [Orlando Dashboard] Session still loading...');
      return;
    }

    if (status === 'unauthenticated') {
      console.log('❌ [Orlando Dashboard] Status is unauthenticated, redirecting to signin');
      router.push('/auth/signin');
      return;
    }

    if (!session) {
      console.log('❌ [Orlando Dashboard] No session object, redirecting to signin');
      router.push('/auth/signin');
      return;
    }

    console.log('✅ [Orlando Dashboard] Session found:', {
      id: session.user?.id,
      email: session.user?.email,
      name: session.user?.name,
      businessId: session.user?.businessId,
      businessName: session.user?.businessName,
      role: session.user?.role,
      staffRole: session.user?.staffRole
    });

    // SECURITY CHECK: Validate this is Orlando's business
    const expectedBusinessId = 'cmckxlexv0000js04ehmx88dq';
    if (session.user.businessId !== expectedBusinessId) {
      console.log('❌ [Orlando Dashboard] SECURITY VIOLATION!');
      console.log('Expected businessId:', expectedBusinessId);
      console.log('Got businessId:', session.user.businessId);
      setError('Acesso negado - Este dashboard é exclusivo da Barbearia Orlando');
      return;
    }

    console.log('✅ [Orlando Dashboard] Security check passed');
    // Fetch business info
    fetchBusinessInfo();
  }, [session, status, router]);

  const fetchBusinessInfo = async () => {
    try {
      console.log('📊 [Orlando Dashboard] Fetching business info...');
      const response = await fetch('/api/business/info');
      const data = await response.json();
      
      console.log('📊 [Orlando Dashboard] Business info response:', data);
      
      if (data.success) {
        setBusinessInfo(data.data);
      } else {
        console.error('❌ [Orlando Dashboard] Failed to fetch business info:', data.error);
        setError('Erro ao carregar informações do negócio');
      }
    } catch (error) {
      console.error('❌ [Orlando Dashboard] Error fetching business info:', error);
      setError('Erro de conexão');
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Erro de Acesso
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">{error}</p>
            <Button 
              onClick={() => router.push('/auth/signin')}
              className="w-full"
            >
              Fazer Login Novamente
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const businessName = businessInfo?.name || session?.user?.businessName || 'Barbearia Orlando';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Scissors className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {businessName} - Dashboard
                </h1>
                <p className="text-sm text-gray-500">
                  Bem-vindo, {session?.user?.name}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                {session?.user?.staffRole || 'Staff'}
              </span>
              <Button
                variant="outline"
                onClick={() => router.push('/auth/signin')}
              >
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Security Status */}
        <div className="mb-6">
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-green-800">
                <div className="h-2 w-2 bg-green-600 rounded-full"></div>
                <span className="text-sm font-medium">
                  🔒 Acesso Seguro Validado - Barbearia Orlando
                </span>
              </div>
              <p className="text-xs text-green-700 mt-1">
                URL: /barbearia-orlando/staff/dashboard | Business ID: {session?.user?.businessId}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Agendamentos Hoje
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">
                +2 desde ontem
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Clientes Ativos
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">145</div>
              <p className="text-xs text-muted-foreground">
                +12% este mês
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Serviços Realizados
              </CardTitle>
              <Scissors className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">89</div>
              <p className="text-xs text-muted-foreground">
                Esta semana
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Receita Mensal
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">€2,450</div>
              <p className="text-xs text-muted-foreground">
                +8% vs mês anterior
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => router.push('/barbearia-orlando/staff/bookings')}
              >
                <Calendar className="mr-2 h-4 w-4" />
                Ver Agendamentos
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => router.push('/barbearia-orlando/staff/clients')}
              >
                <Users className="mr-2 h-4 w-4" />
                Gerir Clientes
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => router.push('/barbearia-orlando/staff/schedule')}
              >
                <Scissors className="mr-2 h-4 w-4" />
                Horários
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Próximos Agendamentos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">João Silva</p>
                    <p className="text-sm text-gray-500">Corte + Barba</p>
                  </div>
                  <span className="text-sm text-blue-600">14:30</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Pedro Santos</p>
                    <p className="text-sm text-gray-500">Corte</p>
                  </div>
                  <span className="text-sm text-blue-600">15:00</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Miguel Costa</p>
                    <p className="text-sm text-gray-500">Barba</p>
                  </div>
                  <span className="text-sm text-blue-600">15:30</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Estatísticas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Taxa de Ocupação</span>
                  <span className="text-sm font-medium">85%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Satisfação Cliente</span>
                  <span className="text-sm font-medium">4.8/5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Tempo Médio Serviço</span>
                  <span className="text-sm font-medium">45min</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
} 