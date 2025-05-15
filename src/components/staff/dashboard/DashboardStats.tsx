interface Stat {
  name: string;
  value: number;
}

interface DashboardStatsProps {
  stats: Stat[];
}

export default function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div>
      <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6"
          >
            <dt className="truncate text-sm font-medium text-gray-500">
              {stat.name}
            </dt>
            <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
} 