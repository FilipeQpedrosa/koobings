"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Edit, Trash2, ArrowLeft, Clock, Euro, Search, Users, Calendar, Settings } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface Service {
  id: string;
  name: string;
  description?: string;
  duration: number;
  price: number;
  image?: string;
  createdAt: string;
  slotsNeeded?: number;
  category?: {
    id: string;
    name: string;
  };
  // ✅ NOVOS CAMPOS
  eventType?: 'INDIVIDUAL' | 'GROUP';
    capacity?: number;
  availabilitySchedule?: any;
  isActive?: boolean;
}

interface ServiceFormData {
  name: string;
  description: string;
  duration: number;
  price: number;
  image: string;
  slotsNeeded: number;
  // ✅ NOVOS CAMPOS
  eventType: 'INDIVIDUAL' | 'GROUP';
  capacity: number;
  availabilitySchedule: any;
  isActive: boolean;
}

export default function StaffSettingsServicesPage() {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState<ServiceFormData>({
    name: '',
    description: '',
    duration: 30,
    price: 0,
    image: '',
    slotsNeeded: 1,
    // ✅ NOVOS CAMPOS
    eventType: 'INDIVIDUAL',
    capacity: 1,
    availabilitySchedule: {
      monday: { enabled: true, timeSlots: [] },
      tuesday: { enabled: true, timeSlots: [] },
      wednesday: { enabled: true, timeSlots: [] },
      thursday: { enabled: true, timeSlots: [] },
      friday: { enabled: true, timeSlots: [] },
      saturday: { enabled: false, timeSlots: [] },
      sunday: { enabled: false, timeSlots: [] }
    },
    isActive: true
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && user) {
      fetchServices();
    }
  }, [mounted, user]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/business/services', {
        credentials: 'include'
      });
        const data = await response.json();
        
        if (data.success) {
          setServices(data.data);
        } else {
        setError(data.error?.message || 'Erro ao carregar serviços');
      }
    } catch (err) {
      setError('Erro ao carregar serviços');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || formData.price <= 0) {
      toast({
        title: "Erro",
        description: "Nome e preço são obrigatórios",
        variant: "destructive"
      });
      return;
    }

    try {
      const url = editingService ? `/api/business/services/${editingService.id}` : '/api/business/services';
      const method = editingService ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (data.success) {
        toast({
          title: editingService ? "Serviço atualizado!" : "Serviço criado!",
          description: editingService ? "Serviço atualizado com sucesso" : "Serviço criado com sucesso"
        });
        
        setShowAddModal(false);
    setEditingService(null);
    setFormData({
      name: '',
      description: '',
      duration: 30,
      price: 0,
      image: '',
          slotsNeeded: 1,
          eventType: 'INDIVIDUAL',
          capacity: 1,
          availabilitySchedule: {
            monday: { enabled: true, timeSlots: [] },
            tuesday: { enabled: true, timeSlots: [] },
            wednesday: { enabled: true, timeSlots: [] },
            thursday: { enabled: true, timeSlots: [] },
            friday: { enabled: true, timeSlots: [] },
            saturday: { enabled: false, timeSlots: [] },
            sunday: { enabled: false, timeSlots: [] }
          },
          isActive: true
        });
        fetchServices();
      } else {
        toast({
          title: "Erro",
          description: data.error?.message || 'Erro ao salvar serviço',
          variant: "destructive"
        });
      }
    } catch (err) {
      toast({
        title: "Erro",
        description: "Erro ao salvar serviço",
        variant: "destructive"
      });
    }
  };

  // Função para adicionar novo horário
  const addTimeSlot = (day: string) => {
    // Calcular próximo horário disponível
    const existingSlots = formData.availabilitySchedule[day].timeSlots;
    let nextStartTime = '09:00';
    
    if (existingSlots.length > 0) {
      // Encontrar o último horário de fim
      const lastSlot = existingSlots[existingSlots.length - 1];
      
      // Calcular horário de fim do último slot
      const start = new Date(`2000-01-01T${lastSlot.startTime}`);
      const end = new Date(start.getTime() + (formData.slotsNeeded * 30 * 60 * 1000));
      const lastEndTime = end.toTimeString().slice(0, 5);
      
      // Converter para minutos para facilitar cálculos
      const [hours, minutes] = lastEndTime.split(':').map(Number);
      const lastEndMinutes = hours * 60 + minutes;
      
      // Adicionar 30 minutos de intervalo
      const nextStartMinutes = lastEndMinutes + 30;
      const nextHours = Math.floor(nextStartMinutes / 60);
      const nextMins = nextStartMinutes % 60;
      
      nextStartTime = `${nextHours.toString().padStart(2, '0')}:${nextMins.toString().padStart(2, '0')}`;
    }
    
        setFormData(prev => ({
          ...prev,
      availabilitySchedule: {
        ...prev.availabilitySchedule,
        [day]: {
          ...prev.availabilitySchedule[day],
          timeSlots: [
            ...prev.availabilitySchedule[day].timeSlots,
            { startTime: nextStartTime }
          ]
        }
      }
    }));
  };

  // Função para remover horário
  const removeTimeSlot = (day: string, index: number) => {
    setFormData(prev => ({
      ...prev,
      availabilitySchedule: {
        ...prev.availabilitySchedule,
        [day]: {
          ...prev.availabilitySchedule[day],
          timeSlots: prev.availabilitySchedule[day].timeSlots.filter((_: any, i: number) => i !== index)
        }
      }
    }));
  };

  // Função para atualizar horário
  const updateTimeSlot = (day: string, index: number, field: 'startTime', value: string) => {
    setFormData(prev => ({
      ...prev,
      availabilitySchedule: {
        ...prev.availabilitySchedule,
        [day]: {
          ...prev.availabilitySchedule[day],
          timeSlots: prev.availabilitySchedule[day].timeSlots.map((slot: any, i: number) => 
            i === index ? { ...slot, [field]: value } : slot
          )
        }
      }
    }));
  };

  // Função para aplicar horários a todos os dias úteis
  const applyToWeekdays = (sourceDay: string) => {
    const sourceTimeSlots = formData.availabilitySchedule[sourceDay].timeSlots;
    const weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
    
    setFormData(prev => {
      const newSchedule = { ...prev.availabilitySchedule };
      
      weekdays.forEach(day => {
        if (day !== sourceDay) {
          newSchedule[day] = {
            ...newSchedule[day],
            enabled: true,
            timeSlots: [...sourceTimeSlots]
          };
        }
      });
      
      return {
        ...prev,
        availabilitySchedule: newSchedule
      };
    });
  };

  const filteredServices = services.filter((service: Service) =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!mounted || authLoading) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
  }

    return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/staff/settings">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Serviços</h1>
            <p className="text-muted-foreground">Gerencie seus serviços e configure slots</p>
          </div>
        </div>
        
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Serviço
        </Button>
      </div>

      {/* Search */}
      <div className="mb-6">
          <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
            placeholder="Buscar serviços..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
            </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => (
          <Card key={service.id} className="hover:shadow-lg transition-shadow">
        <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{service.name}</CardTitle>
                  <CardDescription className="mt-1">
                    {service.description || 'Sem descrição'}
          </CardDescription>
            </div>
                <div className="flex gap-2">
                  {service.slotsNeeded && (
                    <Badge variant="outline" className="text-xs">
                      {service.slotsNeeded} slots
                    </Badge>
                  )}
                  {service.eventType === 'GROUP' && (
                    <Badge variant="secondary" className="text-xs">
                      <Users className="h-3 w-3 mr-1" />
                      Grupo ({service.capacity} lugares)
                    </Badge>
                  )}
                  {service.eventType === 'INDIVIDUAL' && (
                    <Badge variant="outline" className="text-xs">
                      Individual
                    </Badge>
                  )}
                  {!service.isActive && (
                    <Badge variant="destructive" className="text-xs">
                      Inativo
                    </Badge>
                        )}
                      </div>
                        </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{service.duration}min</span>
                        </div>
                  <div className="flex items-center gap-2">
                    <Euro className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{service.price}€</span>
                    </div>
                  </div>
                  
                <div className="flex gap-2 pt-2">
                    <Button
                    variant="outline"
                      size="sm"
                    onClick={() => {
                      setEditingService(service);
                      setFormData({
                        name: service.name,
                        description: service.description || '',
                        duration: service.duration,
                        price: service.price,
                        image: service.image || '',
                        slotsNeeded: service.slotsNeeded || 1,
                        eventType: service.eventType || 'INDIVIDUAL',
                        capacity: service.capacity || 1,
                        availabilitySchedule: service.availabilitySchedule || {
                          monday: { enabled: true, timeSlots: [] },
                          tuesday: { enabled: true, timeSlots: [] },
                          wednesday: { enabled: true, timeSlots: [] },
                          thursday: { enabled: true, timeSlots: [] },
                          friday: { enabled: true, timeSlots: [] },
                          saturday: { enabled: false, timeSlots: [] },
                          sunday: { enabled: false, timeSlots: [] }
                        },
                        isActive: service.isActive !== false
                      });
                      setShowAddModal(true);
                    }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                    variant="outline"
                      size="sm"
                    onClick={() => {
                      // TODO: Implementar delete
                    }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
        </CardContent>
      </Card>
        ))}
      </div>

      {/* Add/Edit Service Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingService ? 'Editar Serviço' : 'Novo Serviço'}
            </DialogTitle>
            <DialogDescription>
              {editingService ? 'Atualize as informações do serviço' : 'Crie um novo serviço'}
            </DialogDescription>
          </DialogHeader>

          <div className="overflow-y-auto max-h-[70vh] pr-2">
            <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informações Básicas */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Informações Básicas</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nome *</Label>
              <Input
                id="name"
                value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
                <div>
                  <Label htmlFor="price">Preço (€) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                  required
                />
              </div>
            </div>

              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="slotsNeeded">Slots Necessários</Label>
                  <div className="flex items-center space-x-2">
                  <Input
                      id="slotsNeeded"
                    type="number"
                      value={formData.slotsNeeded}
                      onChange={(e) => {
                        const slotsNeeded = parseInt(e.target.value) || 1;
                        setFormData(prev => ({ 
                          ...prev, 
                          slotsNeeded,
                          duration: slotsNeeded * 30
                        }));
                      }}
                    min="1"
                      className="flex-1"
                  />
                    <span className="text-sm text-muted-foreground">slots</span>
                </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Cada slot = 30 minutos (fixo)
                  </p>
              </div>
                <div>
                  <Label>Duração Total</Label>
                <div className="flex items-center space-x-2">
                    <div className="flex-1 px-3 py-2 bg-muted rounded-md border">
                      <span className="text-sm font-medium">{formData.duration} minutos</span>
                </div>
                    <span className="text-sm text-muted-foreground">calculado</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Duração automática baseada nos slots
                </p>
              </div>
                </div>
              </div>

            {/* Tipo de Evento e Capacidade */}
                <div className="space-y-4">
              <h3 className="text-lg font-semibold">Tipo de Evento</h3>
              <div className="grid grid-cols-2 gap-4">
                          <div>
                  <Label htmlFor="eventType">Tipo de Evento</Label>
                  <Select
                    value={formData.eventType}
                    onValueChange={(value: 'INDIVIDUAL' | 'GROUP') => 
                      setFormData(prev => ({ 
                        ...prev, 
                        eventType: value,
                        capacity: value === 'INDIVIDUAL' ? 1 : prev.capacity
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INDIVIDUAL">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          Individual
                          </div>
                      </SelectItem>
                      <SelectItem value="GROUP">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          Grupo
                    </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                          </div>
                          <div>
                  <Label htmlFor="capacity">Capacidade (lugares)</Label>
                            <Input
                    id="capacity"
                              type="number"
                              min="1"
                    value={formData.capacity}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      capacity: parseInt(e.target.value) || 1 
                    }))}
                    disabled={formData.eventType === 'INDIVIDUAL'}
                  />
                  {formData.eventType === 'INDIVIDUAL' && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Eventos individuais têm capacidade fixa de 1 lugar
                  </p>
                )}
              </div>
                          </div>
                        </div>
                        
            {/* Configuração de Disponibilidade */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Horários Disponíveis por Dia</h3>
              <p className="text-sm text-muted-foreground">
                Defina os horários específicos de início e fim para cada dia da semana
              </p>
              <div className="space-y-4">
                {Object.entries(formData.availabilitySchedule).map(([day, config]: [string, any]) => (
                  <Card key={day} className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Switch
                          checked={config.enabled}
                          onCheckedChange={(checked) => 
                            setFormData(prev => ({
                              ...prev,
                              availabilitySchedule: {
                                ...prev.availabilitySchedule,
                                [day]: { ...config, enabled: checked }
                              }
                            }))
                          }
                        />
                        <Label className="capitalize text-base font-medium">
                          {day === 'monday' && 'Segunda-feira'}
                          {day === 'tuesday' && 'Terça-feira'}
                          {day === 'wednesday' && 'Quarta-feira'}
                          {day === 'thursday' && 'Quinta-feira'}
                          {day === 'friday' && 'Sexta-feira'}
                          {day === 'saturday' && 'Sábado'}
                          {day === 'sunday' && 'Domingo'}
                                </Label>
                              </div>
                      {config.enabled && (
                        <Badge variant="outline" className="text-xs">
                          {config.timeSlots.length} horários definidos
                        </Badge>
                      )}
                          </div>

                    {config.enabled && (
              <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm font-medium">Horários Disponíveis:</Label>
                          <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                              onClick={() => addTimeSlot(day)}
                              className="text-xs"
                            >
                              + Adicionar Horário
                      </Button>
                            {config.timeSlots.length > 0 && (
                  <Button
                    type="button"
                                variant="secondary"
                                size="sm"
                                onClick={() => applyToWeekdays(day)}
                                className="text-xs"
                              >
                                📅 Aplicar a Dias Úteis
                  </Button>
                            )}
                </div>
                  </div>

                        {config.timeSlots.map((timeSlot: any, index: number) => {
                          // Calcular horário de fim automaticamente
                          const calculateEndTime = (startTime: string) => {
                            const start = new Date(`2000-01-01T${startTime}`);
                            const end = new Date(start.getTime() + (formData.slotsNeeded * 30 * 60 * 1000));
                            return end.toTimeString().slice(0, 5);
                          };

                          return (
                            <div key={index} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                              <div className="flex-1 grid grid-cols-2 gap-3">
                          <div>
                                  <Label className="text-xs text-muted-foreground">Início</Label>
                    <Input
                      type="time"
                                    value={timeSlot.startTime}
                                    onChange={(e) => updateTimeSlot(day, index, 'startTime', e.target.value)}
                              className="text-sm"
                    />
                  </div>
                          <div>
                                  <Label className="text-xs text-muted-foreground">Fim</Label>
                                  <div className="px-3 py-2 bg-muted rounded-md border">
                                    <span className="text-sm font-medium">
                                      {calculateEndTime(timeSlot.startTime)}
                                    </span>
                          </div>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    Calculado automaticamente
                                  </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                                onClick={() => removeTimeSlot(day, index)}
                                className="text-red-600 hover:text-red-700"
                      >
                        ✕
                      </Button>
                    </div>
                          );
                        })}
                        
                        {config.timeSlots.length === 0 && (
                          <div className="text-center py-4 text-muted-foreground">
                            <p className="text-sm">Nenhum horário definido para este dia</p>
                            <p className="text-xs">Clique em "Adicionar Horário" para começar</p>
                </div>
              )}
                  </div>
                    )}
                  </Card>
                ))}
                  </div>
                </div>

            {/* Status do Serviço */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Status</h3>
              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.isActive}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, isActive: checked }))
                  }
                />
                <Label>Serviço ativo</Label>
                </div>
                </div>

            </form>
            </div>

          <DialogFooter className="mt-4">
            <Button type="button" variant="outline" onClick={() => setShowAddModal(false)}>
              Cancelar
              </Button>
            <Button onClick={handleSubmit}>
              {editingService ? 'Atualizar' : 'Criar'} Serviço
              </Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 
