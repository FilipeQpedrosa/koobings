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
      
      // Fetch client details
      const clientResponse = await fetch(`/api/staff/clients/${params.id}`, {
        credentials: 'include'
      });
      
      if (clientResponse.ok) {
        const clientData = await clientResponse.json();
        if (clientData.success) {
          setClient(clientData.data.client);
          setAppointments(clientData.data.appointments || []);
          setNotes(clientData.data.notes || []);
        }
      }
    } catch (error) {
      console.error('Error fetching client details:', error);
      toast({
        title: "Erro",
        description: "Falha ao carregar detalhes do cliente",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addNote = async () => {
    if (!newNote.trim()) return;

    try {
      setAddingNote(true);
      const response = await fetch(`/api/staff/clients/${params.id}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ content: newNote })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setNotes(prev => [data.data, ...prev]);
          setNewNote('');
          toast({
            title: "Sucesso",
            description: "Nota adicionada com sucesso"
          });
        }
      }
    } catch (error) {
      console.error('Error adding note:', error);
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
                    <div key={appointment.id} className="border rounded-lg p-4">
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
                  {notes.map((note) => (
                    <div key={note.id} className="border rounded-lg p-4 bg-white">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <User className="h-4 w-4" />
                          <span>{note.Staff.name}</span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {formatDate(note.createdAt)}
                        </span>
                      </div>
                      <p className="text-gray-900">{note.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 