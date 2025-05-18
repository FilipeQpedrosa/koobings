import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useToast } from '@/components/ui/use-toast';

export interface Appointment {
  id: string;
  customerId: string;
  serviceId: string;
  staffId: string;
  businessId: string;
  date: string;
  time: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  service: {
    id: string;
    name: string;
    duration: number;
    price: number;
  };
  staff: {
    id: string;
    name: string;
    role: string;
  };
}

interface UseAppointmentsOptions {
  date?: string;
  status?: string;
  search?: string;
}

export function useAppointments(options: UseAppointmentsOptions = {}) {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAppointments() {
      try {
        setIsLoading(true);
        setError(null);

        const queryParams = new URLSearchParams();
        if (options.date) queryParams.set('date', options.date);
        if (options.status) queryParams.set('status', options.status);
        if (options.search) queryParams.set('search', options.search);

        const response = await fetch(`/api/appointments?${queryParams}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch appointments');
        }

        const data = await response.json();
        setAppointments(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        toast({
          title: 'Error',
          description: 'Failed to load appointments',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    }

    if (session) {
      fetchAppointments();
    }
  }, [session, options.date, options.status, options.search, toast]);

  const updateAppointment = async (
    id: string,
    data: Partial<Appointment>
  ): Promise<boolean> => {
    try {
      const response = await fetch(`/api/appointments`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, ...data }),
      });

      if (!response.ok) {
        throw new Error('Failed to update appointment');
      }

      const updatedAppointment = await response.json();
      setAppointments((prev) =>
        prev.map((app) =>
          app.id === updatedAppointment.id ? updatedAppointment : app
        )
      );

      toast({
        title: 'Success',
        description: 'Appointment updated successfully',
      });

      return true;
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to update appointment',
        variant: 'destructive',
      });
      return false;
    }
  };

  const createAppointment = async (
    data: Omit<Appointment, 'id' | 'customer' | 'service' | 'staff'>
  ): Promise<boolean> => {
    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create appointment');
      }

      const newAppointment = await response.json();
      setAppointments((prev) => [...prev, newAppointment]);

      toast({
        title: 'Success',
        description: 'Appointment created successfully',
      });

      return true;
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to create appointment',
        variant: 'destructive',
      });
      return false;
    }
  };

  return {
    appointments,
    isLoading,
    error,
    updateAppointment,
    createAppointment,
  };
} 