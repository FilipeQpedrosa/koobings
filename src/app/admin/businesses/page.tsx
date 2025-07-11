'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Search, ExternalLink, Settings, Users, Calendar, Edit, Save, X } from 'lucide-react';
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

interface CreateBusinessData {
  name: string;
  email: string;
  ownerName?: string;
  phone?: string;
  plan: 'basic' | 'standard' | 'premium';
  slug?: string;
  password?: string;
}

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
    
    if (!editBusiness.name || !editBusiness.email || !editBusiness.ownerName) {
      toast({
        title: "Erro",
        description: "Nome do negócio, email e nome do proprietário são obrigatórios",
        variant: "destructive"
      });
      return;
    }

    if (!editingBusiness) return;

    try {
      setEditing(true);
      const updateData = {
        name: editBusiness.name,
        email: editBusiness.email,
        ownerName: editBusiness.ownerName,
        phone: editBusiness.phone,
        plan: editBusiness.plan,
        slug: editBusiness.slug,
        ...(editBusiness.password && { password: editBusiness.password })
      };

      const response = await fetch(`/api/admin/businesses/${editingBusiness.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
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
      default: return 'bg-gray-100 text-gray-800';
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
          <DialogContent 
            className="sm:max-w-[600px] max-w-[95vw] max-h-[90vh] overflow-y-auto p-6"
            style={{
              top: '2rem',
              transform: 'translateX(-50%)',
              left: '50%',
              position: 'fixed'
            }}
          >
            <DialogHeader className="mb-4">
              <DialogTitle>Criar Novo Negócio</DialogTitle>
            </DialogHeader>
            
            <form onSubmit={createBusiness} className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-sm font-medium">Nome do Negócio *</Label>
                <Input
                  id="name"
                  value={newBusiness.name}
                  onChange={(e) => setNewBusiness({...newBusiness, name: e.target.value})}
                  placeholder="Ex: Salão da Maria"
                  className="mt-1"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="email" className="text-sm font-medium">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={newBusiness.email}
                  onChange={(e) => setNewBusiness({...newBusiness, email: e.target.value})}
                  placeholder="contato@salaodamaria.com"
                  className="mt-1"
                  autoComplete="new-password"
                  data-lpignore="true"
                  data-form-type="other"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="ownerName" className="text-sm font-medium">Nome do Proprietário *</Label>
                <Input
                  id="ownerName"
                  value={newBusiness.ownerName}
                  onChange={(e) => setNewBusiness({...newBusiness, ownerName: e.target.value})}
                  placeholder="Maria Silva"
                  className="mt-1"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="phone" className="text-sm font-medium">Telefone</Label>
                <Input
                  id="phone"
                  value={newBusiness.phone}
                  onChange={(e) => setNewBusiness({...newBusiness, phone: e.target.value})}
                  placeholder="+351 912 345 678"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="plan" className="text-sm font-medium">Plano</Label>
                <Select value={newBusiness.plan} onValueChange={(value: any) => setNewBusiness({...newBusiness, plan: value})}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Basic</SelectItem>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="slug" className="text-sm font-medium">Slug (opcional)</Label>
                <Input
                  id="slug"
                  value={newBusiness.slug}
                  onChange={(e) => setNewBusiness({...newBusiness, slug: e.target.value})}
                  placeholder="salao-da-maria"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="password" className="text-sm font-medium">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  value={newBusiness.password}
                  onChange={(e) => setNewBusiness({...newBusiness, password: e.target.value})}
                  placeholder="Defina uma password segura"
                  className="mt-1"
                  autoComplete="new-password"
                  required
                  minLength={6}
                />
              </div>
              
              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4 mt-6 border-t">
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)} className="sm:w-auto">
                  Cancelar
                </Button>
                <Button type="submit" disabled={creating} className="sm:w-auto" onClick={createBusiness}>
                  {creating ? 'Criando...' : 'Criar Negócio'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
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
                      {business.status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Slug:</p>
                    <p className="text-sm text-gray-600 font-mono">{business.slug}</p>
                  </div>
                  
                  {business.ownerName && (
                    <div>
                      <p className="text-sm font-medium text-gray-700">Proprietário:</p>
                      <p className="text-sm text-gray-600">{business.ownerName}</p>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-sm text-gray-600">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {business._count.staff} staff
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {business._count.appointments} agendamentos
                    </div>
                    <div className="flex items-center">
                      <Settings className="h-4 w-4 mr-1" />
                      {business._count.services} serviços
                    </div>
                  </div>
                  
                  <div className="pt-3 border-t">
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
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Credentials Display Modal */}
      <Dialog open={showCredentials} onOpenChange={setShowCredentials}>
        <DialogContent 
          className="sm:max-w-[500px] max-w-[95vw] max-h-[90vh] overflow-y-auto"
          style={{
            top: '2rem',
            transform: 'translateX(-50%)',
            left: '50%',
            position: 'fixed'
          }}
        >
          <DialogHeader>
            <DialogTitle>🎉 Negócio Criado com Sucesso!</DialogTitle>
          </DialogHeader>
          
          {createdBusinessInfo && (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-800 mb-2">
                  Credenciais de Acesso
                </h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <strong>Negócio:</strong> {createdBusinessInfo.businessName}
                  </div>
                  <div>
                    <strong>Email:</strong> 
                    <code className="ml-2 bg-gray-100 px-2 py-1 rounded">
                      {createdBusinessInfo.email}
                    </code>
                  </div>
                  <div>
                    <strong>Password:</strong>
                    <code className="ml-2 bg-gray-100 px-2 py-1 rounded">
                      {createdBusinessInfo.password}
                    </code>
                    {createdBusinessInfo.isCustomPassword ? (
                      <span className="text-green-600 text-xs ml-2">(personalizada)</span>
                    ) : (
                      <span className="text-orange-600 text-xs ml-2">(temporária)</span>
                    )}
                  </div>
                  <div>
                    <strong>URL de Login:</strong>
                    <div className="mt-1">
                      <code className="bg-gray-100 px-2 py-1 rounded text-xs block">
                        {createdBusinessInfo.loginUrl}
                      </code>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-2">
                  📋 Instruções
                </h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Partilhe estas credenciais com o proprietário do negócio</li>
                  <li>• O proprietário pode fazer login em <code>/auth/signin</code></li>
                  <li>• Será redirecionado automaticamente para o seu portal</li>
                  <li>• Pode alterar a password depois do primeiro login</li>
                </ul>
              </div>
              
              <div className="flex justify-between space-x-3">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `Email: ${createdBusinessInfo.email}\nPassword: ${createdBusinessInfo.password}\nURL: ${createdBusinessInfo.loginUrl}`
                    );
                    toast({
                      title: "Copiado!",
                      description: "Credenciais copiadas para a área de transferência",
                    });
                  }}
                >
                  📋 Copiar Credenciais
                </Button>
                <Button onClick={() => setShowCredentials(false)}>
                  Continuar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Business Modal */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent 
          className="sm:max-w-[600px] max-w-[95vw] max-h-[90vh] overflow-y-auto p-6"
          style={{
            top: '2rem',
            transform: 'translateX(-50%)',
            left: '50%',
            position: 'fixed'
          }}
        >
          <DialogHeader className="mb-4">
            <DialogTitle>✏️ Editar Negócio</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={updateBusiness} className="space-y-4">
            <div>
              <Label htmlFor="edit-name" className="text-sm font-medium">Nome do Negócio *</Label>
              <Input
                id="edit-name"
                value={editBusiness.name}
                onChange={(e) => setEditBusiness({...editBusiness, name: e.target.value})}
                placeholder="Ex: Salão da Maria"
                className="mt-1"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="edit-email" className="text-sm font-medium">Email *</Label>
              <Input
                id="edit-email"
                type="email"
                value={editBusiness.email}
                onChange={(e) => setEditBusiness({...editBusiness, email: e.target.value})}
                placeholder="contato@salaodamaria.com"
                className="mt-1"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="edit-ownerName" className="text-sm font-medium">Nome do Proprietário *</Label>
              <Input
                id="edit-ownerName"
                value={editBusiness.ownerName}
                onChange={(e) => setEditBusiness({...editBusiness, ownerName: e.target.value})}
                placeholder="Maria Silva"
                className="mt-1"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="edit-phone" className="text-sm font-medium">Telefone</Label>
              <Input
                id="edit-phone"
                value={editBusiness.phone}
                onChange={(e) => setEditBusiness({...editBusiness, phone: e.target.value})}
                placeholder="+351 912 345 678"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="edit-plan" className="text-sm font-medium">Plano</Label>
              <Select value={editBusiness.plan} onValueChange={(value: any) => setEditBusiness({...editBusiness, plan: value})}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Basic</SelectItem>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="edit-slug" className="text-sm font-medium">Slug</Label>
              <Input
                id="edit-slug"
                value={editBusiness.slug}
                onChange={(e) => setEditBusiness({...editBusiness, slug: e.target.value})}
                placeholder="salao-da-maria"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="edit-password" className="text-sm font-medium">Nova Password (opcional)</Label>
              <Input
                id="edit-password"
                type="password"
                value={editBusiness.password}
                onChange={(e) => setEditBusiness({...editBusiness, password: e.target.value})}
                placeholder="Deixe vazio para manter a atual"
                className="mt-1"
                autoComplete="new-password"
              />
              <p className="text-xs text-gray-500 mt-1">
                Apenas preencha se quiser alterar a password
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4 mt-6 border-t">
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)} className="sm:w-auto">
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
              <Button type="submit" disabled={editing} className="sm:w-auto">
                <Save className="h-4 w-4 mr-2" />
                {editing ? 'Guardando...' : 'Guardar Alterações'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
} 