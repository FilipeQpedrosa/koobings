'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Users, Sparkles, TrendingUp, AlertTriangle } from 'lucide-react';

interface BusinessInfo {
  id: string;
  name: string;
  logo?: string;
}

export default function JuUnhaDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('💅 [Ju-unha Dashboard] Session status:', status);
    console.log('💅 [Ju-unha Dashboard] Session data:', session);

    if (status === 'loading') {
      return;
    }

    if (!session) {
      console.log('❌ [Ju-unha Dashboard] No session, redirecting to signin');
      router.push('/auth/signin');
      return;
    }

    // SECURITY CHECK: Validate this is Julia's business
    const expectedBusinessId = 'cmckxlgcd0004js04sh2db333';
    if (session.user.businessId !== expectedBusinessId) {
      console.log('❌ [Ju-unha Dashboard] SECURITY VIOLATION!');
      console.log('Expected businessId:', expectedBusinessId);
      console.log('Got businessId:', session.user.businessId);
      setError('Acesso negado - Este dashboard é exclusivo da Ju-unha');
      return;
    }

    // Fetch business info
    fetchBusinessInfo();
  }, [session, status, router]);

  const fetchBusinessInfo = async () => {
    try {
      console.log('📊 [Ju-unha Dashboard] Fetching business info...');
      const response = await fetch('/api/business/info');
      const data = await response.json();
      
      console.log('📊 [Ju-unha Dashboard] Business info response:', data);
      
      if (data.success) {
        setBusinessInfo(data.data);
      } else {
        console.error('❌ [Ju-unha Dashboard] Failed to fetch business info:', data.error);
        setError('Erro ao carregar informações do negócio');
      }
    } catch (error) {
      console.error('❌ [Ju-unha Dashboard] Error fetching business info:', error);
      setError('Erro de conexão');
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
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

  const businessName = businessInfo?.name || session?.user?.businessName || 'Ju-unha';

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Sparkles className="h-8 w-8 text-pink-600 mr-3" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {businessName} - Dashboard
                </h1>
                <p className="text-sm text-gray-500">
                  Bem-vinda, {session?.user?.name}
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
                  🔒 Acesso Seguro Validado - Ju-unha
                </span>
              </div>
              <p className="text-xs text-green-700 mt-1">
                URL: /ju-unha/staff/dashboard | Business ID: {session?.user?.businessId}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-pink-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Agendamentos Hoje
              </CardTitle>
              <Calendar className="h-4 w-4 text-pink-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-pink-700">8</div>
              <p className="text-xs text-muted-foreground">
                +1 desde ontem
              </p>
            </CardContent>
          </Card>

          <Card className="border-purple-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Clientes Ativas
              </CardTitle>
              <Users className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-700">92</div>
              <p className="text-xs text-muted-foreground">
                +15% este mês
              </p>
            </CardContent>
          </Card>

          <Card className="border-pink-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Manicures Realizadas
              </CardTitle>
              <Sparkles className="h-4 w-4 text-pink-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-pink-700">64</div>
              <p className="text-xs text-muted-foreground">
                Esta semana
              </p>
            </CardContent>
          </Card>

          <Card className="border-purple-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Receita Mensal
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-700">€1,850</div>
              <p className="text-xs text-muted-foreground">
                +12% vs mês anterior
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="border-pink-200">
            <CardHeader>
              <CardTitle className="text-pink-700">Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full justify-start bg-pink-100 hover:bg-pink-200 text-pink-700 border-pink-300" 
                variant="outline"
                onClick={() => router.push('/ju-unha/staff/bookings')}
              >
                <Calendar className="mr-2 h-4 w-4" />
                Ver Agendamentos
              </Button>
              <Button 
                className="w-full justify-start bg-purple-100 hover:bg-purple-200 text-purple-700 border-purple-300" 
                variant="outline"
                onClick={() => router.push('/ju-unha/staff/clients')}
              >
                <Users className="mr-2 h-4 w-4" />
                Gerir Clientes
              </Button>
              <Button 
                className="w-full justify-start bg-pink-100 hover:bg-pink-200 text-pink-700 border-pink-300" 
                variant="outline"
                onClick={() => router.push('/ju-unha/staff/schedule')}
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Horários
              </Button>
            </CardContent>
          </Card>

          <Card className="border-purple-200">
            <CardHeader>
              <CardTitle className="text-purple-700">Próximos Agendamentos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Ana Maria</p>
                    <p className="text-sm text-gray-500">Manicure + Pedicure</p>
                  </div>
                  <span className="text-sm text-pink-600">14:00</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Sofia Costa</p>
                    <p className="text-sm text-gray-500">Gel</p>
                  </div>
                  <span className="text-sm text-pink-600">15:30</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Carla Santos</p>
                    <p className="text-sm text-gray-500">Nail Art</p>
                  </div>
                  <span className="text-sm text-pink-600">16:00</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-pink-200">
            <CardHeader>
              <CardTitle className="text-pink-700">Estatísticas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Taxa de Ocupação</span>
                  <span className="text-sm font-medium text-pink-700">78%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Satisfação Cliente</span>
                  <span className="text-sm font-medium text-pink-700">4.9/5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Tempo Médio Serviço</span>
                  <span className="text-sm font-medium text-pink-700">60min</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
} 