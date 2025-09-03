"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Save, ArrowLeft, User, Clock } from 'lucide-react';
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
        body: JSON.stringify({ schedule })
      });
      
      console.log(`📡 [STAFF SCHEDULES] Response status: ${response.status}`);
      console.log(`📡 [STAFF SCHEDULES] Response ok: ${response.ok}`);
      
      if (response.ok) {
        const responseData = await response.json();
        console.log(`✅ [STAFF SCHEDULES] Successfully saved schedule for staff ${selectedStaffId}:`, responseData);
        
        toast({
          title: "Sucesso",
          description: "Horário da equipa guardado com sucesso"
        });
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
      toast({
        title: "Erro",
        description: "Falha ao guardar horário da equipa",
        variant: "destructive"
      });
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
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Horários da Equipa</h1>
            <p className="text-gray-600">Configure os horários individuais de cada membro da equipa</p>
          </div>
        </div>
        
        <Button 
          onClick={() => {
            console.log(`🔘 [STAFF SCHEDULES] Button 1 clicked! isSaving: ${isSaving}, selectedStaffId: ${selectedStaffId}`);
            saveStaffSchedule();
          }} 
          disabled={isSaving || !selectedStaffId}
        >
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? 'A guardar...' : 'Guardar'}
        </Button>
      </div>

      {/* Staff Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="h-5 w-5 mr-2" />
            Selecionar Membro da Equipa
          </CardTitle>
          <CardDescription>
            Escolha o membro da equipa para configurar os horários
          </CardDescription>
        </CardHeader>
        <CardContent>
          {staffMembers.length > 0 ? (
            <Select value={selectedStaffId} onValueChange={setSelectedStaffId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione um membro da equipa" />
              </SelectTrigger>
              <SelectContent>
                {staffMembers.map((staff) => (
                  <SelectItem key={staff.id} value={staff.id}>
                    <div className="flex items-center space-x-2">
                      <span>{staff.name}</span>
                      <span className="text-sm text-gray-500">({staff.email})</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-500">
                Nenhum membro da equipa encontrado. 
                <Button variant="link" onClick={() => router.push(`/${user?.businessSlug}/staff/settings/staff`)}>
                  Adicione membros da equipa primeiro
                </Button>
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Staff Schedule Configuration */}
      {selectedStaffId && selectedStaff && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Horários de {selectedStaff.name}
            </CardTitle>
            <CardDescription>
              Configure os horários de trabalho para cada dia da semana
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {staffSchedules.map((day, index) => (
              <div key={day.day} className="flex items-center space-x-4 p-4 border rounded-lg">
                <div className="w-32">
                  <Label className="text-sm font-medium">{day.name}</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={day.isWorking}
                    onCheckedChange={(checked) => updateStaffSchedule(index, 'isWorking', checked)}
                  />
                  <Label className="text-sm">
                    {day.isWorking ? 'Trabalha' : 'Folga'}
                  </Label>
                </div>
                
                {day.isWorking && (
                  <>
                    <div className="flex items-center space-x-2">
                      <Label htmlFor={`start-${day.day}`} className="text-sm">Das</Label>
                      <Input
                        id={`start-${day.day}`}
                        type="time"
                        value={day.start}
                        onChange={(e) => updateStaffSchedule(index, 'start', e.target.value)}
                        className="w-20"
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Label htmlFor={`end-${day.day}`} className="text-sm">às</Label>
                      <Input
                        id={`end-${day.day}`}
                        type="time"
                        value={day.end}
                        onChange={(e) => updateStaffSchedule(index, 'end', e.target.value)}
                        className="w-20"
                      />
                    </div>
                    
                    <div className="flex items-center space-x-1 border-l pl-2">
                      <Label className="text-xs text-gray-500">Almoço:</Label>
                      <Input
                        type="time"
                        value={day.lunchBreakStart || ''}
                        onChange={(e) => updateStaffSchedule(index, 'lunchBreakStart', e.target.value)}
                        className="w-16 text-xs"
                        placeholder="12:00"
                      />
                      <span className="text-xs text-gray-400">-</span>
                      <Input
                        type="time"
                        value={day.lunchBreakEnd || ''}
                        onChange={(e) => updateStaffSchedule(index, 'lunchBreakEnd', e.target.value)}
                        className="w-16 text-xs"
                        placeholder="13:00"
                      />
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToAllDays(index)}
                      className="text-xs"
                    >
                      Copiar para todos
                    </Button>
                  </>
                )}
              </div>
            ))}
            
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">
                    Os horários serão aplicados na disponibilidade da equipa para agendamentos
                  </p>
                </div>
                <Button 
                  onClick={() => {
                    console.log(`🔘 [STAFF SCHEDULES] Button 2 clicked! isSaving: ${isSaving}, selectedStaffId: ${selectedStaffId}`);
                    saveStaffSchedule();
                  }} 
                  disabled={isSaving || !selectedStaffId}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? 'A guardar...' : 'Guardar Alterações'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
