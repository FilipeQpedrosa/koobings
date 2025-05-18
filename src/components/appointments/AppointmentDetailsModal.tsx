'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { format, parseISO } from 'date-fns';
import { Clock, User, Calendar, CheckCircle, XCircle } from 'lucide-react';

interface Appointment {
  id: string;
  clientName: string;
  clientEmail: string;
  date: string;
  time: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  notes?: string;
  provider: {
    id: string;
    name: string;
  };
}

interface AppointmentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment;
  onStatusUpdate: (appointmentId: string, status: Appointment['status']) => Promise<void>;
}

export default function AppointmentDetailsModal({
  isOpen,
  onClose,
  appointment,
  onStatusUpdate,
}: AppointmentDetailsModalProps) {
  const getStatusActions = () => {
    switch (appointment.status) {
      case 'PENDING':
        return (
          <>
            <Button
              onClick={() => onStatusUpdate(appointment.id, 'CONFIRMED')}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Confirm
            </Button>
            <Button
              onClick={() => onStatusUpdate(appointment.id, 'CANCELLED')}
              variant="destructive"
            >
              <XCircle className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </>
        );
      case 'CONFIRMED':
        return (
          <>
            <Button
              onClick={() => onStatusUpdate(appointment.id, 'COMPLETED')}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Mark as Completed
            </Button>
            <Button
              onClick={() => onStatusUpdate(appointment.id, 'CANCELLED')}
              variant="destructive"
            >
              <XCircle className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Appointment Details</DialogTitle>
        </DialogHeader>
        
        <div className="mt-4 space-y-6">
          {/* Client Information */}
          <div>
            <h4 className="text-sm font-medium text-gray-500">Client Information</h4>
            <div className="mt-2 flex items-center">
              <User className="h-5 w-5 text-gray-400" />
              <div className="ml-2">
                <p className="text-sm font-medium text-gray-900">{appointment.clientName}</p>
                <p className="text-sm text-gray-500">{appointment.clientEmail}</p>
              </div>
            </div>
          </div>

          {/* Date and Time */}
          <div>
            <h4 className="text-sm font-medium text-gray-500">Date & Time</h4>
            <div className="mt-2 space-y-2">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-gray-400" />
                <span className="ml-2 text-sm text-gray-900">
                  {format(parseISO(appointment.date), 'EEEE, MMMM d, yyyy')}
                </span>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-gray-400" />
                <span className="ml-2 text-sm text-gray-900">{appointment.time}</span>
              </div>
            </div>
          </div>

          {/* Provider */}
          <div>
            <h4 className="text-sm font-medium text-gray-500">Provider</h4>
            <p className="mt-2 text-sm text-gray-900">{appointment.provider.name}</p>
          </div>

          {/* Notes */}
          {appointment.notes && (
            <div>
              <h4 className="text-sm font-medium text-gray-500">Notes</h4>
              <p className="mt-2 text-sm text-gray-900">{appointment.notes}</p>
            </div>
          )}

          {/* Status Actions */}
          <div className="flex justify-end space-x-3">
            {getStatusActions()}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 