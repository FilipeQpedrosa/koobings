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
  
  // Safe destructuring with fallbacks
  const user = authResult?.user || null;
  const authLoading = authResult?.loading || false;
  const businessSlug = params?.businessSlug as string || '';
  const slotId = params?.slotId as string || '';
  const date = params?.date as string || '';

  const [slotDetails, setSlotDetails] = useState<SlotDetails | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [clientSearch, setClientSearch] = useState('');
  const [editingDescription, setEditingDescription] = useState(false);
  const [newDescription, setNewDescription] = useState('');

  // Define isStaff as a computed value - more defensive approach
  const isStaff = (() => {
    if (!user) return false;
    return user.role === 'STAFF' || user.role === 'BUSINESS_OWNER' || Boolean(user.isAdmin);
  })();

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
        }
      }
    } catch (error) {
      console.error('Error fetching slot details:', error);
      setError('Erro ao carregar detalhes do slot');
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
          setClients(data.data || []);
        }
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const handleEnrollClient = async (clientId: string) => {
    if (!slotDetails) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/slots/${slotDetails.id}/students/${clientId}?date=${date}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Refresh slot details
          await fetchSlotDetails();
          setShowAddStudent(false);
          setClientSearch('');
        } else {
          setError(data.error?.message || 'Erro ao inscrever cliente');
        }
      } else {
        const errorData = await response.json();
        setError(errorData.error?.message || 'Erro ao inscrever cliente');
      }
    } catch (error) {
      console.error('Error enrolling client:', error);
      setError('Erro ao inscrever cliente');
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveStudent = async (studentId: string) => {
    if (!slotDetails) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/slots/${slotDetails.id}/students/${studentId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Refresh slot details
          await fetchSlotDetails();
        } else {
          setError(data.error?.message || 'Erro ao remover aluno');
        }
      }
    } catch (error) {
      console.error('Error removing student:', error);
      setError('Erro ao remover aluno');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleAttendance = async (studentId: string, currentStatus: boolean) => {
    if (!slotDetails) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/slots/${slotDetails.id}/students/${studentId}/attendance`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          isPresent: !currentStatus
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Refresh slot details
          await fetchSlotDetails();
        } else {
          setError(data.error?.message || 'Erro ao atualizar presença');
        }
      }
    } catch (error) {
      console.error('Error updating attendance:', error);
      setError('Erro ao atualizar presença');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateDescription = async () => {
    if (!slotDetails) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/slots/${slotDetails.id}/description`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          description: newDescription
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setSlotDetails(prev => prev ? { ...prev, serviceDescription: newDescription } : null);
          setEditingDescription(false);
        } else {
          setError(data.error?.message || 'Erro ao atualizar descrição');
        }
      }
    } catch (error) {
      console.error('Error updating description:', error);
      setError('Erro ao atualizar descrição');
    } finally {
      setSaving(false);
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

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
    client.email.toLowerCase().includes(clientSearch.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!slotDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Slot não encontrado</h1>
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
                  className="w-full border border-gray-300 rounded-lg p-3 bg-white text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  rows={4}
                  placeholder="Descrição do treino..."
                />
                <div className="flex gap-2">
                  <Button onClick={handleUpdateDescription} disabled={saving}>
                    {saving ? 'Guardando...' : 'Guardar'}
                  </Button>
                  <Button variant="outline" onClick={() => setEditingDescription(false)}>
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
                Alunos Inscritos ({slotDetails?.enrolledStudents?.length || 0}/{slotDetails?.capacity || 0})
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

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {/* Add Student Modal */}
          {showAddStudent && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
              <h3 className="text-lg font-semibold mb-3">Adicionar Aluno</h3>
              <input
                type="text"
                placeholder="Procurar cliente por nome ou email..."
                className="w-full border border-gray-300 rounded-lg p-3 mb-3 bg-white text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                value={clientSearch}
                onChange={(e) => setClientSearch(e.target.value)}
              />
              
              <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg">
                {filteredClients
                  .filter(client => client.isEligible)
                  .map((client) => (
                    <button
                      key={client.id}
                      type="button"
                      className="flex items-center gap-3 p-3 w-full text-left border-b border-gray-100 last:border-b-0 hover:bg-gray-50"
                      onClick={() => handleEnrollClient(client.id)}
                      disabled={saving}
                    >
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                        {client.name[0]?.toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-sm">{client.name}</div>
                        <div className="text-xs text-gray-500">{client.email}</div>
                      </div>
                      <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
                        Apto
                      </span>
                    </button>
                  ))}
              </div>
              
              <div className="flex justify-end mt-3">
                <Button variant="outline" onClick={() => setShowAddStudent(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          )}

          {/* Students List */}
          <div className="space-y-3">
            {slotDetails.enrolledStudents && slotDetails.enrolledStudents.length > 0 ? (
              slotDetails.enrolledStudents.map((student) => (
                <div key={student.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                      {student.name[0]?.toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{student.name}</div>
                      <div className="text-sm text-gray-500">{student.email}</div>
                      <div className="text-xs text-gray-400">
                        Inscrito em {new Date(student.enrolledAt).toLocaleDateString('pt-PT')}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {isStaff && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleAttendance(student.id, student.isPresent)}
                          disabled={saving}
                          className={student.isPresent ? 'bg-green-50 border-green-200 text-green-700' : 'bg-gray-50 border-gray-200 text-gray-700'}
                        >
                          {student.isPresent ? (
                            <CheckCircle className="h-4 w-4 mr-1" />
                          ) : (
                            <XCircle className="h-4 w-4 mr-1" />
                          )}
                          {student.isPresent ? 'Presente' : 'Ausente'}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveStudent(student.id)}
                          disabled={saving}
                          className="text-red-600 border-red-200 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    {!isStaff && (
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        student.isPresent ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {student.isPresent ? 'Presente' : 'Ausente'}
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium">Nenhum aluno inscrito</p>
                <p className="text-sm">Este treino ainda não tem alunos inscritos</p>
              </div>
            )}
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}