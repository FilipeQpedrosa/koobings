'use client';

import { useState } from 'react';
import { Calendar } from '@/components/ui/Calendar';
import { format } from 'date-fns';
import { CalendarDays, Clock, User } from 'lucide-react';
import AppointmentBookingModal from '@/components/appointments/AppointmentBookingModal';

interface TimeSlot {
  time: string;
  available: boolean;
}

interface Provider {
  id: string;
  name: string;
  specialization: string;
  availableDates: Date[];
}

export default function PatientAppointmentsPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined);
  const [selectedProvider, setSelectedProvider] = useState<string | undefined>(undefined);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // Mock data - replace with API calls
  const providers: Provider[] = [
    {
      id: '1',
      name: 'Dr. Sarah Thompson',
      specialization: 'General Practice',
      availableDates: [new Date(), new Date(Date.now() + 86400000)],
    },
    {
      id: '2',
      name: 'Dr. Michael Chen',
      specialization: 'Specialist',
      availableDates: [new Date(), new Date(Date.now() + 172800000)],
    },
  ];

  const timeSlots: TimeSlot[] = [
    { time: '09:00', available: true },
    { time: '10:00', available: true },
    { time: '11:00', available: false },
    { time: '14:00', available: true },
    { time: '15:00', available: true },
    { time: '16:00', available: true },
  ];

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedTime(undefined);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setIsBookingModalOpen(true);
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Book an Appointment</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Provider Selection */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <User className="mr-2 h-5 w-5 text-gray-500" />
            Select Provider
          </h2>
          <div className="space-y-4">
            {providers.map((provider) => (
              <button
                key={provider.id}
                onClick={() => setSelectedProvider(provider.id)}
                className={`w-full p-4 rounded-lg border text-left transition-colors ${
                  selectedProvider === provider.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-200'
                }`}
              >
                <div className="font-medium text-gray-900">{provider.name}</div>
                <div className="text-sm text-gray-500">{provider.specialization}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Calendar */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <CalendarDays className="mr-2 h-5 w-5 text-gray-500" />
            Select Date
          </h2>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            className="rounded-md border"
          />
        </div>

        {/* Time Slots */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <Clock className="mr-2 h-5 w-5 text-gray-500" />
            Select Time
          </h2>
          {selectedDate ? (
            <div className="grid grid-cols-2 gap-2">
              {timeSlots.map((slot) => (
                <button
                  key={slot.time}
                  onClick={() => slot.available && handleTimeSelect(slot.time)}
                  disabled={!slot.available}
                  className={`p-2 rounded text-center ${
                    slot.available
                      ? 'bg-white border border-gray-200 hover:border-blue-500 hover:bg-blue-50'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {slot.time}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">
              Please select a date first
            </p>
          )}
        </div>
      </div>

      {/* Booking Modal */}
      {selectedDate && selectedTime && (
        <AppointmentBookingModal
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
          date={selectedDate}
          time={selectedTime}
          provider={providers.find(p => p.id === selectedProvider)}
        />
      )}
    </div>
  );
} 