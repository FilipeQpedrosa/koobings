'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  Settings, 
  Mail, 
  Shield, 
  Database, 
  Server, 
  Users, 
  Globe, 
  AlertCircle,
  Save,
  RefreshCw,
  Trash2,
  Download,
  Cog,
  Lock,
  Eye
} from 'lucide-react';

interface SystemSettings {
  email: {
    from: string;
    server: string;
    port: string;
  };
  security: {
    sessionTimeout: number;
    requireMFA: boolean;
    enforcePasswordPolicy: boolean;
  };
  business: {
    maxActive: number;
    autoApprove: boolean;
  };
  system: {
    name: string;
    supportEmail: string;
    defaultTimezone: string;
    defaultCurrency: string;
    defaultLanguage: string;
    maintenanceMode: boolean;
    allowRegistration: boolean;
    defaultPlan: string;
  };
}

interface SystemStats {
  totalBusinesses: number;
  activeBusinesses: number;
  totalStaff: number;
  totalAppointments: number;
  systemHealth: 'healthy' | 'warning' | 'error';
}

export default function SystemSettingsPage() {
  const [settings, setSettings] = useState<SystemSettings>({
    email: {
      from: 'noreply@koobings.com',
      server: 'smtp.gmail.com',
      port: '587'
    },
    security: {
      sessionTimeout: 60,
      requireMFA: false,
      enforcePasswordPolicy: true
    },
    business: {
      maxActive: 1000,
      autoApprove: false
    },
    system: {
      name: 'Koobings Service Manager',
      supportEmail: 'support@koobings.com',
      defaultTimezone: 'Europe/Lisbon',
      defaultCurrency: 'EUR',
      defaultLanguage: 'pt',
      maintenanceMode: false,
      allowRegistration: true,
      defaultPlan: 'standard'
    }
  });

  const [stats, setStats] = useState<SystemStats>({
    totalBusinesses: 0,
    activeBusinesses: 0,
    totalStaff: 0,
    totalAppointments: 0,
    systemHealth: 'healthy'
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
    fetchStats();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings');
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setSettings(data.data);
        }
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/businesses/stats');
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setStats(data.data);
        }
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    setError('');
    
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        toast({
          title: "Sucesso",
          description: "Configurações salvas com sucesso!",
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Erro ao salvar configurações');
      }
    } catch (error: any) {
      setError(error.message || 'Erro ao salvar configurações');
      toast({
        title: "Erro",
        description: error.message || "Erro ao salvar configurações",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const performMaintenance = async (action: string) => {
    try {
      toast({
        title: "Manutenção",
        description: `Executando ${action}...`,
      });
      
      // Simulated maintenance action
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Concluído",
        description: `${action} executado com sucesso!`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: `Erro ao executar ${action}`,
        variant: "destructive"
      });
    }
  };

  const updateEmailSettings = (field: keyof SystemSettings['email'], value: string) => {
    setSettings(prev => ({
      ...prev,
      email: {
        ...prev.email,
        [field]: value
      }
    }));
  };

  const updateSecuritySettings = (field: keyof SystemSettings['security'], value: any) => {
    setSettings(prev => ({
      ...prev,
      security: {
        ...prev.security,
        [field]: value
      }
    }));
  };

  const updateBusinessSettings = (field: keyof SystemSettings['business'], value: any) => {
    setSettings(prev => ({
      ...prev,
      business: {
        ...prev.business,
        [field]: value
      }
    }));
  };

  const updateSystemSettings = (field: keyof SystemSettings['system'], value: any) => {
    setSettings(prev => ({
      ...prev,
      system: {
        ...prev.system,
        [field]: value
      }
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Carregando configurações do sistema...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Configurações do Sistema</h1>
          <p className="text-gray-600 mt-1">Gerir configurações globais da plataforma</p>
        </div>
        <Button onClick={saveSettings} disabled={saving} size="lg">
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Salvando...' : 'Salvar Alterações'}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* System Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Negócios</p>
                <p className="text-2xl font-bold">{stats.totalBusinesses}</p>
              </div>
              <Database className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Negócios Ativos</p>
                <p className="text-2xl font-bold">{stats.activeBusinesses}</p>
              </div>
              <Users className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Staff</p>
                <p className="text-2xl font-bold">{stats.totalStaff}</p>
              </div>
              <Users className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Sistema</p>
                <div className="flex items-center gap-2">
                  <Badge variant={stats.systemHealth === 'healthy' ? 'success' : 'destructive'}>
                    {stats.systemHealth === 'healthy' ? 'Saudável' : 'Problemas'}
                  </Badge>
                </div>
              </div>
              <Server className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue="system" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="system">
            <Globe className="h-4 w-4 mr-2" />
            Sistema
          </TabsTrigger>
          <TabsTrigger value="email">
            <Mail className="h-4 w-4 mr-2" />
            Email
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="h-4 w-4 mr-2" />
            Segurança
          </TabsTrigger>
          <TabsTrigger value="business">
            <Users className="h-4 w-4 mr-2" />
            Negócios
          </TabsTrigger>
          <TabsTrigger value="maintenance">
            <Cog className="h-4 w-4 mr-2" />
            Manutenção
          </TabsTrigger>
        </TabsList>

        {/* System Settings */}
        <TabsContent value="system">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Gerais do Sistema</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="system-name">Nome do Sistema</Label>
                  <Input
                    id="system-name"
                    value={settings.system.name}
                    onChange={(e) => updateSystemSettings('name', e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="support-email">Email de Suporte</Label>
                  <Input
                    id="support-email"
                    type="email"
                    value={settings.system.supportEmail}
                    onChange={(e) => updateSystemSettings('supportEmail', e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="default-timezone">Timezone Padrão</Label>
                  <Select
                    value={settings.system.defaultTimezone}
                    onValueChange={(value) => updateSystemSettings('defaultTimezone', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Europe/Lisbon">Europa/Lisboa</SelectItem>
                      <SelectItem value="Europe/London">Europa/Londres</SelectItem>
                      <SelectItem value="America/New_York">América/Nova York</SelectItem>
                      <SelectItem value="UTC">UTC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="default-currency">Moeda Padrão</Label>
                  <Select
                    value={settings.system.defaultCurrency}
                    onValueChange={(value) => updateSystemSettings('defaultCurrency', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                      <SelectItem value="USD">USD - Dólar</SelectItem>
                      <SelectItem value="GBP">GBP - Libra</SelectItem>
                      <SelectItem value="BRL">BRL - Real</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="default-language">Idioma Padrão</Label>
                  <Select
                    value={settings.system.defaultLanguage}
                    onValueChange={(value) => updateSystemSettings('defaultLanguage', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pt">Português</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="default-plan">Plano Padrão</Label>
                  <Select
                    value={settings.system.defaultPlan}
                    onValueChange={(value) => updateSystemSettings('defaultPlan', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Básico</SelectItem>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="maintenance-mode"
                  checked={settings.system.maintenanceMode}
                  onCheckedChange={(checked) => updateSystemSettings('maintenanceMode', checked)}
                />
                <Label htmlFor="maintenance-mode">Modo de Manutenção</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="allow-registration"
                  checked={settings.system.allowRegistration}
                  onCheckedChange={(checked) => updateSystemSettings('allowRegistration', checked)}
                />
                <Label htmlFor="allow-registration">Permitir Novos Registos</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Settings */}
        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Email</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="email-from">Email Remetente</Label>
                <Input
                  id="email-from"
                  type="email"
                  value={settings.email.from}
                  onChange={(e) => updateEmailSettings('from', e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email-server">Servidor SMTP</Label>
                  <Input
                    id="email-server"
                    value={settings.email.server}
                    onChange={(e) => updateEmailSettings('server', e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="email-port">Porta SMTP</Label>
                  <Input
                    id="email-port"
                    value={settings.email.port}
                    onChange={(e) => updateEmailSettings('port', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Segurança</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="session-timeout">Timeout de Sessão (minutos)</Label>
                <Input
                  id="session-timeout"
                  type="number"
                  value={settings.security.sessionTimeout}
                  onChange={(e) => updateSecuritySettings('sessionTimeout', parseInt(e.target.value))}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="require-mfa"
                  checked={settings.security.requireMFA}
                  onCheckedChange={(checked) => updateSecuritySettings('requireMFA', checked)}
                />
                <Label htmlFor="require-mfa">Requerer Autenticação Multi-factor</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="enforce-password-policy"
                  checked={settings.security.enforcePasswordPolicy}
                  onCheckedChange={(checked) => updateSecuritySettings('enforcePasswordPolicy', checked)}
                />
                <Label htmlFor="enforce-password-policy">Forçar Política de Passwords</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Business Settings */}
        <TabsContent value="business">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Negócios</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="max-active">Máximo de Negócios Ativos</Label>
                <Input
                  id="max-active"
                  type="number"
                  value={settings.business.maxActive}
                  onChange={(e) => updateBusinessSettings('maxActive', parseInt(e.target.value))}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="auto-approve"
                  checked={settings.business.autoApprove}
                  onCheckedChange={(checked) => updateBusinessSettings('autoApprove', checked)}
                />
                <Label htmlFor="auto-approve">Aprovação Automática de Novos Negócios</Label>
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Nota sobre Permissões:</strong> As configurações de permissões de staff (visualização de agendamentos, acesso a clientes, etc.) 
                  são agora configuradas individualmente por cada negócio na sua página de configurações, não ao nível global do sistema.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Maintenance */}
        <TabsContent value="maintenance">
          <Card>
            <CardHeader>
              <CardTitle>Manutenção do Sistema</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  variant="outline"
                  onClick={() => performMaintenance('CLEAR_CACHE')}
                  className="w-full"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Limpar Cache
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => performMaintenance('PURGE_LOGS')}
                  className="w-full"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Limpar Logs Antigos
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => performMaintenance('BACKUP_DB')}
                  className="w-full"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Backup da BD
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 