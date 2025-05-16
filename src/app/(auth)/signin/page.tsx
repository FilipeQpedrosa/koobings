import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { SignInForm } from '@/components/auth/SignInForm';

export const metadata: Metadata = {
  title: 'Sign In | Service Scheduler',
  description: 'Sign in to your account.',
};

export default async function SignInPage() {
  const session = await getServerSession(authOptions);

  if (session?.user) {
    // Redirect based on user role
    if (session.user.role === 'staff') {
      redirect('/staff/dashboard');
    } else if (session.user.role === 'business') {
      redirect('/business/dashboard');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <SignInForm />
      </div>
    </div>
  );
} 