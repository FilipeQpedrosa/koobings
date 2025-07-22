'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Eye, EyeOff, Search, Store, Globe, Calendar, Users, Briefcase } from 'lucide-react';

interface VisibilitySettings {
  isPublic: boolean;
  showInMarketplace: boolean;
  showInSearch: boolean;
  allowOnlineBooking: boolean;
  adminApproved: boolean;
  adminNotes: string;
  lastUpdatedBy: string | null;
  lastUpdatedAt: string | null;
  hasServices: boolean;
  hasStaff: boolean;
  hasBookings: boolean;
  businessStatus: string;
}

interface Business {
  id: string;
  name: string;
  slug: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  stats: {
    Service: number;
    Staff: number;
    appointments: number;
  };
}

interface PreviewData {
  id: string;
  name: string;
  description: string | null;
  address: string | null;
  availableServices: number;
  activeStaff: number;
  visibility: {
    wouldShowInMarketplace: boolean;
    wouldShowInSearch: boolean;
    wouldAllowBooking: boolean;
    isPublic: boolean;
  };
  readinessScore: {
    score: number;
    percentage: number;
    issues: string[];
  };
  stats: {
    services: number;
    staff: number;
    appointments: number;
  };
}

export default function BusinessVisibilityPage() {
  const params = useParams();
  const router = useRouter();
  const businessId = params.id as string;

  const [business, setBusiness] = useState<Business | null>(null);
  const [visibilitySettings, setVisibilitySettings] = useState<VisibilitySettings | null>(null);
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewing, setPreviewing] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  useEffect(() => {
    fetchVisibilitySettings();
  }, [businessId]);

  const fetchVisibilitySettings = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/businesses/${businessId}/visibility`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // 🔧 DEBUG: Log the received data
      console.log('🔍 [VISIBILITY_DEBUG] API Response:', data);
      console.log('🔍 [VISIBILITY_DEBUG] Business stats:', data.data.business.stats);
      console.log('🔍 [VISIBILITY_DEBUG] Visibility settings:', data.data.visibilitySettings);
      
      setBusiness(data.data.business);
      setVisibilitySettings(data.data.visibilitySettings);
    } catch (error) {
      console.error('Error fetching visibility settings:', error);
      setMessage({ type: 'error', text: 'Erro ao carregar configurações de visibilidade' });
    } finally {
      setLoading(false);
    }
  };

  const saveVisibilitySettings = async () => {
    if (!visibilitySettings) return;

    try {
      setSaving(true);
      setMessage(null);

      const requestData = {
        adminApproved: visibilitySettings.adminApproved,
        adminNotes: visibilitySettings.adminNotes,
        isPublic: visibilitySettings.isPublic,
        showInMarketplace: visibilitySettings.showInMarketplace,
        showInSearch: visibilitySettings.showInSearch,
        allowOnlineBooking: visibilitySettings.allowOnlineBooking
      };

      console.log('🔧 [SAVE_DEBUG] Saving visibility settings...');
      console.log('🔧 [SAVE_DEBUG] Request data:', requestData);
      console.log('🔧 [SAVE_DEBUG] Business ID:', businessId);

      const response = await fetch(`/api/admin/businesses/${businessId}/visibility`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
      });

      console.log('🔧 [SAVE_DEBUG] Response status:', response.status);
      console.log('🔧 [SAVE_DEBUG] Response OK:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.log('🔧 [SAVE_DEBUG] Error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('🔧 [SAVE_DEBUG] Success response:', data);
      
      setMessage({ type: 'success', text: 'Configurações de visibilidade atualizadas com sucesso!' });
      
      // Refresh data to get updated timestamps
      fetchVisibilitySettings();
    } catch (error) {
      console.error('🔧 [SAVE_DEBUG] Error saving visibility settings:', error);
      setMessage({ type: 'error', text: 'Erro ao salvar configurações de visibilidade' });
    } finally {
      setSaving(false);
    }
  };

  const generatePreview = async () => {
    try {
      setPreviewing(true);
      setPreviewData(null);

      const response = await fetch(`/api/admin/businesses/${businessId}/visibility/preview`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setPreviewData(data.data);
    } catch (error) {
      console.error('Error generating preview:', error);
      setMessage({ type: 'error', text: 'Erro ao gerar preview' });
    } finally {
      setPreviewing(false);
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

  if (!business || !visibilitySettings) {
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

  const readinessScore = calculateReadinessScore(visibilitySettings);

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Visibilidade no Portal Cliente</h1>
          <p className="text-muted-foreground">{business.name}</p>
        </div>
      </div>

      {/* Messages */}
      {message && (
        <Alert className={`mb-6 ${message.type === 'error' ? 'border-red-500' : message.type === 'success' ? 'border-green-500' : 'border-blue-500'}`}>
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      {/* Business Readiness */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Prontidão do Negócio
            <Badge variant={readinessScore >= 80 ? 'default' : readinessScore >= 60 ? 'secondary' : 'destructive'}>
              {readinessScore}%
            </Badge>
          </CardTitle>
          <CardDescription>
            Verificação de completude para aparecer no portal cliente
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Progress value={readinessScore} className="w-full" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${visibilitySettings.hasServices ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm">Serviços: {business?.stats?.Service || 0}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${visibilitySettings.hasStaff ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm">Staff: {business?.stats?.Staff || 0}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${visibilitySettings.hasBookings ? 'bg-green-500' : 'bg-gray-400'}`}></div>
              <span className="text-sm">Agendamentos: {business?.stats?.appointments || 0}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Visibility Control */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {visibilitySettings.adminApproved ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
            Controlo de Visibilidade
            <Badge variant={visibilitySettings.adminApproved ? 'default' : 'secondary'}>
              {visibilitySettings.adminApproved ? 'Aprovado' : 'Não Aprovado'}
            </Badge>
          </CardTitle>
          <CardDescription>
            Controlo administrativo da visibilidade no portal cliente
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="admin-approved"
              checked={visibilitySettings.adminApproved}
              onCheckedChange={(checked) => {
                console.log('🔧 [SWITCH_DEBUG] Admin approval switch clicked:', checked);
                console.log('🔧 [SWITCH_DEBUG] Current visibility settings:', visibilitySettings);
                setVisibilitySettings(prev => {
                  const newSettings = prev ? { ...prev, adminApproved: checked } : null;
                  console.log('🔧 [SWITCH_DEBUG] New visibility settings:', newSettings);
                  return newSettings;
                });
              }}
            />
            <Label htmlFor="admin-approved" className="text-sm font-medium">
              Aprovar para aparecer no portal cliente
            </Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="admin-notes">Notas do Administrador</Label>
            <Textarea
              id="admin-notes"
              placeholder="Notas internas sobre a aprovação/rejeição..."
              value={visibilitySettings.adminNotes}
              onChange={(e) => 
                setVisibilitySettings(prev => prev ? { ...prev, adminNotes: e.target.value } : null)
              }
              rows={3}
            />
          </div>

          {visibilitySettings.lastUpdatedBy && (
            <div className="text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Última atualização: {new Date(visibilitySettings.lastUpdatedAt!).toLocaleString('pt-PT')}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Visibility Options */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Opções de Visibilidade
          </CardTitle>
          <CardDescription>
            Configurações específicas de onde o negócio aparece (só funcionam se aprovado acima)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="is-public"
                checked={visibilitySettings.isPublic}
                onCheckedChange={(checked) => 
                  setVisibilitySettings(prev => prev ? { ...prev, isPublic: checked } : null)
                }
                disabled={!visibilitySettings.adminApproved}
              />
              <Label htmlFor="is-public" className="text-sm font-medium">
                <Globe className="h-4 w-4 inline mr-1" />
                Público em geral
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="show-marketplace"
                checked={visibilitySettings.showInMarketplace}
                onCheckedChange={(checked) => 
                  setVisibilitySettings(prev => prev ? { ...prev, showInMarketplace: checked } : null)
                }
                disabled={!visibilitySettings.adminApproved}
              />
              <Label htmlFor="show-marketplace" className="text-sm font-medium">
                <Store className="h-4 w-4 inline mr-1" />
                Mostrar no marketplace
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="show-search"
                checked={visibilitySettings.showInSearch}
                onCheckedChange={(checked) => 
                  setVisibilitySettings(prev => prev ? { ...prev, showInSearch: checked } : null)
                }
                disabled={!visibilitySettings.adminApproved}
              />
              <Label htmlFor="show-search" className="text-sm font-medium">
                <Search className="h-4 w-4 inline mr-1" />
                Aparecer em pesquisas
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="allow-booking"
                checked={visibilitySettings.allowOnlineBooking}
                onCheckedChange={(checked) => 
                  setVisibilitySettings(prev => prev ? { ...prev, allowOnlineBooking: checked } : null)
                }
                disabled={!visibilitySettings.adminApproved}
              />
              <Label htmlFor="allow-booking" className="text-sm font-medium">
                <Calendar className="h-4 w-4 inline mr-1" />
                Permitir agendamentos online
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preview */}
      {previewData && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Preview do Portal Cliente
            </CardTitle>
            <CardDescription>
              Como este negócio apareceria para os clientes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border rounded-lg p-4 bg-gray-50">
              <h3 className="font-semibold text-lg">{previewData.name}</h3>
              {previewData.description && (
                <p className="text-gray-600 mt-1">{previewData.description}</p>
              )}
              {previewData.address && (
                <p className="text-sm text-gray-500 mt-2">{previewData.address}</p>
              )}
              
              <div className="flex gap-4 mt-3">
                <Badge variant="outline">{previewData.availableServices} serviços</Badge>
                <Badge variant="outline">{previewData.activeStaff} profissionais</Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className={`text-center p-3 rounded ${previewData.visibility.wouldShowInMarketplace ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                <Store className="h-6 w-6 mx-auto mb-1" />
                <div className="text-xs">Marketplace</div>
                <div className="text-xs font-semibold">{previewData.visibility.wouldShowInMarketplace ? 'Visível' : 'Oculto'}</div>
              </div>
              
              <div className={`text-center p-3 rounded ${previewData.visibility.wouldShowInSearch ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                <Search className="h-6 w-6 mx-auto mb-1" />
                <div className="text-xs">Pesquisa</div>
                <div className="text-xs font-semibold">{previewData.visibility.wouldShowInSearch ? 'Visível' : 'Oculto'}</div>
              </div>
              
              <div className={`text-center p-3 rounded ${previewData.visibility.wouldAllowBooking ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                <Calendar className="h-6 w-6 mx-auto mb-1" />
                <div className="text-xs">Agendamentos</div>
                <div className="text-xs font-semibold">{previewData.visibility.wouldAllowBooking ? 'Permitido' : 'Bloqueado'}</div>
              </div>
              
              <div className={`text-center p-3 rounded ${previewData.visibility.isPublic ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                <Globe className="h-6 w-6 mx-auto mb-1" />
                <div className="text-xs">Público</div>
                <div className="text-xs font-semibold">{previewData.visibility.isPublic ? 'Sim' : 'Não'}</div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded">
              <h4 className="font-medium text-blue-900">Pontuação de Prontidão</h4>
              <div className="flex items-center gap-2 mt-1">
                <Progress value={previewData.readinessScore.percentage} className="flex-1" />
                <span className="text-blue-900 font-semibold">{previewData.readinessScore.percentage}%</span>
              </div>
              {previewData.readinessScore.issues.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm text-blue-800 mb-1">Issues a resolver:</p>
                  <ul className="text-xs text-blue-700 list-disc list-inside">
                    {previewData.readinessScore.issues.map((issue, index) => (
                      <li key={index}>{issue}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex gap-4">
        <Button onClick={saveVisibilitySettings} disabled={saving}>
          {saving ? 'Salvando...' : 'Salvar Configurações'}
        </Button>
        <Button variant="outline" onClick={generatePreview} disabled={previewing}>
          {previewing ? 'Gerando...' : 'Preview Portal Cliente'}
        </Button>
        <Button variant="outline" onClick={() => router.push(`/admin/businesses/${businessId}`)}>
          Ver Negócio
        </Button>
      </div>
    </div>
  );
}

// Helper function to calculate readiness score
function calculateReadinessScore(settings: VisibilitySettings): number {
  let score = 0;
  
  if (settings.hasServices) score += 40;
  if (settings.hasStaff) score += 30;
  if (settings.hasBookings) score += 20;
  if (settings.businessStatus === 'ACTIVE') score += 10;
  
  return score;
} 