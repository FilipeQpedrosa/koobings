"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Users, Calendar, Settings, Tag } from "lucide-react";
import BusinessCategoryManager from "@/components/admin/BusinessCategoryManager";

export default function AdminBusinessDetailsPage() {
  const router = useRouter();
  const { id } = useParams();
  const [business, setBusiness] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchBusiness() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`/api/admin/businesses/${id}`, {
          credentials: 'include'  // Include cookies for authentication
        });
        if (!res.ok) throw new Error("Negócio não encontrado");
        const response = await res.json();
        console.log("Business data:", response.data); // Debug log
        setBusiness(response.data);
      } catch (err: any) {
        setError(err.message || "Falha ao carregar negócio");
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchBusiness();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Carregando detalhes do negócio...</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="max-w-6xl mx-auto py-8 px-4">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (!business) {
    return (
      <div className="max-w-6xl mx-auto py-8 px-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-gray-600">Negócio não encontrado.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold text-gray-900 break-words flex items-center">
            <Building2 className="mr-3 h-6 w-6" />
            {business.name || "Nome não definido"}
          </h1>
          <p className="text-sm text-gray-500 mt-1">ID: {business.id}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push(`/admin/businesses/${id}/visibility`)}>
            Visibilidade
          </Button>
          <Button variant="outline" onClick={() => router.push(`/admin/businesses/${id}/payments`)}>
            Pagamentos
          </Button>
          <Button variant="outline" onClick={() => router.push(`/admin/businesses/${id}/clients`)}>
            <Users className="mr-2 h-4 w-4" />
            Clientes
          </Button>
          <Button onClick={() => router.push(`/admin/businesses/${id}/edit`)}>
            <Settings className="mr-2 h-4 w-4" />
            Editar
          </Button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Business Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Nome</dt>
                  <dd className="text-sm text-gray-900">{business.name || "Não definido"}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="text-sm text-gray-900">{business.email || "Não definido"}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Telefone</dt>
                  <dd className="text-sm text-gray-900">{business.phone || "Não definido"}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Proprietário</dt>
                  <dd className="text-sm text-gray-900">{business.ownerName || "Não definido"}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Endereço</dt>
                  <dd className="text-sm text-gray-900">{business.address || "Não definido"}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Status</dt>
                  <dd>
                    <Badge className={getStatusBadgeColor(business.status)}>
                      {business.status || "Não definido"}
                    </Badge>
                  </dd>
                </div>
              </dl>
              
              {business.description && (
                <div className="mt-4">
                  <dt className="text-sm font-medium text-gray-500">Descrição</dt>
                  <dd className="text-sm text-gray-900 mt-1">{business.description}</dd>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Category Manager */}
          <BusinessCategoryManager 
            businessId={business.id}
            currentCategory={business.type}
            businessName={business.name}
          />
        </div>

        {/* Right Column - Quick Stats & Actions */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Estatísticas Rápidas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total de Clientes</span>
                  <span className="font-semibold">{business._count?.Client || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Serviços</span>
                  <span className="font-semibold">{business._count?.Service || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Staff</span>
                  <span className="font-semibold">{business._count?.Staff || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Agendamentos</span>
                  <span className="font-semibold">{business._count?.appointments || 0}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => router.push(`/admin/businesses/${id}/clients`)}
                >
                  <Users className="mr-2 h-4 w-4" />
                  Ver Clientes
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => router.push(`/admin/businesses/${id}/edit`)}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Editar Negócio
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => router.push(`/admin/businesses/${id}/visibility`)}
                >
                  <Tag className="mr-2 h-4 w-4" />
                  Gerir Visibilidade
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Creation Info */}
          <Card>
            <CardHeader>
              <CardTitle>Informações do Sistema</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-600">Criado em:</span><br />
                  <span className="font-medium">
                    {business.createdAt ? new Date(business.createdAt).toLocaleString('pt-PT') : 'Não disponível'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Última atualização:</span><br />
                  <span className="font-medium">
                    {business.updatedAt ? new Date(business.updatedAt).toLocaleString('pt-PT') : 'Não disponível'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Slug:</span><br />
                  <span className="font-medium font-mono text-xs">
                    {business.slug || 'Não definido'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 