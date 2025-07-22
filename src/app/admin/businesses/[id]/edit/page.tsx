'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Building2, User, Settings, Shield, Save, Key, AlertCircle, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';

type EditBusinessData = {
  name: string;
  email: string;
  ownerName: string;
  phone: string;
  address: string;
  description: string;
  type: 'basic' | 'standard' | 'premium';  // Use specific types instead of generic string
  status: 'ACTIVE' | 'PENDING' | 'SUSPENDED' | 'INACTIVE';
  password: string;
  settings: {  // Use 'settings' instead of 'features'
    multipleStaff: boolean;
    advancedReports: boolean;
    smsNotifications: boolean;
    customBranding: boolean;
    apiAccess: boolean;
    calendarIntegration: boolean;
    clientPortalEnabled?: boolean;
    allowOnlineBooking?: boolean;
    allowSelfRegistration?: boolean;
    requireApproval?: boolean;
    autoConfirmBookings?: boolean;
    paymentsEnabled?: boolean;
    maxClients?: number;  // Fix: number instead of boolean
  };
};

export default function EditBusinessPage() {
  const router = useRouter();
  const { id } = useParams();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [business, setBusiness] = useState<any>(null);

  const [formData, setFormData] = useState<EditBusinessData>({
    name: '',
    email: '',
    ownerName: '',
    phone: '',
    address: '',
    description: '',
    type: 'standard',
    // slug: '', // REMOVED - column doesn't exist in database
    status: 'ACTIVE',
    password: '',
    settings: {
      multipleStaff: true,
      advancedReports: true,
      smsNotifications: false,
      customBranding: false,
      apiAccess: false,
      calendarIntegration: true,
      clientPortalEnabled: true,
      allowOnlineBooking: true,
      allowSelfRegistration: true,
      requireApproval: false,
      autoConfirmBookings: true,
      paymentsEnabled: false,
      maxClients: 0,
    }
  });

  useEffect(() => {
    fetchBusiness();
  }, [id]);

  const fetchBusiness = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/businesses/${id}`, {
        credentials: 'include'  // Include cookies for authentication
      });
      const data = await response.json();
      
      if (response.ok) {
        const businessData = data.data || data;
        setBusiness(businessData);
        
        // Populate form with existing data
        setFormData({
          name: businessData.name || '',
          email: businessData.email || '',
          ownerName: businessData.ownerName || '',
          phone: businessData.phone || '',
          address: businessData.address || '',
          description: businessData.description || '',
          type: (['basic', 'standard', 'premium'].includes(businessData.type)) ? businessData.type : 'standard', // Ensure valid type
          status: businessData.status || 'ACTIVE',
          password: '',
          settings: {
            multipleStaff: businessData.settings?.multipleStaff ?? true,
            advancedReports: businessData.settings?.advancedReports ?? true,
            smsNotifications: businessData.settings?.smsNotifications ?? false,
            customBranding: businessData.settings?.customBranding ?? false,
            apiAccess: businessData.settings?.apiAccess ?? false,
            calendarIntegration: businessData.settings?.calendarIntegration ?? true,
            clientPortalEnabled: businessData.settings?.clientPortalEnabled ?? true,
            allowOnlineBooking: businessData.settings?.allowOnlineBooking ?? true,
            allowSelfRegistration: businessData.settings?.allowSelfRegistration ?? true,
            requireApproval: businessData.settings?.requireApproval ?? false,
            autoConfirmBookings: businessData.settings?.autoConfirmBookings ?? true,
            paymentsEnabled: businessData.settings?.paymentsEnabled ?? false,
            maxClients: businessData.settings?.maxClients || 0,
          }
        });
      } else {
        toast({
          title: "Erro",
          description: data.error || "Erro ao carregar negócio",
          variant: "destructive"
        });
        router.push('/admin/businesses');
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao conectar com o servidor",
        variant: "destructive"
      });
      router.push('/admin/businesses');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof EditBusinessData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFeatureChange = (feature: keyof EditBusinessData['settings'], value: boolean) => {
    setFormData(prev => ({
      ...prev,
      settings: { ...prev.settings, [feature]: value }
    }));
  };

  const updateBusiness = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.ownerName) {
      toast({
        title: "Erro",
        description: "Email e nome do proprietário são obrigatórios",
        variant: "destructive"
      });
      return;
    }

    try {
      setSaving(true);
      
      // Remove 'name' from the data being sent since it's read-only
      const { name, ...updateData } = formData;
      
      const response = await fetch(`/api/admin/businesses/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',  // Include cookies for authentication
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Sucesso",
          description: `Negócio "${business?.name}" atualizado com sucesso!`,
        });
        
        // Refresh data
        await fetchBusiness();
        
      } else {
        toast({
          title: "Erro",
          description: data.error || "Erro ao atualizar negócio",
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
      setSaving(false);
    }
  };

  const planFeatures = {
    basic: {
      name: 'Básico',
      description: 'Ideal para negócios pequenos',
      price: 'Gratuito',
      color: 'bg-gray-50 border-gray-200'
    },
    standard: {
      name: 'Standard',
      description: 'Perfeito para negócios em crescimento',
      price: '€29/mês',
      color: 'bg-blue-50 border-blue-200'
    },
    premium: {
      name: 'Premium',
      description: 'Funcionalidades completas',
      price: '€59/mês',
      color: 'bg-purple-50 border-purple-200'
    }
  };

  const getStatusColor = (status: string) => {
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando negócio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => router.push('/admin/businesses')}
                className="hover:bg-gray-50"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Editar Negócio</h1>
                <p className="text-gray-600 mt-1">Atualizar informações do negócio</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className={getStatusColor(formData.status)}>
                {getStatusText(formData.status)}
              </Badge>
              <Badge variant="outline">
                {planFeatures[formData.type]?.name || formData.type || 'Standard'}
              </Badge>
            </div>
          </div>
        </div>

        <form onSubmit={updateBusiness} className="space-y-8">
          {/* Business Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-blue-600" />
                Informações do Negócio
              </CardTitle>
              <CardDescription>Dados básicos sobre o negócio</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700 mb-2 block">
                    Nome do Negócio <span className="text-gray-400">(não editável)</span>
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    readOnly
                    disabled
                    className="bg-gray-50 cursor-not-allowed text-gray-600"
                  />
                  {business?.slug && (
                    <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div className="text-xs text-blue-800">
                          <p className="font-medium mb-1">🔒 Nome protegido por segurança</p>
                          <p className="mb-1">URL do portal: <code className="bg-blue-100 px-1 rounded">koobings.com/{business.slug}/staff/dashboard</code></p>
                          <p>Para alterar o nome, contacte o suporte técnico.</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700 mb-2 block">
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                    className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="phone" className="text-sm font-medium text-gray-700 mb-2 block">
                    Telefone
                  </Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                {/* REMOVED - Slug field doesn't exist in database
                <div>
                  <Label htmlFor="slug" className="text-sm font-medium text-gray-700 mb-2 block">
                    Slug
                  </Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => handleInputChange('slug', e.target.value)}
                    className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                */}
              </div>

              <div>
                <Label htmlFor="address" className="text-sm font-medium text-gray-700 mb-2 block">
                  Endereço
                </Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-sm font-medium text-gray-700 mb-2 block">
                  Descrição
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={3}
                  className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </CardContent>
          </Card>

          {/* Owner Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-emerald-600" />
                Proprietário
              </CardTitle>
              <CardDescription>Informações sobre o responsável pelo negócio</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="ownerName" className="text-sm font-medium text-gray-700 mb-2 block">
                    Nome do Proprietário <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="ownerName"
                    value={formData.ownerName}
                    onChange={(e) => handleInputChange('ownerName', e.target.value)}
                    required
                    className="transition-all duration-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <Label htmlFor="status" className="text-sm font-medium text-gray-700 mb-2 block">
                    Status do Negócio
                  </Label>
                  <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACTIVE">Ativo</SelectItem>
                      <SelectItem value="PENDING">Pendente</SelectItem>
                      <SelectItem value="SUSPENDED">Suspenso</SelectItem>
                      <SelectItem value="INACTIVE">Inativo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                <div className="flex items-start gap-2">
                  <Key className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <Label htmlFor="password" className="text-sm font-medium text-amber-800 mb-2 block">
                      Nova Password (opcional)
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      placeholder="Deixe vazio para manter a password atual"
                      minLength={6}
                      className="bg-white transition-all duration-200 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                    <p className="text-xs text-amber-700 mt-1">
                      Apenas preencha se quiser alterar a password atual
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Plan & Features */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-purple-600" />
                Plano & Funcionalidades
              </CardTitle>
              <CardDescription>Configuração do plano e funcionalidades ativas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-3 block">Plano</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.entries(planFeatures).map(([key, plan]) => (
                    <Card 
                      key={key} 
                      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                        formData.type === key 
                          ? 'ring-2 ring-blue-500 border-blue-500' 
                          : 'hover:border-gray-300'
                      }`}
                      onClick={() => handleInputChange('type', key)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{plan.name}</CardTitle>
                          <Badge variant={formData.type === key ? "default" : "secondary"}>
                            {plan.price}
                          </Badge>
                        </div>
                        <CardDescription>{plan.description}</CardDescription>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-lg font-medium text-gray-900">Funcionalidades Específicas</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(formData.settings).filter(([key, value]) => 
                    typeof value === 'boolean' && !['clientPortalEnabled', 'allowOnlineBooking', 'allowSelfRegistration', 'autoConfirmBookings', 'paymentsEnabled'].includes(key)
                  ).map(([key, value]) => {
                    const featureLabels = {
                      multipleStaff: { name: 'Múltiplos Funcionários', desc: 'Permite adicionar vários membros da equipa' },
                      advancedReports: { name: 'Relatórios Avançados', desc: 'Relatórios detalhados e analytics' },
                      smsNotifications: { name: 'Notificações SMS', desc: 'Envio de SMS para clientes' },
                      customBranding: { name: 'Branding Personalizado', desc: 'Logo e cores personalizadas' },
                      calendarIntegration: { name: 'Integração Calendário', desc: 'Sincronização com Google Calendar' },
                      apiAccess: { name: 'Acesso API', desc: 'Integração com sistemas externos' }
                    };
                    
                    const feature = featureLabels[key as keyof typeof featureLabels];
                    if (!feature) return null;
                    
                    return (
                      <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
                        <div className="flex-1">
                          <Label htmlFor={key} className="font-medium text-gray-900 cursor-pointer">{feature.name}</Label>
                          <p className="text-sm text-gray-600 mt-1">{feature.desc}</p>
                        </div>
                        <Switch
                          id={key}
                          checked={value}
                          onCheckedChange={(checked) => handleFeatureChange(key as keyof EditBusinessData['settings'], checked)}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Client Portal Settings */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Configurações do Portal Cliente
              </CardTitle>
              <CardDescription>
                Controle o acesso e funcionalidades disponíveis para clientes deste negócio
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Main Toggle */}
              <div className="flex items-center space-x-2 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <Switch
                  id="client-portal-enabled"
                  checked={formData.settings.clientPortalEnabled ?? true}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({
                      ...prev,
                      settings: {
                        ...prev.settings,
                        clientPortalEnabled: checked
                      }
                    }))
                  }
                />
                <div className="flex-1">
                  <Label htmlFor="client-portal-enabled" className="text-sm font-medium">
                    Ativar Portal Cliente
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Permite que clientes acedam ao portal e façam marcações online
                  </p>
                </div>
                <Badge variant={formData.settings.clientPortalEnabled ? 'default' : 'secondary'}>
                  {formData.settings.clientPortalEnabled ? 'Ativo' : 'Inativo'}
                </Badge>
              </div>

              {/* Client Settings Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="allow-online-booking"
                    checked={formData.settings.allowOnlineBooking ?? true}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({
                        ...prev,
                        settings: {
                          ...prev.settings,
                          allowOnlineBooking: checked
                        }
                      }))
                    }
                    disabled={!formData.settings.clientPortalEnabled}
                  />
                  <div className="flex-1">
                    <Label htmlFor="allow-online-booking" className="text-sm font-medium">
                      Marcações Online
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Clientes podem agendar serviços
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="allow-self-registration"
                    checked={formData.settings.allowSelfRegistration ?? true}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({
                        ...prev,
                        settings: {
                          ...prev.settings,
                          allowSelfRegistration: checked
                        }
                      }))
                    }
                    disabled={!formData.settings.clientPortalEnabled}
                  />
                  <div className="flex-1">
                    <Label htmlFor="allow-self-registration" className="text-sm font-medium">
                      Registo Automático
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Clientes podem criar conta automaticamente
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 md:col-span-2">
                  <Switch
                    id="auto-confirm-bookings"
                    checked={formData.settings.autoConfirmBookings ?? true}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({
                        ...prev,
                        settings: {
                          ...prev.settings,
                          autoConfirmBookings: checked
                        }
                      }))
                    }
                    disabled={!formData.settings.clientPortalEnabled}
                  />
                  <div className="flex-1">
                    <Label htmlFor="auto-confirm-bookings" className="text-sm font-medium">
                      Aprovação Automática de Marcações
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Se ativo: marcações são aprovadas automaticamente. Se desativo: staff aprova manualmente cada marcação.
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Payment Settings */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Configurações de Pagamento</h4>
                <div className="flex items-center space-x-2 p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <Switch
                    id="payments-enabled"
                    checked={formData.settings.paymentsEnabled ?? false}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({
                        ...prev,
                        settings: {
                          ...prev.settings,
                          paymentsEnabled: checked
                        }
                      }))
                    }
                    disabled={!formData.settings.clientPortalEnabled}
                  />
                  <div className="flex-1">
                    <Label htmlFor="payments-enabled" className="text-sm font-medium">
                      Pagamentos pela Plataforma
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Permite pagamentos online via Stripe (requer configuração)
                    </p>
                  </div>
                  <Badge variant={formData.settings.paymentsEnabled ? 'default' : 'secondary'}>
                    {formData.settings.paymentsEnabled ? 'Ativo' : 'Inativo'}
                  </Badge>
                </div>
                
                {!formData.settings.paymentsEnabled && (
                  <Alert className="border-amber-200 bg-amber-50">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <span className="text-amber-800">
                        <strong>Nota:</strong> Pagamentos estão desativados. Quando a integração com Stripe estiver 
                        disponível, poderá ativar esta funcionalidade.
                      </span>
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => router.push('/admin/businesses')}
              className="hover:bg-gray-50"
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={saving}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Guardar Alterações
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 