import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useToast } from '@/components/ui/use-toast';

export interface Staff {
  id: string;
  name: string;
  email: string;
  role: string;
  businessId: string;
}

interface UseStaffOptions {
  businessId?: string;
}

export function useStaff(options: UseStaffOptions = {}) {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [staff, setStaff] = useState<Staff[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStaff() {
      try {
        setIsLoading(true);
        setError(null);

        const queryParams = new URLSearchParams();
        if (options.businessId) queryParams.set('businessId', options.businessId);

        const response = await fetch(`/api/staff?${queryParams}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch staff');
        }

        const data = await response.json();
        setStaff(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        toast({
          title: 'Error',
          description: 'Failed to load staff members',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    }

    if (session) {
      fetchStaff();
    }
  }, [session, options.businessId, toast]);

  const createStaff = async (data: Omit<Staff, 'id'>): Promise<boolean> => {
    try {
      const response = await fetch('/api/staff', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create staff member');
      }

      const newStaff = await response.json();
      setStaff((prev) => [...prev, newStaff]);

      toast({
        title: 'Success',
        description: 'Staff member created successfully',
      });

      return true;
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to create staff member',
        variant: 'destructive',
      });
      return false;
    }
  };

  const updateStaff = async (
    id: string,
    data: Partial<Omit<Staff, 'id'>>
  ): Promise<boolean> => {
    try {
      const response = await fetch('/api/staff', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, ...data }),
      });

      if (!response.ok) {
        throw new Error('Failed to update staff member');
      }

      const updatedStaff = await response.json();
      setStaff((prev) =>
        prev.map((s) => (s.id === updatedStaff.id ? updatedStaff : s))
      );

      toast({
        title: 'Success',
        description: 'Staff member updated successfully',
      });

      return true;
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to update staff member',
        variant: 'destructive',
      });
      return false;
    }
  };

  const deleteStaff = async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/staff?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete staff member');
      }

      setStaff((prev) => prev.filter((s) => s.id !== id));

      toast({
        title: 'Success',
        description: 'Staff member deleted successfully',
      });

      return true;
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to delete staff member',
        variant: 'destructive',
      });
      return false;
    }
  };

  return {
    staff,
    isLoading,
    error,
    createStaff,
    updateStaff,
    deleteStaff,
  };
} 