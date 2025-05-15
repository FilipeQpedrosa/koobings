'use client';

import { useState } from 'react';
import { 
  Clock, 
  CheckCircle2, 
  XCircle,
  UserCircle,
  CalendarClock,
  Users,
  PlusCircle,
  Bell,
  FileText,
  QrCode,
  Clock4,
  Send
} from 'lucide-react';

// Temporary mock data
const upcomingAppointments = [
  {
    id: 1,
    clientName: 'Sarah Johnson',
    time: '10:00 AM',
    provider: 'Dr. Thompson',
    status: 'waiting',
    type: 'Individual Therapy'
  },
  {
    id: 2,
    clientName: 'Michael Chen',
    time: '11:30 AM',
    provider: 'Dr. Chen',
    status: 'in_session',
    type: 'Follow-up Session'
  },
  {
    id: 3,
    clientName: 'Emma Davis',
    time: '2:00 PM',
    provider: 'Dr. Thompson',
    status: 'scheduled',
    type: 'Initial Consultation'
  }
];

const providers = [
  {
    id: 1,
    name: 'Dr. Thompson',
    status: 'available',
    appointments: 4,
    nextAvailable: '2:00 PM'
  },
  {
    id: 2,
    name: 'Dr. Chen',
    status: 'in_session',
    appointments: 6,
    nextAvailable: '3:30 PM'
  }
];

export default function DashboardPage() {
  const [selectedAppointment, setSelectedAppointment] = useState<number | null>(null);
  const [showQRCode, setShowQRCode] = useState(false);
  const [waitingClients, setWaitingClients] = useState([
    { id: 1, name: 'James Wilson', arrivalTime: '9:45 AM', provider: 'Dr. Thompson', waited: '15 min' },
    { id: 2, name: 'Emily Brown', arrivalTime: '10:05 AM', provider: 'Dr. Chen', waited: '5 min' }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_session':
        return 'bg-green-100 text-green-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getProviderStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'in_session':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const quickActions = [
    {
      icon: PlusCircle,
      label: 'Emergency Slot',
      description: 'Add urgent appointment',
      action: () => console.log('Add emergency slot')
    },
    {
      icon: Bell,
      label: 'Notifications',
      description: 'Send mass updates',
      action: () => console.log('Send notifications')
    },
    {
      icon: FileText,
      label: 'Daily Report',
      description: 'Generate summary',
      action: () => console.log('Generate report')
    },
    {
      icon: QrCode,
      label: 'Check-in QR',
      description: 'Show check-in code',
      action: () => setShowQRCode(true)
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="text-sm font-medium text-gray-500">Today's Appointments</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">24</p>
          <p className="mt-2 text-sm text-gray-500">4 waiting</p>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="text-sm font-medium text-gray-500">Active Clients</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">156</p>
          <p className="mt-2 text-sm text-gray-500">+12 this month</p>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="text-sm font-medium text-gray-500">Available Staff</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">8</p>
          <p className="mt-2 text-sm text-gray-500">Out of 10</p>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="text-sm font-medium text-gray-500">Completion Rate</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">98%</p>
          <p className="mt-2 text-sm text-gray-500">Last 30 days</p>
        </div>
      </div>

      {/* Quick Actions Panel */}
      <div className="rounded-lg bg-white shadow">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
        </div>
        <div className="grid grid-cols-2 gap-4 p-6 sm:grid-cols-4">
          {quickActions.map((action) => (
            <button
              key={action.label}
              onClick={action.action}
              className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 p-4 hover:border-gray-300 hover:bg-gray-50"
            >
              <action.icon className="h-8 w-8 text-gray-400" />
              <span className="mt-2 font-medium text-gray-900">{action.label}</span>
              <span className="mt-1 text-sm text-gray-500">{action.description}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Upcoming Appointments - Make it span 2 columns */}
        <div className="lg:col-span-2">
          <div className="rounded-lg bg-white shadow">
            <div className="border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CalendarClock className="h-5 w-5 text-gray-400" />
                  <h2 className="ml-2 text-lg font-medium text-gray-900">Upcoming Appointments</h2>
                </div>
                <button className="rounded-md bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100">
                  View All
                </button>
              </div>
            </div>

            <div className="divide-y divide-gray-200">
              {upcomingAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className={`cursor-pointer px-6 py-4 transition hover:bg-gray-50 ${
                    selectedAppointment === appointment.id ? 'bg-gray-50' : ''
                  }`}
                  onClick={() => setSelectedAppointment(appointment.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <UserCircle className="h-8 w-8 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{appointment.clientName}</p>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-500">{appointment.time}</span>
                          <span className="text-gray-300">•</span>
                          <span className="text-sm text-gray-500">{appointment.provider}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(appointment.status)}`}>
                        {appointment.status.replace('_', ' ')}
                      </span>
                      {selectedAppointment === appointment.id && (
                        <div className="flex space-x-1">
                          <button className="rounded p-1 hover:bg-green-100" title="Check-in">
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                          </button>
                          <button className="rounded p-1 hover:bg-red-100" title="Cancel">
                            <XCircle className="h-5 w-5 text-red-600" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  {selectedAppointment === appointment.id && (
                    <div className="mt-2 rounded-md bg-gray-50 p-3">
                      <p className="text-sm text-gray-600">{appointment.type}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Waiting Room Panel */}
        <div className="rounded-lg bg-white shadow">
          <div className="border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Clock4 className="h-5 w-5 text-gray-400" />
                <h2 className="ml-2 text-lg font-medium text-gray-900">Waiting Room</h2>
              </div>
              <span className="rounded-full bg-yellow-100 px-2.5 py-0.5 text-sm font-medium text-yellow-800">
                {waitingClients.length} waiting
              </span>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {waitingClients.map((client) => (
              <div key={client.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <UserCircle className="h-8 w-8 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{client.name}</p>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">Arrived: {client.arrivalTime}</span>
                        <span className="text-gray-300">•</span>
                        <span className="text-sm text-gray-500">{client.provider}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">Waited: {client.waited}</span>
                    <button 
                      className="rounded-full bg-green-50 p-1 hover:bg-green-100"
                      onClick={() => console.log('Notify client')}
                    >
                      <Send className="h-4 w-4 text-green-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* QR Code Modal */}
      {showQRCode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-75">
          <div className="rounded-lg bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Client Check-in QR Code</h3>
              <button
                onClick={() => setShowQRCode(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            <div className="flex h-64 w-64 items-center justify-center rounded bg-gray-100">
              <QrCode className="h-32 w-32 text-gray-400" />
            </div>
            <p className="mt-4 text-center text-sm text-gray-500">
              Scan this code with the client app to check in
            </p>
          </div>
        </div>
      )}
    </div>
  );
} 