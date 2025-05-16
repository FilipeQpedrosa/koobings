import { getServerSession } from 'next-auth';
import { authOptions } from '../../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import StaffCalendar from '@/components/staff/StaffCalendar';

export default async function StaffSchedulePage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'STAFF') {
    redirect('/auth/signin');
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">My Schedule</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your availability and view upcoming appointments.
        </p>
      </div>
      <StaffCalendar staffId={session.user.id} />
    </div>
  );
} 