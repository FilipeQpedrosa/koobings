'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft, Users, Clock, Calendar, Edit, Plus, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface SlotDetails {
  id: string;
  startTime: string;
  endTime: string;
  serviceName: string;
  serviceDescription: string;
  staffName: string;
  capacity: number;
  price?: number;
  enrolledStudents: EnrolledStudent[];
}

interface EnrolledStudent {
  id: string;
  name: string;
  email: string;
  isPresent: boolean;
  enrolledAt: string;
}

interface Client {
  id: string;
  name: string;
  email: string;
  isEligible: boolean;
}

export default function SlotDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const authResult = useAuth();
  
  const user = authResult?.user || null;
  const authLoading = authResult?.loading || false;
  const businessSlug = params?.businessSlug as string || '';
  const slotId = params?.slotId as string || '';
  const date = params?.date as string || '';

  const [slotDetails, setSlotDetails] = useState<SlotDetails | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingClientId, setSavingClientId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [clientSearch, setClientSearch] = useState('');
  const [editingDescription, setEditingDescription] = useState(false);
  const [newDescription, setNewDescription] = useState('');

  const isStaff = user?.role === 'STAFF' || user?.role === 'BUSINESS_OWNER' || user?.isAdmin;

  useEffect(() => {
    if (!authLoading && user) {
      fetchSlotDetails();
      if (isStaff) {
        fetchClients();
      }
    }
  }, [authLoading, user, slotId, date, isStaff]);

  const fetchSlotDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/slots/${slotId}/details?date=${date}`, {
        credentials: 'include',
        cache: 'no-store'
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setSlotDetails(data.data);
          setNewDescription(data.data.serviceDescription || '');
        } else {
          setError(data.error?.message || 'Erro ao carregar detalhes da slot');
        }
      } else {
        setError('Erro ao carregar detalhes da slot');
      }
    } catch (error) {
      console.error('Error fetching slot details:', error);
      setError('Erro ao carregar detalhes da slot');
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      const response = await fetch('/api/business/clients', {
        credentials: 'include',
        cache: 'no-store'
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setClients(data.data.clients || []);
        }
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const handleEnrollClient = async (clientId: string) => {
    if (!slotDetails) return;
    
    setSavingClientId(clientId);
    setError('');
    try {
      const response = await fetch(`/api/slots/${slotDetails.id}/students/${clientId}?date=${date}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          await fetchSlotDetails();
          setShowAddStudent(false);
          setClientSearch('');
        } else {
          setError(data.error?.message || 'Erro ao inscrever cliente');
        }
      } else {
        setError('Erro ao inscrever cliente');
      }
    } catch (error) {
      console.error('Error enrolling client:', error);
      setError('Erro ao inscrever cliente');
    } finally {
      setSavingClientId(null);
    }
  };

  const formatTime = (time: string) => {
    if (!time) return '--:--';
    try {
      return new Date(`2000-01-01T${time}`).toLocaleTimeString('pt-PT', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return '--:--';
    }
  };

  const filteredClients = Array.isArray(clients) ? clients.filter(client =>
    client.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
    client.email.toLowerCase().includes(clientSearch.toLowerCase())
  ) : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Carregando detalhes da slot...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-4">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <Button variant="outline" onClick={() => router.back()} className="flex-shrink-0">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 mb-2">{slotDetails?.serviceName || 'Carregando...'}</h1>
              <div className="flex flex-col space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 flex-shrink-0" />
                  <span className="text-xs">
                    {date ? new Date(date).toLocaleDateString('pt-PT', { 
                      weekday: 'long', 
                      day: 'numeric', 
                      month: 'long' 
                    }) : 'Data não disponível'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 flex-shrink-0" />
                  <span className="text-xs">
                    {slotDetails ? `${formatTime(slotDetails.startTime)} - ${formatTime(slotDetails.endTime)}` : '--:-- - --:--'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="border-t pt-4 mt-4">
            <div className="flex flex-col space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-gray-900">Descrição do Treino</h3>
                {isStaff && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingDescription(!editingDescription)}
                    className="text-xs px-3 py-1"
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Editar
                  </Button>
                )}
              </div>
              {editingDescription ? (
                <div className="space-y-3">
                  <textarea
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg resize-none"
                    rows={3}
                    placeholder="Digite a descrição do treino..."
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setEditingDescription(false)}
                      size="sm"
                      className="text-xs px-3 py-1"
                    >
                      Guardar
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setEditingDescription(false)}
                      size="sm"
                      className="text-xs px-3 py-1"
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-700 whitespace-pre-wrap">
                  {slotDetails?.serviceDescription || 'Nenhuma descrição disponível.'}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Students List */}
        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Alunos Inscritos ({Array.isArray(slotDetails?.enrolledStudents) ? slotDetails.enrolledStudents.length : 0}/{slotDetails?.capacity || 0})
              </h2>
              {isStaff && (
                <Button 
                  onClick={() => setShowAddStudent(true)}
                  size="sm"
                  className="text-xs px-3 py-1"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Adicionar
                </Button>
              )}
            </div>

            {/* Add Student Modal */}
            {showAddStudent && (
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Adicionar Aluno</h3>
                <div className="space-y-3">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Procurar cliente por nome ou email"
                      value={clientSearch}
                      onChange={(e) => setClientSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                  
                  <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg">
                    {filteredClients.map((client) => (
                      <div key={client.id} className="flex items-center justify-between p-3 border-b border-gray-100 last:border-b-0">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{client.name}</p>
                          <p className="text-xs text-gray-500">{client.email}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            client.isEligible ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {client.isEligible ? 'Apto' : 'Inapto'}
                          </span>
                          <Button
                            onClick={() => handleEnrollClient(client.id)}
                            disabled={savingClientId === client.id || !client.isEligible}
                            size="sm"
                            className="text-xs px-3 py-1"
                          >
                            {savingClientId === client.id ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Adicionar'}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <Button
                    variant="outline"
                    onClick={() => setShowAddStudent(false)}
                    size="sm"
                    className="text-xs px-3 py-1"
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            )}

            {/* Students List */}
            <div className="space-y-3">
              {slotDetails?.enrolledStudents && Array.isArray(slotDetails.enrolledStudents) && slotDetails.enrolledStudents.length > 0 ? (
                slotDetails.enrolledStudents.map((student) => (
                  <div key={student.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{student.name}</p>
                      <p className="text-xs text-gray-500">{student.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {isStaff && (
                        <Button
                          onClick={() => {}}
                          disabled={saving}
                          size="sm"
                          className={`text-xs px-3 py-1 ${
                            student.isPresent ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {student.isPresent ? <CheckCircle className="h-3 w-3 mr-1" /> : <XCircle className="h-3 w-3 mr-1" />}
                          {student.isPresent ? 'Presente' : 'Ausente'}
                        </Button>
                      )}
                      {isStaff && (
                        <Button
                          onClick={() => {}}
                          disabled={saving}
                          variant="outline"
                          size="sm"
                          className="text-xs px-3 py-1 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Remover
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Nenhum aluno inscrito</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}