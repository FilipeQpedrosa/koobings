"use client";
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';

export default function StaffProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Show loading while auth is checking
  if (authLoading) {
    return (
      <div className="max-w-md mx-auto mt-10 bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-6"></div>
          <div className="h-4 bg-gray-200 rounded mb-4"></div>
          <div className="h-10 bg-gray-200 rounded mb-4"></div>
        </div>
      </div>
    );
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({ title: 'Todos os campos são obrigatórios', variant: 'destructive' });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({ title: 'As senhas não coincidem', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/staff/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Falha ao alterar senha');
      toast({ title: 'Senha alterada com sucesso', variant: 'default' });
      setShowModal(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      toast({ title: err.message || 'Falha ao alterar senha', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 bg-white rounded-lg shadow p-6">
      <h1 className="text-2xl font-bold mb-6">Meu Perfil</h1>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600 mb-1">Nome</label>
        <div className="p-2 bg-gray-100 rounded text-gray-800">{user?.name || '-'}</div>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
        <div className="p-2 bg-gray-100 rounded text-gray-800">{user?.email || '-'}</div>
      </div>
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-600 mb-1">Função</label>
        <div className="p-2 bg-gray-100 rounded text-gray-800 capitalize">{user?.staffRole?.toLowerCase() || user?.role?.toLowerCase() || '-'}</div>
      </div>
      <Button variant="outline" className="w-full" onClick={() => setShowModal(true)}>Alterar Senha</Button>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogTitle>Alterar Senha</DialogTitle>
          <DialogDescription>Digite sua senha atual e uma nova senha.</DialogDescription>
          <form onSubmit={handleChangePassword} className="space-y-4 mt-2">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Senha Atual</label>
              <Input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Nova Senha</label>
              <Input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required minLength={8} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Confirmar Nova Senha</label>
              <Input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required minLength={8} />
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setShowModal(false)} disabled={loading}>Cancelar</Button>
              <Button type="submit" disabled={loading}>{loading ? 'Salvando...' : 'Salvar'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
} 