'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Building2, User, Settings, Shield, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type CreateBusinessData = {
  name: string;
  email: string;
  ownerName: string;
  phone: string;
  address: string;
  description: string;
  plan: 'basic' | 'standard' | 'premium';
  slug: string;
  password: string;
  features: {
    multipleStaff: boolean;
    advancedReports: boolean;
    smsNotifications: boolean;
    customBranding: boolean;
    apiAccess: boolean;
    calendarIntegration: boolean;
  };
};

export default function NewBusinessPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [creating, setCreating] = useState(false);
  const [showCredentials, setShowCredentials] = useState(false);
  const [createdBusinessInfo, setCreatedBusinessInfo] = useState<any>(null);

  const [formData, setFormData] = useState<CreateBusinessData>({
    name: '',
    email: '',
    ownerName: '',
    phone: '',
    address: '',
    description: '',
    plan: 'standard',
    slug: '',
    password: '',
    features: {
      multipleStaff: true,
      advancedReports: true,
      smsNotifications: false,
      customBranding: false,
      apiAccess: false,
      calendarIntegration: true,
    }
  });

  const handleInputChange = (field: keyof CreateBusinessData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFeatureChange = (feature: keyof CreateBusinessData['features'], value: boolean) => {
    setFormData(prev => ({
      ...prev,
      features: { ...prev.features, [feature]: value }
    }));
  };

  const createBusiness = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.ownerName || !formData.password) {
      toast({
        title: "Erro",
        description: "Nome do negócio, email, nome do proprietário e password são obrigatórios",
        variant: "destructive"
      });
      return;
    }

    try {
      setCreating(true);
      const response = await fetch('/api/admin/businesses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('✅ Business created successfully:', data.business);
        
        // Store credentials info to show in modal
        setCreatedBusinessInfo({
          businessName: data.business.name,
          email: data.business.email,
          password: data.tempPassword,
          loginUrl: data.loginUrl,
          isCustomPassword: data.isCustomPassword
        });
        
        toast({
          title: "Sucesso",
          description: `Negócio "${data.business.name}" criado com sucesso!`,
        });
        
        setShowCredentials(true);
        
      } else {
        toast({
          title: "Erro",
          description: data.error || "Erro ao criar negócio",
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
      setCreating(false);
    }
  };

  const planFeatures = {
    basic: {
      name: 'Básico',
      description: 'Ideal para negócios pequenos',
      features: ['1 utilizador', 'Marcações básicas', 'Relatórios simples']
    },
    standard: {
      name: 'Standard',
      description: 'Perfeito para negócios em crescimento',
      features: ['Múltiplos utilizadores', 'Relatórios avançados', 'Integração calendário']
    },
    premium: {
      name: 'Premium',
      description: 'Funcionalidades completas',
      features: ['Todos os recursos', 'SMS', 'Branding personalizado', 'API']
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">Criar Novo Negócio</h1>
              <p className="text-gray-600 mt-1">Configure um novo negócio na plataforma</p>
            </div>
          </div>
        </div>

        <form onSubmit={createBusiness} className="space-y-8">
          {/* Business Information */}
          <Card className="shadow-sm border-gray-200">
            <CardHeader className="bg-gray-50 border-b border-gray-200">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Building2 className="h-5 w-5 text-blue-600" />
                Informações do Negócio
              </CardTitle>
              <CardDescription>
                Detalhes básicos sobre o negócio
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700">Nome do Negócio *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Ex: Salão Bela Vista"
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="contato@negocio.com"
                    required
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="phone" className="text-sm font-medium text-gray-700">Telefone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+351 912 345 678"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="slug" className="text-sm font-medium text-gray-700">Slug (opcional)</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => handleInputChange('slug', e.target.value)}
                    placeholder="deixe vazio para gerar automaticamente"
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="address" className="text-sm font-medium text-gray-700">Morada</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Rua, Número, Cidade"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-sm font-medium text-gray-700">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Breve descrição do negócio..."
                  rows={3}
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

          {/* Owner Information */}
          <Card className="shadow-sm border-gray-200">
            <CardHeader className="bg-gray-50 border-b border-gray-200">
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="h-5 w-5 text-green-600" />
                Proprietário
              </CardTitle>
              <CardDescription>
                Informações do responsável pelo negócio
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="ownerName" className="text-sm font-medium text-gray-700">Nome do Proprietário *</Label>
                  <Input
                    id="ownerName"
                    value={formData.ownerName}
                    onChange={(e) => handleInputChange('ownerName', e.target.value)}
                    placeholder="Nome completo"
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    required
                    minLength={6}
                    className="mt-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Plan Selection */}
          <Card className="shadow-sm border-gray-200">
            <CardHeader className="bg-gray-50 border-b border-gray-200">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Settings className="h-5 w-5 text-purple-600" />
                Plano e Funcionalidades
              </CardTitle>
              <CardDescription>
                Escolha o plano e configure as funcionalidades
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div>
                <Label htmlFor="plan" className="text-sm font-medium text-gray-700">Plano</Label>
                <Select value={formData.plan} onValueChange={(value) => handleInputChange('plan', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(planFeatures).map(([key, plan]) => (
                      <SelectItem key={key} value={key}>
                        <div className="flex flex-col">
                          <span className="font-medium">{plan.name}</span>
                          <span className="text-sm text-gray-500">{plan.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Features */}
              <div className="space-y-4">
                <Label className="text-sm font-medium text-gray-700">Funcionalidades</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <Label htmlFor="multipleStaff" className="font-medium">Múltiplos Funcionários</Label>
                      <p className="text-sm text-gray-500">Permite adicionar vários membros da equipa</p>
                    </div>
                    <Switch
                      id="multipleStaff"
                      checked={formData.features.multipleStaff}
                      onCheckedChange={(checked) => handleFeatureChange('multipleStaff', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <Label htmlFor="advancedReports" className="font-medium">Relatórios Avançados</Label>
                      <p className="text-sm text-gray-500">Relatórios detalhados e analytics</p>
                    </div>
                    <Switch
                      id="advancedReports"
                      checked={formData.features.advancedReports}
                      onCheckedChange={(checked) => handleFeatureChange('advancedReports', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <Label htmlFor="smsNotifications" className="font-medium">Notificações SMS</Label>
                      <p className="text-sm text-gray-500">Envio de SMS para clientes</p>
                    </div>
                    <Switch
                      id="smsNotifications"
                      checked={formData.features.smsNotifications}
                      onCheckedChange={(checked) => handleFeatureChange('smsNotifications', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <Label htmlFor="customBranding" className="font-medium">Branding Personalizado</Label>
                      <p className="text-sm text-gray-500">Logo e cores personalizadas</p>
                    </div>
                    <Switch
                      id="customBranding"
                      checked={formData.features.customBranding}
                      onCheckedChange={(checked) => handleFeatureChange('customBranding', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <Label htmlFor="calendarIntegration" className="font-medium">Integração Calendário</Label>
                      <p className="text-sm text-gray-500">Sincronização com Google Calendar</p>
                    </div>
                    <Switch
                      id="calendarIntegration"
                      checked={formData.features.calendarIntegration}
                      onCheckedChange={(checked) => handleFeatureChange('calendarIntegration', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <Label htmlFor="apiAccess" className="font-medium">Acesso API</Label>
                      <p className="text-sm text-gray-500">Integração com sistemas externos</p>
                    </div>
                    <Switch
                      id="apiAccess"
                      checked={formData.features.apiAccess}
                      onCheckedChange={(checked) => handleFeatureChange('apiAccess', checked)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancelar
              </Button>
              <Button type="submit" disabled={creating} className="bg-blue-600 hover:bg-blue-700">
                {creating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Criando...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Criar Negócio
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>

        {/* Success Modal */}
        {showCredentials && createdBusinessInfo && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="h-5 w-5 text-green-600" />
                <h3 className="text-lg font-semibold">Negócio Criado com Sucesso!</h3>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-2">Credenciais de Acesso</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <strong>Negócio:</strong> {createdBusinessInfo.businessName}
                    </div>
                    <div>
                      <strong>Email:</strong> {createdBusinessInfo.email}
                    </div>
                    <div>
                      <strong>Password:</strong> {createdBusinessInfo.password}
                    </div>
                    <div>
                      <strong>URL de Login:</strong> 
                      <a 
                        href={createdBusinessInfo.loginUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline ml-1"
                      >
                        {createdBusinessInfo.loginUrl}
                      </a>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="text-sm text-yellow-800">
                    <strong>Importante:</strong> Guarde estas credenciais num local seguro. 
                    O proprietário do negócio pode alterar a password após o primeiro login.
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 mt-6">
                <Button variant="outline" onClick={() => setShowCredentials(false)}>
                  Fechar
                </Button>
                <Button onClick={() => router.push('/admin/businesses')} className="bg-blue-600 hover:bg-blue-700">
                  Ver Negócios
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 