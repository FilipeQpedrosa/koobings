"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Search, Plus, User, Phone, Mail, Calendar, Edit, Trash2, Users } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  createdAt: string;
  isEligible: boolean;
  _count?: {
    appointments: number;
  };
}

export default function StaffClientsPage() {
  const { user } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [deletingClient, setDeletingClient] = useState<string | null>(null);

  useEffect(() => {
    async function fetchClients() {
      try {
        setLoading(true);
        setError('');
        
        const response = await fetch('/api/staff/clients', {
          credentials: 'include',
          cache: 'no-store'
        });
        
        if (response.ok) {
          const data = await response.json();
          
          if (data.success) {
            setClients(data.data);
            setFilteredClients(data.data);
          } else {
            setError(data.error || 'Failed to load clients');
          }
        } else {
          setError('Failed to load clients');
        }
      } catch (err) {
        console.error('Error fetching clients:', err);
        setError('Failed to load clients');
      } finally {
        setLoading(false);
      }
    }

    fetchClients();
  }, []);

  // Function to toggle client eligibility
  const toggleClientEligibility = async (clientId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/business/clients/${clientId}/eligibility`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ isEligible: !currentStatus })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Update the client in the local state
          setClients(prevClients => 
            prevClients.map(client => 
              client.id === clientId 
                ? { ...client, isEligible: !currentStatus }
                : client
            )
          );
          setFilteredClients(prevClients => 
            prevClients.map(client => 
              client.id === clientId 
                ? { ...client, isEligible: !currentStatus }
                : client
            )
          );
          console.log('✅ Client eligibility updated successfully');
        }
      } else {
        console.error('❌ Failed to update client eligibility');
      }
    } catch (error) {
      console.error('❌ Error updating client eligibility:', error);
    }
  };

  // Filter clients based on search term
  useEffect(() => {
    if (!searchTerm) {
      setFilteredClients(clients);
    } else {
      const filtered = clients.filter(client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (client.phone && client.phone.includes(searchTerm))
      );
      setFilteredClients(filtered);
    }
  }, [clients, searchTerm]);

  const handleDeleteClient = async (clientId: string, clientName: string) => {
    const confirmed = window.confirm(
      `Tem a certeza que quer apagar o cliente "${clientName}"?\n\nEsta ação não pode ser desfeita.`
    );
    
    if (!confirmed) return;

    setDeletingClient(clientId);
    
    try {
      const response = await fetch(`/api/staff/clients/${clientId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      
      if (response.ok) {
        // Remove client from local state
        const updatedClients = clients.filter(client => client.id !== clientId);
        setClients(updatedClients);
        setFilteredClients(updatedClients.filter(client =>
          !searchTerm || 
          client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (client.phone && client.phone.includes(searchTerm))
        ));
      } else {
        const errorData = await response.json();
        alert(`Erro ao apagar cliente: ${errorData.error || 'Erro desconhecido'}`);
      }
    } catch (err) {
      console.error('Error deleting client:', err);
      alert('Erro ao apagar cliente. Tente novamente.');
    } finally {
      setDeletingClient(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-96 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-red-600">Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={() => window.location.reload()} variant="outline">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
          <p className="text-gray-600">Gerir a lista de clientes</p>
        </div>
        <Link href={`/${user?.businessSlug || 'business'}/staff/clients/new`}>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Cliente
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Buscar clientes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Clients List */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Clientes</CardTitle>
          <CardDescription>
            {filteredClients.length} cliente{filteredClients.length !== 1 ? 's' : ''} encontrado{filteredClients.length !== 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredClients.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum cliente ainda</h3>
                <p className="text-gray-500 mb-4">Comece por adicionar o seu primeiro cliente</p>
                <Link href={`/${user?.businessSlug || 'business'}/staff/clients/new`}>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Cliente
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredClients.map((client) => (
                <div key={client.id} className="border rounded-lg hover:bg-gray-50 transition-colors">
                  <Link href={`/${user?.businessSlug || 'business'}/staff/clients/${client.id}`}>
                    <div className="flex items-center justify-between p-4 cursor-pointer">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{client.name}</h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            {client.email && (
                              <div className="flex items-center">
                                <Mail className="h-4 w-4 mr-1" />
                                {client.email}
                              </div>
                            )}
                            {client.phone && (
                              <div className="flex items-center">
                                <Phone className="h-4 w-4 mr-1" />
                                {client.phone}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary">
                          {client._count?.appointments || 0} marcações
                        </Badge>
                      </div>
                    </div>
                  </Link>
                  
                  {/* Controls section */}
                  <div className="px-4 pb-4 flex justify-between items-center">
                    {/* Eligibility toggle */}
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={client.isEligible}
                        onCheckedChange={() => toggleClientEligibility(client.id, client.isEligible)}
                      />
                      <span className={`text-sm font-medium ${client.isEligible ? 'text-green-600' : 'text-red-600'}`}>
                        {client.isEligible ? 'Apto' : 'Não Apto'}
                      </span>
                    </div>
                    
                    {/* Action buttons */}
                    <div className="flex items-center space-x-2">
                      <Link href={`/${user?.businessSlug || 'business'}/staff/clients/${client.id}/edit`}>
                        <Button size="sm" variant="outline" className="flex items-center">
                          <Edit className="h-4 w-4 mr-1" />
                          Editar
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex items-center"
                        onClick={() => handleDeleteClient(client.id, client.name)}
                        disabled={deletingClient === client.id}
                      >
                        {deletingClient === client.id ? (
                          <div className="animate-spin h-4 w-4 border-b-2 border-red-600"></div>
                        ) : (
                          <Trash2 className="h-4 w-4 text-red-600" />
                        )}
                        Apagar
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}