"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Save, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

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

export default function EditClientPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [client, setClient] = useState<Client | null>(null);
  const [editedClient, setEditedClient] = useState<Partial<Client>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchClient();
  }, [params.id]);

  const fetchClient = async () => {
    try {
      setLoading(true);
      
      const response = await fetch(`/api/staff/clients/${params.id}`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setClient(data.data.client);
          setEditedClient(data.data.client);
        }
      } else {
        toast({
          title: "Erro",
          description: "Falha ao carregar dados do cliente",
          variant: "destructive"
        });
        router.back();
      }
    } catch (error) {
      console.error('Error fetching client:', error);
      toast({
        title: "Erro",
        description: "Falha ao carregar dados do cliente",
        variant: "destructive"
      });
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const saveClient = async () => {
    try {
      setSaving(true);
      
      const response = await fetch(`/api/staff/clients/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(editedClient)
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          toast({
            title: "Sucesso",
            description: "Cliente atualizado com sucesso"
          });
          router.push(`/${user?.businessSlug}/staff/clients/${params.id}`);
        } else {
          throw new Error(data.error || 'Failed to update client');
        }
      } else {
        throw new Error('Failed to update client');
      }
    } catch (error) {
      console.error('Error updating client:', error);
      toast({
        title: "Erro",
        description: "Falha ao atualizar cliente",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.push(`/${user?.businessSlug}/staff/clients/${params.id}`);
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
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={handleCancel}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Editar Cliente</h1>
            <p className="text-gray-600">{client.name}</p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleCancel}>
            <X className="h-4 w-4 mr-2" />
            Cancelar
          </Button>
          <Button onClick={saveClient} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'A guardar...' : 'Guardar'}
          </Button>
        </div>
      </div>

      {/* Edit Form */}
      <Card>
        <CardHeader>
          <CardTitle>Informações do Cliente</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="name" className="text-sm font-medium">
                Nome *
              </Label>
              <Input
                id="name"
                value={editedClient.name || ''}
                onChange={(e) => setEditedClient(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Nome completo do cliente"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="email" className="text-sm font-medium">
                Email *
              </Label>
              <Input
                id="email"
                type="email"
                value={editedClient.email || ''}
                onChange={(e) => setEditedClient(prev => ({ ...prev, email: e.target.value }))}
                placeholder="email@exemplo.com"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="phone" className="text-sm font-medium">
                Telefone
              </Label>
              <Input
                id="phone"
                value={editedClient.phone || ''}
                onChange={(e) => setEditedClient(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="+351 123 456 789"
              />
            </div>
            
            <div>
              <Label htmlFor="status" className="text-sm font-medium">
                Status
              </Label>
              <select
                id="status"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={editedClient.status || 'ACTIVE'}
                onChange={(e) => setEditedClient(prev => ({ ...prev, status: e.target.value }))}
              >
                <option value="ACTIVE">Ativo</option>
                <option value="INACTIVE">Inativo</option>
              </select>
            </div>
            
            <div className="md:col-span-2">
              <Label htmlFor="notes" className="text-sm font-medium">
                Notas
              </Label>
              <Textarea
                id="notes"
                value={editedClient.notes || ''}
                onChange={(e) => setEditedClient(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Notas ou observações sobre o cliente..."
                rows={4}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 