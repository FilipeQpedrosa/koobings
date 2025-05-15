'use client';

import { useState } from 'react';
import { Calendar } from '@/components/Calendar';
import { BookingForm } from '@/components/BookingForm';
import { Loader2 } from 'lucide-react';

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

export default function BookAppointment() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    
    setIsLoading(true);
    setSelectedDate(date);

    fetch(`/api/appointments/availability?date=${date.toISOString()}`)
      .then((response) => {
        if (!response.ok) throw new Error('Failed to fetch availability');
        return response.json();
      })
      .then((slots) => {
        setAvailableSlots(slots);
      })
      .catch((error) => {
        console.error('Error fetching availability:', error);
        // TODO: Show error toast
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleSlotSelect = (slot: TimeSlot) => {
    setSelectedSlot(slot);
  };

  const handleProviderSelect = async (provider: Provider) => {
    setSelectedProvider(provider);
    setSelectedService(null); // Reset service when provider changes
  };

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Book an Appointment</h1>
          <p className="mt-2 text-sm text-gray-500">
            Select your preferred date, time, and service to schedule your appointment.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Calendar and Time Slots */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                className="rounded-md border"
                disabled={[{ before: new Date() }]}
              />
            </div>

            {selectedDate && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Available Time Slots</h3>
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {availableSlots.map((slot) => (
                      <button
                        key={slot.startTime}
                        onClick={() => handleSlotSelect(slot)}
                        className={`px-4 py-2 text-sm font-medium rounded-md ${
                          selectedSlot?.startTime === slot.startTime
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                        } ${!slot.available ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={!slot.available}
                      >
                        {new Date(slot.startTime).toLocaleTimeString([], {
                          hour: 'numeric',
                          minute: '2-digit',
                        })}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Booking Form */}
          <div className="bg-white rounded-lg shadow p-6">
            <BookingForm
              selectedDate={selectedDate}
              selectedSlot={selectedSlot}
              selectedProvider={selectedProvider}
              selectedService={selectedService}
              onProviderSelect={handleProviderSelect}
              onServiceSelect={handleServiceSelect}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 