'use client';

import React, { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';

export default function Header() {
  const { data: session, status } = useSession();
  const [businessName, setBusinessName] = useState<string | null>(null);
  const [ownerName, setOwnerName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!session) return;
    setLoading(true);
    fetch('/api/business')
      .then(res => res.json())
      .then(data => {
        setBusinessName(data.name);
        setOwnerName(data.ownerName);
      })
      .catch(() => {
        setBusinessName('');
        setOwnerName('');
      })
      .finally(() => setLoading(false));
  }, [session]);

  if (status === 'loading' || !session || loading) {
    return null;
  }

  // Show ownerName for business owner, staff name for staff
  let displayName = '';
  if (session.user.role === 'BUSINESS_OWNER') {
    displayName = ownerName || session.user.name || '';
  } else {
    displayName = session.user.name || '';
  }

  return (
    <header className="fixed top-0 left-0 w-full bg-white border-b border-gray-200 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        {/* Business Name */}
        <div className="font-bold text-lg tracking-tight text-pink-600">
          {businessName || '...'}
        </div>
        {/* User Info & Logout */}
        <div className="flex flex-col items-end gap-1 min-w-[120px]">
          <span className="text-xs text-gray-500">Logged in as</span>
          <span className="text-base font-semibold text-gray-800">{displayName}</span>
          <button
            onClick={() => signOut()}
            className="px-3 py-1 rounded bg-pink-100 text-pink-700 hover:bg-pink-200 font-semibold text-xs transition-colors mt-1"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
} 