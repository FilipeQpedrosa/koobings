'use client';

import { useState, useEffect } from 'react';
import { EventClickArg } from '@fullcalendar/core';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate?: { start: Date; end: Date };
  selectedEvent?: EventClickArg;
  onSave: (appointmentData: any) => void;
}

export default function AppointmentModal({
  isOpen,
  onClose,
  selectedDate,
  selectedEvent,
  onSave,
}: AppointmentModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    start: '',
    end: '',
    provider: '',
    client: '',
    notes: '',
  });

  useEffect(() => {
    if (selectedEvent) {
      // Edit mode
      const event = selectedEvent.event;
      setFormData({
        title: event.title,
        start: event.startStr,
        end: event.endStr,
        provider: '', // TODO: Parse from title
        client: '', // TODO: Parse from title
        notes: event.extendedProps.notes || '',
      });
    } else if (selectedDate) {
      // Create mode
      setFormData({
        ...formData,
        start: selectedDate.start.toISOString(),
        end: selectedDate.end.toISOString(),
      });
    }
  }, [selectedEvent, selectedDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">
            {selectedEvent ? 'Edit Appointment' : 'New Appointment'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Provider
            </label>
            <select
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={formData.provider}
              onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
              required
            >
              <option value="">Select a provider</option>
              <option value="dr_thompson">Dr. Thompson</option>
              <option value="dr_chen">Dr. Chen</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Client
            </label>
            <select
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={formData.client}
              onChange={(e) => setFormData({ ...formData, client: e.target.value })}
              required
            >
              <option value="">Select a client</option>
              <option value="alice_johnson">Alice Johnson</option>
              <option value="bob_wilson">Bob Wilson</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Date & Time
            </label>
            <input
              type="datetime-local"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={formData.start.slice(0, 16)}
              onChange={(e) => {
                const start = new Date(e.target.value);
                const end = new Date(start.getTime() + 50 * 60000); // 50 minutes
                setFormData({
                  ...formData,
                  start: start.toISOString(),
                  end: end.toISOString(),
                });
              }}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Notes
            </label>
            <textarea
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
            >
              {selectedEvent ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 