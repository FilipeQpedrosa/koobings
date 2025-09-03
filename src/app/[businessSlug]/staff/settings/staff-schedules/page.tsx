"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Save, ArrowLeft, User, Clock, Coffee, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface StaffSchedule {
  day: number;
  name: string;
  isWorking: boolean;
  start: string;
  end: string;
  lunchBreakStart?: string;
  lunchBreakEnd?: string;
}

interface StaffAvailability {
  staffId: string;
  schedule: Record<string, {
    start: string;
    end: string;
    isWorking?: boolean;
    lunchBreakStart?: string;
    lunchBreakEnd?: string;
  }>;
}

export default function StaffSchedulesPage() {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [selectedStaffId, setSelectedStaffId] = useState<string>('');
  const [staffSchedules, setStaffSchedules] = useState<StaffSchedule[]>([
    { day: 1, name: 'Segunda-feira', isWorking: false, start: '09:00', end: '18:00', lunchBreakStart: '12:00', lunchBreakEnd: '13:00' },
    { day: 2, name: 'Terça-feira', isWorking: false, start: '09:00', end: '18:00', lunchBreakStart: '12:00', lunchBreakEnd: '13:00' },
    { day: 3, name: 'Quarta-feira', isWorking: false, start: '09:00', end: '18:00', lunchBreakStart: '12:00', lunchBreakEnd: '13:00' },
    { day: 4, name: 'Quinta-feira', isWorking: false, start: '09:00', end: '18:00', lunchBreakStart: '12:00', lunchBreakEnd: '13:00' },
    { day: 5, name: 'Sexta-feira', isWorking: false, start: '09:00', end: '18:00', lunchBreakStart: '12:00', lunchBreakEnd: '13:00' },
    { day: 6, name: 'Sábado', isWorking: false, start: '09:00', end: '18:00', lunchBreakStart: '12:00', lunchBreakEnd: '13:00' },
    { day: 0, name: 'Domingo', isWorking: false, start: '09:00', end: '18:00', lunchBreakStart: '12:00', lunchBreakEnd: '13:00' }
  ]);

  useEffect(() => {
    loadStaffMembers();
  }, []);

  useEffect(() => {
    if (selectedStaffId) {
      console.log(`🔄 [STAFF SCHEDULES] Staff selection changed to: ${selectedStaffId}`);
      // Reset schedules to default before loading new ones
      setStaffSchedules([
        { day: 1, name: 'Segunda-feira', isWorking: false, start: '09:00', end: '18:00', lunchBreakStart: '12:00', lunchBreakEnd: '13:00' },
        { day: 2, name: 'Terça-feira', isWorking: false, start: '09:00', end: '18:00', lunchBreakStart: '12:00', lunchBreakEnd: '13:00' },
        { day: 3, name: 'Quarta-feira', isWorking: false, start: '09:00', end: '18:00', lunchBreakStart: '12:00', lunchBreakEnd: '13:00' },
        { day: 4, name: 'Quinta-feira', isWorking: false, start: '09:00', end: '18:00', lunchBreakStart: '12:00', lunchBreakEnd: '13:00' },
        { day: 5, name: 'Sexta-feira', isWorking: false, start: '09:00', end: '18:00', lunchBreakStart: '12:00', lunchBreakEnd: '13:00' },
        { day: 6, name: 'Sábado', isWorking: false, start: '09:00', end: '18:00', lunchBreakStart: '12:00', lunchBreakEnd: '13:00' },
        { day: 0, name: 'Domingo', isWorking: false, start: '09:00', end: '18:00', lunchBreakStart: '12:00', lunchBreakEnd: '13:00' }
      ]);
      loadStaffSchedule(selectedStaffId);
    }
  }, [selectedStaffId]);

  const loadStaffMembers = async () => {
    try {
      const response = await fetch('/api/business/staff', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data.length > 0) {
          setStaffMembers(data.data);
          if (data.data.length === 1) {
            setSelectedStaffId(data.data[0].id);
          }
        }
      }
    } catch (error) {
      console.error('Error loading staff members:', error);
    }
  };

  const loadStaffSchedule = async (staffId: string) => {
    try {
      console.log(`🔍 [STAFF SCHEDULES] Loading schedule for staff: ${staffId}`);
      
      const response = await fetch(`/api/business/staff/${staffId}/availability`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log(`📋 [STAFF SCHEDULES] Response for staff ${staffId}:`, data);
        
        if (data.success) {
          const schedule = data.data?.schedule || {};
          console.log(`📅 [STAFF SCHEDULES] Schedule data for staff ${staffId}:`, schedule);
          
          const dayMap: Record<number, string> = {
            1: 'monday', 2: 'tuesday', 3: 'wednesday', 4: 'thursday', 
            5: 'friday', 6: 'saturday', 0: 'sunday'
          };
          
          const mappedSchedules = staffSchedules.map(dayTemplate => {
            const dayKey = dayMap[dayTemplate.day];
            const dayData = schedule[dayKey];
            
            console.log(`📋 [STAFF SCHEDULES] Day ${dayTemplate.name} (${dayKey}):`, dayData);
            
            return {
              ...dayTemplate,
              isWorking: dayData?.isWorking !== false && !!dayData?.start,
              start: dayData?.start || '09:00',
              end: dayData?.end || '18:00',
              lunchBreakStart: dayData?.lunchBreakStart || '12:00',
              lunchBreakEnd: dayData?.lunchBreakEnd || '13:00'
            };
          });
          
          console.log(`✅ [STAFF SCHEDULES] Mapped schedules for staff ${staffId}:`, mappedSchedules);
          setStaffSchedules(mappedSchedules);
        }
      } else {
        console.error(`❌ [STAFF SCHEDULES] Failed to load schedule for staff ${staffId}:`, response.status);
      }
    } catch (error) {
      console.error('Error loading staff schedule:', error);
    }
  };

  const saveStaffSchedule = async () => {
    console.log(`🔍 [STAFF SCHEDULES] Save button clicked`);
    console.log(`🔍 [STAFF SCHEDULES] selectedStaffId:`, selectedStaffId);
    console.log(`🔍 [STAFF SCHEDULES] isSaving:`, isSaving);
    console.log(`🔍 [STAFF SCHEDULES] staffSchedules:`, staffSchedules);
    
    // Prevent multiple simultaneous saves
    if (isSaving) {
      console.log(`⚠️ [STAFF SCHEDULES] Save already in progress, ignoring click`);
      return;
    }
    
    if (!selectedStaffId) {
      console.error(`❌ [STAFF SCHEDULES] No staff selected`);
      toast({
        title: "Erro",
        description: "Selecione um membro da equipa",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSaving(true);
      console.log(`💾 [STAFF SCHEDULES] Setting isSaving to true`);
      
      console.log(`💾 [STAFF SCHEDULES] Saving schedule for staff: ${selectedStaffId}`);
      
      const dayMap: Record<number, string> = {
        1: 'monday', 2: 'tuesday', 3: 'wednesday', 4: 'thursday', 
        5: 'friday', 6: 'saturday', 0: 'sunday'
      };
      
      const schedule: Record<string, any> = {};
      
      staffSchedules.forEach(day => {
        const dayKey = dayMap[day.day];
        schedule[dayKey] = {
          isWorking: day.isWorking,
          start: day.isWorking ? day.start : null,
          end: day.isWorking ? day.end : null,
          lunchBreakStart: day.isWorking && day.lunchBreakStart ? day.lunchBreakStart : null,
          lunchBreakEnd: day.isWorking && day.lunchBreakEnd ? day.lunchBreakEnd : null
        };
      });
      
      console.log(`📋 [STAFF SCHEDULES] Schedule data to save for staff ${selectedStaffId}:`, schedule);
      
      const url = `/api/business/staff/${selectedStaffId}/availability`;
      console.log(`🌐 [STAFF SCHEDULES] Making request to: ${url}`);
      
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ schedule }),
        // Add longer timeout for slower connections
        signal: AbortSignal.timeout(30000) // 30 seconds timeout
      });
      
      console.log(`📡 [STAFF SCHEDULES] Response status: ${response.status}`);
      console.log(`📡 [STAFF SCHEDULES] Response ok: ${response.ok}`);
      
      if (response.ok) {
        const responseData = await response.json();
        console.log(`✅ [STAFF SCHEDULES] Successfully saved schedule for staff ${selectedStaffId}:`, responseData);
        
        toast({
          title: "✅ Guardado com sucesso!",
          description: `Horários de ${selectedStaff?.name} actualizados`,
          className: "bg-green-50 border-green-200 text-green-800"
        });
        
        // Reload the schedule to confirm it was saved
        await loadStaffSchedule(selectedStaffId);
      } else {
        console.error(`❌ [STAFF SCHEDULES] Response not ok. Status: ${response.status}`);
        let errorData;
        try {
          errorData = await response.json();
          console.error(`❌ [STAFF SCHEDULES] Error response data:`, errorData);
        } catch (jsonError) {
          console.error(`❌ [STAFF SCHEDULES] Failed to parse error response as JSON:`, jsonError);
          const textData = await response.text();
          console.error(`❌ [STAFF SCHEDULES] Error response text:`, textData);
        }
        throw new Error(`HTTP ${response.status}: Falha ao guardar horário`);
      }
    } catch (error) {
      console.error('❌ [STAFF SCHEDULES] Catch block - Error saving staff schedule:', error);
      
      if (error instanceof Error && error.name === 'AbortError') {
        toast({
          title: "⏱️ Tempo esgotado",
          description: "A operação demorou muito tempo. Tente novamente.",
          variant: "destructive"
        });
      } else if (error instanceof Error && error.message.includes('fetch')) {
        toast({
          title: "🌐 Erro de conexão",
          description: "Verifique a sua conexão e tente novamente.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "❌ Erro",
          description: "Falha ao guardar horário da equipa",
          variant: "destructive"
        });
      }
    } finally {
      console.log(`🔄 [STAFF SCHEDULES] Setting isSaving to false`);
      setIsSaving(false);
    }
  };

  const updateStaffSchedule = (dayIndex: number, field: keyof StaffSchedule, value: any) => {
    const updated = [...staffSchedules];
    updated[dayIndex] = { ...updated[dayIndex], [field]: value };
    setStaffSchedules(updated);
  };

  const copyToAllDays = (sourceIndex: number) => {
    const sourceDay = staffSchedules[sourceIndex];
    const updated = staffSchedules.map(day => ({
      ...day,
      isWorking: sourceDay.isWorking,
      start: sourceDay.start,
      end: sourceDay.end,
      lunchBreakStart: sourceDay.lunchBreakStart,
      lunchBreakEnd: sourceDay.lunchBreakEnd
    }));
    setStaffSchedules(updated);
    
    toast({
      title: "Horários copiados",
      description: `Horários de ${sourceDay.name} aplicados a todos os dias`
    });
  };

  const selectedStaff = staffMembers.find(s => s.id === selectedStaffId);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">A carregar...</p>
        </div>
      </div>
    );
  }

  const workingDaysCount = staffSchedules.filter(day => day.isWorking).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/20 to-indigo-50/30 p-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Modern Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => router.back()}
                className="p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Horários da Equipa</h1>
                <p className="text-gray-500">Configure horários personalizados para cada membro</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {selectedStaffId && (
                <div className="text-right bg-blue-50 px-4 py-2 rounded-lg">
                  <p className="text-sm text-blue-600 font-medium">Editando horários de</p>
                  <p className="font-bold text-blue-900">{selectedStaff?.name}</p>
                </div>
              )}
              <Button 
                onClick={() => {
                  console.log(`🔘 [STAFF SCHEDULES] Button clicked! isSaving: ${isSaving}, selectedStaffId: ${selectedStaffId}`);
                  saveStaffSchedule();
                }} 
                disabled={isSaving || !selectedStaffId}
                className={`px-8 py-3 rounded-xl font-semibold shadow-lg transition-all transform ${
                  isSaving 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:scale-105'
                } text-white disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                    A guardar...
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5 mr-2" />
                    Guardar Alterações
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Staff Selection Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Selecionar Membro da Equipa</h3>
                <p className="text-gray-500">Escolha quem quer configurar</p>
              </div>
            </div>
            
            {staffMembers.length > 0 ? (
              <Select value={selectedStaffId} onValueChange={setSelectedStaffId}>
                <SelectTrigger className="w-80 h-12 rounded-lg border-gray-200">
                  <SelectValue placeholder="Escolha um membro da equipa" />
                </SelectTrigger>
                <SelectContent>
                  {staffMembers.map((staff) => (
                    <SelectItem key={staff.id} value={staff.id}>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">{staff.name}</p>
                          <p className="text-sm text-gray-500">{staff.email}</p>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="text-center py-8">
                <User className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500 mb-4">Nenhum membro da equipa encontrado</p>
                <Button 
                  variant="outline" 
                  onClick={() => router.push(`/${user?.businessSlug}/staff/settings/staff`)}
                  className="rounded-lg"
                >
                  Adicionar Staff Primeiro
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Schedule Configuration */}
        {selectedStaffId && selectedStaff && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Clock className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Configurar Horários</h3>
                  <p className="text-gray-500">
                    {workingDaysCount} {workingDaysCount === 1 ? 'dia configurado' : 'dias configurados'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Alterações salvas automaticamente</span>
              </div>
            </div>

            <div className="grid gap-4">
              {staffSchedules.map((day, index) => (
                <div key={day.day} className="border border-gray-200 rounded-xl p-5 hover:border-blue-200 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-3">
                        <Calendar className="h-5 w-5 text-gray-400" />
                        <h4 className="font-semibold text-gray-900">{day.name}</h4>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={day.isWorking}
                          onCheckedChange={(checked) => updateStaffSchedule(index, 'isWorking', checked)}
                          className="data-[state=checked]:bg-green-500"
                        />
                        <span className={`text-sm font-medium ${day.isWorking ? 'text-green-600' : 'text-gray-500'}`}>
                          {day.isWorking ? 'Trabalha' : 'Folga'}
                        </span>
                      </div>
                    </div>
                    
                    {day.isWorking && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToAllDays(index)}
                        className="rounded-lg"
                      >
                        Copiar para todos
                      </Button>
                    )}
                  </div>

                  {day.isWorking && (
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Working Hours */}
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2 mb-3">
                          <Clock className="h-4 w-4 text-blue-500" />
                          <span className="font-medium text-blue-700">Horário de Trabalho</span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label className="text-sm text-gray-600 mb-1 block">Início</Label>
                            <Input
                              type="time"
                              value={day.start}
                              onChange={(e) => updateStaffSchedule(index, 'start', e.target.value)}
                              className="h-10 rounded-lg"
                            />
                          </div>
                          <div>
                            <Label className="text-sm text-gray-600 mb-1 block">Fim</Label>
                            <Input
                              type="time"
                              value={day.end}
                              onChange={(e) => updateStaffSchedule(index, 'end', e.target.value)}
                              className="h-10 rounded-lg"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Lunch Break */}
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2 mb-3">
                          <Coffee className="h-4 w-4 text-orange-500" />
                          <span className="font-medium text-orange-700">Pausa de Almoço</span>
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Opcional</span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label className="text-sm text-gray-600 mb-1 block">Início</Label>
                            <Input
                              type="time"
                              value={day.lunchBreakStart}
                              onChange={(e) => updateStaffSchedule(index, 'lunchBreakStart', e.target.value)}
                              className="h-10 rounded-lg"
                            />
                          </div>
                          <div>
                            <Label className="text-sm text-gray-600 mb-1 block">Fim</Label>
                            <Input
                              type="time"
                              value={day.lunchBreakEnd}
                              onChange={(e) => updateStaffSchedule(index, 'lunchBreakEnd', e.target.value)}
                              className="h-10 rounded-lg"
                            />
                          </div>
                        </div>
                        
                        {day.lunchBreakStart && day.lunchBreakEnd && (
                          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                            <p className="text-sm text-orange-700">
                              <AlertCircle className="h-4 w-4 inline mr-1" />
                              Pausa: {day.lunchBreakStart} - {day.lunchBreakEnd}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-900">Configuração Completa</p>
                  <p className="text-sm text-blue-700">
                    Os horários serão aplicados na disponibilidade da equipa para agendamentos
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}