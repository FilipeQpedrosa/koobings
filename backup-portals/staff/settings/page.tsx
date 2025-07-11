'use client';
import React, { useEffect, useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

const settingsTabs = [
  { label: 'Geral', href: '/staff/settings' },
  { label: 'Serviços', href: '/staff/settings/services' },
  { label: 'Equipe', href: '/staff/settings/staff' },
  { label: 'Categorias', href: '/staff/settings/categories' },
];

export default function StaffSettingsPage() {
  const { user, loading: authLoading, authenticated } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [businessInfo, setBusinessInfo] = useState({
    name: '',
    allowStaffToViewAllBookings: false,
    restrictStaffToViewAllClients: false,
    restrictStaffToViewAllNotes: false,
    requireAdminCancelApproval: false,
  });
  const pathname = usePathname();

  useEffect(() => {
    if (authLoading || !authenticated) return;
    if (
      user?.staffRole !== 'ADMIN' &&
      !(user?.permissions && user.permissions.includes('canViewSettings'))
    ) {
      router.replace('/staff/dashboard');
    }
  }, [user, authLoading, authenticated, router]);

  useEffect(() => {
    async function fetchBusinessInfo() {
      setIsLoading(true);
      try {
        const response = await fetch('/api/business/info');
        if (!response.ok) throw new Error('Failed to fetch business info');
        const data = await response.json();
        if (data.success) {
          setBusinessInfo({
            name: data.data.name || '',
            allowStaffToViewAllBookings: data.data.allowStaffToViewAllBookings || false,
            restrictStaffToViewAllClients: data.data.restrictStaffToViewAllClients || false,
            restrictStaffToViewAllNotes: data.data.restrictStaffToViewAllNotes || false,
            requireAdminCancelApproval: data.data.requireAdminCancelApproval || false,
          });
        }
      } catch (err: any) {
        setError(err.message || 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    }
    fetchBusinessInfo();
  }, []);

  const handleToggleChange = (field: keyof typeof businessInfo) => {
    setBusinessInfo(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError('');
    setSuccess('');
    try {
      const response = await fetch('/api/business/info', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(businessInfo),
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to save settings');
      }
      setSuccess('Settings saved successfully!');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  React.useEffect(() => {
    if (user) {
      // Debug: log session object
      console.log('StaffSettingsPage session:', user);
    }
  }, [user]);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold leading-tight text-gray-900">
          Configurações
        </h1>
        <div className="mt-4">
          <div className="sm:hidden">
            <label htmlFor="tabs" className="sr-only">Selecione uma aba</label>
            <select
              id="tabs"
              name="tabs"
              className="block w-full pl-3 pr-12 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              defaultValue={settingsTabs.find(tab => pathname === tab.href)?.href}
              onChange={(e) => router.push(e.target.value)}
            >
              {settingsTabs.map((tab) => (
                <option key={tab.href} value={tab.href}>{tab.label}</option>
              ))}
            </select>
          </div>
          <div className="hidden sm:block">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                {settingsTabs.map((tab) => (
                  <Link
                    key={tab.href}
                    href={tab.href}
                    className={`${
                      pathname === tab.href
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  >
                    {tab.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </header>

      <main>
        {isLoading ? (
          <div className="text-center py-12">Carregando configurações...</div>
        ) : (
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Configurações Gerais</h3>
              <div className="mt-2 max-w-xl text-xs text-gray-500">
                <p>Gerencie configurações gerais do negócio e permissões da equipe.</p>
              </div>
              <div className="mt-5 space-y-6">
                <div className="flex items-center justify-between">
                  <label htmlFor="allowStaffToViewAllBookings" className="text-sm font-medium text-gray-700">Permitir que funcionários vejam todos os agendamentos</label>
                  <Switch
                    id="allowStaffToViewAllBookings"
                    checked={businessInfo.allowStaffToViewAllBookings}
                    onCheckedChange={() => handleToggleChange('allowStaffToViewAllBookings')}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label htmlFor="restrictStaffToViewAllClients" className="text-sm font-medium text-gray-700">Restringir funcionários de visualizar todos os clientes</label>
                  <Switch
                    id="restrictStaffToViewAllClients"
                    checked={businessInfo.restrictStaffToViewAllClients}
                    onCheckedChange={() => handleToggleChange('restrictStaffToViewAllClients')}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label htmlFor="restrictStaffToViewAllNotes" className="text-sm font-medium text-gray-700">Restringir funcionários de visualizar todas as notas de clientes</label>
                  <Switch
                    id="restrictStaffToViewAllNotes"
                    checked={businessInfo.restrictStaffToViewAllNotes}
                    onCheckedChange={() => handleToggleChange('restrictStaffToViewAllNotes')}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label htmlFor="requireAdminCancelApproval" className="text-sm font-medium text-gray-700">Exigir aprovação de admin para cancelamentos de agendamentos por funcionários</label>
                  <Switch
                    id="requireAdminCancelApproval"
                    checked={businessInfo.requireAdminCancelApproval}
                    onCheckedChange={() => handleToggleChange('requireAdminCancelApproval')}
                  />
                </div>
              </div>
            </div>
            <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
              {error && <div className="text-red-500 text-sm text-left mb-2">{error}</div>}
              {success && <div className="text-green-500 text-sm text-left mb-2">{success}</div>}
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
} 