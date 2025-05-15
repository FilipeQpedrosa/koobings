import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { PrismaClient, Business, BusinessType, Prisma } from '@prisma/client';
import Link from 'next/link';

const prisma = new PrismaClient();

type VerificationStatus = 'PENDING' | 'IN_REVIEW' | 'APPROVED' | 'REJECTED';

interface BusinessVerification {
  id: string;
  businessId: string;
  status: VerificationStatus;
  submittedAt: Date;
  verifiedAt: Date | null;
  verifiedBy: string | null;
  documents: Prisma.JsonValue | null;
  notes: string | null;
}

interface BusinessWithDetails extends Business {
  verification: BusinessVerification | null;
  _count: {
    staff: number;
    patients: number;
    services: number;
  };
}

export default async function BusinessListPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  const businesses = await prisma.business.findMany({
    include: {
      verification: true,
      _count: {
        select: {
          staff: true,
          patients: true,
          services: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  }) as unknown as BusinessWithDetails[];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Businesses</h1>
        <Link
          href="/admin/businesses/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          New Business
        </Link>
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Business
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Staff
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Patients
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Services
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {businesses.map((business) => (
              <tr key={business.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {business.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {business.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {business.type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    business.verification?.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                    business.verification?.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                    business.verification?.status === 'IN_REVIEW' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {business.verification?.status || 'PENDING'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {business._count.staff}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {business._count.patients}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {business._count.services}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link
                    href={`/admin/businesses/${business.id}/verify`}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Verify
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 