import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import { SystemSettings } from '@/types/settings';

const prisma = new PrismaClient();

async function updateSettings(formData: FormData) {
  'use server';
  
  const data: SystemSettings = {
    email: {
      from: formData.get('emailFrom') as string,
      server: formData.get('emailServer') as string,
      port: formData.get('emailPort') as string,
    },
    security: {
      sessionTimeout: Number(formData.get('sessionTimeout')),
      requireMFA: formData.get('requireMFA') === 'on',
      enforcePasswordPolicy: formData.get('enforcePasswordPolicy') === 'on',
    },
    business: {
      maxActive: Number(formData.get('maxBusinesses')),
      autoApprove: formData.get('autoApprove') === 'on',
    }
  };

  const response = await fetch('/api/admin/settings', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to update settings');
  }
}

async function performMaintenance(action: 'CLEAR_CACHE' | 'PURGE_LOGS' | 'BACKUP_DB') {
  'use server';

  const response = await fetch('/api/admin/settings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ action }),
  });

  if (!response.ok) {
    throw new Error(`Failed to perform maintenance action: ${action}`);
  }
}

export default async function AdminSettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  // Verify if user is admin
  const admin = await prisma.systemAdmin.findUnique({
    where: { email: session.user?.email }
  });

  if (!admin) {
    redirect('/auth/signin');
  }

  // Fetch current settings
  const response = await fetch('/api/admin/settings', {
    cache: 'no-store',
  });

  const settings: SystemSettings = await response.json();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">System Settings</h1>
        <p className="text-gray-600 mt-2">Configure system-wide settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Email Settings</h3>
          <form action={updateSettings} className="space-y-4">
            <div>
              <label htmlFor="emailFrom" className="block text-sm font-medium text-gray-700">
                From Email Address
              </label>
              <input
                type="email"
                id="emailFrom"
                name="emailFrom"
                defaultValue={settings.email.from}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="emailServer" className="block text-sm font-medium text-gray-700">
                SMTP Server
              </label>
              <input
                type="text"
                id="emailServer"
                name="emailServer"
                defaultValue={settings.email.server}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="emailPort" className="block text-sm font-medium text-gray-700">
                SMTP Port
              </label>
              <input
                type="number"
                id="emailPort"
                name="emailPort"
                defaultValue={settings.email.port}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <button
              type="submit"
              className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Save Email Settings
            </button>
          </form>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Security Settings</h3>
          <form action={updateSettings} className="space-y-4">
            <div>
              <label htmlFor="sessionTimeout" className="block text-sm font-medium text-gray-700">
                Session Timeout (minutes)
              </label>
              <input
                type="number"
                id="sessionTimeout"
                name="sessionTimeout"
                defaultValue={settings.security.sessionTimeout}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="requireMFA"
                  defaultChecked={settings.security.requireMFA}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="ml-2 text-sm text-gray-700">Require MFA for all admin users</span>
              </label>
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="enforcePasswordPolicy"
                  defaultChecked={settings.security.enforcePasswordPolicy}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="ml-2 text-sm text-gray-700">Enforce strong password policy</span>
              </label>
            </div>

            <button
              type="submit"
              className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Save Security Settings
            </button>
          </form>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Business Settings</h3>
          <form action={updateSettings} className="space-y-4">
            <div>
              <label htmlFor="maxBusinesses" className="block text-sm font-medium text-gray-700">
                Maximum Active Businesses
              </label>
              <input
                type="number"
                id="maxBusinesses"
                name="maxBusinesses"
                defaultValue={settings.business.maxActive}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="autoApprove"
                  defaultChecked={settings.business.autoApprove}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="ml-2 text-sm text-gray-700">Auto-approve new businesses</span>
              </label>
            </div>

            <button
              type="submit"
              className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Save Business Settings
            </button>
          </form>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 mb-4">System Maintenance</h3>
          <div className="space-y-4">
            <form action={() => performMaintenance('CLEAR_CACHE')}>
              <button
                type="submit"
                className="inline-flex w-full justify-center rounded-md border border-transparent bg-yellow-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
              >
                Clear System Cache
              </button>
            </form>

            <form action={() => performMaintenance('PURGE_LOGS')}>
              <button
                type="submit"
                className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Purge Old Logs
              </button>
            </form>

            <form action={() => performMaintenance('BACKUP_DB')}>
              <button
                type="submit"
                className="inline-flex w-full justify-center rounded-md border border-transparent bg-green-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Run Database Backup
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 