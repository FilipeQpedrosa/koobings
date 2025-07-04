'use client';

import React from 'react';
import { useSession, signOut } from 'next-auth/react';

export default function Header() {
  const { data: session, status } = useSession();

  if (status === 'loading' || !session) {
    return null;
  }

  // Use business name from session for both staff and business owner
  let businessName = '';
  let displayName = '';
  if (session.user.role === 'BUSINESS_OWNER') {
    businessName = session.user.name || '';
    displayName = session.user.name || '';
  } else if (session.user.role === 'STAFF') {
    businessName = session.user.businessId ? 'Business' : '';
    displayName = session.user.name || '';
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