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
            <div key={day.day} className="p-4 border rounded-lg space-y-3">
              {/* Day Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-32">
                    <Label className="text-sm font-medium">{day.name}</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={day.isOpen}
                      onCheckedChange={(checked) => updateBusinessHour(index, 'isOpen', checked)}
                    />
                    <Label className="text-sm">
                      {day.isOpen ? 'Aberto' : 'Fechado'}
                    </Label>
                  </div>
                </div>
                
                {day.isOpen && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToAllDays(index)}
                    className="text-xs"
                  >
                    Copiar para todos
                  </Button>
                )}
              </div>
              
              {/* Time Configuration */}
              {day.isOpen && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Working Hours */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Horário de Trabalho</Label>
                    <div className="flex items-center space-x-2">
                      <Label htmlFor={`start-${day.day}`} className="text-sm">Das</Label>
                      <Input
                        id={`start-${day.day}`}
                        type="time"
                        value={day.start}
                        onChange={(e) => updateBusinessHour(index, 'start', e.target.value)}
                        className="w-24"
                      />
                      <Label htmlFor={`end-${day.day}`} className="text-sm">às</Label>
                      <Input
                        id={`end-${day.day}`}
                        type="time"
                        value={day.end}
                        onChange={(e) => updateBusinessHour(index, 'end', e.target.value)}
                        className="w-24"
                      />
                    </div>
                  </div>
                  
                  {/* Lunch Break */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Pausa para Almoço</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        type="time"
                        value={day.lunchBreakStart || ''}
                        onChange={(e) => updateBusinessHour(index, 'lunchBreakStart', e.target.value)}
                        className="w-24"
                        placeholder="12:00"
                      />
                      <span className="text-sm text-gray-400">às</span>
                      <Input
                        type="time"
                        value={day.lunchBreakEnd || ''}
                        onChange={(e) => updateBusinessHour(index, 'lunchBreakEnd', e.target.value)}
                        className="w-24"
                        placeholder="13:00"
                      />
                    </div>
                  </div>
                  
                  {/* Info */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Informação</Label>
                    <p className="text-xs text-gray-500">
                      {day.lunchBreakStart && day.lunchBreakEnd 
                        ? `Pausa: ${day.lunchBreakStart} - ${day.lunchBreakEnd}`
                        : 'Sem pausa definida'
                      }
                    </p>
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