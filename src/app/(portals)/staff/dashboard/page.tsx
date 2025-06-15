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
    async function fetchStatsAndAppointments() {
      setLoading(true);
      setError(null);
      try {
        const businessName = session?.user?.businessId;
        const res = await fetch('/api/business/appointments');
        if (!res.ok) throw new Error('Failed to fetch appointments');
        const data = await res.json();
        const apiData = data.data;
        // Debug log for raw API data
        console.log('API /api/business/appointments response:', data);
        setAppointments(
          (apiData.appointments || []).map((apt: any) => ({
            id: apt.id,
            clientName: apt.client?.name || '',
            serviceName: apt.services?.[0]?.name || '',
            dateTime: apt.scheduledFor,
            status: apt.status,
            duration: apt.services?.[0]?.duration || 0,
          }))
        );
        setBusiness({ name: apiData.businessName, logo: apiData.businessLogo });

        // Calculate and set stats
        const appointmentsArr = apiData.appointments || [];
        const now = new Date();
        const upcomingAppointments = appointmentsArr.filter(
          (apt: any) => new Date(apt.scheduledFor) > now
        ).length;
        const totalAppointments = appointmentsArr.length;
        const totalClients = new Set(appointmentsArr.map((apt: any) => apt.client?.id)).size;
        const completed = appointmentsArr.filter((apt: any) => apt.status === 'COMPLETED').length;
        const completionRate = totalAppointments > 0 ? Math.round((completed / totalAppointments) * 100) : 0;
        setStats({
          totalAppointments,
          upcomingAppointments,
          totalClients,
          completionRate,
        });
        // Debug logs for stats and appointments
        console.log('Stats:', {
          totalAppointments,
          upcomingAppointments,
          totalClients,
          completionRate,
        });
        console.log('Appointments (mapped):', (apiData.appointments || []).map((apt: any) => ({
          id: apt.id,
          clientName: apt.client?.name || '',
          serviceName: apt.services?.[0]?.name || '',
          dateTime: apt.scheduledFor,
          status: apt.status,
          duration: apt.services?.[0]?.duration || 0,
        })));
      } catch (err: any) {
        setError(err.message || 'Unknown error');
        console.error('Dashboard error:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchStatsAndAppointments();
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