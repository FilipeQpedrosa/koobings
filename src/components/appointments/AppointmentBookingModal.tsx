'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { X, Calendar, Clock, User, CheckCircle } from 'lucide-react';

interface Provider {
  id: string;
  name: string;
  specialization: string;
  availableDates: Date[];
}

interface AppointmentBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: Date;
  time: string;
  provider?: Provider;
}

export default function AppointmentBookingModal({
  isOpen,
  onClose,
  date,
  time,
  provider,
}: AppointmentBookingModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notes, setNotes] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // TODO: Implement API call to book appointment
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
      setIsSuccess(true);
      setTimeout(() => {
        onClose();
        setIsSuccess(false);
        setNotes('');
      }, 2000);
    } catch (error) {
      console.error('Failed to book appointment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full mx-4">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">
            Confirm Appointment
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-6 text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Appointment Booked!
            </h3>
            <p className="text-gray-500">
              You will receive a confirmation email shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="p-4 space-y-4">
              <div className="space-y-4">
                {provider && (
                  <div className="flex items-start space-x-3">
                    <User className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {provider.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {provider.specialization}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <p className="text-sm text-gray-900">
                    {format(date, 'EEEE, MMMM d, yyyy')}
                  </p>
                </div>

                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-gray-400" />
                  <p className="text-sm text-gray-900">{time}</p>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="notes"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Additional Notes
                  </label>
                  <textarea
                    id="notes"
                    rows={3}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="Any specific concerns or requests..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="px-4 py-3 bg-gray-50 text-right rounded-b-lg">
              <button
                type="button"
                className="mr-3 inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {isSubmitting ? 'Booking...' : 'Confirm Booking'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
} 