"use client";

import React, { useState, useEffect, useLayoutEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ArrowLeft, Clock, Users, Edit3, Plus, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from '@/hooks/use-toast';

interface SlotDetails {
  id: string;
  startTime: string;
  endTime: string;
  serviceName: string;
  capacity: number;
  booked: number;
  available: boolean;
  serviceId: string;
  price: number;
  duration: number;
  date: string;
}

interface Staff {
  id: string;
  name: string;
  email: string;
}

interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  isEligible: boolean;
}

interface SlotEnrollment {
  id: string;
  clientId: string;
  client: Client;
  status: 'CONFIRMED' | 'PENDING' | 'CANCELLED';
  attendance?: boolean;
}

export default function SlotDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { slotId } = params;
  
  const [slotDetails, setSlotDetails] = useState<SlotDetails | null>(null);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [enrollments, setEnrollments] = useState<SlotEnrollment[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  
  // Form states
  const [description, setDescription] = useState('');
  const [assignedStaffId, setAssignedStaffId] = useState<string>('');
  const [showAddClient, setShowAddClient] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string>('');

  // Add error handler immediately on component mount
  useLayoutEffect(() => {
    console.log('🔧 DEBUG: useLayoutEffect - Setting up error handler');
    
    const handleError = (error: ErrorEvent) => {
      console.error('🔧 DEBUG: Global error caught in useLayoutEffect:', error);
      if (error.message.includes('saving is not defined')) {
        console.error('🔧 DEBUG: Found the saving error in useLayoutEffect!', error);
        console.error('🔧 DEBUG: Error stack:', error.error?.stack);
      }
    };
    
    window.addEventListener('error', handleError);
    
    return () => {
      window.removeEventListener('error', handleError);
    };
  }, []);

  useEffect(() => {
    console.log('🔧 DEBUG: Component mounted');
    setMounted(true);
    
    // Global error handler for this component
    const handleError = (error: ErrorEvent) => {
      console.error('🔧 DEBUG: Global error caught:', error);
      if (error.message.includes('saving is not defined')) {
        console.error('🔧 DEBUG: Found the saving error!', error);
      }
    };
    
    window.addEventListener('error', handleError);
    
    return () => {
      window.removeEventListener('error', handleError);
    };
  }, []);

  useEffect(() => {
    if (slotId) {
      fetchSlotDetails();
      fetchStaff();
      fetchClients();
    }
  }, [slotId]);

  const fetchSlotDetails = async () => {
    try {
      const response = await fetch(`/api/slots/${slotId}/details`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setSlotDetails(data.data.slot);
          setDescription(data.data.description || '');
          setAssignedStaffId(data.data.assignedStaffId || '');
          setEnrollments(data.data.enrollments || []);
        }
      }
    } catch (error) {
      console.error('Error fetching slot details:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar detalhes da aula",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchStaff = async () => {
    try {
      const response = await fetch('/api/business/staff', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setStaff(data.data);
        }
      }
    } catch (error) {
      console.error('Error fetching staff:', error);
    }
  };

  const fetchClients = async () => {
    try {
      const response = await fetch('/api/business/clients', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setClients(data.data);
        }
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const saveSlotDetails = async () => {
    if (!mounted) return;
    try {
      const response = await fetch(`/api/slots/${slotId}/details`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          description,
          assignedStaffId: assignedStaffId || null
        })
      });

      if (response.ok) {
        toast({
          title: "Sucesso",
          description: "Detalhes da aula atualizados"
        });
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar detalhes da aula",
        variant: "destructive"
      });
    }
  };

  const enrollClient = async () => {
    console.log('🔧 DEBUG: enrollClient called', { selectedClientId, mounted });
    if (!selectedClientId || !mounted) return;
    
    try {
      const response = await fetch(`/api/slots/${slotId}/students/${selectedClientId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      if (response.ok) {
        toast({
          title: "Sucesso",
          description: "Cliente inscrito na aula"
        });
        setShowAddClient(false);
        setSelectedClientId('');
        fetchSlotDetails(); // Refresh data
      } else {
        throw new Error('Failed to enroll');
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao inscrever cliente",
        variant: "destructive"
      });
    }
  };

  const removeClient = async (enrollmentId: string) => {
    if (!mounted) return;
    try {
      const response = await fetch(`/api/slots/${slotId}/students/${enrollmentId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        toast({
          title: "Sucesso",
          description: "Cliente removido da aula"
        });
        fetchSlotDetails(); // Refresh data
      } else {
        throw new Error('Failed to remove');
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao remover cliente",
        variant: "destructive"
      });
    }
  };

  const toggleAttendance = async (enrollmentId: string, currentAttendance: boolean) => {
    if (!mounted) return;
    try {
      const response = await fetch(`/api/slots/${slotId}/students/${enrollmentId}/attendance`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          attendance: !currentAttendance
        })
      });

      if (response.ok) {
        toast({
          title: "Sucesso",
          description: `Presença ${!currentAttendance ? 'confirmada' : 'removida'}`
        });
        fetchSlotDetails(); // Refresh data
      } else {
        throw new Error('Failed to update attendance');
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar presença",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Carregando...</div>
        </div>
      </div>
    );
  }

  if (!slotDetails) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Aula não encontrada</h1>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </div>
      </div>
    );
  }

  const availableClients = clients.filter(client => 
    client.isEligible && 
    !enrollments.some(enrollment => enrollment.clientId === client.id)
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{slotDetails.serviceName}</h1>
            <p className="text-muted-foreground">
              {format(new Date(slotDetails.date), 'dd/MM/yyyy', { locale: ptBR })} • 
              {slotDetails.startTime} - {slotDetails.endTime}
            </p>
          </div>
        </div>
        
        <Button onClick={saveSlotDetails} disabled={!mounted}>
          Salvar Alterações
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Slot Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Informações da Aula
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Horário</label>
                  <p className="text-lg">{slotDetails.startTime} - {slotDetails.endTime}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Duração</label>
                  <p className="text-lg">{slotDetails.duration} minutos</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Preço</label>
                  <p className="text-lg">€{slotDetails.price}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Capacidade</label>
                  <p className="text-lg">{slotDetails.booked}/{slotDetails.capacity}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Edit3 className="h-5 w-5" />
                Descrição da Aula
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Adicione uma descrição para esta aula..."
                rows={4}
              />
            </CardContent>
          </Card>

          {/* Staff Assignment */}
          <Card>
            <CardHeader>
              <CardTitle>Staff Responsável</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={assignedStaffId} onValueChange={setAssignedStaffId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar staff" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Nenhum staff atribuído</SelectItem>
                  {staff.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Students List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Alunos ({enrollments.length})
                </div>
                <Dialog open={showAddClient} onOpenChange={setShowAddClient}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Adicionar Aluno</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Select value={selectedClientId} onValueChange={setSelectedClientId}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecionar cliente" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableClients.map((client) => (
                            <SelectItem key={client.id} value={client.id}>
                              {client.name} ({client.email})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setShowAddClient(false)}>
                          Cancelar
                        </Button>
                        <Button onClick={enrollClient} disabled={!selectedClientId || !mounted}>
                          Adicionar
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {enrollments.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  Nenhum aluno inscrito
                </p>
              ) : (
                <div className="space-y-3">
                  {enrollments?.map((enrollment) => {
                    console.log('🔧 DEBUG: Rendering enrollment:', enrollment.id);
                    return (
                    <div key={enrollment.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="font-medium">{enrollment.client.name}</p>
                          <p className="text-sm text-muted-foreground">{enrollment.client.email}</p>
                        </div>
                        <Badge variant={enrollment.status === 'CONFIRMED' ? 'default' : 'secondary'}>
                          {enrollment.status === 'CONFIRMED' ? 'Confirmado' : 'Pendente'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant={enrollment.attendance ? "default" : "outline"}
                          onClick={() => toggleAttendance(enrollment.id, enrollment.attendance || false)}
                          disabled={!mounted}
                        >
                          {enrollment.attendance ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            <XCircle className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeClient(enrollment.id)}
                          disabled={!mounted}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
