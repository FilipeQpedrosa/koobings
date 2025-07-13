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
import { ArrowLeft, Building2, User, Settings, Shield, CheckCircle, ArrowRight, Check, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

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
  const [currentStep, setCurrentStep] = useState(1);
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

  const steps = [
    {
      number: 1,
      title: 'Informações do Negócio',
      description: 'Dados básicos sobre o negócio',
      icon: Building2,
      color: 'blue'
    },
    {
      number: 2,
      title: 'Proprietário',
      description: 'Informações do responsável',
      icon: User,
      color: 'emerald'
    },
    {
      number: 3,
      title: 'Plano & Funcionalidades',
      description: 'Configuração do plano',
      icon: Settings,
      color: 'purple'
    },
    {
      number: 4,
      title: 'Revisão & Criação',
      description: 'Confirmar e criar negócio',
      icon: CheckCircle,
      color: 'orange'
    }
  ];

  const handleInputChange = (field: keyof CreateBusinessData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFeatureChange = (feature: keyof CreateBusinessData['features'], value: boolean) => {
    setFormData(prev => ({
      ...prev,
      features: { ...prev.features, [feature]: value }
    }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.name && formData.email);
      case 2:
        return !!(formData.ownerName && formData.password);
      case 3:
        return !!formData.plan;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    } else {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios antes de continuar.",
        variant: "destructive"
      });
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const createBusiness = async () => {
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
        console.error('❌ Business creation failed:', data);
        toast({
          title: "Erro",
          description: data.error || "Erro ao criar negócio",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('❌ Business creation error:', error);
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
      price: 'Gratuito',
      features: ['1 utilizador', 'Marcações básicas', 'Relatórios simples'],
      color: 'bg-gray-50 border-gray-200'
    },
    standard: {
      name: 'Standard',
      description: 'Perfeito para negócios em crescimento',
      price: '€29/mês',
      features: ['Múltiplos utilizadores', 'Relatórios avançados', 'Integração calendário'],
      color: 'bg-blue-50 border-blue-200'
    },
    premium: {
      name: 'Premium',
      description: 'Funcionalidades completas',
      price: '€59/mês',
      features: ['Todos os recursos', 'SMS', 'Branding personalizado', 'API'],
      color: 'bg-purple-50 border-purple-200'
    }
  };

  const getStepColor = (step: number) => {
    const colors = {
      1: 'blue',
      2: 'emerald',
      3: 'purple',
      4: 'orange'
    };
    return colors[step as keyof typeof colors] || 'blue';
  };

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
                <h1 className="text-3xl font-bold text-gray-900">Criar Novo Negócio</h1>
                <p className="text-gray-600 mt-1">Configure um novo negócio na plataforma</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Building2 className="h-4 w-4" />
              <span>Portal Admin</span>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;
              const StepIcon = step.icon;
              
              return (
                <div key={step.number} className="flex items-center">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                    isActive 
                      ? `bg-${step.color}-100 border-${step.color}-500 text-${step.color}-600` 
                      : isCompleted 
                        ? 'bg-green-100 border-green-500 text-green-600' 
                        : 'bg-gray-100 border-gray-300 text-gray-400'
                  }`}>
                    {isCompleted ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <StepIcon className="h-5 w-5" />
                    )}
                  </div>
                  <div className="ml-4 min-w-0">
                    <p className={`text-sm font-medium ${
                      isActive ? `text-${step.color}-600` : isCompleted ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </p>
                    <p className="text-xs text-gray-500">{step.description}</p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-4 ${
                      isCompleted ? 'bg-green-300' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          {/* Step 1: Business Information */}
          {currentStep === 1 && (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building2 className="h-8 w-8 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Informações do Negócio</h2>
                <p className="text-gray-600 mt-2">Vamos começar com os dados básicos do seu negócio</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700 mb-2 block">
                    Nome do Negócio <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Ex: Salão Bela Vista"
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
                    placeholder="contato@negocio.com"
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
                    placeholder="+351 912 345 678"
                    className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <Label htmlFor="slug" className="text-sm font-medium text-gray-700 mb-2 block">
                    Slug (opcional)
                  </Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => handleInputChange('slug', e.target.value)}
                    placeholder="deixe vazio para gerar automaticamente"
                    className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="address" className="text-sm font-medium text-gray-700 mb-2 block">
                  Morada
                </Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Rua, Número, Cidade"
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
                  placeholder="Breve descrição do negócio..."
                  rows={3}
                  className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          )}

          {/* Step 2: Owner Information */}
          {currentStep === 2 && (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-8 w-8 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Proprietário</h2>
                <p className="text-gray-600 mt-2">Informações sobre o responsável pelo negócio</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="ownerName" className="text-sm font-medium text-gray-700 mb-2 block">
                    Nome do Proprietário <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="ownerName"
                    value={formData.ownerName}
                    onChange={(e) => handleInputChange('ownerName', e.target.value)}
                    placeholder="Nome completo"
                    required
                    className="transition-all duration-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700 mb-2 block">
                    Password <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    required
                    minLength={6}
                    className="transition-all duration-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-emerald-800 mb-2">Informações de Acesso</h3>
                    <p className="text-sm text-emerald-700">
                      O proprietário poderá fazer login com o email <strong>{formData.email}</strong> e a password definida acima.
                      Após o primeiro login, poderá alterar a password nas configurações.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Plan & Features */}
          {currentStep === 3 && (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Settings className="h-8 w-8 text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Plano & Funcionalidades</h2>
                <p className="text-gray-600 mt-2">Escolha o plano e configure as funcionalidades</p>
              </div>

              <div className="space-y-6">
                <Label className="text-lg font-medium text-gray-900">Escolher Plano</Label>
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
                      <CardContent>
                        <ul className="space-y-2">
                          {plan.features.map((feature, index) => (
                            <li key={index} className="flex items-center gap-2 text-sm">
                              <Check className="h-4 w-4 text-green-500" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
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
                          onCheckedChange={(checked) => handleFeatureChange(key as keyof CreateBusinessData['features'], checked)}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Review & Create */}
          {currentStep === 4 && (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-orange-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Revisão & Criação</h2>
                <p className="text-gray-600 mt-2">Revise todas as informações antes de criar o negócio</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-blue-600" />
                      Negócio
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Nome:</span>
                      <span className="font-medium">{formData.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium">{formData.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Telefone:</span>
                      <span className="font-medium">{formData.phone || 'Não informado'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Morada:</span>
                      <span className="font-medium">{formData.address || 'Não informado'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Slug:</span>
                      <span className="font-medium">{formData.slug || 'Gerado automaticamente'}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5 text-emerald-600" />
                      Proprietário
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Nome:</span>
                      <span className="font-medium">{formData.ownerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Password:</span>
                      <span className="font-medium">••••••••</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-purple-600" />
                    Plano & Funcionalidades
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-gray-600">Plano:</span>
                    <Badge variant="default">
                      {planFeatures[formData.plan].name} - {planFeatures[formData.plan].price}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-gray-600 block mb-2">Funcionalidades ativas:</span>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(formData.features)
                        .filter(([_, enabled]) => enabled)
                        .map(([key, _]) => {
                          const featureLabels = {
                            multipleStaff: 'Múltiplos Funcionários',
                            advancedReports: 'Relatórios Avançados',
                            smsNotifications: 'Notificações SMS',
                            customBranding: 'Branding Personalizado',
                            calendarIntegration: 'Integração Calendário',
                            apiAccess: 'Acesso API'
                          };
                          return (
                            <Badge key={key} variant="secondary">
                              {featureLabels[key as keyof typeof featureLabels]}
                            </Badge>
                          );
                        })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center pt-8 border-t border-gray-200">
            <div>
              {currentStep > 1 && (
                <Button 
                  variant="outline" 
                  onClick={prevStep}
                  className="hover:bg-gray-50"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Anterior
                </Button>
              )}
            </div>
            <div>
              {currentStep < 4 ? (
                <Button 
                  onClick={nextStep}
                  disabled={!validateStep(currentStep)}
                  className={`bg-gradient-to-r from-${getStepColor(currentStep)}-600 to-${getStepColor(currentStep)}-700 hover:from-${getStepColor(currentStep)}-700 hover:to-${getStepColor(currentStep)}-800 text-white`}
                >
                  Próximo
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button 
                  onClick={createBusiness}
                  disabled={creating}
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8"
                >
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
              )}
            </div>
          </div>
        </div>

        {/* Success Modal */}
        {showCredentials && createdBusinessInfo && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl p-8 max-w-lg w-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Negócio Criado com Sucesso!</h3>
              </div>
              
              <div className="space-y-6">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-3">Credenciais de Acesso</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-green-700">Negócio:</span>
                      <span className="font-medium text-green-800">{createdBusinessInfo.businessName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-700">Email:</span>
                      <span className="font-medium text-green-800">{createdBusinessInfo.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-700">Password:</span>
                      <span className="font-medium text-green-800">{createdBusinessInfo.password}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2">URL de Login</h4>
                  <a 
                    href={createdBusinessInfo.loginUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 hover:underline text-sm break-all"
                  >
                    {createdBusinessInfo.loginUrl}
                  </a>
                </div>
                
                <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-amber-800">
                        <strong>Importante:</strong> Guarde estas credenciais num local seguro. 
                        O proprietário do negócio pode alterar a password após o primeiro login.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <Button 
                  variant="outline" 
                  onClick={() => setShowCredentials(false)}
                  className="hover:bg-gray-50"
                >
                  Fechar
                </Button>
                <Button 
                  onClick={() => router.push('/admin/businesses')} 
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
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