'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/Calendar';
import { UserRole } from '@/types/dashboard';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useSchedule } from '@/hooks/useSchedule';
import { useStaff } from '@/hooks/useStaff';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const DAYS_OF_WEEK = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const TIME_SLOTS = Array.from({ length: 48 }, (_, i) => {
  const hour = Math.floor(i / 2);
  const minute = i % 2 === 0 ? '00' : '30';
  return `${hour.toString().padStart(2, '0')}:${minute}`;
});

export default function SchedulePage() {
  const { data: session } = useSession();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedStaff, setSelectedStaff] = useState<string>('');
  const { staff, isLoading: isLoadingStaff } = useStaff();
  const { schedules, isLoading: isLoadingSchedules, createSchedule, updateSchedule, deleteSchedule } = useSchedule({
    staffId: selectedStaff || undefined,
  });

  const handleAddTimeSlot = async (dayOfWeek: number) => {
    await createSchedule({
      staffId: selectedStaff || session?.user?.id || '',
      dayOfWeek,
      startTime: '09:00',
      endTime: '17:00',
      isAvailable: true,
    });
  };

  const handleUpdateTimeSlot = async (
    id: string,
    data: { startTime?: string; endTime?: string; isAvailable?: boolean }
  ) => {
    await updateSchedule(id, data);
  };

  const handleDeleteTimeSlot = async (id: string) => {
    await deleteSchedule(id);
  };

  if (isLoadingStaff || isLoadingSchedules) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-gray-200 animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Schedule Management</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <Card className="md:col-span-4 p-6">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Calendar</h2>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-md border"
            />
            
            {session?.user?.role === ('BUSINESS_OWNER' satisfies UserRole) && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Staff Member</label>
                <Select
                  value={selectedStaff}
                  onValueChange={setSelectedStaff}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select staff member" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Staff</SelectItem>
                    {staff.map((member) => (
                      <SelectItem key={member.id} value={member.id}>
                        {member.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </Card>

        <Card className="md:col-span-8 p-6">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Working Hours</h2>
            <div className="space-y-4">
              {DAYS_OF_WEEK.map((day, index) => {
                const daySchedules = schedules.filter(
                  (schedule) => schedule.dayOfWeek === index
                );

                return (
                  <div key={day} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{day}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddTimeSlot(index)}
                      >
                        Add Time Slot
                      </Button>
                    </div>
                    {daySchedules.map((schedule) => (
                      <div
                        key={schedule.id}
                        className="grid grid-cols-12 gap-4 items-center bg-gray-50 p-4 rounded-lg"
                      >
                        <div className="col-span-5">
                          <Select
                            value={schedule.startTime}
                            onValueChange={(value) =>
                              handleUpdateTimeSlot(schedule.id, { startTime: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Start time" />
                            </SelectTrigger>
                            <SelectContent>
                              {TIME_SLOTS.map((time) => (
                                <SelectItem key={time} value={time}>
                                  {time}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="col-span-5">
                          <Select
                            value={schedule.endTime}
                            onValueChange={(value) =>
                              handleUpdateTimeSlot(schedule.id, { endTime: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="End time" />
                            </SelectTrigger>
                            <SelectContent>
                              {TIME_SLOTS.map((time) => (
                                <SelectItem key={time} value={time}>
                                  {time}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="col-span-1 flex items-center space-x-2">
                          <Switch
                            checked={schedule.isAvailable}
                            onCheckedChange={(checked) =>
                              handleUpdateTimeSlot(schedule.id, { isAvailable: checked })
                            }
                          />
                        </div>
                        <div className="col-span-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDeleteTimeSlot(schedule.id)}
                          >
                            ×
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
} 