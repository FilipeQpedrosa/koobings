"use client";
import React, { useEffect, useState } from 'react';
import DashboardStats from '@/components/Staff/dashboard/DashboardStats';
import RecentAppointments from '@/components/Staff/dashboard/RecentAppointments';
import type { AppointmentStatus } from '@prisma/client';
import { useSession } from 'next-auth/react';

interface Stats {
  totalAppointments: number;
  upcomingAppointments: number;
  totalClients: number;
  completionRate: number;
}

interface Appointment {
  id: string;
  clientName: string;
  serviceName: string;
  dateTime: string;
  status: string;
  duration: number;
}

export default function StaffDashboardPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<Stats | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [business, setBusiness] = useState<{ name: string; logo?: string | null } | null>(null);

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/staff/dashboard');
        if (!res.ok) throw new Error('Failed to fetch dashboard data');
        const data = await res.json();
        setStats(data.stats);
        setAppointments(
          (data.appointments || []).map((apt: any) => ({
            ...apt,
            dateTime: new Date(apt.dateTime),
          }))
        );
      } catch (err: any) {
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  useEffect(() => {
    async function fetchBusiness() {
      if (!session?.user?.businessId) return;
      const res = await fetch('/api/business');
      if (!res.ok) return;
      const data = await res.json();
      setBusiness({ name: data.name, logo: data.logo });
    }
    fetchBusiness();
  }, [session]);

  const companyName = business?.name || '';
  const logo = business?.logo;
  const maxLen = 18;
  const isLong = companyName.length > maxLen;
  const displayName = isLong ? companyName.slice(0, maxLen - 3) + '...' : companyName;

  return (
    <div className="max-w-6xl mx-auto px-2 sm:px-4 md:px-8 py-4 sm:py-8 overflow-x-hidden w-full flex flex-col items-center">
      <div className="flex items-center gap-3 mb-1 w-full justify-center">
        {logo && (
          <img src={logo} alt="Logo" className="w-8 h-8 rounded-full object-cover" />
        )}
        <span
          className="text-2xl sm:text-3xl font-bold truncate max-w-xs"
          style={{ maxWidth: 220 }}
          title={isLong ? companyName : undefined}
        >
          {displayName}
        </span>
        <span className="text-2xl sm:text-3xl font-bold ml-2">Dashboard</span>
      </div>
      <p className="text-muted-foreground mb-6 sm:mb-8 text-sm sm:text-base">
        {`Welcome back${session?.user?.name ? ', ' + session.user.name.split(' ')[0] : ''}! Here's an overview of your schedule`}
      </p>
      {loading && <p>Loading dashboard...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {stats && (
        <>
          <div className="w-full mb-6 sm:mb-8">
            <DashboardStats
              totalAppointments={stats.totalAppointments}
              upcomingAppointments={stats.upcomingAppointments}
              totalClients={stats.totalClients}
              completionRate={stats.completionRate}
            />
          </div>
          <div className="w-full">
            <RecentAppointments appointments={appointments
              .filter(a => ['PENDING', 'COMPLETED', 'CANCELLED'].includes(a.status))
              .map(a => ({ ...a, dateTime: new Date(a.dateTime), status: a.status as 'PENDING' | 'COMPLETED' | 'CANCELLED' }))
            } />
          </div>
        </>
      )}
    </div>
  );
} 