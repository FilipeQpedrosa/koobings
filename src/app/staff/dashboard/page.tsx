"use client";
import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import DashboardStats from '@/components/staff/dashboard/DashboardStats';
import RecentAppointments from '@/components/staff/dashboard/RecentAppointments';
import { addDays, startOfDay, endOfDay } from 'date-fns';
import { Appointment, Staff, Client, Service } from '@prisma/client';
import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function StaffDashboardWrapper() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const handleStatusChange = useCallback(() => {
    setRefreshKey(k => k + 1);
    router.refresh();
  }, [router]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const res = await fetch('/api/staff/dashboard');
      const data = await res.json();
      setDashboardData(data);
      setLoading(false);
    }
    fetchData();
  }, [refreshKey]);

  if (loading) return <div>Loading...</div>;
  if (!dashboardData) return <div>Staff not found</div>;

  return <StaffDashboard dashboardData={dashboardData} onStatusChange={handleStatusChange} />;
}

function StaffDashboard({ dashboardData, onStatusChange }: { dashboardData: any, onStatusChange: () => void }) {
  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's an overview of your schedule
          </p>
        </div>

        <DashboardStats {...dashboardData.stats} />
        
        <RecentAppointments appointments={dashboardData.appointments} onStatusChange={onStatusChange} />
      </div>
    </div>
  );
} 