import React from 'react';
import { format, parseISO } from 'date-fns';
import { AppointmentStatus } from '@prisma/client';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface Appointment {
  id: string;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  notes?: string;
  patient: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
  service: {
    id: string;
    name: string;
    duration: number;
    price: number;
  };
  staff: {
    id: string;
    name: string;
    email: string;
  };
}

interface AppointmentDetailsModalProps {
  appointment: Appointment;
  onClose: () => void;
  onStatusChange: (appointmentId: string, status: AppointmentStatus) => void;
  onEdit: (appointment: Appointment) => void;
  onCancel: (appointmentId: string) => void;
}

export function AppointmentDetailsModal({
  appointment,
  onClose,
  onStatusChange,
  onEdit,
  onCancel,
}: AppointmentDetailsModalProps) {
  const getStatusColor = (status: AppointmentStatus) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">Appointment Details</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status Badge */}
          <div className="flex items-center space-x-2">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                appointment.status
              )}`}
            >
              {appointment.status}
            </span>
          </div>

          {/* Time and Service Details */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Date & Time</h3>
              <p className="mt-1 text-sm">
                {format(parseISO(appointment.startTime), 'PPP')}
                <br />
                {format(parseISO(appointment.startTime), 'p')} -{' '}
                {format(parseISO(appointment.endTime), 'p')}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Service</h3>
              <p className="mt-1 text-sm">
                {appointment.service.name}
                <br />
                {appointment.service.duration} minutes - ${appointment.service.price}
              </p>
            </div>
          </div>

          {/* Patient and Staff Details */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Patient</h3>
              <p className="mt-1 text-sm">
                {appointment.patient.name}
                <br />
                {appointment.patient.email}
                {appointment.patient.phone && (
                  <>
                    <br />
                    {appointment.patient.phone}
                  </>
                )}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Staff Member</h3>
              <p className="mt-1 text-sm">
                {appointment.staff.name}
                <br />
                {appointment.staff.email}
              </p>
            </div>
          </div>

          {/* Notes */}
          {appointment.notes && (
            <div>
              <h3 className="text-sm font-medium text-gray-500">Notes</h3>
              <p className="mt-1 text-sm whitespace-pre-wrap">
                {appointment.notes}
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 p-4 border-t">
          {appointment.status === 'PENDING' && (
            <>
              <button
                onClick={() =>
                  onStatusChange(appointment.id, AppointmentStatus.CONFIRMED)
                }
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Confirm
              </button>
              <button
                onClick={() => onCancel(appointment.id)}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Cancel
              </button>
            </>
          )}
          {appointment.status === 'CONFIRMED' && (
            <>
              <button
                onClick={() =>
                  onStatusChange(appointment.id, AppointmentStatus.COMPLETED)
                }
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Mark as Completed
              </button>
              <button
                onClick={() => onCancel(appointment.id)}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Cancel
              </button>
            </>
          )}
          <button
            onClick={() => onEdit(appointment)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
} 