'use client';

import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2 } from 'lucide-react';

interface Service {
  name: string;
  description: string;
  duration: number;
  price: number;
}

const DEFAULT_SERVICE: Service = {
  name: '',
  description: '',
  duration: 60,
  price: 0,
};

export default function ServiceSetupForm() {
  const { toast } = useToast();
  const [services, setServices] = useState<Service[]>([{ ...DEFAULT_SERVICE }]);
  const [isSaving, setIsSaving] = useState(false);

  const handleAddService = () => {
    setServices([...services, { ...DEFAULT_SERVICE }]);
  };

  const handleRemoveService = (index: number) => {
    setServices(services.filter((_, i) => i !== index));
  };

  const handleServiceChange = (index: number, field: keyof Service, value: string | number) => {
    const newServices = [...services];
    newServices[index] = {
      ...newServices[index],
      [field]: value,
    };
    setServices(newServices);
  };

  const handleSave = async () => {
    if (services.some(service => !service.name)) {
      toast({
        title: 'Error',
        description: 'Please fill in all service names',
        variant: 'destructive',
      });
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch('/api/business/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ services }),
      });

      if (!response.ok) {
        throw new Error('Failed to save services');
      }

      toast({
        title: 'Success',
        description: 'Services saved successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save services',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-sm text-gray-500">
        Add the services you offer. You can add more or modify these later.
      </div>

      <div className="space-y-4">
        {services.map((service, index) => (
          <div key={index} className="p-4 border rounded-lg space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Service {index + 1}</h3>
              {services.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveService(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor={`name-${index}`}>Service Name</Label>
                <Input
                  id={`name-${index}`}
                  value={service.name}
                  onChange={(e) => handleServiceChange(index, 'name', e.target.value)}
                  placeholder="e.g., Haircut"
                />
              </div>

              <div>
                <Label htmlFor={`duration-${index}`}>Duration (minutes)</Label>
                <Input
                  id={`duration-${index}`}
                  type="number"
                  min="1"
                  value={service.duration}
                  onChange={(e) => handleServiceChange(index, 'duration', parseInt(e.target.value))}
                />
              </div>

              <div>
                <Label htmlFor={`price-${index}`}>Price</Label>
                <Input
                  id={`price-${index}`}
                  type="number"
                  min="0"
                  step="0.01"
                  value={service.price}
                  onChange={(e) => handleServiceChange(index, 'price', parseFloat(e.target.value))}
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor={`description-${index}`}>Description</Label>
                <Textarea
                  id={`description-${index}`}
                  value={service.description}
                  onChange={(e) => handleServiceChange(index, 'description', e.target.value)}
                  placeholder="Describe the service..."
                  rows={2}
                />
              </div>
            </div>
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={handleAddService}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Another Service
        </Button>
      </div>
    </div>
  );
} 