'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
}

interface StaffMember {
  id: string;
  name: string;
  services: Service[];
}

export default function StaffServices() {
  const router = useRouter();
  const params = useParams();
  const [staffMember, setStaffMember] = useState<StaffMember | null>(null);
  const [availableServices, setAvailableServices] = useState<Service[]>([]);
  const [selectedServices, setSelectedServices] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [staffResponse, servicesResponse] = await Promise.all([
          fetch(`/api/business/staff/${params.id}`),
          fetch('/api/business/services')
        ]);

        if (!staffResponse.ok || !servicesResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const [staffData, servicesData] = await Promise.all([
          staffResponse.json(),
          servicesResponse.json()
        ]);

        setStaffMember(staffData);
        setAvailableServices(servicesData);
        setSelectedServices(new Set(staffData.services.map((s: Service) => s.id)));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    }

    if (params.id) {
      fetchData();
    }
  }, [params.id]);

  const handleServiceToggle = (serviceId: string) => {
    setSelectedServices(current => {
      const updated = new Set(current);
      if (updated.has(serviceId)) {
        updated.delete(serviceId);
      } else {
        updated.add(serviceId);
      }
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch(`/api/business/staff/${params.id}/services`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serviceIds: Array.from(selectedServices)
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update services');
      }

      router.push('/dashboard/staff');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Service Assignment</h1>
        <p className="text-gray-600 mt-2">
          Manage services for {staffMember?.name}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-4">
          {availableServices.map((service) => (
            <div
              key={service.id}
              className="flex items-center justify-between p-4 bg-white rounded-lg shadow"
            >
              <div className="flex items-center space-x-4">
                <input
                  type="checkbox"
                  id={service.id}
                  checked={selectedServices.has(service.id)}
                  onChange={() => handleServiceToggle(service.id)}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <div>
                  <label htmlFor={service.id} className="font-medium">
                    {service.name}
                  </label>
                  <div className="text-sm text-gray-500">
                    {service.duration} min • ${service.price}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className={`px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 ${
              isSaving ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSaving ? 'Saving...' : 'Save Services'}
          </button>
        </div>
      </form>
    </div>
  );
} 