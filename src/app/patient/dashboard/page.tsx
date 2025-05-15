import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { PrismaClient, Patient, Appointment, Service, Staff } from '@prisma/client';
import Link from 'next/link';

const prisma = new PrismaClient();

interface AppointmentWithDetails extends Appointment {
  service: Service;
  staff: Staff;
}

interface PatientWithDetails extends Patient {
  appointments: AppointmentWithDetails[];
}

export default async function PatientDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  const patient = await prisma.patient.findFirst({
    where: { email: session.user?.email },
    include: {
      appointments: {
        take: 5,
        orderBy: { startTime: 'desc' },
        include: {
          service: true,
          staff: true
        }
      }
    }
  }) as PatientWithDetails | null;

  if (!patient) {
    redirect('/auth/signin');
  }

  const upcomingAppointments = patient.appointments.filter(
    (appointment) => new Date(appointment.startTime) > new Date()
  );

  const pastAppointments = patient.appointments.filter(
    (appointment) => new Date(appointment.startTime) <= new Date()
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Welcome, {patient.name}</h1>
        <p className="text-gray-600 mt-2">Manage your appointments and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Upcoming Appointments</h2>
            <Link
              href="/patient/appointments/new"
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              Book New →
            </Link>
          </div>
          {upcomingAppointments.length > 0 ? (
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="border-l-4 border-blue-500 pl-4 py-2">
                  <p className="font-medium">{appointment.service.name}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(appointment.startTime).toLocaleDateString()} at{' '}
                    {new Date(appointment.startTime).toLocaleTimeString()}
                  </p>
                  <p className="text-sm text-gray-600">with {appointment.staff.name}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No upcoming appointments</p>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Past Appointments</h2>
            <Link
              href="/patient/appointments"
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              View All →
            </Link>
          </div>
          {pastAppointments.length > 0 ? (
            <div className="space-y-4">
              {pastAppointments.map((appointment) => (
                <div key={appointment.id} className="border-l-4 border-gray-300 pl-4 py-2">
                  <p className="font-medium">{appointment.service.name}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(appointment.startTime).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600">with {appointment.staff.name}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No past appointments</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          href="/patient/profile"
          className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <h3 className="text-lg font-medium text-gray-900">Profile Settings</h3>
          <p className="mt-2 text-gray-600">Update your personal information and preferences</p>
        </Link>

        <Link
          href="/patient/notifications"
          className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <h3 className="text-lg font-medium text-gray-900">Notification Settings</h3>
          <p className="mt-2 text-gray-600">Manage your notification preferences</p>
        </Link>

        <Link
          href="/patient/payment-methods"
          className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <h3 className="text-lg font-medium text-gray-900">Payment Methods</h3>
          <p className="mt-2 text-gray-600">Manage your payment information</p>
        </Link>
      </div>
    </div>
  );
} 