'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Plus, Search, ExternalLink, Settings, Users, Calendar, Edit, Pause, Play, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

interface Business {
  id: string;
  name: string;
  slug: string;
  email: string;
  ownerName?: string;
  phone?: string;
  plan: string;
  status: string;
  features: Record<string, boolean>;
  createdAt: string;
  _count: {
    staff: number;
    appointments: number;
    services: number;
  };
}

export default function BusinessesPage() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    fetchBusinesses();
  }, [search]);

  const fetchBusinesses = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      
      // Add cache-busting parameter to ensure fresh data
      params.append('_t', Date.now().toString());
      
      const response = await fetch(`/api/admin/businesses?${params}`, {
        // Disable caching to always get fresh data
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
        },
      });
      const data = await response.json();
      
      if (response.ok) {
        setBusinesses(data.businesses);
      } else {
        toast({
          title: "Erro",
          description: data.error || "Erro ao carregar negócios",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao conectar com o servidor",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateBusinessStatus = async (businessId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/businesses/${businessId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Sucesso",
          description: data.message,
        });
        
        // Reload businesses list
        await fetchBusinesses();
      } else {
        toast({
          title: "Erro",
          description: data.error || "Erro ao atualizar status",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao conectar com o servidor",
        variant: "destructive"
      });
    }
  };

  const deleteBusiness = async (businessId: string) => {
    const confirmed = window.confirm(
      `Tem a certeza que deseja eliminar este negócio? Esta ação não pode ser desfeita!`
    );
    
    if (!confirmed) return;

    try {
      const response = await fetch(`/api/admin/businesses/${businessId}/status`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Sucesso",
          description: data.message,
        });
        
        // Reload businesses list
        await fetchBusinesses();
      } else {
        toast({
          title: "Erro",
          description: data.error || "Erro ao eliminar negócio",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao conectar com o servidor",
        variant: "destructive"
      });
    }
  };

  const getBusinessUrl = (business: Business) => {
    // Direct link to universal staff portal with business slug for admin access
    return `/staff/dashboard?businessSlug=${business.slug}`;
  };

  const getPlanBadgeColor = (plan: string) => {
    switch (plan) {
      case 'basic': return 'bg-gray-100 text-gray-800';
      case 'standard': return 'bg-blue-100 text-blue-800';
      case 'premium': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'SUSPENDED': return 'bg-red-100 text-red-800';
      case 'INACTIVE': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'Ativo';
      case 'PENDING': return 'Pendente';
      case 'SUSPENDED': return 'Suspenso';
      case 'INACTIVE': return 'Inativo';
      default: return status;
    }
  };

  const handleCreateBusiness = () => {
    console.log('🔥 CREATE BUSINESS BUTTON CLICKED');
    console.log('🔥 Navigating to: /admin/businesses/new');
    
    // Clear any potential cache
    if (typeof window !== 'undefined') {
      window.localStorage.clear();
      window.sessionStorage.clear();
    }
    
    // Force navigation with cache busting
    const url = `/admin/businesses/new?t=${Date.now()}`;
    console.log('🔥 Final URL:', url);
    
    // Try multiple navigation methods
    try {
      router.push(url);
    } catch (error) {
      console.error('Router push failed:', error);
      window.location.href = url;
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestão de Negócios</h1>
          <p className="text-gray-600">Gerir todos os negócios da plataforma</p>
        </div>
        
        <button 
          onClick={handleCreateBusiness}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Criar Negócio
        </button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Pesquisar negócios..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Businesses Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando negócios...</p>
        </div>
      ) : businesses.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Nenhum negócio encontrado</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {businesses.map((business) => (
            <Card key={business.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg truncate">{business.name}</CardTitle>
                    <p className="text-sm text-gray-600 truncate">{business.email}</p>
                  </div>
                  <div className="flex flex-col gap-2 ml-3 flex-shrink-0">
                    <Badge 
                      variant="secondary" 
                      className={`${getPlanBadgeColor(business.plan)} text-xs px-2 py-1 text-center`}
                    >
                      {business.plan}
                    </Badge>
                    <Badge 
                      variant="secondary" 
                      className={`${getStatusBadgeColor(business.status)} text-xs px-2 py-1 text-center`}
                    >
                      {getStatusText(business.status)}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="h-4 w-4 mr-2" />
                    <span>{business._count.staff} funcionários</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{business._count.appointments} marcações</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <Settings className="h-4 w-4 mr-2" />
                    <span>{business._count.services} serviços</span>
                  </div>
                  
                  <div className="pt-3 border-t space-y-2">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => window.open(getBusinessUrl(business), '_blank')}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Abrir Portal
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/admin/businesses/${business.id}/edit`)}
                        title="Editar negócio"
                        className="px-3"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex gap-2">
                      {business.status === 'ACTIVE' ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateBusinessStatus(business.id, 'SUSPENDED')}
                          className="flex-1 text-orange-600 hover:text-orange-700"
                        >
                          <Pause className="h-4 w-4 mr-2" />
                          Pausar
                        </Button>
                      ) : business.status === 'SUSPENDED' ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateBusinessStatus(business.id, 'ACTIVE')}
                          className="flex-1 text-green-600 hover:text-green-700"
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Ativar
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateBusinessStatus(business.id, 'ACTIVE')}
                          className="flex-1 text-green-600 hover:text-green-700"
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Ativar
                        </Button>
                      )}
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteBusiness(business.id)}
                        className="px-3 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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