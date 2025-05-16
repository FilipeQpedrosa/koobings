import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Loader2 } from 'lucide-react';

const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;

const businessHoursSchema = z.object({
  hours: z.array(z.object({
    day: z.number(),
    isOpen: z.boolean(),
    start: z.string().regex(timeRegex, 'Invalid time format'),
    end: z.string().regex(timeRegex, 'Invalid time format')
  })).refine((hours) => {
    return hours.every(hour => {
      if (!hour.isOpen) return true;
      const start = new Date(`1970-01-01T${hour.start}`);
      const end = new Date(`1970-01-01T${hour.end}`);
      return end > start;
    });
  }, 'End time must be after start time')
});

type BusinessHoursFormData = z.infer<typeof businessHoursSchema>;

const dayNames = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export default function BusinessHoursForm({ initialData }: { initialData?: BusinessHoursFormData }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const defaultValues = {
    hours: initialData?.hours || [
      { day: 0, isOpen: false, start: '09:00', end: '17:00' },
      { day: 1, isOpen: true, start: '09:00', end: '17:00' },
      { day: 2, isOpen: true, start: '09:00', end: '17:00' },
      { day: 3, isOpen: true, start: '09:00', end: '17:00' },
      { day: 4, isOpen: true, start: '09:00', end: '17:00' },
      { day: 5, isOpen: true, start: '09:00', end: '17:00' },
      { day: 6, isOpen: false, start: '09:00', end: '17:00' },
    ]
  };

  const {
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<BusinessHoursFormData>({
    resolver: zodResolver(businessHoursSchema),
    defaultValues
  });

  const hours = watch('hours');

  const onSubmit = async (data: BusinessHoursFormData) => {
    try {
      setIsSubmitting(true);
      const response = await fetch('/api/business/hours', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to save business hours');
      }

      toast({
        title: 'Success',
        description: 'Business hours have been updated successfully.',
      });
    } catch (error) {
      console.error('Error saving business hours:', error);
      toast({
        title: 'Error',
        description: 'Failed to save business hours. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleHoursChange = (
    day: number,
    field: keyof (typeof hours)[0],
    value: string | boolean
  ) => {
    const newHours = [...hours];
    const index = newHours.findIndex(h => h.day === day);
    if (index !== -1) {
      newHours[index] = { ...newHours[index], [field]: value };
      setValue('hours', newHours);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        {hours.map((hour) => (
          <div
            key={hour.day}
            className="grid grid-cols-12 gap-4 items-center p-4 rounded-lg bg-gray-50"
          >
            <div className="col-span-3">
              <Label>{dayNames[hour.day]}</Label>
            </div>
            
            <div className="col-span-2">
              <Switch
                checked={hour.isOpen}
                onCheckedChange={(checked) =>
                  handleHoursChange(hour.day, 'isOpen', checked)
                }
              />
            </div>

            <div className="col-span-3">
              <Input
                type="time"
                value={hour.start}
                onChange={(e) =>
                  handleHoursChange(hour.day, 'start', e.target.value)
                }
                disabled={!hour.isOpen}
              />
            </div>

            <div className="col-span-3">
              <Input
                type="time"
                value={hour.end}
                onChange={(e) =>
                  handleHoursChange(hour.day, 'end', e.target.value)
                }
                disabled={!hour.isOpen}
              />
            </div>
          </div>
        ))}
      </div>

      {errors.hours && (
        <p className="text-sm text-red-500 mt-2">
          {errors.hours.message}
        </p>
      )}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full sm:w-auto"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          'Save Business Hours'
        )}
      </Button>
    </form>
  );
} 