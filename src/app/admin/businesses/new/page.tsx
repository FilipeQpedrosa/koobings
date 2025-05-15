import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import BusinessOnboardingForm from '@/components/admin/BusinessOnboardingForm';

export default async function NewBusinessPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">New Business Registration</h1>
      <BusinessOnboardingForm />
    </div>
  );
} 