'use client';

import { CalendarCheck, Clock, Users } from 'lucide-react';

interface Stat {
  name: string;
  value: number;
}

interface DashboardStatsProps {
  stats: Stat[];
}

const DashboardStats = ({ stats }: DashboardStatsProps) => {
  return (
    <div>
      <h3 className="text-base font-semibold leading-6 text-gray-900">Last 30 days</h3>
      <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((item) => {
          const Icon = item.name.includes('Today') ? Clock :
                      item.name.includes('Completed') ? CalendarCheck : Users;
          return (
            <div
              key={item.name}
              className="relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow sm:px-6 sm:pt-6"
            >
              <dt>
                <div className="absolute rounded-md bg-primary p-3">
                  <Icon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <p className="ml-16 truncate text-sm font-medium text-gray-500">{item.name}</p>
              </dt>
              <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
                <p className="text-2xl font-semibold text-gray-900">{item.value}</p>
              </dd>
            </div>
          );
        })}
      </dl>
    </div>
  );
};

export default DashboardStats; 