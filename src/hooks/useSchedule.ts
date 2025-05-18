import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useToast } from '@/components/ui/use-toast';

export interface Schedule {
  id: string;
  staffId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  staff: {
    id: string;
    name: string;
    role: string;
  };
}

interface UseScheduleOptions {
  staffId?: string;
}

export function useSchedule(options: UseScheduleOptions = {}) {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSchedules() {
      try {
        setIsLoading(true);
        setError(null);

        const queryParams = new URLSearchParams();
        if (options.staffId) queryParams.set('staffId', options.staffId);

        const response = await fetch(`/api/schedule?${queryParams}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch schedules');
        }

        const data = await response.json();
        setSchedules(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        toast({
          title: 'Error',
          description: 'Failed to load schedules',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    }

    if (session) {
      fetchSchedules();
    }
  }, [session, options.staffId, toast]);

  const createSchedule = async (data: Omit<Schedule, 'id' | 'staff'>): Promise<boolean> => {
    try {
      const response = await fetch('/api/schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create schedule');
      }

      const newSchedule = await response.json();
      setSchedules((prev) => [...prev, newSchedule]);

      toast({
        title: 'Success',
        description: 'Schedule created successfully',
      });

      return true;
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to create schedule',
        variant: 'destructive',
      });
      return false;
    }
  };

  const updateSchedule = async (
    id: string,
    data: Partial<Omit<Schedule, 'id' | 'staff'>>
  ): Promise<boolean> => {
    try {
      const response = await fetch('/api/schedule', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, ...data }),
      });

      if (!response.ok) {
        throw new Error('Failed to update schedule');
      }

      const updatedSchedule = await response.json();
      setSchedules((prev) =>
        prev.map((schedule) =>
          schedule.id === updatedSchedule.id ? updatedSchedule : schedule
        )
      );

      toast({
        title: 'Success',
        description: 'Schedule updated successfully',
      });

      return true;
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to update schedule',
        variant: 'destructive',
      });
      return false;
    }
  };

  const deleteSchedule = async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/schedule?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete schedule');
      }

      setSchedules((prev) => prev.filter((schedule) => schedule.id !== id));

      toast({
        title: 'Success',
        description: 'Schedule deleted successfully',
      });

      return true;
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to delete schedule',
        variant: 'destructive',
      });
      return false;
    }
  };

  return {
    schedules,
    isLoading,
    error,
    createSchedule,
    updateSchedule,
    deleteSchedule,
  };
} 