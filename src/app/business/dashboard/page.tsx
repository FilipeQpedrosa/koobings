import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';
import Link from 'next/link';

const prisma = new PrismaClient();

export default async function BusinessDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  const staff = await prisma.staff.findFirst({
    where: { email: session.user?.email },
    include: {
      business: {
        include: {
          _count: {
            select: {
              staff: true,
              patients: true,
              services: true,
              appointments: true
            }
          }
        }
      }
    }
  });

  if (!staff) {
    redirect('/auth/signin');
  }

  const { business } = staff;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{business.name} Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back, {staff.name}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900">Staff Members</h3>
          <p className="mt-2 text-3xl font-bold text-blue-600">{business._count.staff}</p>
          <Link href="/business/staff" className="mt-4 text-sm text-blue-600 hover:text-blue-800 block">
            View all staff →
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900">Patients</h3>
          <p className="mt-2 text-3xl font-bold text-blue-600">{business._count.patients}</p>
          <Link href="/business/patients" className="mt-4 text-sm text-blue-600 hover:text-blue-800 block">
            View all patients →
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900">Services</h3>
          <p className="mt-2 text-3xl font-bold text-blue-600">{business._count.services}</p>
          <Link href="/business/services" className="mt-4 text-sm text-blue-600 hover:text-blue-800 block">
            Manage services →
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900">Appointments</h3>
          <p className="mt-2 text-3xl font-bold text-blue-600">{business._count.appointments}</p>
          <Link href="/business/appointments" className="mt-4 text-sm text-blue-600 hover:text-blue-800 block">
            View calendar →
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-4">
            <Link
              href="/business/appointments/new"
              className="block w-full text-left px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-md"
            >
              Schedule New Appointment
            </Link>
            <Link
              href="/business/patients/new"
              className="block w-full text-left px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-md"
            >
              Add New Patient
            </Link>
            <Link
              href="/business/staff/new"
              className="block w-full text-left px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-md"
            >
              Add Staff Member
            </Link>
            <Link
              href="/business/services/new"
              className="block w-full text-left px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-md"
            >
              Add New Service
            </Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Business Settings</h3>
          <div className="space-y-4">
            <Link
              href="/business/settings/profile"
              className="block w-full text-left px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-md"
            >
              Business Profile
            </Link>
            <Link
              href="/business/settings/hours"
              className="block w-full text-left px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-md"
            >
              Business Hours
            </Link>
            <Link
              href="/business/settings/notifications"
              className="block w-full text-left px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-md"
            >
              Notification Settings
            </Link>
            <Link
              href="/business/settings/security"
              className="block w-full text-left px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-md"
            >
              Security Settings
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 