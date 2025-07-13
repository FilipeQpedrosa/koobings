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
import { ArrowLeft, Building2, User, Settings, Shield, Save, Key, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

type EditBusinessData = {
  name: string;
  email: string;
  ownerName: string;
  phone: string;
  address: string;
  description: string;
  plan: 'basic' | 'standard' | 'premium';
  slug: string;
  status: 'ACTIVE' | 'PENDING' | 'SUSPENDED' | 'INACTIVE';
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
    plan: 'standard',
    slug: '',
    status: 'ACTIVE',
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

  useEffect(() => {
    fetchBusiness();
  }, [id]);

  const fetchBusiness = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/businesses/${id}`);
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
          plan: businessData.plan || 'standard',
          slug: businessData.slug || '',
          status: businessData.status || 'ACTIVE',
          password: '',
          features: {
            multipleStaff: businessData.features?.multipleStaff ?? true,
            advancedReports: businessData.features?.advancedReports ?? true,
            smsNotifications: businessData.features?.smsNotifications ?? false,
            customBranding: businessData.features?.customBranding ?? false,
            apiAccess: businessData.features?.apiAccess ?? false,
            calendarIntegration: businessData.features?.calendarIntegration ?? true,
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

  const handleFeatureChange = (feature: keyof EditBusinessData['features'], value: boolean) => {
    setFormData(prev => ({
      ...prev,
      features: { ...prev.features, [feature]: value }
    }));
  };

  const updateBusiness = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.ownerName) {
      toast({
        title: "Erro",
        description: "Nome do negócio, email e nome do proprietário são obrigatórios",
        variant: "destructive"
      });
      return;
    }

    try {
      setSaving(true);
      const response = await fetch(`/api/admin/businesses/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Sucesso",
          description: `Negócio "${data.business.name}" atualizado com sucesso!`,
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
                {planFeatures[formData.plan].name}
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
                    Nome do Negócio <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                    className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
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
                        formData.plan === key 
                          ? 'ring-2 ring-blue-500 border-blue-500' 
                          : 'hover:border-gray-300'
                      }`}
                      onClick={() => handleInputChange('plan', key)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{plan.name}</CardTitle>
                          <Badge variant={formData.plan === key ? "default" : "secondary"}>
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
                  {Object.entries(formData.features).map(([key, value]) => {
                    const featureLabels = {
                      multipleStaff: { name: 'Múltiplos Funcionários', desc: 'Permite adicionar vários membros da equipa' },
                      advancedReports: { name: 'Relatórios Avançados', desc: 'Relatórios detalhados e analytics' },
                      smsNotifications: { name: 'Notificações SMS', desc: 'Envio de SMS para clientes' },
                      customBranding: { name: 'Branding Personalizado', desc: 'Logo e cores personalizadas' },
                      calendarIntegration: { name: 'Integração Calendário', desc: 'Sincronização com Google Calendar' },
                      apiAccess: { name: 'Acesso API', desc: 'Integração com sistemas externos' }
                    };
                    
                    const feature = featureLabels[key as keyof typeof featureLabels];
                    
                    return (
                      <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
                        <div className="flex-1">
                          <Label htmlFor={key} className="font-medium text-gray-900 cursor-pointer">{feature.name}</Label>
                          <p className="text-sm text-gray-600 mt-1">{feature.desc}</p>
                        </div>
                        <Switch
                          id={key}
                          checked={value}
                          onCheckedChange={(checked) => handleFeatureChange(key as keyof EditBusinessData['features'], checked)}
                        />
                      </div>
                    );
                  })}
                </div>
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