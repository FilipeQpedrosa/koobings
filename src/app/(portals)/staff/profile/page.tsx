"use client";
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';

export default function StaffProfilePage() {
  const { data: session } = useSession();
  const user = session?.user;
  const [showModal, setShowModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({ title: 'All fields are required', variant: 'destructive' });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({ title: 'Passwords do not match', variant: 'destructive' });
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
      if (!res.ok) throw new Error(data.error || 'Failed to change password');
      toast({ title: 'Password changed successfully', variant: 'success' });
      setShowModal(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      toast({ title: err.message || 'Failed to change password', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 bg-white rounded-lg shadow p-6">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600 mb-1">Name</label>
        <div className="p-2 bg-gray-100 rounded text-gray-800">{user?.name || '-'}</div>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
        <div className="p-2 bg-gray-100 rounded text-gray-800">{user?.email || '-'}</div>
      </div>
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-600 mb-1">Role</label>
        <div className="p-2 bg-gray-100 rounded text-gray-800 capitalize">{user?.staffRole?.toLowerCase() || '-'}</div>
      </div>
      <Button variant="outline" className="w-full" onClick={() => setShowModal(true)}>Change Password</Button>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogTitle>Change Password</DialogTitle>
          <DialogDescription>Enter your current password and a new password.</DialogDescription>
          <form onSubmit={handleChangePassword} className="space-y-4 mt-2">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Current Password</label>
              <Input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">New Password</label>
              <Input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required minLength={8} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Confirm New Password</label>
              <Input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required minLength={8} />
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setShowModal(false)} disabled={loading}>Cancel</Button>
              <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
} 