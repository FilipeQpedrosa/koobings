'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Edit, Save, X, Download, Clock, Users, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ServiceDayConfig {
  serviceId: string;
  serviceName: string;
  date: string;
  description: string;
  slots: {
    startTime: string;
    endTime: string;
    staffId: string;
    capacity: number;
  }[];
}

interface Staff {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface ServiceManagementProps {
  selectedDate: string;
  businessSlug: string;
}

export default function ServiceManagement({ selectedDate, businessSlug }: ServiceManagementProps) {
  const [serviceConfigs, setServiceConfigs] = useState<ServiceDayConfig[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingService, setEditingService] = useState<string | null>(null);
  const [editingDescription, setEditingDescription] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    if (selectedDate) {
      fetchServiceConfigs();
    }
  }, [selectedDate]);

  const fetchServiceConfigs = async () => {
    if (!selectedDate) return;

    setLoading(true);
    try {
      console.log('🔍 ServiceManagement: Fetching configs for date:', selectedDate);
      
      const response = await fetch(`/api/business/services/day-config?date=${selectedDate}`, {
        credentials: 'include',
        cache: 'no-store'
      });

      console.log('🔍 ServiceManagement: Response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('🔍 ServiceManagement: Response data:', data);
        
        if (data.success) {
          setServiceConfigs(data.data.services);
          setStaff(data.data.staff);
          console.log('🔍 ServiceManagement: Set services:', data.data.services.length, 'staff:', data.data.staff.length);
        } else {
          console.error('🔍 ServiceManagement: API returned error:', data.error);
          toast({
            title: 'Erro',
            description: data.error?.message || 'Erro ao carregar configurações',
            variant: 'destructive'
          });
        }
      } else {
        const errorData = await response.json();
        console.error('🔍 ServiceManagement: HTTP error:', response.status, errorData);
        toast({
          title: 'Erro',
          description: `Erro ${response.status}: ${errorData.error?.message || 'Erro ao carregar dados'}`,
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('🔍 ServiceManagement: Fetch error:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao carregar configurações dos serviços',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditDescription = (serviceId: string, currentDescription: string) => {
    setEditingService(serviceId);
    setEditingDescription(currentDescription);
  };

  const handleSaveDescription = async (serviceId: string) => {
    setSaving(true);
    try {
      const serviceConfig = serviceConfigs.find(s => s.serviceId === serviceId);
      if (!serviceConfig) return;

      const response = await fetch('/api/business/services/day-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          serviceId: serviceId,
          date: selectedDate,
          description: editingDescription,
          slots: serviceConfig.slots
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setServiceConfigs(prev => 
            prev.map(s => 
              s.serviceId === serviceId 
                ? { ...s, description: editingDescription }
                : s
            )
          );
          setEditingService(null);
          toast({
            title: 'Sucesso',
            description: 'Descrição atualizada com sucesso'
          });
        }
      }
    } catch (error) {
      console.error('Error saving description:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao salvar descrição',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleStaffChange = async (serviceId: string, slotIndex: number, staffId: string) => {
    setSaving(true);
    try {
      console.log('🔍 ServiceManagement: Updating staff for service:', serviceId, 'slot:', slotIndex, 'staffId:', staffId);
      
      const serviceConfig = serviceConfigs.find(s => s.serviceId === serviceId);
      if (!serviceConfig) {
        console.error('🔍 ServiceManagement: Service config not found for:', serviceId);
        return;
      }

      const updatedSlots = [...serviceConfig.slots];
      updatedSlots[slotIndex] = { ...updatedSlots[slotIndex], staffId };

      console.log('🔍 ServiceManagement: Updated slots:', updatedSlots);

      const response = await fetch('/api/business/services/day-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          serviceId: serviceId,
          date: selectedDate,
          description: serviceConfig.description,
          slots: updatedSlots
        })
      });

      console.log('🔍 ServiceManagement: Update response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('🔍 ServiceManagement: Update response data:', data);
        
        if (data.success) {
          setServiceConfigs(prev => 
            prev.map(s => 
              s.serviceId === serviceId 
                ? { ...s, slots: updatedSlots }
                : s
            )
          );
          toast({
            title: 'Sucesso',
            description: 'Staff atualizado com sucesso'
          });
        } else {
          console.error('🔍 ServiceManagement: Update failed:', data.error);
          toast({
            title: 'Erro',
            description: data.error?.message || 'Erro ao atualizar staff',
            variant: 'destructive'
          });
        }
      } else {
        const errorData = await response.json();
        console.error('🔍 ServiceManagement: Update HTTP error:', response.status, errorData);
        toast({
          title: 'Erro',
          description: `Erro ${response.status}: ${errorData.error?.message || 'Erro ao atualizar staff'}`,
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('🔍 ServiceManagement: Update error:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao atualizar staff',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleExportExcel = async () => {
    try {
      const startDate = selectedDate;
      const endDate = selectedDate; // Same day for now
      
      const response = await fetch(`/api/business/services/export-excel?startDate=${startDate}&endDate=${endDate}`, {
        credentials: 'include'
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `service-occupancy-${selectedDate}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        toast({
          title: 'Sucesso',
          description: 'Ficheiro Excel descarregado com sucesso'
        });
      }
    } catch (error) {
      console.error('Error exporting Excel:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao exportar para Excel',
        variant: 'destructive'
      });
    }
  };

  if (!selectedDate) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Gestão de Serviços do Dia
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-8">
            Selecione uma data no calendário para gerir os serviços
          </p>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Gestão de Serviços do Dia
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
            <p className="text-gray-600">Carregando configurações...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Gestão de Serviços do Dia
          </CardTitle>
          <Button onClick={handleExportExcel} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar Excel
          </Button>
        </div>
        <p className="text-sm text-gray-600">
          {new Date(selectedDate).toLocaleDateString('pt-PT', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {serviceConfigs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">Nenhum serviço configurado</p>
            <p className="text-sm">Configure os serviços na página de configurações</p>
          </div>
        ) : (
          serviceConfigs.map((config) => (
            <div key={config.serviceId} className="border rounded-lg p-4 bg-gray-50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{config.serviceName}</h3>
                <Badge variant="outline">
                  {config.slots.length} horário{config.slots.length !== 1 ? 's' : ''}
                </Badge>
              </div>

              {/* Description Section */}
              <div className="mb-4">
                <Label className="text-sm font-medium text-gray-700">Descrição do Dia</Label>
                {editingService === config.serviceId ? (
                  <div className="mt-2 space-y-2">
                    <Textarea
                      value={editingDescription}
                      onChange={(e) => setEditingDescription(e.target.value)}
                      placeholder="Descrição específica para este dia..."
                      rows={3}
                    />
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        onClick={() => handleSaveDescription(config.serviceId)}
                        disabled={saving}
                      >
                        <Save className="h-4 w-4 mr-2" />
                        {saving ? 'Guardando...' : 'Guardar'}
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setEditingService(null)}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-2 p-3 bg-white rounded border">
                    <p className="text-gray-700">{config.description || 'Sem descrição específica'}</p>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="mt-2"
                      onClick={() => handleEditDescription(config.serviceId, config.description)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Editar Descrição
                    </Button>
                  </div>
                )}
              </div>

              {/* Slots Section */}
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-3 block">Horários e Staff</Label>
                <div className="space-y-3">
                  {config.slots.map((slot, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 bg-white rounded border">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">{slot.startTime} - {slot.endTime}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-500" />
                        <Select
                          value={slot.staffId}
                          onValueChange={(value) => handleStaffChange(config.serviceId, index, value)}
                          disabled={saving}
                        >
                          <SelectTrigger className="w-48">
                            <SelectValue placeholder="Selecionar staff" />
                          </SelectTrigger>
                          <SelectContent>
                            {staff.map(s => (
                              <SelectItem key={s.id} value={s.id}>
                                <div className="flex items-center gap-2">
                                  <span>{s.name}</span>
                                  <Badge variant="outline" className="text-xs">
                                    {s.role}
                                  </Badge>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <Badge variant="secondary">
                        {slot.capacity} lugares
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
