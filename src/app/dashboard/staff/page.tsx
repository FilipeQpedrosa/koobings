'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePermissions } from '@/hooks/usePermissions';

interface Schedule {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

interface Service {
  id: string;
  name: string;
}

interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: string;
  lastActive: string | null;
  schedules: Schedule[];
  services: Service[];
}

export default function StaffManagement() {
  const router = useRouter();
  const { can } = usePermissions();
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStaff() {
      try {
        const response = await fetch('/api/business/staff');
        if (!response.ok) {
          throw new Error('Failed to fetch staff');
        }
        const data = await response.json();
        setStaff(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    }

    fetchStaff();
  }, []);

  if (!can('manage_staff')) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          You don't have permission to access this page.
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Staff Management</h1>
        {can('manage_staff') && (
          <button
            onClick={() => router.push('/dashboard/staff/new')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Add Staff Member
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      ) : staff.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No staff members found.</p>
          <p className="text-gray-500 mt-2">Add staff members to manage their schedules and services.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {staff.map((member) => (
            <div
              key={member.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">{member.name}</h3>
                <span className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-800">
                  {member.role}
                </span>
              </div>
              <div className="text-gray-600 mb-4">
                <p>{member.email}</p>
                <p className="text-sm mt-2">
                  Last active: {member.lastActive ? new Date(member.lastActive).toLocaleDateString() : 'Never'}
                </p>
              </div>
              <div className="border-t pt-4 mt-4">
                <h4 className="text-sm font-medium mb-2">Services</h4>
                <div className="flex flex-wrap gap-2">
                  {member.services.map((service) => (
                    <span
                      key={service.id}
                      className="px-2 py-1 text-xs rounded-full bg-gray-100"
                    >
                      {service.name}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex justify-end mt-4 space-x-2">
                {can('manage_schedule') && (
                  <button
                    onClick={() => router.push(`/dashboard/staff/${member.id}/schedule`)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Schedule
                  </button>
                )}
                {can('manage_services') && (
                  <button
                    onClick={() => router.push(`/dashboard/staff/${member.id}/services`)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Services
                  </button>
                )}
                {can('manage_staff') && (
                  <button
                    onClick={() => router.push(`/dashboard/staff/${member.id}`)}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    Edit
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 