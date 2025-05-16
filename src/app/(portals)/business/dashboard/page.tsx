import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Business Dashboard | Service Scheduler',
  description: 'Manage your business, services, and staff.',
};

export default function BusinessDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Business Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your business operations, services, and staff members.
        </p>
      </div>

      {/* Add your business dashboard components here */}
    </div>
  );
} 