"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Clock, Save, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

interface BusinessHour {
  day: number;
  name: string;
  isOpen: boolean;
  start: string;
  end: string;
  lunchBreakStart?: string;
  lunchBreakEnd?: string;
}

export default function BusinessHoursSettings() {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  
  const [businessHours, setBusinessHours] = useState<BusinessHour[]>([
    { day: 1, name: 'Segunda-feira', isOpen: false, start: '09:00', end: '18:00', lunchBreakStart: '12:00', lunchBreakEnd: '13:00' },
    { day: 2, name: 'Terça-feira', isOpen: false, start: '09:00', end: '18:00', lunchBreakStart: '12:00', lunchBreakEnd: '13:00' },
    { day: 3, name: 'Quarta-feira', isOpen: false, start: '09:00', end: '18:00', lunchBreakStart: '12:00', lunchBreakEnd: '13:00' },
    { day: 4, name: 'Quinta-feira', isOpen: false, start: '09:00', end: '18:00', lunchBreakStart: '12:00', lunchBreakEnd: '13:00' },
    { day: 5, name: 'Sexta-feira', isOpen: false, start: '09:00', end: '18:00', lunchBreakStart: '12:00', lunchBreakEnd: '13:00' },
    { day: 6, name: 'Sábado', isOpen: false, start: '09:00', end: '18:00', lunchBreakStart: '12:00', lunchBreakEnd: '13:00' },
    { day: 0, name: 'Domingo', isOpen: false, start: '09:00', end: '18:00', lunchBreakStart: '12:00', lunchBreakEnd: '13:00' }
  ]);

  useEffect(() => {
    loadBusinessHours();
  }, []);

  const loadBusinessHours = async () => {
    try {
      const response = await fetch('/api/business/hours', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data.length > 0) {
          const mappedHours = businessHours.map(dayTemplate => {
            const dayData = data.data.find((h: any) => h.day === dayTemplate.day);
            return {
              ...dayTemplate,
              isOpen: dayData?.isOpen || false,
              start: dayData?.start || '09:00',
              end: dayData?.end || '18:00',
              lunchBreakStart: dayData?.lunchBreakStart || '12:00',
              lunchBreakEnd: dayData?.lunchBreakEnd || '13:00'
            };
          });
          setBusinessHours(mappedHours);
        }
      }
    } catch (error) {
      console.error('Error loading business hours:', error);
    }
  };

  const saveBusinessHours = async () => {
    try {
      setIsSaving(true);
      
      const response = await fetch('/api/business/hours', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          hours: businessHours.map(h => ({
            day: h.day,
            isOpen: h.isOpen,
            start: h.isOpen ? h.start : null,
            end: h.isOpen ? h.end : null,
            lunchBreakStart: h.isOpen && h.lunchBreakStart ? h.lunchBreakStart : null,
            lunchBreakEnd: h.isOpen && h.lunchBreakEnd ? h.lunchBreakEnd : null
          }))
        })
      });
      
      if (response.ok) {
        toast({
          title: "Sucesso",
          description: "Horários de funcionamento guardados com sucesso"
        });
      } else {
        throw new Error('Falha ao guardar horários');
      }
    } catch (error) {
      console.error('Error saving business hours:', error);
      toast({
        title: "Erro",
        description: "Falha ao guardar horários de funcionamento",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const updateBusinessHour = (dayIndex: number, field: keyof BusinessHour, value: any) => {
    const updated = [...businessHours];
    updated[dayIndex] = { ...updated[dayIndex], [field]: value };
    setBusinessHours(updated);
  };

  const copyToAllDays = (sourceIndex: number) => {
    const sourceDay = businessHours[sourceIndex];
    const updated = businessHours.map(day => ({
      ...day,
      isOpen: sourceDay.isOpen,
      start: sourceDay.start,
      end: sourceDay.end,
      lunchBreakStart: sourceDay.lunchBreakStart,
      lunchBreakEnd: sourceDay.lunchBreakEnd
    }));
    setBusinessHours(updated);
    
    toast({
      title: "Horários copiados",
      description: `Horários de ${sourceDay.name} aplicados a todos os dias`
    });
  };

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
            <h1 className="text-3xl font-bold text-gray-900">Horários de Funcionamento</h1>
            <p className="text-gray-600">Configure os horários de funcionamento do seu negócio</p>
          </div>
        </div>
        
        <Button onClick={saveBusinessHours} disabled={isSaving}>
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? 'A guardar...' : 'Guardar'}
        </Button>
      </div>

      {/* Business Hours Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Horários Semanais
          </CardTitle>
          <CardDescription>
            Defina os horários de funcionamento para cada dia da semana
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {businessHours.map((day, index) => (
            <div key={day.day} className="border rounded-lg overflow-hidden">
              {/* Day Header */}
              <div className="bg-gray-50 px-4 py-3 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <h3 className="font-medium text-gray-900 w-28">{day.name}</h3>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={day.isOpen}
                        onCheckedChange={(checked) => updateBusinessHour(index, 'isOpen', checked)}
                      />
                      <Label className="text-sm text-gray-600">
                        {day.isOpen ? 'Aberto' : 'Fechado'}
                      </Label>
                    </div>
                  </div>
                  
                  {day.isOpen && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToAllDays(index)}
                      className="text-xs bg-white"
                    >
                      Copiar para todos
                    </Button>
                  )}
                </div>
              </div>
              
              {/* Time Configuration */}
              {day.isOpen && (
                <div className="p-4 bg-white">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Working Hours */}
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 text-blue-600">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <Label className="text-sm font-medium">Horário de Funcionamento</Label>
                      </div>
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-2">
                            <Label className="text-sm text-gray-600 min-w-[30px]">Das</Label>
                            <Input
                              type="time"
                              value={day.start}
                              onChange={(e) => updateBusinessHour(index, 'start', e.target.value)}
                              className="w-28 h-9"
                            />
                          </div>
                          <div className="flex items-center space-x-2">
                            <Label className="text-sm text-gray-600 min-w-[20px]">às</Label>
                            <Input
                              type="time"
                              value={day.end}
                              onChange={(e) => updateBusinessHour(index, 'end', e.target.value)}
                              className="w-28 h-9"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Lunch Break */}
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 text-orange-600">
                        <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                        <Label className="text-sm font-medium">Pausa para Almoço</Label>
                        <span className="text-xs text-gray-500">(opcional)</span>
                      </div>
                      <div className="bg-orange-50 p-3 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-2">
                            <Label className="text-sm text-gray-600 min-w-[30px]">Das</Label>
                            <Input
                              type="time"
                              value={day.lunchBreakStart || ''}
                              onChange={(e) => updateBusinessHour(index, 'lunchBreakStart', e.target.value)}
                              className="w-28 h-9"
                              placeholder="12:00"
                            />
                          </div>
                          <div className="flex items-center space-x-2">
                            <Label className="text-sm text-gray-600 min-w-[20px]">às</Label>
                            <Input
                              type="time"
                              value={day.lunchBreakEnd || ''}
                              onChange={(e) => updateBusinessHour(index, 'lunchBreakEnd', e.target.value)}
                              className="w-28 h-9"
                              placeholder="13:00"
                            />
                          </div>
                        </div>
                        {day.lunchBreakStart && day.lunchBreakEnd && (
                          <div className="mt-2 text-xs text-orange-700 bg-orange-100 px-2 py-1 rounded">
                            Pausa configurada: {day.lunchBreakStart} - {day.lunchBreakEnd}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
          
          <div className="pt-4 border-t">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">
                  Os horários serão aplicados na agenda e no portal do cliente
                </p>
              </div>
              <Button onClick={saveBusinessHours} disabled={isSaving}>
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? 'A guardar...' : 'Guardar Alterações'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 