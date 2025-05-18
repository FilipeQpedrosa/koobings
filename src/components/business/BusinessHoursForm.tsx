'use client';

import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface BusinessHour {
  dayOfWeek: number;
  isOpen: boolean;
  startTime: string;
  endTime: string;
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

const DEFAULT_HOURS: BusinessHour[] = DAYS_OF_WEEK.map((_, index) => ({
  dayOfWeek: index,
  isOpen: index > 0 && index < 6, // Monday to Friday open by default
  startTime: '09:00',
  endTime: '17:00',
}));

export default function BusinessHoursForm() {
  const { toast } = useToast();
  const [hours, setHours] = useState<BusinessHour[]>(DEFAULT_HOURS);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/business/hours', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ hours }),
      });

      if (!response.ok) {
        throw new Error('Failed to save business hours');
      }

      toast({
        title: 'Success',
        description: 'Business hours saved successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save business hours',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleDay = (index: number) => {
    const newHours = [...hours];
    newHours[index] = {
      ...newHours[index],
      isOpen: !newHours[index].isOpen,
    };
    setHours(newHours);
  };

  const handleTimeChange = (index: number, field: 'startTime' | 'endTime', value: string) => {
    const newHours = [...hours];
    newHours[index] = {
      ...newHours[index],
      [field]: value,
    };
    setHours(newHours);
  };

  return (
    <div className="space-y-6">
      <div className="text-sm text-gray-500">
        Set your regular business hours. You can always adjust these later.
      </div>

      <div className="space-y-4">
        {hours.map((hour, index) => (
          <div key={index} className="flex items-center space-x-4">
            <div className="w-32">
              <Label>{DAYS_OF_WEEK[index]}</Label>
            </div>
            <Switch
              checked={hour.isOpen}
              onCheckedChange={() => handleToggleDay(index)}
            />
            <div className="flex items-center space-x-2 flex-1">
              <Input
                type="time"
                value={hour.startTime}
                onChange={(e) => handleTimeChange(index, 'startTime', e.target.value)}
                disabled={!hour.isOpen}
                className="w-32"
              />
              <span>to</span>
              <Input
                type="time"
                value={hour.endTime}
                onChange={(e) => handleTimeChange(index, 'endTime', e.target.value)}
                disabled={!hour.isOpen}
                className="w-32"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 