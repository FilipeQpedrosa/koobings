"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Settings, Users, Package, Tag, ArrowRight, Shield, Eye, Database, Lock, Save, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface BusinessPermissions {
  allowStaffToViewAllBookings: boolean;
  restrictStaffToViewAllClients: boolean;
  restrictStaffToViewAllNotes: boolean;
  requireAdminCancelApproval: boolean;
}

export default function StaffSettingsPage() {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);

  const [permissions, setPermissions] = useState<BusinessPermissions>({
    allowStaffToViewAllBookings: false,
    restrictStaffToViewAllClients: false,
    restrictStaffToViewAllNotes: false,
    requireAdminCancelApproval: false,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fix hydration by waiting for client mount
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      fetchBusinessPermissions();
    }
  }, [mounted]);

  const businessSlug = user?.businessSlug;

  if (authLoading) {
    return <div>Loading...</div>;
  }

  if (!businessSlug) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-medium">Business Information Missing</h3>
          <p className="text-red-600">Unable to load business settings. Please try logging in again.</p>
        </div>
      </div>
    );
  }

  const settingsOptions = [
    {
      title: 'Services',
      description: 'Manage your business services and pricing',
      icon: Package,
      href: `/${businessSlug}/staff/settings/services`,
      color: 'text-blue-600'
    },
    {
      title: 'Categories',
      description: 'Organize services into categories',
      icon: Tag,
      href: `/${businessSlug}/staff/settings/categories`,
      color: 'text-green-600'
    },
    {
      title: 'Staff',
      description: 'Manage staff members and permissions',
      icon: Users,
      href: `/${businessSlug}/staff/settings/staff`,
      color: 'text-purple-600'
    }
  ];

  const fetchBusinessPermissions = async () => {
    try {
      const response = await fetch('/api/business/info');
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setPermissions({
            allowStaffToViewAllBookings: data.data.allowStaffToViewAllBookings || false,
            restrictStaffToViewAllClients: data.data.restrictStaffToViewAllClients || false,
            restrictStaffToViewAllNotes: data.data.restrictStaffToViewAllNotes || false,
            requireAdminCancelApproval: data.data.requireAdminCancelApproval || false,
          });
        }
      }
    } catch (error) {
      console.error('Error fetching business permissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const savePermissions = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/business/info', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(permissions),
      });

      if (response.ok) {
        toast({
          title: "Sucesso",
          description: "Configurações de permissões salvas com sucesso!",
        });
      } else {
        throw new Error('Erro ao salvar configurações');
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao salvar configurações",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const updatePermission = (field: keyof BusinessPermissions, value: boolean) => {
    setPermissions(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Don't render dynamic content until mounted on client
  if (!mounted) {
    return (
      <div className="space-y-6 p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Configure your business settings and preferences</p>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 rounded-lg">
          <TabsTrigger 
            value="general" 
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
            onClick={() => console.log('🔧 General tab clicked')}
          >
            <Settings className="h-4 w-4 mr-2" />
            Geral
          </TabsTrigger>
          <TabsTrigger 
            value="permissions" 
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
            onClick={() => console.log('🔧 Permissions tab clicked')}
          >
            <Shield className="h-4 w-4 mr-2" />
            Permissões de Staff
          </TabsTrigger>
        </TabsList>

        {/* Debug Info */}
        <div className="bg-yellow-100 p-4 rounded-lg">
          <p>🔍 Debug: mounted={mounted ? 'true' : 'false'}, loading={loading ? 'true' : 'false'}, saving={saving ? 'true' : 'false'}</p>
          <p>🔍 Permissions: {JSON.stringify(permissions)}</p>
        </div>

        {/* General Settings Tab */}
        <TabsContent value="general" className="space-y-6">
          {/* Settings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {settingsOptions.map((option) => (
              <Card key={option.title} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <option.icon className={`h-5 w-5 mr-2 ${option.color}`} />
                    {option.title}
                  </CardTitle>
                  <CardDescription>{option.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href={option.href}>
                    <Button variant="outline" className="w-full justify-between">
                      Configure
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* General Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                General Settings
              </CardTitle>
              <CardDescription>
                Basic business configuration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Business Name</label>
                  <div className="p-2 bg-gray-50 rounded text-gray-900 mt-1">
                    {user?.businessName || 'Not set'}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Business Slug</label>
                  <div className="p-2 bg-gray-50 rounded text-gray-900 mt-1">
                    {businessSlug}
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <p className="text-sm text-gray-500">
                  Need to update business information? Contact your administrator.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Permissions Tab */}
        <TabsContent value="permissions">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Permissões de Staff por Padrão
                </CardTitle>
                <CardDescription>
                  Configure as permissões padrão para membros da equipa deste negócio.
                </CardDescription>
              </div>
              <Button onClick={savePermissions} disabled={saving || loading}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Salvando...' : 'Salvar'}
              </Button>
            </CardHeader>
            {loading ? (
              <CardContent>
                <div className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
                    <p>Carregando configurações...</p>
                  </div>
                </div>
              </CardContent>
            ) : (
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3 p-4 border rounded-lg">
                    <Eye className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="allow-view-all-bookings" className="text-base font-medium">
                            Ver Todos os Agendamentos
                          </Label>
                          <p className="text-sm text-gray-600 mt-1">
                            Permitir que staff padrão veja agendamentos de todos os membros da equipa, ou apenas os seus próprios.
                          </p>
                        </div>
                        <Switch
                          id="allow-view-all-bookings"
                          checked={permissions.allowStaffToViewAllBookings}
                          onCheckedChange={(checked) => updatePermission('allowStaffToViewAllBookings', checked)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-4 border rounded-lg">
                    <Users className="h-5 w-5 text-green-500 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="restrict-client-access" className="text-base font-medium">
                            Restringir Acesso a Clientes
                          </Label>
                          <p className="text-sm text-gray-600 mt-1">
                            Se ativo, staff só pode ver clientes que criaram. Se inativo, pode ver todos os clientes do negócio.
                          </p>
                        </div>
                        <Switch
                          id="restrict-client-access"
                          checked={permissions.restrictStaffToViewAllClients}
                          onCheckedChange={(checked) => updatePermission('restrictStaffToViewAllClients', checked)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-4 border rounded-lg">
                    <Database className="h-5 w-5 text-yellow-500 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="restrict-notes-access" className="text-base font-medium">
                            Restringir Acesso a Notas
                          </Label>
                          <p className="text-sm text-gray-600 mt-1">
                            Se ativo, staff só pode ver notas que criaram. Se inativo, pode ver todas as notas dos clientes.
                          </p>
                        </div>
                        <Switch
                          id="restrict-notes-access"
                          checked={permissions.restrictStaffToViewAllNotes}
                          onCheckedChange={(checked) => updatePermission('restrictStaffToViewAllNotes', checked)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-4 border rounded-lg">
                    <Lock className="h-5 w-5 text-red-500 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="require-cancel-approval" className="text-base font-medium">
                            Aprovação para Cancelamentos
                          </Label>
                          <p className="text-sm text-gray-600 mt-1">
                            Requerer aprovação de administrador para cancelar agendamentos.
                          </p>
                        </div>
                        <Switch
                          id="require-cancel-approval"
                          checked={permissions.requireAdminCancelApproval}
                          onCheckedChange={(checked) => updatePermission('requireAdminCancelApproval', checked)}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Nota:</strong> Estas configurações aplicam-se a todos os membros da equipa deste negócio. 
                    As alterações terão efeito imediato para novos agendamentos e acessos.
                  </AlertDescription>
                </Alert>
              </CardContent>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 