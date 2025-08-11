'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User, X, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AppointmentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: {
    id: string;
    clientName: string;
    clientEmail: string;
    clientId: string;
    serviceName: string;
    staffName: string;
    scheduledFor: string;
    duration: number;
    status: string;
    notes?: string;
  };
  onNoteAdded?: () => void;
}

export default function AppointmentDetailsModal({
  isOpen,
  onClose,
  appointment,
  onNoteAdded,
}: AppointmentDetailsModalProps) {
  const [newNote, setNewNote] = useState('');
  const [addingNote, setAddingNote] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const { toast } = useToast();

  const addNote = async () => {
    if (!newNote.trim()) return;

    try {
      setAddingNote(true);
      const response = await fetch(`/api/appointments/${appointment.id}/notes`, {
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
          setNewNote('');
          toast({
            title: "Sucesso",
            description: "Nota adicionada ao histórico do cliente"
          });
          onNoteAdded?.();
        }
      } else {
        throw new Error('Falha ao adicionar nota');
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

  const updateStatus = async (newStatus: string) => {
    try {
      setUpdatingStatus(true);
      const response = await fetch(`/api/business/appointments/${appointment.id}`, {
        method: 'PATCH', // Changed from PUT to PATCH
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          toast({
            title: "Sucesso",
            description: "Status do agendamento atualizado"
          });
          onNoteAdded?.(); // Refresh data
          onClose(); // Close modal
        }
      } else {
        throw new Error('Falha ao atualizar status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Erro",
        description: "Falha ao atualizar status",
        variant: "destructive"
      });
    } finally {
      setUpdatingStatus(false);
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <Card className="w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl">Detalhes do Agendamento</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Client Information */}
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-2">Cliente</h4>
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-sm font-medium">{appointment.clientName}</p>
                <p className="text-xs text-gray-500">{appointment.clientEmail}</p>
              </div>
            </div>
          </div>

          {/* Service & Staff */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Serviço</h4>
              <p className="text-sm">{appointment.serviceName}</p>
              <p className="text-xs text-gray-500">{appointment.duration} min</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Profissional</h4>
              <p className="text-sm">{appointment.staffName}</p>
            </div>
          </div>

          {/* Date & Time */}
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-2">Data & Hora</h4>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-sm">{formatDate(appointment.scheduledFor)}</span>
              </div>
              {getStatusBadge(appointment.status)}
            </div>
          </div>

          {/* Existing Notes */}
          {appointment.notes && (
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Notas do Agendamento</h4>
              <p className="text-sm bg-gray-50 p-3 rounded-lg">{appointment.notes}</p>
            </div>
          )}

          {/* Add New Note */}
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Adicionar Nota ao Cliente</h4>
            <div className="space-y-2">
              <Textarea
                placeholder="Escreva uma nota sobre este agendamento..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                rows={3}
                className="text-sm"
              />
              <div className="flex justify-between items-center">
                <p className="text-xs text-gray-500">
                  Esta nota será guardada no histórico do cliente
                </p>
                <Button 
                  onClick={addNote} 
                  disabled={!newNote.trim() || addingNote}
                  size="sm"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  {addingNote ? 'A adicionar...' : 'Adicionar'}
                </Button>
              </div>
            </div>
          </div>

          {/* Status Change Actions - Mobile Optimized */}
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Alterar Status</h4>
            <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-2">
              {appointment.status === 'PENDING' && (
                <>
                  <Button 
                    onClick={() => updateStatus('CONFIRMED')}
                    size="sm"
                    disabled={updatingStatus}
                    className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-2"
                  >
                    {updatingStatus ? '...' : '✓ Confirmar'}
                  </Button>
                  <Button 
                    onClick={() => updateStatus('CANCELLED')}
                    size="sm"
                    disabled={updatingStatus}
                    variant="destructive" 
                    className="text-xs px-3 py-2"
                  >
                    {updatingStatus ? '...' : '✗ Cancelar'}
                  </Button>
                </>
              )}
              {appointment.status === 'CONFIRMED' && (
                <>
                  <Button 
                    onClick={() => updateStatus('COMPLETED')}
                    size="sm"
                    disabled={updatingStatus}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-2"
                  >
                    {updatingStatus ? '...' : '✓ Concluir'}
                  </Button>
                  <Button 
                    onClick={() => updateStatus('CANCELLED')}
                    size="sm"
                    disabled={updatingStatus}
                    variant="destructive" 
                    className="text-xs px-3 py-2"
                  >
                    {updatingStatus ? '...' : '✗ Cancelar'}
                  </Button>
                </>
              )}
              {appointment.status === 'ACCEPTED' && (
                <>
                  <Button 
                    onClick={() => updateStatus('COMPLETED')}
                    size="sm"
                    disabled={updatingStatus}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-2"
                  >
                    {updatingStatus ? '...' : '✓ Concluir'}
                  </Button>
                  <Button 
                    onClick={() => updateStatus('CANCELLED')}
                    size="sm"
                    disabled={updatingStatus}
                    variant="destructive" 
                    className="text-xs px-3 py-2"
                  >
                    {updatingStatus ? '...' : '✗ Cancelar'}
                  </Button>
                </>
              )}
              {(appointment.status === 'COMPLETED' || appointment.status === 'CANCELLED') && (
                <Button 
                  onClick={() => updateStatus('CONFIRMED')}
                  size="sm"
                  disabled={updatingStatus}
                  variant="outline" 
                  className="text-xs px-3 py-2"
                >
                  {updatingStatus ? '...' : '↻ Reativar'}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 