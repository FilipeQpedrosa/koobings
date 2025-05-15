'use client';

import { signOut } from 'next-auth/react';
import Link from 'next/link';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'SUPPORT';
}

interface AdminNavbarProps {
  admin: AdminUser;
}

export default function AdminNavbar({ admin }: AdminNavbarProps) {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/admin/dashboard" className="text-xl font-bold text-gray-800">
                Admin Portal
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <span className="text-gray-600 mr-4">{admin.name}</span>
            <button
              onClick={() => signOut()}
              className="text-gray-600 hover:text-gray-900"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
} 