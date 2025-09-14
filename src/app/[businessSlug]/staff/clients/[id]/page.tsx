"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { ArrowLeft, User, Phone, Mail, Calendar, Edit, Plus, Clock } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  notes?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface Appointment {
  id: string;
  scheduledFor: string;
  duration: number;
  status: string;
  notes?: string;
  createdAt: string;
  Service?: {
    name: string;
    price: number;
  };
  Staff?: {
    name: string;
  };
}

interface Note {
  id: string;
  content: string;
  createdAt: string;
  Staff: {
    name: string;
  };
}

export default function ClientDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [client, setClient] = useState<Client | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [newNote, setNewNote] = useState('');
  const [addingNote, setAddingNote] = useState(false);

  useEffect(() => {
    fetchClientDetails();
  }, [params.id]);

  const fetchClientDetails = async () => {
    try {
      setLoading(true);
      console.log('🔧 DEBUG: Fetching client data for:', params.id);
      
      // Add timestamp to prevent cache
      const timestamp = Date.now();
      const response = await fetch(`/api/staff/clients/${params.id}?t=${timestamp}`, {
        credentials: 'include',
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });

      console.log('🔧 DEBUG: Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('🔧 DEBUG: Response data received:', {
          clientExists: !!data.data?.client,
          appointmentsCount: data.data?.appointments?.length || 0,
          notesCount: data.data?.notes?.length || 0,
          notes: data.data?.notes?.map((note: any) => ({ id: note.id, content: note.content.substring(0, 50) + '...' }))
        });
        
        if (data.success && data.data) {
          setClient(data.data.client);
          setAppointments(data.data.appointments || []);
          setNotes(data.data.notes || []);
          console.log('🔧 DEBUG: State updated - notes count:', data.data.notes?.length || 0);
        }
      } else {
        console.error('🔧 DEBUG: Failed to fetch client data:', response.status);
      }
    } catch (error) {
      console.error('🔧 DEBUG: Error fetching client data:', error);
    } finally {
      setLoading(false);
    }
  };

  const addNote = async () => {
    if (!newNote.trim()) return;

    try {
      setAddingNote(true);
      console.log('🔧 DEBUG: Adding note for client:', params.id);
      console.log('🔧 DEBUG: Note content:', newNote);
      
      const response = await fetch(`/api/staff/clients/${params.id}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ content: newNote })
      });

      console.log('🔧 DEBUG: Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('🔧 DEBUG: Response data:', data);
        
        if (data.success) {
          console.log('🔧 DEBUG: Adding note to local state:', data.data);
          setNotes(prev => {
            const updated = [data.data, ...prev];
            console.log('🔧 DEBUG: Updated notes array length:', updated.length);
            return updated;
          });
          setNewNote('');
          toast({
            title: "Sucesso",
            description: "Nota adicionada com sucesso"
          });
        } else {
          console.error('🔧 DEBUG: API returned success: false');
        }
      } else {
        console.error('🔧 DEBUG: Response not OK, status:', response.status);
        const errorData = await response.text();
        console.error('🔧 DEBUG: Error response:', errorData);
      }
    } catch (error) {
      console.error('🔧 DEBUG: Exception in addNote:', error);
      toast({
        title: "Erro",
        description: "Falha ao adicionar nota",
        variant: "destructive"
      });
    } finally {
      setAddingNote(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      'CONFIRMED': { label: 'Confirmado', variant: 'default' },
      'PENDING': { label: 'Pendente', variant: 'secondary' },
      'COMPLETED': { label: 'Concluído', variant: 'outline' },
      'CANCELLED': { label: 'Cancelado', variant: 'destructive' }
    };
    
    const statusInfo = statusMap[status] || { label: status, variant: 'secondary' };
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-red-600">Cliente não encontrado</CardTitle>
            <CardDescription>O cliente solicitado não foi encontrado</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={() => router.back()} variant="outline">
              Voltar
            </Button>
          </CardContent>
        </Card>
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
            <h1 className="text-3xl font-bold text-gray-900">{client.name}</h1>
            <p className="text-gray-600">Detalhes do cliente</p>
          </div>
        </div>
        
        <Link href={`/${user?.businessSlug}/staff/clients/${client.id}/edit`}>
          <Button>
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
        </Link>
      </div>

      {/* Client Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="h-5 w-5 mr-2" />
            Informações do Cliente
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-gray-500" />
              <span>{client.email}</span>
            </div>
            {client.phone && (
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <span>{client.phone}</span>
              </div>
            )}
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span>Cliente desde {formatDate(client.createdAt)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>Status:</span>
              <Badge variant={client.status === 'ACTIVE' ? 'default' : 'secondary'}>
                {client.status === 'ACTIVE' ? 'Ativo' : 'Inativo'}
              </Badge>
            </div>
            {client.notes && (
              <div className="md:col-span-2">
                <p className="text-sm text-gray-600">{client.notes}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tabs for History and Notes */}
      <Tabs defaultValue="appointments" className="w-full">
        <TabsList>
          <TabsTrigger value="appointments">
            Histórico de Marcações ({appointments.length})
          </TabsTrigger>
          <TabsTrigger value="notes">
            Notas ({notes.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="appointments">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Marcações</CardTitle>
              <CardDescription>
                Todas as marcações deste cliente
              </CardDescription>
            </CardHeader>
            <CardContent>
              {appointments.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Nenhuma marcação encontrada</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {appointments.map((appointment) => (
                    <div key={appointment.id} className="border rounded-lg p-4" data-appointment-id={appointment.id}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span className="font-medium">
                            {formatDate(appointment.scheduledFor)}
                          </span>
                        </div>
                        {getStatusBadge(appointment.status)}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                        {appointment.Service && (
                          <div>
                            <strong>Serviço:</strong> {appointment.Service.name}
                          </div>
                        )}
                        {appointment.Staff && (
                          <div>
                            <strong>Profissional:</strong> {appointment.Staff.name}
                          </div>
                        )}
                        <div>
                          <strong>Duração:</strong> {appointment.duration} min
                        </div>
                      </div>
                      
                      {appointment.Service?.price && (
                        <div className="mt-2 text-sm">
                          <strong>Preço:</strong> €{appointment.Service.price}
                        </div>
                      )}
                      
                      {appointment.notes && (
                        <div className="mt-2 text-sm text-gray-600">
                          <strong>Notas:</strong> {appointment.notes}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notes">
          <Card>
            <CardHeader>
              <CardTitle>Notas do Cliente</CardTitle>
              <CardDescription>
                Histórico de notas e observações
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Add Note Form */}
              <div className="mb-6 p-4 border rounded-lg bg-gray-50">
                <Label htmlFor="newNote" className="text-sm font-medium">
                  Adicionar Nova Nota
                </Label>
                <div className="mt-2 flex space-x-2">
                  <Textarea
                    id="newNote"
                    placeholder="Escreva uma nota sobre este cliente..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    rows={2}
                    className="flex-1"
                  />
                  <Button 
                    onClick={addNote} 
                    disabled={!newNote.trim() || addingNote}
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    {addingNote ? 'A adicionar...' : 'Adicionar'}
                  </Button>
                </div>
              </div>

              {/* Notes List */}
              {notes.length === 0 ? (
                <div className="text-center py-8">
                  <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Nenhuma nota encontrada</p>
                  <p className="text-sm text-gray-400">Adicione a primeira nota sobre este cliente</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {notes.map((note) => {
                    // Check if this is an appointment note by looking at the content format
                    const isAppointmentNote = note.content.includes('📅 Agendamento') && note.content.includes('🔹 Serviço:');
                    
                    return (
                      <div key={note.id} className={`border rounded-lg p-4 ${isAppointmentNote ? 'bg-blue-50 border-blue-200' : 'bg-white'}`}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            {isAppointmentNote ? (
                              <>
                                <Calendar className="h-4 w-4 text-blue-600" />
                                <span className="text-blue-800 font-medium">Nota de Marcação</span>
                                <span className="text-gray-400">•</span>
                                <span>{note.Staff.name}</span>
                              </>
                            ) : (
                              <>
                                <User className="h-4 w-4" />
                                <span>Nota Geral</span>
                                <span className="text-gray-400">•</span>
                                <span>{note.Staff.name}</span>
                              </>
                            )}
                          </div>
                          <span className="text-xs text-gray-500">
                            {formatDate(note.createdAt)}
                          </span>
                        </div>
                        
                        {isAppointmentNote ? (
                          <div className="space-y-2">
                            {/* Parse and format appointment note content */}
                            {note.content.split('\n').map((line, index) => {
                              if (line.startsWith('📅')) {
                                return (
                                  <div key={index} className="flex items-center space-x-2 text-sm">
                                    <Calendar className="h-4 w-4 text-blue-600" />
                                    <span className="font-medium text-blue-800">{line.replace('📅 ', '')}</span>
                                  </div>
                                );
                              } else if (line.startsWith('🔹')) {
                                return (
                                  <div key={index} className="flex items-center space-x-2 text-sm">
                                    <span className="text-blue-600">🔹</span>
                                    <span className="text-gray-700">{line.replace('🔹 ', '')}</span>
                                  </div>
                                );
                              } else if (line.startsWith('📝')) {
                                return (
                                  <div key={index} className="mt-3 p-3 bg-white rounded-md border border-blue-200">
                                    <div className="flex items-start space-x-2">
                                      <span className="text-blue-600 mt-0.5">📝</span>
                                      <div>
                                        <div className="text-xs text-blue-600 font-medium mb-1">Nota da Marcação:</div>
                                        <p className="text-gray-900">{line.replace('📝 Nota: ', '')}</p>
                                      </div>
                                    </div>
                                  </div>
                                );
                              } else if (line.startsWith('🔗')) {
                                // Extract appointment ID and create a clickable link
                                const appointmentId = line.replace('🔗 ID Marcação: ', '');
                                const matchingAppointment = appointments.find(apt => apt.id === appointmentId);
                                
                                return (
                                  <div key={index} className="mt-2 p-2 bg-blue-100 rounded-md border border-blue-300">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center space-x-2 text-sm">
                                        <span className="text-blue-600">🔗</span>
                                        <span className="text-blue-700 font-medium">Referência:</span>
                                        {matchingAppointment ? (
                                          <span className="text-blue-800">
                                            Marcação de {formatDate(matchingAppointment.scheduledFor)}
                                          </span>
                                        ) : (
                                          <span className="text-blue-800">Marcação #{appointmentId.slice(-8)}</span>
                                        )}
                                      </div>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="text-xs h-6 px-2 text-blue-600 border-blue-300 hover:bg-blue-50"
                                        onClick={() => {
                                          // Scroll to appointments tab and highlight the specific appointment
                                          const tabTrigger = document.querySelector('[value="appointments"]') as HTMLElement;
                                          if (tabTrigger) {
                                            tabTrigger.click();
                                            setTimeout(() => {
                                              const appointmentElement = document.querySelector(`[data-appointment-id="${appointmentId}"]`);
                                              if (appointmentElement) {
                                                appointmentElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                                appointmentElement.classList.add('ring-2', 'ring-blue-400', 'ring-opacity-75');
                                                setTimeout(() => {
                                                  appointmentElement.classList.remove('ring-2', 'ring-blue-400', 'ring-opacity-75');
                                                }, 3000);
                                              }
                                            }, 100);
                                          }
                                        }}
                                      >
                                        Ver Marcação
                                      </Button>
                                    </div>
                                  </div>
                                );
                              }
                              return null;
                            })}
                          </div>
                        ) : (
                          <p className="text-gray-900">{note.content}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 