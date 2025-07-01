"use client";
import React, { useEffect, useState } from 'react';
import DashboardStats from '@/components/Staff/dashboard/DashboardStats';
import RecentAppointments from '@/components/Staff/dashboard/RecentAppointments';
import { useSession } from 'next-auth/react';

interface Stats {
  totalAppointments: number;
  upcomingAppointments: number;
  totalClients: number;
  completionRate: number;
}

export default function StaffDashboardPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [business, setBusiness] = useState<{ name: string; logo?: string | null } | null>(null);

  useEffect(() => {
    async function fetchDashboardData() {
      if (!session?.user?.businessId) {
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const [statsRes, businessRes] = await Promise.all([
          fetch('/api/business/appointments?limit=1000'), // For stats
          fetch('/api/business/info') // For business name/logo
        ]);

        if (!statsRes.ok) throw new Error('Failed to fetch appointments for stats');
        if (!businessRes.ok) throw new Error('Failed to fetch business info');
        
        const data = await statsRes.json();
        const businessInfo = await businessRes.json();
        if (businessInfo.success) {
          setBusiness(businessInfo.data);
        }
        
        const appointmentsArr = data?.data?.appointments || [];
        
        // Calculate and set stats
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

      } catch (err: any) {
        setError(err.message || 'Unknown error');
        console.error('Dashboard error:', err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchDashboardData();
    
  }, [session]);

  const companyName = business?.name || '';
  const logo = business?.logo;

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8 bg-gray-50 min-h-screen">
      {/* Header Section with Better Responsive Design */}
      <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-6 w-full max-w-4xl mx-auto border border-gray-200">
        {/* Mobile Layout: Stack vertically */}
        <div className="block sm:hidden">
          <div className="flex items-center justify-center gap-3 mb-3">
            {logo && (
              <img src={logo} alt="Logo" className="w-8 h-8 rounded-full object-cover border-2 border-blue-200 flex-shrink-0" />
            )}
            <h1 className="text-lg font-bold text-gray-900 text-center break-words">
              {companyName}
            </h1>
          </div>
          <div className="text-center">
            <span className="text-xl font-bold text-blue-600">Dashboard</span>
          </div>
          <p className="text-gray-700 text-center text-sm font-medium mt-3">
            {`Bem-vindo de volta${session?.user?.name ? ', ' + session.user.name.split(' ')[0] : ''}! Aqui está uma visão geral da sua agenda`}
          </p>
        </div>

        {/* Desktop Layout: Horizontal with flexible sizing */}
        <div className="hidden sm:block">
          <div className="flex items-center justify-center gap-3 mb-2 flex-wrap">
            {logo && (
              <img src={logo} alt="Logo" className="w-10 h-10 rounded-full object-cover border-2 border-blue-200 flex-shrink-0" />
            )}
            <div className="flex items-center gap-2 flex-wrap justify-center">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 text-center break-words max-w-none">
                {companyName}
              </h1>
              <span className="text-2xl md:text-3xl font-bold text-blue-600">Dashboard</span>
            </div>
          </div>
          <p className="text-gray-700 text-center text-base sm:text-lg font-medium">
            {`Bem-vindo de volta${session?.user?.name ? ', ' + session.user.name.split(' ')[0] : ''}! Aqui está uma visão geral da sua agenda`}
          </p>
        </div>
      </div>

      {/* Loading and Error States with Better Visibility */}
      {loading && (
        <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-4xl mx-auto border border-gray-200">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
            <p className="text-gray-800 font-medium text-lg">Carregando painel...</p>
          </div>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 w-full max-w-4xl mx-auto">
          <p className="text-red-800 font-semibold text-center">{error}</p>
        </div>
      )}
      
      {stats && (
        <>
          <div className="w-full mb-6 sm:mb-8 max-w-4xl mx-auto">
            <DashboardStats
              totalAppointments={stats.totalAppointments}
              upcomingAppointments={stats.upcomingAppointments}
              totalClients={stats.totalClients}
              completionRate={stats.completionRate}
            />
          </div>
          <div className="w-full max-w-4xl mx-auto">
            <RecentAppointments />
          </div>
        </>
      )}
    </div>
  );
} 