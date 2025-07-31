"use client";
import React, { useEffect, useState } from 'react';
import DashboardStats from '@/components/Staff/dashboard/DashboardStats';
import RecentAppointments from '@/components/Staff/dashboard/RecentAppointments';
import { useAuth } from '@/hooks/useAuth';
import { useParams } from 'next/navigation';
import Image from 'next/image';

interface Stats {
  totalAppointments: number;
  upcomingAppointments: number;
  totalClients: number;
  completionRate: number;
}

export default function StaffDashboard() {
  const { user, loading: authLoading } = useAuth();
  const params = useParams();
  const businessSlug = params.businessSlug as string;
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [business, setBusiness] = useState<{ name: string; logo?: string | null } | null>(null);

  useEffect(() => {
    if (authLoading) return;

    if (!user?.businessSlug) {
      setError('Business information not available. Please try logging in again.');
      setLoading(false);
      return;
    }

    fetchDashboardData();
  }, [authLoading, user?.businessSlug]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('📊 Dashboard: Fetching business info and stats for businessSlug:', businessSlug);
      
      // 🚨 CRITICAL FIX: Pass businessSlug as query parameter to ensure correct business data
      const businessInfoUrl = `/api/business/info?businessSlug=${encodeURIComponent(businessSlug)}`;
      
      // Fetch both business info and stats in parallel
      const [businessRes, statsRes] = await Promise.all([
        fetch(businessInfoUrl, {
          credentials: 'include',
          cache: 'no-store'
        }),
        fetch('/api/staff/dashboard/stats', {
          credentials: 'include',
          cache: 'no-store'
        })
      ]);

      console.log('📊 Dashboard: API responses:', {
        businessOk: businessRes.ok,
        statsOk: statsRes.ok,
        businessStatus: businessRes.status,
        statsStatus: statsRes.status
      });

      // Handle business info
      if (businessRes.ok) {
        const businessData = await businessRes.json();
        if (businessData.success) {
          setBusiness(businessData.data);
          console.log('✅ Dashboard: Business info loaded:', businessData.data.name, 'slug:', businessData.data.slug);
        } else {
          console.log('❌ Dashboard: Business info failed:', businessData.error);
          setError('Failed to load business information');
        }
      } else if (businessRes.status === 404) {
        setError('Business not found. Please contact support.');
      } else {
        setError('Failed to connect to server');
      }

      // Handle stats
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        console.log('📊 Dashboard: Stats received:', statsData);
        setStats({
          totalAppointments: statsData.totalAppointments || 0,
          upcomingAppointments: statsData.upcomingAppointments || 0,
          totalClients: statsData.totalClients || 0,
          completionRate: statsData.completionRate || 0,
        });
        console.log('✅ Dashboard: Stats loaded successfully');
      } else {
        console.log('❌ Dashboard: Stats failed:', statsRes.status);
        // Set default stats if API fails
        setStats({
          totalAppointments: 0,
          upcomingAppointments: 0,
          totalClients: 0,
          completionRate: 0,
        });
      }

    } catch (error) {
      console.error('❌ Dashboard: Error fetching data:', error);
      setError('Network error occurred');
      // Set default stats on error
      setStats({
        totalAppointments: 0,
        upcomingAppointments: 0,
        totalClients: 0,
        completionRate: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  // Only use API data, never fallback to potentially hardcoded user.businessName
  const companyName = business?.name || 'Loading...';
  const logo = business?.logo;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8 bg-gray-50 min-h-screen">
      {/* Header Section with Better Responsive Design */}
      <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-6 w-full max-w-4xl mx-auto border border-gray-200">
        {/* Mobile Layout: Stack vertically */}
        <div className="block sm:hidden">
          <div className="flex items-center justify-center gap-3 mb-3">
            {logo ? (
              <Image 
                src={logo} 
                alt="Logo" 
                width={64}
                height={64}
                className="w-16 h-16 rounded-full object-cover border-2 border-blue-200 flex-shrink-0 shadow-md"
                unoptimized={true}
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl border-2 border-blue-200 shadow-md">
                {companyName.charAt(0).toUpperCase()}
              </div>
            )}
            <h1 className="text-lg font-bold text-gray-900 text-center break-words">
              {companyName}
            </h1>
          </div>
          <div className="text-center">
            <span className="text-xl font-bold text-blue-600">Dashboard</span>
          </div>
          <p className="text-gray-700 text-center text-sm font-medium mt-3">
            {`Bem-vindo de volta${user?.name ? ', ' + user.name.split(' ')[0] : ''}! Aqui está uma visão geral da sua agenda`}
          </p>
        </div>

        {/* Desktop Layout: Horizontal with flexible sizing */}
        <div className="hidden sm:block">
          <div className="flex items-center justify-center gap-4 mb-2 flex-wrap">
            {logo ? (
              <Image 
                src={logo} 
                alt="Logo" 
                width={80}
                height={80}
                className="w-20 h-20 rounded-full object-cover border-2 border-blue-200 flex-shrink-0 shadow-md"
                unoptimized={true}
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl border-2 border-blue-200 shadow-md">
                {companyName.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="flex items-center gap-2 flex-wrap justify-center">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 text-center break-words max-w-none">
                {companyName}
              </h1>
              <span className="text-2xl md:text-3xl font-bold text-blue-600">Dashboard</span>
            </div>
          </div>
          <p className="text-gray-700 text-center text-base sm:text-lg font-medium">
            {`Bem-vindo de volta${user?.name ? ', ' + user.name.split(' ')[0] : ''}! Aqui está uma visão geral da sua agenda`}
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
            <RecentAppointments businessSlug={businessSlug} />
          </div>
        </>
      )}
    </div>
  );
} 