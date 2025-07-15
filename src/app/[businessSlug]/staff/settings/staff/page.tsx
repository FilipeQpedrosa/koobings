"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, ArrowLeft, Plus, Mail, User, Eye, EyeOff, Edit, Trash2, MoreVertical } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'MANAGER' | 'STANDARD';
}

export default function StaffSettingsStaffPage() {
  const { user, loading: authLoading } = useAuth();
  const businessSlug = user?.businessSlug;

  if (authLoading) {
    return <div>Loading...</div>;
  }

  if (!businessSlug) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-medium">Business Information Missing</h3>
          <p className="text-red-600">Unable to load staff settings. Please try logging in again.</p>
        </div>
      </div>
    );
  }
  
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showEditPassword, setShowEditPassword] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState<{ id: string; name: string } | null>(null);
  
  // Form data for creation
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'STANDARD' as 'ADMIN' | 'MANAGER' | 'STANDARD'
  });

  // Form data for editing
  const [editFormData, setEditFormData] = useState({
    id: '',
    name: '',
    email: '',
    password: '',
    role: 'STANDARD' as 'ADMIN' | 'MANAGER' | 'STANDARD'
  });

  // Fetch staff members
  const fetchStaffMembers = async () => {
    try {
      const response = await fetch('/api/business/staff', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setStaffMembers(data.data || []);
      } else {
        console.error('Failed to fetch staff members');
      }
    } catch (error) {
      console.error('Error fetching staff members:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffMembers();
  }, []);

  // Handle form submission for creating staff
  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      const response = await fetch('/api/business/staff', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Staff created successfully:', result.data);
        
        // Refresh the staff list
        await fetchStaffMembers();
        
        // Reset form and close modal
        setFormData({ name: '', email: '', password: '', role: 'STANDARD' });
        setIsCreateModalOpen(false);
        setShowPassword(false);
      } else {
        const error = await response.json();
        console.error('❌ Failed to create staff:', error);
        alert(`Erro ao criar membro da equipa: ${error.error?.message || 'Erro desconhecido'}`);
      }
    } catch (error) {
      console.error('❌ Network error creating staff:', error);
      alert('Erro de rede ao criar membro da equipa');
    } finally {
      setIsCreating(false);
    }
  };

  // Handle form submission for editing staff
  const handleEditStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      const updateData: any = {
        id: editFormData.id,
        name: editFormData.name,
        email: editFormData.email,
        role: editFormData.role,
      };

      // Only include password if it's provided
      if (editFormData.password.trim()) {
        updateData.password = editFormData.password;
      }

      const response = await fetch('/api/business/staff', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Staff updated successfully:', result.data);
        
        // Refresh the staff list
        await fetchStaffMembers();
        
        // Reset form and close modal
        setEditFormData({ id: '', name: '', email: '', password: '', role: 'STANDARD' });
        setIsEditModalOpen(false);
        setEditingStaff(null);
        setShowEditPassword(false);
      } else {
        const error = await response.json();
        console.error('❌ Failed to update staff:', error);
        alert(`Erro ao atualizar membro da equipa: ${error.error?.message || 'Erro desconhecido'}`);
      }
    } catch (error) {
      console.error('❌ Network error updating staff:', error);
      alert('Erro de rede ao atualizar membro da equipa');
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle staff deletion
  const handleDeleteStaff = async () => {
    if (!staffToDelete) return;
    
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/business/staff?id=${staffToDelete.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        console.log('✅ Staff deleted successfully:', staffToDelete.name);
        
        // Refresh the staff list
        await fetchStaffMembers();
        
        // Close dialog and reset state
        setDeleteDialogOpen(false);
        setStaffToDelete(null);
      } else {
        const error = await response.json();
        console.error('❌ Failed to delete staff:', error);
        alert(`Erro ao excluir membro da equipa: ${error.error?.message || 'Erro desconhecido'}`);
      }
    } catch (error) {
      console.error('❌ Network error deleting staff:', error);
      alert('Erro de rede ao excluir membro da equipa');
    } finally {
      setIsDeleting(false);
    }
  };

  // Open delete confirmation dialog
  const openDeleteDialog = (staff: StaffMember) => {
    setStaffToDelete({ id: staff.id, name: staff.name });
    setDeleteDialogOpen(true);
  };

  // Open edit modal with staff data
  const openEditModal = (staff: StaffMember) => {
    setEditingStaff(staff);
    setEditFormData({
      id: staff.id,
      name: staff.name,
      email: staff.email,
      password: '',
      role: staff.role
    });
    setIsEditModalOpen(true);
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'Administrador';
      case 'MANAGER': return 'Gestor';
      case 'STANDARD': return 'Padrão';
      default: return role;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'text-red-600 bg-red-100';
      case 'MANAGER': return 'text-blue-600 bg-blue-100';
      case 'STANDARD': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href={`/${businessSlug}/staff/settings`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para Configurações
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Equipa</h1>
            <p className="text-gray-600 mt-1">Gerir membros da equipa e permissões</p>
          </div>
        </div>
        
        {/* Create Staff Modal */}
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Membro
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Adicionar Membro da Equipa</DialogTitle>
              <DialogDescription>
                Crie um novo membro da equipa com acesso ao sistema.
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleCreateStaff} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="João Silva"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="joao.silva@empresa.com"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Mínimo 6 caracteres"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    className="pr-10"
                    minLength={6}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Nível de Acesso</Label>
                <Select value={formData.role} onValueChange={(value: 'ADMIN' | 'MANAGER' | 'STANDARD') => setFormData(prev => ({ ...prev, role: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar nível" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="STANDARD">Padrão - Acesso básico</SelectItem>
                    <SelectItem value="MANAGER">Gestor - Gestão de agendamentos</SelectItem>
                    <SelectItem value="ADMIN">Administrador - Acesso total</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsCreateModalOpen(false)}
                  disabled={isCreating}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isCreating}>
                  {isCreating ? 'A Criar...' : 'Criar Membro'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Staff Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Membro da Equipa</DialogTitle>
            <DialogDescription>
              Atualize as informações do membro da equipa.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleEditStaff} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nome Completo</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="edit-name"
                  type="text"
                  placeholder="João Silva"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="edit-email"
                  type="email"
                  placeholder="joao.silva@empresa.com"
                  value={editFormData.email}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-password">Nova Password (deixe vazio para manter atual)</Label>
              <div className="relative">
                <Input
                  id="edit-password"
                  type={showEditPassword ? "text" : "password"}
                  placeholder="Deixe vazio para não alterar"
                  value={editFormData.password}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="pr-10"
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowEditPassword(!showEditPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showEditPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-role">Nível de Acesso</Label>
              <Select value={editFormData.role} onValueChange={(value: 'ADMIN' | 'MANAGER' | 'STANDARD') => setEditFormData(prev => ({ ...prev, role: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar nível" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="STANDARD">Padrão - Acesso básico</SelectItem>
                  <SelectItem value="MANAGER">Gestor - Gestão de agendamentos</SelectItem>
                  <SelectItem value="ADMIN">Administrador - Acesso total</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingStaff(null);
                  setShowEditPassword(false);
                }}
                disabled={isUpdating}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? 'A Atualizar...' : 'Atualizar'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Staff List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Membros da Equipa
          </CardTitle>
          <CardDescription>
            {loading ? 'A carregar...' : `${staffMembers.length} membros da equipa`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-500 mt-2">A carregar membros da equipa...</p>
            </div>
          ) : staffMembers.length > 0 ? (
            <div className="space-y-3">
              {staffMembers.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">
                        {member.name}
                      </h3>
                      <p className="text-sm text-gray-500">{member.email}</p>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(member.role)}`}>
                        {getRoleLabel(member.role)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className="text-sm text-gray-500">
                      {member.email === user?.email ? 'Você' : 'Membro'}
                    </div>
                    
                    {/* Action Menu */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEditModal(member)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        {member.email !== user?.email && (
                          <DropdownMenuItem 
                            onClick={() => openDeleteDialog(member)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Excluir
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum membro da equipa</h3>
              <p className="text-gray-500 mb-4">
                Comece por adicionar o primeiro membro da sua equipa.
              </p>
              <Button onClick={() => setIsCreateModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Primeiro Membro
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir membro da equipa</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir <strong>{staffToDelete?.name}</strong>? 
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setDeleteDialogOpen(false);
              setStaffToDelete(null);
            }}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteStaff}
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting ? 'A Excluir...' : 'Excluir'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 