'use client';

import { CalendarDays, Clock, FileText, MessageSquare } from 'lucide-react';

// Mock data - will be replaced with real data from API
const upcomingAppointments = [
  {
    id: 1,
    date: 'March 25, 2024',
    time: '10:00 AM',
    provider: 'Dr. Thompson',
    type: 'Individual Therapy',
    status: 'confirmed'
  },
  {
    id: 2,
    date: 'April 1, 2024',
    time: '2:30 PM',
    provider: 'Dr. Chen',
    type: 'Follow-up Session',
    status: 'pending'
  }
];

const documents = [
  {
    id: 1,
    name: 'Intake Form',
    status: 'pending',
    dueDate: 'March 24, 2024'
  },
  {
    id: 2,
    name: 'Treatment Plan',
    status: 'completed',
    completedDate: 'March 15, 2024'
  }
];

export default function ClientDashboard() {
  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Welcome Back, Sarah</h1>
        <div className="mt-4 sm:mt-0">
          <button className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
            <CalendarDays className="mr-2 h-5 w-5" />
            Book Appointment
          </button>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {/* Upcoming Appointments */}
        <div className="rounded-lg bg-white shadow">
          <div className="border-b border-gray-200 px-4 py-5 sm:px-6">
            <h2 className="text-lg font-medium text-gray-900">Upcoming Appointments</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {upcomingAppointments.map((appointment) => (
              <div key={appointment.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                      <Clock className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{appointment.type}</p>
                      <p className="text-sm text-gray-500">with {appointment.provider}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{appointment.date}</p>
                    <p className="text-sm text-gray-500">{appointment.time}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      appointment.status === 'confirmed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {appointment.status}
                  </span>
                  <button className="text-sm font-medium text-blue-600 hover:text-blue-500">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-200 px-4 py-4 sm:px-6">
            <button className="text-sm font-medium text-blue-600 hover:text-blue-500">
              View all appointments →
            </button>
          </div>
        </div>

        {/* Documents and Messages */}
        <div className="space-y-6">
          {/* Required Documents */}
          <div className="rounded-lg bg-white shadow">
            <div className="border-b border-gray-200 px-4 py-5 sm:px-6">
              <h2 className="text-lg font-medium text-gray-900">Required Documents</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-4 hover:bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                      <FileText className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{doc.name}</p>
                      <p className="text-sm text-gray-500">
                        {doc.status === 'pending' ? `Due: ${doc.dueDate}` : `Completed: ${doc.completedDate}`}
                      </p>
                    </div>
                  </div>
                  <button
                    className={`rounded-md px-3 py-2 text-sm font-medium ${
                      doc.status === 'pending'
                        ? 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                        : 'bg-green-50 text-green-700'
                    }`}
                  >
                    {doc.status === 'pending' ? 'Complete Now' : 'View'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Messages */}
          <div className="rounded-lg bg-white shadow">
            <div className="border-b border-gray-200 px-4 py-5 sm:px-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">Recent Messages</h2>
                <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                  2 new
                </span>
              </div>
            </div>
            <div className="p-4">
              <button className="flex w-full items-center justify-center space-x-2 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                <MessageSquare className="h-5 w-5 text-gray-400" />
                <span>Open Messages</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 