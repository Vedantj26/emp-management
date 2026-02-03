'use client';

import AdminLayout from '@/components/layout/AdminLayout';
import StatCard from '@/components/ui/StatCard';
import DataTable from '@/components/ui/DataTable';
import { Users, ShoppingCart, Heart, Star } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

const recentVisitors = [
  {
    id: 1,
    name: 'Rahul Sharma',
    email: 'rahul.sharma@gmail.com',
    phone: '988-5567',
    time: '12:08 PM',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rahul',
  },
  {
    id: 2,
    name: 'Neha Verma',
    email: 'resha.verma@acm.com',
    phone: '666-1234',
    time: '11:47 AM',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=neha',
  },
  {
    id: 3,
    name: 'John Doe',
    email: 'john.doe@email.com',
    phone: '445-2322',
    time: '10:35 AM',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
  },
  {
    id: 4,
    name: 'Amit Gupta',
    email: 'amit.gupta@corp.com',
    phone: '123-1101',
    time: '10:04 AM',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=amit',
  },
];

const productInterests = [
  { id: 1, product: '4K TV', interestedCount: 45 },
  { id: 2, product: 'Wireless Earbuds', interestedCount: 32 },
  { id: 3, product: 'Laptop', interestedCount: 27 },
];

export default function DashboardPage() {
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
            value="350"
            icon={<Users size={24} />}
            color="blue"
          />
          <StatCard
            title="Today's Visitors"
            value="28"
            icon={<ShoppingCart size={24} />}
            color="orange"
          />
          <StatCard
            title="Total Product Interests"
            value="125"
            icon={<Heart size={24} />}
            color="purple"
          />
          <div className="bg-white rounded-lg p-6 border border-gray-200 flex flex-col items-center justify-center text-center">
            <div className="text-orange-400 text-4xl mb-2">⭐</div>
            <p className="text-gray-600 text-sm font-medium mb-2">Top Product</p>
            <p className="text-lg font-bold text-gray-900">New Smartphone</p>
          </div>
        </div>

        {/* Recent Visitors */}
        <DataTable
          title="Recent Visitors"
          columns={[
            {
              key: 'name',
              label: 'Name',
              render: (_, row: any) => (
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={row.avatar || "/placeholder.svg"} alt={row.name} />
                    <AvatarFallback>{row.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium text-gray-900">{row.name}</span>
                </div>
              ),
            },
            { key: 'email', label: 'Email' },
            { key: 'phone', label: 'Phone' },
            { key: 'time', label: 'Time' },
            {
              key: 'id',
              label: 'Action',
              render: () => (
                <Button variant="link" className="p-0 h-auto text-blue-600">
                  View
                </Button>
              ),
            },
          ]}
          data={recentVisitors}
        />

        {/* Product Interest Summary */}
        <DataTable
          title="Product Interest Summary"
          columns={[
            { key: 'product', label: 'Product' },
            {
              key: 'interestedCount',
              label: 'Interested Count',
              render: (value: any) => (
                <span className="font-semibold text-gray-900">{value}</span>
              ),
            },
          ]}
          data={productInterests}
        />
      </div>
    </AdminLayout>
  );
}
