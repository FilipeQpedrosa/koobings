'use client';

import { Card } from '@/components/ui/card';

export default function SignUpPage() {
  return (
    <div className="container mx-auto flex h-screen items-center justify-center px-4">
      <Card className="w-full max-w-lg p-6 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Create an Account</h1>
          <p className="text-gray-500">Sign up is only available to system administrators. Please contact support.</p>
        </div>
        {/* Registration forms are disabled for now */}
      </Card>
    </div>
  );
} 