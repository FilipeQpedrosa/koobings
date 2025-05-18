'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import {
  Building2,
  UserCheck,
  AlertCircle,
  Clock,
} from 'lucide-react';
import { DashboardMetrics } from '@/types/admin';

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchMetrics() {
      try {
        const response = await fetch('/api/admin/metrics');
        const data = await response.json();
        setMetrics(data);
      } catch (error) {
        console.error('Error fetching metrics:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchMetrics();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const stats = [
    {
      name: 'Total Businesses',
      value: metrics?.totalBusinesses || 0,
      icon: Building2,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      name: 'Active Businesses',
      value: metrics?.activeBusinesses || 0,
      icon: UserCheck,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      name: 'Pending Verification',
      value: metrics?.pendingVerification || 0,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      name: 'In Review',
      value: metrics?.inReview || 0,
      icon: AlertCircle,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-gray-500">Welcome to the admin dashboard.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name} className="p-6">
            <div className="flex items-center">
              <div className={`${stat.bgColor} p-3 rounded-lg`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stat.value}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-medium mb-4">Recent Activities</h2>
        <div className="space-y-4">
          {metrics?.recentActivities?.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center justify-between py-3 border-b last:border-0"
            >
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {activity.admin.name}
                </p>
                <p className="text-sm text-gray-500">{activity.action}</p>
              </div>
              <time className="text-sm text-gray-500">
                {new Date(activity.createdAt).toLocaleDateString()}
              </time>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
} 