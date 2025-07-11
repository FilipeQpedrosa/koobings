'use client';

import { useSession } from 'next-auth/react';

export default function SessionDebug() {
  const { data: session, status } = useSession();

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-90 text-white p-4 rounded-lg text-xs max-w-sm z-50">
      <h3 className="font-bold mb-2">🔍 Session Debug</h3>
      <div className="space-y-1">
        <div><strong>Status:</strong> {status}</div>
        <div><strong>Has Session:</strong> {session ? 'Yes' : 'No'}</div>
        {session && (
          <>
            <div><strong>Role:</strong> {session.user?.role}</div>
            <div><strong>Email:</strong> {session.user?.email}</div>
            <div><strong>Business:</strong> {session.user?.businessName}</div>
            <div><strong>Business ID:</strong> {session.user?.businessId}</div>
          </>
        )}
      </div>
    </div>
  );
} 