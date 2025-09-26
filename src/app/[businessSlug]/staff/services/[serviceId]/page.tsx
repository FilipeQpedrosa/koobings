'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { ArrowLeft, Edit, Save, Users, Calendar, Clock, Euro, Settings } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  description: string | null;
  duration: number;
  price: number;
  maxCapacity: number;
  availableDays: number[];
  startTime: string | null;
  endTime: string | null;
  slots: any;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Staff {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface SlotAssignment {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  staffId: string;
}

export default function ServiceDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const businessSlug = params.businessSlug as string;
  const serviceId = params.serviceId as string;

  const [service, setService] = useState<Service | null>(null);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [slotAssignments, setSlotAssignments] = useState<SlotAssignment[]>([]);
  const [dailyDescriptions, setDailyDescriptions] = useState<{ [key: number]: string }>({});

  const dayNames = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

  useEffect(() => {
    if (serviceId) {
      fetchServiceDetails();
      fetchStaff();
    }
  }, [serviceId]);

  const fetchServiceDetails = async () => {
    try {
      const response = await fetch(`/api/business/services/${serviceId}`, {
        credentials: 'include',
        cache: 'no-store'
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setService(data.data);
          initializeSlotAssignments(data.data);
        }
      }
    } catch (error) {
      console.error('Error fetching service:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStaff = async () => {
    try {
      const response = await fetch('/api/business/staff', {
        credentials: 'include',
        cache: 'no-store'
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setStaff(data.data || []);
        }
      }
    } catch (error) {
      console.error('Error fetching staff:', error);
    }
  };

  const initializeSlotAssignments = (serviceData: Service) => {
    const assignments: SlotAssignment[] = [];
    const descriptions: { [key: number]: string } = {};

    if (serviceData.slots && typeof serviceData.slots === 'object') {
      Object.entries(serviceData.slots).forEach(([dayName, daySlots]: [string, any]) => {
        const dayOfWeek = getDayOfWeekFromName(dayName);
        
        if (Array.isArray(daySlots)) {
          daySlots.forEach((slot: any) => {
            assignments.push({
              dayOfWeek,
              startTime: slot.startTime,
              endTime: slot.endTime,
              staffId: slot.staffId || ''
            });
          });
        }
      });
    }

    // Initialize daily descriptions from service data or default to main description
    serviceData.availableDays?.forEach(day => {
      descriptions[day] = serviceData.description || '';
    });

    setSlotAssignments(assignments);
    setDailyDescriptions(descriptions);
  };

  const getDayOfWeekFromName = (dayName: string): number => {
    const dayMap: { [key: string]: number } = {
      'sunday': 0, 'monday': 1, 'tuesday': 2, 'wednesday': 3,
      'thursday': 4, 'friday': 5, 'saturday': 6
    };
    return dayMap[dayName.toLowerCase()] || 0;
  };

  const getDayNameFromNumber = (dayOfWeek: number): string => {
    return dayNames[dayOfWeek];
  };

  const handleSaveService = async () => {
    if (!service) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/business/services/${serviceId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: service.name,
          description: service.description,
          duration: service.duration,
          price: service.price,
          maxCapacity: service.maxCapacity,
          startTime: service.startTime,
          endTime: service.endTime,
          isActive: service.isActive,
          slotAssignments: slotAssignments,
          dailyDescriptions: dailyDescriptions
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setEditing(false);
          await fetchServiceDetails();
        }
      }
    } catch (error) {
      console.error('Error saving service:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleSlotAssignmentChange = (index: number, field: keyof SlotAssignment, value: string) => {
    const newAssignments = [...slotAssignments];
    newAssignments[index] = { ...newAssignments[index], [field]: value };
    setSlotAssignments(newAssignments);
  };

  const handleDailyDescriptionChange = (dayOfWeek: number, description: string) => {
    setDailyDescriptions(prev => ({
      ...prev,
      [dayOfWeek]: description
    }));
  };

  const addSlotAssignment = (dayOfWeek: number) => {
    const newAssignment: SlotAssignment = {
      dayOfWeek,
      startTime: '09:00',
      endTime: '10:00',
      staffId: ''
    };
    setSlotAssignments(prev => [...prev, newAssignment]);
  };

  const removeSlotAssignment = (index: number) => {
    setSlotAssignments(prev => prev.filter((_, i) => i !== index));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando detalhes do serviço...</p>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Serviço não encontrado</h1>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => router.back()}
                className="flex items-center"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{service.name}</h1>
                <div className="flex items-center space-x-4 mt-2">
                  <Badge variant={service.isActive ? "default" : "secondary"}>
                    {service.isActive ? 'Ativo' : 'Inativo'}
                  </Badge>
                  <span className="text-sm text-gray-500">
                    Criado em {new Date(service.createdAt).toLocaleDateString('pt-PT')}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              {editing ? (
                <>
                  <Button onClick={() => setEditing(false)} variant="outline">
                    Cancelar
                  </Button>
                  <Button onClick={handleSaveService} disabled={saving}>
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? 'Guardando...' : 'Guardar'}
                  </Button>
                </>
              ) : (
                <Button onClick={() => setEditing(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
              )}
            </div>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="schedule">Horários</TabsTrigger>
            <TabsTrigger value="staff">Staff</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Duração</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{service.duration} min</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Preço</CardTitle>
                  <Euro className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">€{service.price}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Capacidade</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{service.maxCapacity}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Dias Ativos</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{service.availableDays?.length || 0}</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Descrição</CardTitle>
              </CardHeader>
              <CardContent>
                {editing ? (
                  <Textarea
                    value={service.description || ''}
                    onChange={(e) => setService(prev => prev ? { ...prev, description: e.target.value } : null)}
                    placeholder="Descrição do serviço..."
                    rows={4}
                  />
                ) : (
                  <p className="text-gray-700">{service.description || 'Sem descrição'}</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Schedule Tab */}
          <TabsContent value="schedule" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Horários e Staff</CardTitle>
                <p className="text-sm text-gray-600">
                  Configure os horários e atribua staff específico para cada slot
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {service.availableDays?.map(dayOfWeek => (
                  <div key={dayOfWeek} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">{getDayNameFromNumber(dayOfWeek)}</h3>
                      <Button
                        size="sm"
                        onClick={() => addSlotAssignment(dayOfWeek)}
                        disabled={!editing}
                      >
                        Adicionar Horário
                      </Button>
                    </div>

                    {/* Daily Description */}
                    <div className="mb-4">
                      <Label htmlFor={`description-${dayOfWeek}`}>
                        Descrição/Plano de Treino para {getDayNameFromNumber(dayOfWeek)}
                      </Label>
                      {editing ? (
                        <Textarea
                          id={`description-${dayOfWeek}`}
                          value={dailyDescriptions[dayOfWeek] || ''}
                          onChange={(e) => handleDailyDescriptionChange(dayOfWeek, e.target.value)}
                          placeholder={`Plano de treino específico para ${getDayNameFromNumber(dayOfWeek)}...`}
                          rows={3}
                        />
                      ) : (
                        <p className="text-gray-700 mt-1 p-3 bg-gray-50 rounded">
                          {dailyDescriptions[dayOfWeek] || 'Sem descrição específica'}
                        </p>
                      )}
                    </div>

                    {/* Slot Assignments */}
                    <div className="space-y-3">
                      {slotAssignments
                        .filter(slot => slot.dayOfWeek === dayOfWeek)
                        .map((slot, index) => {
                          const globalIndex = slotAssignments.findIndex(s => s === slot);
                          const assignedStaff = staff.find(s => s.id === slot.staffId);
                          return (
                            <div key={globalIndex} className="border rounded-lg p-4 bg-white shadow-sm">
                              <div className="flex items-center justify-between mb-3">
                                <h4 className="font-semibold text-gray-900">
                                  Slot {slot.startTime} - {slot.endTime}
                                </h4>
                                {editing && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => removeSlotAssignment(globalIndex)}
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    Remover Slot
                                  </Button>
                                )}
                              </div>
                              
                              <div className="mb-4">
                                <Label>Horário</Label>
                                {editing ? (
                                  <div className="flex space-x-2 mt-1">
                                    <Input
                                      type="time"
                                      value={slot.startTime}
                                      onChange={(e) => handleSlotAssignmentChange(globalIndex, 'startTime', e.target.value)}
                                      className="flex-1"
                                    />
                                    <span className="flex items-center text-gray-500">até</span>
                                    <Input
                                      type="time"
                                      value={slot.endTime}
                                      onChange={(e) => handleSlotAssignmentChange(globalIndex, 'endTime', e.target.value)}
                                      className="flex-1"
                                    />
                                  </div>
                                ) : (
                                  <p className="text-sm font-medium mt-1">{slot.startTime} - {slot.endTime}</p>
                                )}
                              </div>
                              
                              <div className="mt-4">
                                <Label>Professor/Staff Atribuído</Label>
                                {editing ? (
                                  <Select
                                    value={slot.staffId}
                                    onValueChange={(value) => handleSlotAssignmentChange(globalIndex, 'staffId', value)}
                                    className="mt-1"
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Selecionar professor para este horário" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {staff.map(s => (
                                        <SelectItem key={s.id} value={s.id}>
                                          <div className="flex items-center space-x-2">
                                            <span>{s.name}</span>
                                            <Badge variant="outline" className="text-xs">
                                              {s.role}
                                            </Badge>
                                          </div>
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                ) : (
                                  <div className="flex items-center space-x-2 mt-1">
                                    <p className="text-sm font-medium">
                                      {assignedStaff?.name || 'Não atribuído'}
                                    </p>
                                    {assignedStaff && (
                                      <Badge variant="outline" className="text-xs">
                                        {assignedStaff.role}
                                      </Badge>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      
                      {slotAssignments.filter(slot => slot.dayOfWeek === dayOfWeek).length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                          <p className="text-lg font-medium">Nenhum horário configurado</p>
                          <p className="text-sm">Adicione horários para este dia</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Staff Tab */}
          <TabsContent value="staff" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Staff Disponível</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {staff.map(member => (
                    <div key={member.id} className="border rounded-lg p-4">
                      <h3 className="font-semibold">{member.name}</h3>
                      <p className="text-sm text-gray-600">{member.email}</p>
                      <Badge variant="outline" className="mt-2">
                        {member.role}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configurações do Serviço</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="duration">Duração (minutos)</Label>
                    {editing ? (
                      <Input
                        id="duration"
                        type="number"
                        value={service.duration}
                        onChange={(e) => setService(prev => prev ? { ...prev, duration: parseInt(e.target.value) } : null)}
                      />
                    ) : (
                      <p className="text-sm font-medium">{service.duration} minutos</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="price">Preço (€)</Label>
                    {editing ? (
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        value={service.price}
                        onChange={(e) => setService(prev => prev ? { ...prev, price: parseFloat(e.target.value) } : null)}
                      />
                    ) : (
                      <p className="text-sm font-medium">€{service.price}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="capacity">Capacidade Máxima</Label>
                    {editing ? (
                      <Input
                        id="capacity"
                        type="number"
                        value={service.maxCapacity}
                        onChange={(e) => setService(prev => prev ? { ...prev, maxCapacity: parseInt(e.target.value) } : null)}
                      />
                    ) : (
                      <p className="text-sm font-medium">{service.maxCapacity} pessoas</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="startTime">Hora de Início</Label>
                    {editing ? (
                      <Input
                        id="startTime"
                        type="time"
                        value={service.startTime || ''}
                        onChange={(e) => setService(prev => prev ? { ...prev, startTime: e.target.value } : null)}
                      />
                    ) : (
                      <p className="text-sm font-medium">{service.startTime || 'Não definido'}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="endTime">Hora de Fim</Label>
                    {editing ? (
                      <Input
                        id="endTime"
                        type="time"
                        value={service.endTime || ''}
                        onChange={(e) => setService(prev => prev ? { ...prev, endTime: e.target.value } : null)}
                      />
                    ) : (
                      <p className="text-sm font-medium">{service.endTime || 'Não definido'}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="status">Estado</Label>
                    {editing ? (
                      <Select
                        value={service.isActive ? 'active' : 'inactive'}
                        onValueChange={(value) => setService(prev => prev ? { ...prev, isActive: value === 'active' } : null)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Ativo</SelectItem>
                          <SelectItem value="inactive">Inativo</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Badge variant={service.isActive ? "default" : "secondary"}>
                        {service.isActive ? 'Ativo' : 'Inativo'}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
