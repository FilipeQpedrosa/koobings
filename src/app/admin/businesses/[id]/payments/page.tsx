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
import { ArrowLeft, CreditCard, TestTube, Settings, User, Calendar } from 'lucide-react';

interface PaymentSettings {
  enabled: boolean;
  provider: string | null;
  currency: string;
  autoCharge: boolean;
  depositPercentage: number;
  processingFee: number;
  adminEnabled: boolean;
  adminNotes: string;
  lastUpdatedBy: string | null;
  lastUpdatedAt: string | null;
}

interface Business {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export default function BusinessPaymentsPage() {
  const params = useParams();
  const router = useRouter();
  const businessId = params.id as string;

  const [business, setBusiness] = useState<Business | null>(null);
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [testResults, setTestResults] = useState<any>(null);

  useEffect(() => {
    fetchPaymentSettings();
  }, [businessId]);

  const fetchPaymentSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/businesses/${businessId}/payments`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setBusiness(data.data.business);
      setPaymentSettings(data.data.paymentSettings);
    } catch (error) {
      console.error('Error fetching payment settings:', error);
      setMessage({ type: 'error', text: 'Erro ao carregar configurações de pagamento' });
    } finally {
      setLoading(false);
    }
  };

  const savePaymentSettings = async () => {
    if (!paymentSettings) return;

    try {
      setSaving(true);
      setMessage(null);

      const response = await fetch(`/api/admin/businesses/${businessId}/payments`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminEnabled: paymentSettings.adminEnabled,
          adminNotes: paymentSettings.adminNotes,
          provider: paymentSettings.provider,
          currency: paymentSettings.currency,
          processingFee: paymentSettings.processingFee,
          autoCharge: paymentSettings.autoCharge,
          depositPercentage: paymentSettings.depositPercentage
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setMessage({ type: 'success', text: 'Configurações de pagamento atualizadas com sucesso!' });
      
      // Refresh data to get updated timestamps
      fetchPaymentSettings();
    } catch (error) {
      console.error('Error saving payment settings:', error);
      setMessage({ type: 'error', text: 'Erro ao salvar configurações de pagamento' });
    } finally {
      setSaving(false);
    }
  };

  const runPaymentTest = async (action: 'test_connection' | 'simulate_payment') => {
    try {
      setTesting(true);
      setTestResults(null);

      const response = await fetch(`/api/admin/businesses/${businessId}/payments/test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setTestResults(data.data);
      setMessage({ 
        type: data.data.status === 'success' || data.data.status === 'completed' ? 'success' : 'error', 
        text: data.data.message 
      });
    } catch (error) {
      console.error('Error running payment test:', error);
      setMessage({ type: 'error', text: 'Erro ao executar teste de pagamento' });
    } finally {
      setTesting(false);
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

  if (!business || !paymentSettings) {
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
          <h1 className="text-3xl font-bold">Configurações de Pagamento</h1>
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
            <Label className="text-sm font-medium">Criado em</Label>
            <p className="text-sm text-muted-foreground">
              {new Date(business.createdAt).toLocaleDateString('pt-PT')}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Payment Control */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Controlo de Pagamentos
            <Badge variant={paymentSettings.adminEnabled ? 'default' : 'secondary'}>
              {paymentSettings.adminEnabled ? 'Ativado' : 'Desativado'}
            </Badge>
          </CardTitle>
          <CardDescription>
            Controlo administrativo dos pagamentos para este negócio
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="admin-enabled"
              checked={paymentSettings.adminEnabled}
              onCheckedChange={(checked) => 
                setPaymentSettings(prev => prev ? { ...prev, adminEnabled: checked } : null)
              }
            />
            <Label htmlFor="admin-enabled" className="text-sm font-medium">
              Permitir pagamentos para este negócio
            </Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="admin-notes">Notas do Administrador</Label>
            <Textarea
              id="admin-notes"
              placeholder="Notas internas sobre as configurações de pagamento..."
              value={paymentSettings.adminNotes}
              onChange={(e) => 
                setPaymentSettings(prev => prev ? { ...prev, adminNotes: e.target.value } : null)
              }
              rows={3}
            />
          </div>

          {paymentSettings.lastUpdatedBy && (
            <div className="text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Última atualização: {new Date(paymentSettings.lastUpdatedAt!).toLocaleString('pt-PT')}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Provider Settings */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configurações do Provedor
          </CardTitle>
          <CardDescription>
            Configurações técnicas de pagamento (aplicam-se apenas se os pagamentos estiverem ativados)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="provider">Provedor de Pagamento</Label>
              <select
                id="provider"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={paymentSettings.provider || ''}
                onChange={(e) => 
                  setPaymentSettings(prev => prev ? { ...prev, provider: e.target.value || null } : null)
                }
              >
                <option value="">Selecionar provedor</option>
                <option value="stripe">Stripe</option>
                <option value="paypal">PayPal</option>
                <option value="mbway">MBWay</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">Moeda</Label>
              <Input
                id="currency"
                value={paymentSettings.currency}
                onChange={(e) => 
                  setPaymentSettings(prev => prev ? { ...prev, currency: e.target.value } : null)
                }
                placeholder="EUR"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="processing-fee">Taxa de Processamento (%)</Label>
              <Input
                id="processing-fee"
                type="number"
                step="0.1"
                value={paymentSettings.processingFee}
                onChange={(e) => 
                  setPaymentSettings(prev => prev ? { ...prev, processingFee: parseFloat(e.target.value) || 0 } : null)
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deposit-percentage">Percentagem de Depósito (%)</Label>
              <Input
                id="deposit-percentage"
                type="number"
                step="1"
                value={paymentSettings.depositPercentage}
                onChange={(e) => 
                  setPaymentSettings(prev => prev ? { ...prev, depositPercentage: parseInt(e.target.value) || 0 } : null)
                }
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="auto-charge"
              checked={paymentSettings.autoCharge}
              onCheckedChange={(checked) => 
                setPaymentSettings(prev => prev ? { ...prev, autoCharge: checked } : null)
              }
            />
            <Label htmlFor="auto-charge" className="text-sm font-medium">
              Cobrança automática quando serviço é concluído
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Testing */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="h-5 w-5" />
            Testes de Pagamento
          </CardTitle>
          <CardDescription>
            Executar testes para verificar configurações
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <Button
              variant="outline"
              onClick={() => runPaymentTest('test_connection')}
              disabled={testing}
            >
              {testing ? 'Testando...' : 'Testar Conexão'}
            </Button>
            <Button
              variant="outline"
              onClick={() => runPaymentTest('simulate_payment')}
              disabled={testing}
            >
              {testing ? 'Testando...' : 'Simular Pagamento'}
            </Button>
          </div>

          {testResults && (
            <Alert className={`${testResults.status === 'success' || testResults.status === 'completed' ? 'border-green-500' : 'border-red-500'}`}>
              <AlertDescription>
                <div className="space-y-1">
                  <div><strong>Ação:</strong> {testResults.action}</div>
                  <div><strong>Status:</strong> {testResults.status}</div>
                  <div><strong>Mensagem:</strong> {testResults.message}</div>
                  {testResults.transactionId && (
                    <div><strong>Transaction ID:</strong> {testResults.transactionId}</div>
                  )}
                  {testResults.amount && (
                    <div><strong>Valor:</strong> €{testResults.amount}</div>
                  )}
                </div>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-4">
        <Button onClick={savePaymentSettings} disabled={saving}>
          {saving ? 'Salvando...' : 'Salvar Configurações'}
        </Button>
        <Button variant="outline" onClick={() => router.push(`/admin/businesses/${businessId}`)}>
          Ver Negócio
        </Button>
      </div>
    </div>
  );
} 