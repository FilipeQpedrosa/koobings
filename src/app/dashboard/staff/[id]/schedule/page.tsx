'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

interface Schedule {
  id?: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

interface StaffMember {
  id: string;
  name: string;
  schedules: Schedule[];
}

const DAYS_OF_WEEK = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export default function StaffSchedule() {
  const router = useRouter();
  const params = useParams();
  const [staffMember, setStaffMember] = useState<StaffMember | null>(null);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStaffMember() {
      try {
        const response = await fetch(`/api/business/staff/${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch staff member');
        }
        const data = await response.json();
        setStaffMember(data);
        setSchedules(data.schedules || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    }

    if (params.id) {
      fetchStaffMember();
    }
  }, [params.id]);

  const handleScheduleChange = (dayOfWeek: number, field: 'startTime' | 'endTime', value: string) => {
    setSchedules(current => {
      const existingSchedule = current.find(s => s.dayOfWeek === dayOfWeek);
      if (existingSchedule) {
        return current.map(s =>
          s.dayOfWeek === dayOfWeek ? { ...s, [field]: value } : s
        );
      }
      return [...current, {
        dayOfWeek,
        startTime: field === 'startTime' ? value : '09:00',
        endTime: field === 'endTime' ? value : '17:00'
      }];
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch(`/api/business/staff/${params.id}/schedule`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ schedules }),
      });

      if (!response.ok) {
        throw new Error('Failed to update schedule');
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
        <h1 className="text-2xl font-bold">Schedule Management</h1>
        <p className="text-gray-600 mt-2">
          {staffMember?.name}'s Weekly Schedule
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {DAYS_OF_WEEK.map((day, index) => {
          const schedule = schedules.find(s => s.dayOfWeek === index);
          return (
            <div key={day} className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow">
              <div className="w-32">
                <span className="font-medium">{day}</span>
              </div>
              <div className="flex-1 grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600">Start Time</label>
                  <input
                    type="time"
                    value={schedule?.startTime || '09:00'}
                    onChange={(e) => handleScheduleChange(index, 'startTime', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600">End Time</label>
                  <input
                    type="time"
                    value={schedule?.endTime || '17:00'}
                    onChange={(e) => handleScheduleChange(index, 'endTime', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          );
        })}

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
            {isSaving ? 'Saving...' : 'Save Schedule'}
          </button>
        </div>
      </form>
    </div>
  );
} 