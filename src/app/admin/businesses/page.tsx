'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Plus, Search, ExternalLink, Settings, Users, Calendar, Edit, Save, X, Pause, Play, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Business {
  id: string;
  name: string;
  slug: string;
  email: string;
  ownerName?: string;
  phone?: string;
  plan: string;
  status: string;
  features: Record<string, boolean>;
  createdAt: string;
  _count: {
    staff: number;
    appointments: number;
    services: number;
  };
}

type CreateBusinessData = {
  name: string;
  email: string;
  ownerName: string;
  phone: string;
  plan: 'basic' | 'standard' | 'premium';
  slug: string;
  password: string;
};

export default function BusinessesPage() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState(false);
  const [search, setSearch] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [showCredentials, setShowCredentials] = useState(false);
  const [createdBusinessInfo, setCreatedBusinessInfo] = useState<any>(null);
  const [editingBusiness, setEditingBusiness] = useState<Business | null>(null);
  const { toast } = useToast();

  const [newBusiness, setNewBusiness] = useState<CreateBusinessData>({
    name: '',
    email: '',
    ownerName: '',
    phone: '',
    plan: 'standard',
    slug: '',
    password: ''
  });

  const [editBusiness, setEditBusiness] = useState<CreateBusinessData>({
    name: '',
    email: '',
    ownerName: '',
    phone: '',
    plan: 'standard',
    slug: '',
    password: ''
  });

  useEffect(() => {
    fetchBusinesses();
  }, [search]);

  const fetchBusinesses = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      
      // Add cache-busting parameter to ensure fresh data
      params.append('_t', Date.now().toString());
      
      const response = await fetch(`/api/admin/businesses?${params}`, {
        // Disable caching to always get fresh data
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
        },
      });
      const data = await response.json();
      
      if (response.ok) {
        console.log('✅ Businesses loaded:', data.businesses.length);
        setBusinesses(data.businesses);
      } else {
        toast({
          title: "Erro",
          description: data.error || "Erro ao carregar negócios",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao conectar com o servidor",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createBusiness = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newBusiness.name || !newBusiness.email || !newBusiness.ownerName || !newBusiness.password) {
      toast({
        title: "Erro",
        description: "Nome do negócio, email, nome do proprietário e password são obrigatórios",
        variant: "destructive"
      });
      return;
    }

    try {
      setCreating(true);
      const response = await fetch('/api/admin/businesses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newBusiness),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('✅ Business created successfully:', data.business);
        
        // Store credentials info to show in modal
        setCreatedBusinessInfo({
          businessName: data.business.name,
          email: data.business.email,
          password: data.tempPassword,
          loginUrl: data.loginUrl,
          isCustomPassword: data.isCustomPassword
        });
        
        toast({
          title: "Sucesso",
          description: `Negócio "${data.business.name}" criado com sucesso!`,
        });
        
        // Close creation dialog and show credentials
        setIsCreateDialogOpen(false);
        setShowCredentials(true);
        
        // Reset form
        setNewBusiness({
          name: '',
          email: '',
          ownerName: '',
          phone: '',
          plan: 'standard',
          slug: '',
          password: ''
        });
        
        // Force reload businesses list
        await fetchBusinesses();
        
      } else {
        toast({
          title: "Erro",
          description: data.error || "Erro ao criar negócio",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao conectar com o servidor",
        variant: "destructive"
      });
    } finally {
      setCreating(false);
    }
  };

  const updateBusiness = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingBusiness || !editBusiness.name || !editBusiness.email || !editBusiness.ownerName) {
      toast({
        title: "Erro",
        description: "Nome do negócio, email e nome do proprietário são obrigatórios",
        variant: "destructive"
      });
      return;
    }

    try {
      setEditing(true);
      const response = await fetch(`/api/admin/businesses/${editingBusiness.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editBusiness),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('✅ Business updated successfully:', data.business);
        
        toast({
          title: "Sucesso",
          description: `Negócio "${data.business.name}" atualizado com sucesso!`,
        });
        
        // Close dialog and reset form
        setIsEditDialogOpen(false);
        setEditingBusiness(null);
        setEditBusiness({
          name: '',
          email: '',
          ownerName: '',
          phone: '',
          plan: 'standard',
          slug: '',
          password: ''
        });
        
        // Force reload businesses list
        await fetchBusinesses();
        
      } else {
        toast({
          title: "Erro",
          description: data.error || "Erro ao atualizar negócio",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao conectar com o servidor",
        variant: "destructive"
      });
    } finally {
      setEditing(false);
    }
  };

  const updateBusinessStatus = async (businessId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/businesses/${businessId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Sucesso",
          description: data.message,
        });
        
        // Reload businesses list
        await fetchBusinesses();
      } else {
        toast({
          title: "Erro",
          description: data.error || "Erro ao atualizar status",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao conectar com o servidor",
        variant: "destructive"
      });
    }
  };

  const deleteBusiness = async (businessId: string) => {
    try {
      const response = await fetch(`/api/admin/businesses/${businessId}/status`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Sucesso",
          description: data.message,
        });
        
        // Reload businesses list
        await fetchBusinesses();
      } else {
        toast({
          title: "Erro",
          description: data.error || "Erro ao eliminar negócio",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao conectar com o servidor",
        variant: "destructive"
      });
    }
  };

  const getBusinessUrl = (business: Business) => {
    // Direct link to universal staff portal with business slug for admin access
    return `/staff/dashboard?businessSlug=${business.slug}`;
  };

  const getPlanBadgeColor = (plan: string) => {
    switch (plan) {
      case 'basic': return 'bg-gray-100 text-gray-800';
      case 'standard': return 'bg-blue-100 text-blue-800';
      case 'premium': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'SUSPENDED': return 'bg-red-100 text-red-800';
      case 'INACTIVE': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'Ativo';
      case 'PENDING': return 'Pendente';
      case 'SUSPENDED': return 'Suspenso';
      case 'INACTIVE': return 'Inativo';
      default: return status;
    }
  };

  const openEditDialog = (business: Business) => {
    setEditingBusiness(business);
    setEditBusiness({
      name: business.name,
      email: business.email,
      ownerName: business.ownerName || '',
      phone: business.phone || '',
      plan: business.plan as 'basic' | 'standard' | 'premium',
      slug: business.slug,
      password: '' // Don't pre-fill password for security
    });
    setIsEditDialogOpen(true);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestão de Negócios</h1>
          <p className="text-gray-600">Gerir todos os negócios da plataforma</p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Criar Negócio
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Criar Novo Negócio</DialogTitle>
            </DialogHeader>
            <form onSubmit={createBusiness} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nome do Negócio *</Label>
                  <Input
                    id="name"
                    value={newBusiness.name}
                    onChange={(e) => setNewBusiness({...newBusiness, name: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newBusiness.email}
                    onChange={(e) => setNewBusiness({...newBusiness, email: e.target.value})}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="ownerName">Nome do Proprietário *</Label>
                  <Input
                    id="ownerName"
                    value={newBusiness.ownerName}
                    onChange={(e) => setNewBusiness({...newBusiness, ownerName: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    value={newBusiness.phone}
                    onChange={(e) => setNewBusiness({...newBusiness, phone: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="plan">Plano</Label>
                  <Select value={newBusiness.plan} onValueChange={(value) => setNewBusiness({...newBusiness, plan: value as 'basic' | 'standard' | 'premium'})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Básico</SelectItem>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="slug">Slug (opcional)</Label>
                  <Input
                    id="slug"
                    value={newBusiness.slug}
                    onChange={(e) => setNewBusiness({...newBusiness, slug: e.target.value})}
                    placeholder="deixe vazio para gerar automaticamente"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  value={newBusiness.password}
                  onChange={(e) => setNewBusiness({...newBusiness, password: e.target.value})}
                  required
                  minLength={6}
                />
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={creating}>
                  {creating ? 'Criando...' : 'Criar Negócio'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Pesquisar negócios..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Businesses Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando negócios...</p>
        </div>
      ) : businesses.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Nenhum negócio encontrado</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {businesses.map((business) => (
            <Card key={business.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg truncate">{business.name}</CardTitle>
                    <p className="text-sm text-gray-600 truncate">{business.email}</p>
                  </div>
                  <div className="flex flex-col gap-2 ml-3 flex-shrink-0">
                    <Badge 
                      variant="secondary" 
                      className={`${getPlanBadgeColor(business.plan)} text-xs px-2 py-1 text-center`}
                    >
                      {business.plan}
                    </Badge>
                    <Badge 
                      variant="secondary" 
                      className={`${getStatusBadgeColor(business.status)} text-xs px-2 py-1 text-center`}
                    >
                      {getStatusText(business.status)}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="h-4 w-4 mr-2" />
                    <span>{business._count.staff} funcionários</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{business._count.appointments} marcações</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <Settings className="h-4 w-4 mr-2" />
                    <span>{business._count.services} serviços</span>
                  </div>
                  
                  <div className="pt-3 border-t space-y-2">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => window.open(getBusinessUrl(business), '_blank')}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Abrir Portal
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(business)}
                        title="Editar negócio"
                        className="px-3"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex gap-2">
                      {business.status === 'ACTIVE' ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateBusinessStatus(business.id, 'SUSPENDED')}
                          className="flex-1 text-orange-600 hover:text-orange-700"
                        >
                          <Pause className="h-4 w-4 mr-2" />
                          Pausar
                        </Button>
                      ) : business.status === 'SUSPENDED' ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateBusinessStatus(business.id, 'ACTIVE')}
                          className="flex-1 text-green-600 hover:text-green-700"
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Ativar
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateBusinessStatus(business.id, 'ACTIVE')}
                          className="flex-1 text-green-600 hover:text-green-700"
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Ativar
                        </Button>
                      )}
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="px-3 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Eliminar Negócio</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem a certeza que deseja eliminar o negócio "{business.name}"? 
                              Esta ação irá eliminar permanentemente:
                              <br />
                              • Todos os funcionários ({business._count.staff})
                              <br />
                              • Todas as marcações ({business._count.appointments})
                              <br />
                              • Todos os serviços ({business._count.services})
                              <br />
                              • Todos os clientes
                              <br />
                              <br />
                              <strong>Esta ação não pode ser desfeita!</strong>
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteBusiness(business.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Eliminar Definitivamente
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Credentials Display Modal */}
      <Dialog open={showCredentials} onOpenChange={setShowCredentials}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Negócio Criado com Sucesso!</DialogTitle>
          </DialogHeader>
          {createdBusinessInfo && (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">Credenciais de Acesso</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <strong>Negócio:</strong> {createdBusinessInfo.businessName}
                  </div>
                  <div>
                    <strong>Email:</strong> {createdBusinessInfo.email}
                  </div>
                  <div>
                    <strong>Password:</strong> {createdBusinessInfo.password}
                  </div>
                  <div>
                    <strong>URL de Login:</strong> 
                    <a 
                      href={createdBusinessInfo.loginUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline ml-1"
                    >
                      {createdBusinessInfo.loginUrl}
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-yellow-50 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Importante:</strong> Guarde estas credenciais num local seguro. 
                  O proprietário do negócio pode alterar a password após o primeiro login.
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setShowCredentials(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Business Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Editar Negócio</DialogTitle>
          </DialogHeader>
          <form onSubmit={updateBusiness} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-name">Nome do Negócio *</Label>
                <Input
                  id="edit-name"
                  value={editBusiness.name}
                  onChange={(e) => setEditBusiness({...editBusiness, name: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-email">Email *</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editBusiness.email}
                  onChange={(e) => setEditBusiness({...editBusiness, email: e.target.value})}
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-ownerName">Nome do Proprietário *</Label>
                <Input
                  id="edit-ownerName"
                  value={editBusiness.ownerName}
                  onChange={(e) => setEditBusiness({...editBusiness, ownerName: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-phone">Telefone</Label>
                <Input
                  id="edit-phone"
                  value={editBusiness.phone}
                  onChange={(e) => setEditBusiness({...editBusiness, phone: e.target.value})}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-plan">Plano</Label>
                <Select value={editBusiness.plan} onValueChange={(value) => setEditBusiness({...editBusiness, plan: value as 'basic' | 'standard' | 'premium'})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Básico</SelectItem>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-slug">Slug</Label>
                <Input
                  id="edit-slug"
                  value={editBusiness.slug}
                  onChange={(e) => setEditBusiness({...editBusiness, slug: e.target.value})}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="edit-password">Nova Password (opcional)</Label>
              <Input
                id="edit-password"
                type="password"
                value={editBusiness.password}
                onChange={(e) => setEditBusiness({...editBusiness, password: e.target.value})}
                placeholder="Deixe vazio para manter a password atual"
                minLength={6}
              />
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={editing}>
                {editing ? 'Atualizando...' : 'Atualizar Negócio'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
} 