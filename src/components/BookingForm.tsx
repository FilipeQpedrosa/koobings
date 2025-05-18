'use client';

import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { formatPrice, formatDuration } from '@/lib/utils/formatting'
import { parsePrice } from '@/lib/utils/validation';

interface TimeSlot {
  startTime: string;
  endTime: string;
  available: boolean;
}

interface Provider {
  id: string;
  name: string;
  services: Service[];
}

interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
  description?: string;
}

interface BookingFormProps {
  selectedDate: Date | null;
  selectedSlot: TimeSlot | null;
  selectedProvider: Provider | null;
  selectedService: Service | null;
  onProviderSelect: (provider: Provider) => void;
  onServiceSelect: (service: Service) => void;
}

export function BookingForm({
  selectedDate,
  selectedSlot,
  selectedProvider,
  selectedService,
  onProviderSelect,
  onServiceSelect,
}: BookingFormProps) {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/providers');
      if (!response.ok) throw new Error('Failed to fetch providers');
      const data = await response.json();
      setProviders(data);
    } catch (error) {
      console.error('Error fetching providers:', error);
      toast.error('Failed to load providers');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedSlot || !selectedProvider || !selectedService) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: selectedDate,
          startTime: selectedSlot.startTime,
          endTime: selectedSlot.endTime,
          providerId: selectedProvider.id,
          serviceId: selectedService.id,
          notes,
        }),
      });

      if (!response.ok) throw new Error('Failed to book appointment');

      toast.success('Appointment booked successfully!');
      // TODO: Redirect to confirmation page or appointments list
    } catch (error) {
      console.error('Error booking appointment:', error);
      toast.error('Failed to book appointment');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="provider"
          className="block text-sm font-medium text-gray-700"
        >
          Provider
        </label>
        <select
          id="provider"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          value={selectedProvider?.id || ''}
          onChange={(e) => {
            const provider = providers.find((p) => p.id === e.target.value);
            if (provider) onProviderSelect(provider);
          }}
          required
        >
          <option value="">Select a provider</option>
          {providers.map((provider) => (
            <option key={provider.id} value={provider.id}>
              {provider.name}
            </option>
          ))}
        </select>
      </div>

      {selectedProvider && (
        <div>
          <label
            htmlFor="service"
            className="block text-sm font-medium text-gray-700"
          >
            Service
          </label>
          <select
            id="service"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            value={selectedService?.id || ''}
            onChange={(e) => {
              const service = selectedProvider.services.find(
                (s) => s.id === e.target.value
              );
              if (service) onServiceSelect(service);
            }}
            required
          >
            <option value="">Select a service</option>
            {selectedProvider.services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name} ({formatDuration(service.duration)}) - {formatPrice(Number(service.price))}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label
          htmlFor="notes"
          className="block text-sm font-medium text-gray-700"
        >
          Notes (optional)
        </label>
        <textarea
          id="notes"
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          placeholder="Any special requests or information for your provider"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      {selectedDate && selectedSlot && selectedProvider && selectedService && (
        <div className="rounded-md bg-blue-50 p-4">
          <h4 className="text-sm font-medium text-blue-800">
            Appointment Summary
          </h4>
          <dl className="mt-2 text-sm text-blue-700">
            <div className="flex justify-between py-1">
              <dt>Date:</dt>
              <dd>{selectedDate.toLocaleDateString()}</dd>
            </div>
            <div className="flex justify-between py-1">
              <dt>Time:</dt>
              <dd>
                {new Date(selectedSlot.startTime).toLocaleTimeString([], {
                  hour: 'numeric',
                  minute: '2-digit',
                })}
              </dd>
            </div>
            <div className="flex justify-between py-1">
              <dt>Provider:</dt>
              <dd>{selectedProvider.name}</dd>
            </div>
            <div className="flex justify-between py-1">
              <dt>Service:</dt>
              <dd>
                {selectedService.name} - {formatPrice(parsePrice(selectedService.price))}
              </dd>
            </div>
          </dl>
        </div>
      )}

      <button
        type="submit"
        disabled={
          isSubmitting ||
          !selectedDate ||
          !selectedSlot ||
          !selectedProvider ||
          !selectedService
        }
        className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin inline" />
            Booking...
          </>
        ) : (
          'Book Appointment'
        )}
      </button>
    </form>
  );
} 