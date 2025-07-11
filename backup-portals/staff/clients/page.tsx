"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Users, Search, Phone, Mail, Calendar, ArrowLeft } from "lucide-react";
import { useAuth } from '@/hooks/useAuth';

interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  lastVisit?: string;
  totalVisits?: number;
  totalAppointments?: number;
  status?: string;
  notes?: string;
}

interface ClientMetrics {
  totalClients: number;
  visitsThisMonth: number;
  clientsWithContact: number;
}

export default function StaffClients() {
  const { user, loading, authenticated } = useAuth();
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [metrics, setMetrics] = useState<ClientMetrics>({ totalClients: 0, visitsThisMonth: 0, clientsWithContact: 0 });
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (loading) return;
    
    if (!authenticated || !user) {
      router.push('/auth/signin');
      return;
    }
    
    fetchClients();
  }, [user, loading, authenticated, router]);

  // Refresh clients when page becomes visible (when coming back from other pages)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && !loading && authenticated && user) {
        fetchClients();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [loading, authenticated, user]);

  const fetchClients = async () => {
    setIsLoading(true);
    setError("");
    
    try {
      
      const response = await fetch(`/api/business/clients?_t=${Date.now()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
        credentials: 'include',
        cache: 'no-store'
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.success) {
        setClients(result.data.clients || []);
        setMetrics(result.data.metrics || { totalClients: 0, visitsThisMonth: 0, clientsWithContact: 0 });
      } else {
        throw new Error(result.error?.message || 'Erro ao carregar clientes');
      }
    } catch (err: any) {
      console.error('❌ Error fetching clients:', err);
      setError(err.message || "Erro ao carregar clientes");
      setClients([]);
      setMetrics({ totalClients: 0, visitsThisMonth: 0, clientsWithContact: 0 });
    } finally {
      setIsLoading(false);
    }
  };

  const filtered = clients.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      (c.email && c.email.toLowerCase().includes(q)) ||
      (c.phone && c.phone.toLowerCase().includes(q))
    );
  });

  // Determine business slug and theme color
  const businessSlug = user?.businessName?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || 'staff';
  const isOrlando = user?.businessName?.toLowerCase().includes('orlando');
  const isJulia = user?.businessName?.toLowerCase().includes('ju-unha') || user?.businessName?.toLowerCase().includes('julia');
  
  const primaryColor = isOrlando ? 'blue' : isJulia ? 'pink' : 'indigo';
  const primaryColorClasses = {
    blue: 'text-blue-600 bg-blue-600 hover:bg-blue-700 border-blue-600',
    pink: 'text-pink-600 bg-pink-600 hover:bg-pink-700 border-pink-600', 
    indigo: 'text-indigo-600 bg-indigo-600 hover:bg-indigo-700 border-indigo-600'
  };

  if (loading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className={`animate-spin rounded-full h-8 w-8 border-b-2 border-${primaryColor}-600`}></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="p-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Users className={`h-8 w-8 ${primaryColorClasses[primaryColor].split(' ')[0]}`} />
              Clientes
            </h1>
            <p className="text-gray-600 mt-1">Gerir clientes de {user?.businessName}</p>
          </div>
        </div>
        <Button 
          className={primaryColorClasses[primaryColor].split(' ').slice(1, 3).join(' ')}
          onClick={() => router.push(`/${user?.businessSlug}/staff/clients/new`)}
        >
          <Plus className="h-5 w-5 mr-2" />
          Adicionar Cliente
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por nome, email ou telefone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="mt-4 flex justify-between items-center">
            <span className="text-xs text-gray-500">
              Última atualização: {new Date().toLocaleTimeString('pt-PT')} | {clients.length} clientes carregados
            </span>
            <Button variant="outline" size="sm" onClick={() => fetchClients()}>
              🔄 Forçar Atualização
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className={`p-2 rounded-lg bg-${primaryColor}-100`}>
                <Users className={`h-6 w-6 ${primaryColorClasses[primaryColor].split(' ')[0]}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total de Clientes</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.totalClients}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-green-100">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Visitas este Mês</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.visitsThisMonth}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-purple-100">
                <Phone className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Com Contacto</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.clientsWithContact}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Clients List */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-800">{error}</p>
            <Button onClick={fetchClients} className="mt-4" variant="outline">
              Tentar Novamente
            </Button>
          </CardContent>
        </Card>
      )}

      {filtered.length === 0 && !error ? (
        <Card>
          <CardContent className="pt-12 pb-12 text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {search ? "Nenhum cliente encontrado" : "Nenhum cliente cadastrado"}
            </h3>
            <p className="text-gray-500 mb-6">
              {search 
                ? "Tente ajustar sua busca ou verificar a ortografia." 
                : "Comece adicionando o primeiro cliente."
              }
            </p>
            {!search && (
              <Button 
                className={primaryColorClasses[primaryColor].split(' ').slice(1, 3).join(' ')}
                onClick={() => router.push(`/${user?.businessSlug}/staff/clients/new`)}
              >
                <Plus className="h-5 w-5 mr-2" />
                Adicionar Primeiro Cliente
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filtered.map((client) => (
            <Card key={client.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <div className={`w-10 h-10 rounded-full bg-${primaryColor}-100 flex items-center justify-center`}>
                        <span className={`${primaryColorClasses[primaryColor].split(' ')[0]} font-semibold`}>
                          {client.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900">{client.name}</h3>
                        <p className="text-sm text-gray-500">
                          {client.totalVisits || 0} visitas • Última: {client.lastVisit ? new Date(client.lastVisit).toLocaleDateString('pt-PT') : 'Nunca'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                      {client.email && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail className="h-4 w-4" />
                          <span>{client.email}</span>
                        </div>
                      )}
                      {client.phone && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="h-4 w-4" />
                          <span>{client.phone}</span>
                        </div>
                      )}
                    </div>
                    
                    {client.notes && (
                      <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                        <span className="font-medium">Notas:</span> {client.notes}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2 sm:flex-col">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => router.push(`/staff/clients/${client.id}`)}
                    >
                      Ver Detalhes
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => router.push(`/staff/schedule?client=${client.id}`)}
                    >
                      Novo Agendamento
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 