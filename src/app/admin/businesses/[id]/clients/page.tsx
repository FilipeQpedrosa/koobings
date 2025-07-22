'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Users, Settings, User, Calendar, Shield } from 'lucide-react';

interface ClientSettings {
  enabled: boolean;
  allowOnlineBooking: boolean;
  allowSelfRegistration: boolean;
  requireApproval: boolean;
  maxClientsPerBusiness: number;
  autoConfirmBookings: boolean;
  adminEnabled: boolean;
  adminNotes: string;
  lastUpdatedBy: string | null;
  lastUpdatedAt: string | null;
}

interface Business {
  id: string;
  name: string;
  slug: string;
  email: string;
  status: string;
  createdAt: string;
}

export default function BusinessClientsPage() {
  const params = useParams();
  const router = useRouter();
  const businessId = params.id as string;

  const [business, setBusiness] = useState<Business | null>(null);
  const [clientSettings, setClientSettings] = useState<ClientSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  useEffect(() => {
    fetchClientSettings();
  }, [businessId]);

  const fetchClientSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/businesses/${businessId}/clients`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setBusiness(data.data.business);
      setClientSettings(data.data.clientSettings);
    } catch (error) {
      console.error('Error fetching client settings:', error);
      setMessage({ type: 'error', text: 'Erro ao carregar configurações de clientes' });
    } finally {
      setLoading(false);
    }
  };

  const saveClientSettings = async () => {
    if (!clientSettings) return;

    try {
      setSaving(true);
      setMessage(null);

      const response = await fetch(`/api/admin/businesses/${businessId}/clients`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminEnabled: clientSettings.adminEnabled,
          adminNotes: clientSettings.adminNotes,
          allowOnlineBooking: clientSettings.allowOnlineBooking,
          allowSelfRegistration: clientSettings.allowSelfRegistration,
          requireApproval: clientSettings.requireApproval,
          maxClientsPerBusiness: clientSettings.maxClientsPerBusiness,
          autoConfirmBookings: clientSettings.autoConfirmBookings
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setMessage({ type: 'success', text: 'Configurações de clientes atualizadas com sucesso!' });
      
      // Refresh data to get updated timestamps
      fetchClientSettings();
    } catch (error) {
      console.error('Error saving client settings:', error);
      setMessage({ type: 'error', text: 'Erro ao salvar configurações de clientes' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </div>
        <div className="text-center py-8">Carregando configurações...</div>
      </div>
    );
  }

  if (!business || !clientSettings) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </div>
        <Alert>
          <AlertDescription>Negócio não encontrado</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Configurações de Clientes</h1>
          <p className="text-muted-foreground">{business.name}</p>
        </div>
      </div>

      {/* Messages */}
      {message && (
        <Alert className={`mb-6 ${message.type === 'error' ? 'border-red-500' : message.type === 'success' ? 'border-green-500' : 'border-blue-500'}`}>
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      {/* Business Info */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Informações do Negócio
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label className="text-sm font-medium">Nome</Label>
            <p className="text-sm text-muted-foreground">{business.name}</p>
          </div>
          <div>
            <Label className="text-sm font-medium">Slug</Label>
            <p className="text-sm text-muted-foreground">{business.slug}</p>
          </div>
          <div>
            <Label className="text-sm font-medium">Status</Label>
            <Badge variant={business.status === 'ACTIVE' ? 'default' : 'secondary'}>
              {business.status === 'ACTIVE' ? 'Ativo' : business.status}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Client Portal Control */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Controlo do Portal Cliente
            <Badge variant={clientSettings.adminEnabled ? 'default' : 'secondary'}>
              {clientSettings.adminEnabled ? 'Ativado' : 'Desativado'}
            </Badge>
          </CardTitle>
          <CardDescription>
            Controlo administrativo do acesso de clientes para este negócio
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="admin-enabled"
              checked={clientSettings.adminEnabled}
              onCheckedChange={(checked) => 
                setClientSettings(prev => prev ? { ...prev, adminEnabled: checked } : null)
              }
            />
            <Label htmlFor="admin-enabled" className="text-sm font-medium">
              Permitir acesso de clientes para este negócio
            </Label>
          </div>

          <Alert className="border-amber-200 bg-amber-50">
            <Shield className="h-4 w-4" />
            <AlertDescription>
              <span className="text-amber-800">
                <strong>Atenção:</strong> Desabilitar o acesso de clientes impedirá que novos clientes se registem 
                e que clientes existentes façam marcações online. Use com cuidado.
              </span>
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Label htmlFor="admin-notes">Notas do Administrador</Label>
            <Textarea
              id="admin-notes"
              placeholder="Notas internas sobre as configurações de clientes..."
              value={clientSettings.adminNotes}
              onChange={(e) => 
                setClientSettings(prev => prev ? { ...prev, adminNotes: e.target.value } : null)
              }
              rows={3}
            />
          </div>

          {clientSettings.lastUpdatedBy && (
            <div className="text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Última atualização: {new Date(clientSettings.lastUpdatedAt!).toLocaleString('pt-PT')}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Client Access Settings */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configurações de Acesso
          </CardTitle>
          <CardDescription>
            Configurações específicas para clientes (aplicam-se apenas se o acesso estiver ativado)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center space-x-2">
              <Switch
                id="allow-booking"
                checked={clientSettings.allowOnlineBooking}
                onCheckedChange={(checked) => 
                  setClientSettings(prev => prev ? { ...prev, allowOnlineBooking: checked } : null)
                }
                disabled={!clientSettings.adminEnabled}
              />
              <div className="flex-1">
                <Label htmlFor="allow-booking" className="text-sm font-medium">
                  Permitir marcações online
                </Label>
                <p className="text-xs text-muted-foreground">
                  Clientes podem agendar serviços via portal
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="allow-registration"
                checked={clientSettings.allowSelfRegistration}
                onCheckedChange={(checked) => 
                  setClientSettings(prev => prev ? { ...prev, allowSelfRegistration: checked } : null)
                }
                disabled={!clientSettings.adminEnabled}
              />
              <div className="flex-1">
                <Label htmlFor="allow-registration" className="text-sm font-medium">
                  Permitir auto-registo
                </Label>
                <p className="text-xs text-muted-foreground">
                  Novos clientes podem criar conta automaticamente
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="require-approval"
                checked={clientSettings.requireApproval}
                onCheckedChange={(checked) => 
                  setClientSettings(prev => prev ? { ...prev, requireApproval: checked } : null)
                }
                disabled={!clientSettings.adminEnabled}
              />
              <div className="flex-1">
                <Label htmlFor="require-approval" className="text-sm font-medium">
                  Requer aprovação manual
                </Label>
                <p className="text-xs text-muted-foreground">
                  Novos clientes precisam ser aprovados pelo staff
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="auto-confirm"
                checked={clientSettings.autoConfirmBookings}
                onCheckedChange={(checked) => 
                  setClientSettings(prev => prev ? { ...prev, autoConfirmBookings: checked } : null)
                }
                disabled={!clientSettings.adminEnabled}
              />
              <div className="flex-1">
                <Label htmlFor="auto-confirm" className="text-sm font-medium">
                  Confirmar marcações automaticamente
                </Label>
                <p className="text-xs text-muted-foreground">
                  Marcações são confirmadas sem intervenção manual
                </p>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="max-clients">Máximo de clientes por negócio</Label>
            <Input
              id="max-clients"
              type="number"
              min="0"
              max="10000"
              value={clientSettings.maxClientsPerBusiness}
              onChange={(e) => 
                setClientSettings(prev => prev ? { 
                  ...prev, 
                  maxClientsPerBusiness: parseInt(e.target.value) || 0 
                } : null)
              }
              disabled={!clientSettings.adminEnabled}
              className="max-w-xs"
            />
            <p className="text-xs text-muted-foreground">
              0 = sem limite. Útil para controlar crescimento de negócios.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-4">
        <Button onClick={saveClientSettings} disabled={saving}>
          {saving ? 'Guardando...' : 'Guardar Configurações'}
        </Button>
        <Button variant="outline" onClick={() => router.push(`/admin/businesses/${businessId}`)}>
          Ver Negócio
        </Button>
        <Button variant="outline" onClick={() => router.push(`/admin/businesses/${businessId}/payments`)}>
          Configurações de Pagamento
        </Button>
      </div>
    </div>
  );
} 