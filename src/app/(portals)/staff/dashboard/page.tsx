"use client";
import React, { useEffect, useState } from 'react';
import DashboardStats from '@/components/Staff/dashboard/DashboardStats';
import RecentAppointments from '@/components/Staff/dashboard/RecentAppointments';
import type { AppointmentStatus } from '@prisma/client';

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
  const [stats, setStats] = useState<Stats | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="max-w-6xl mx-auto px-2 sm:px-4 md:px-8 py-4 sm:py-8 overflow-x-hidden w-full flex flex-col items-center">
      <h1 className="text-2xl sm:text-3xl font-bold mb-1">Dashboard</h1>
      <p className="text-muted-foreground mb-6 sm:mb-8 text-sm sm:text-base">Welcome back! Here's an overview of your schedule</p>
      {loading && <p>Loading dashboard...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {stats && (
        <div className="mb-6 sm:mb-8">
          <DashboardStats
            totalAppointments={stats.totalAppointments}
            upcomingAppointments={stats.upcomingAppointments}
            totalClients={stats.totalClients}
            completionRate={stats.completionRate}
          />
        </div>
      )}
      <RecentAppointments appointments={appointments
        .filter(a => ['PENDING', 'COMPLETED', 'CANCELLED'].includes(a.status))
        .map(a => ({ ...a, dateTime: new Date(a.dateTime), status: a.status as 'PENDING' | 'COMPLETED' | 'CANCELLED' }))
      } />
    </div>
  );
} 