import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { format } from 'date-fns';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const TIME_SLOTS = Array.from({ length: 48 }, (_, i) => {
  const hour = Math.floor(i / 2);
  const minute = i % 2 === 0 ? '00' : '30';
  return `${hour.toString().padStart(2, '0')}:${minute}`;
});

interface TimeSlot {
  start: string;
  end: string;
}

interface DaySchedule {
  isWorking: boolean;
  timeSlots: TimeSlot[];
}

interface WeeklySchedule {
  [key: string]: DaySchedule;
}

interface AvailabilitySchedulerProps {
  initialSchedule?: WeeklySchedule;
  onSave: (schedule: WeeklySchedule) => void;
}

export default function AvailabilityScheduler({ initialSchedule, onSave }: AvailabilitySchedulerProps) {
  const [schedule, setSchedule] = useState<WeeklySchedule>(() => {
    const defaultSchedule = DAYS.reduce((acc, day) => ({
      ...acc,
      [day]: {
        isWorking: true,
        timeSlots: [{ start: '09:00', end: '17:00' }],
      },
    }), {});
    return initialSchedule || defaultSchedule;
  });

  const handleDayToggle = (day: string) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        isWorking: !prev[day].isWorking,
      },
    }));
  };

  const handleTimeChange = (day: string, slotIndex: number, type: 'start' | 'end', value: string) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        timeSlots: prev[day].timeSlots.map((slot, idx) =>
          idx === slotIndex ? { ...slot, [type]: value } : slot
        ),
      },
    }));
  };

  const addTimeSlot = (day: string) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        timeSlots: [...prev[day].timeSlots, { start: '09:00', end: '17:00' }],
      },
    }));
  };

  const removeTimeSlot = (day: string, slotIndex: number) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        timeSlots: prev[day].timeSlots.filter((_, idx) => idx !== slotIndex),
      },
    }));
  };

  const handleSave = () => {
    onSave(schedule);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Weekly Availability</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {DAYS.map((day) => (
            <div key={day} className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={schedule[day].isWorking}
                    onCheckedChange={() => handleDayToggle(day)}
                  />
                  <Label>{day}</Label>
                </div>
                {schedule[day].isWorking && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addTimeSlot(day)}
                  >
                    Add Time Slot
                  </Button>
                )}
              </div>
              
              {schedule[day].isWorking && (
                <div className="space-y-2">
                  {schedule[day].timeSlots.map((slot, slotIndex) => (
                    <div key={slotIndex} className="flex items-center space-x-2">
                      <Select
                        value={slot.start}
                        onValueChange={(value) => handleTimeChange(day, slotIndex, 'start', value)}
                      >
                        <SelectTrigger className="w-[180px]">
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
                      <span>to</span>
                      <Select
                        value={slot.end}
                        onValueChange={(value) => handleTimeChange(day, slotIndex, 'end', value)}
                      >
                        <SelectTrigger className="w-[180px]">
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
                      {schedule[day].timeSlots.length > 1 && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => removeTimeSlot(day, slotIndex)}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          <Button onClick={handleSave} className="w-full">
            Save Availability
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 