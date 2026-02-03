'use client';

import AdminLayout from '@/components/layout/AdminLayout';
import StatCard from '@/components/ui/StatCard';
import DataTable from '@/components/ui/DataTable';
import { Users, ShoppingCart, Heart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getDashboard } from '@/api/dashboard';

/* ================= TYPES ================= */

interface DateCountDto {
  date: string;
  count: number;
}

interface NameCountDto {
  name: string;
  count: number;
}

interface RecentVisitorDto {
  id: number;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
}

interface DashboardResponse {
  totalVisitors: number;
  todayVisitors: number;
  totalProductInterests: number;
  recentVisitors: RecentVisitorDto[];
  analytics: {
    visitorsPerDay: DateCountDto[];
    topProducts: NameCountDto[];
  };
}

/* ================= PAGE ================= */

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);

  useEffect(() => {
    getDashboard().then(res => setDashboard(res.data));
  }, []);

  const visitorsPerDay = dashboard?.analytics?.visitorsPerDay ?? [];
  const topProducts = dashboard?.analytics?.topProducts ?? [];
  const recentVisitors = dashboard?.recentVisitors ?? [];

  const topProductName = topProducts.length > 0
    ? topProducts[0].name
    : '—';

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome to Tech Expo 2026</p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Visitors"
            value={dashboard?.totalVisitors ?? 0}
            icon={<Users size={24} />}
            color="blue"
          />

          <StatCard
            title="Today's Visitors"
            value={dashboard?.todayVisitors ?? 0}
            icon={<ShoppingCart size={24} />}
            color="orange"
          />

          <StatCard
            title="Total Product Interests"
            value={dashboard?.totalProductInterests ?? 0}
            icon={<Heart size={24} />}
            color="purple"
          />

          <div className="bg-white rounded-lg p-6 border border-gray-200 flex flex-col items-center justify-center text-center">
            <div className="text-orange-400 text-4xl mb-2">⭐</div>
            <p className="text-gray-600 text-sm font-medium mb-2">Top Product</p>
            <p className="text-lg font-bold text-gray-900">
              {topProductName}
            </p>
          </div>
        </div>

        {/* Recent Visitors */}
        <DataTable
          title="Recent Visitors"
          columns={[
            { key: 'name', label: 'Name' },
            { key: 'email', label: 'Email' },
            { key: 'phone', label: 'Phone' },
            {
              key: 'createdAt',
              label: 'Visited At',
              render: (value: any) =>
                new Date(value).toLocaleString(),
            },
          ]}
          data={recentVisitors}
        />
      </div>
    </AdminLayout>
  );
}
