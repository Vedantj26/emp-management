import { ReactNode } from 'react';
import { Card } from '@/components/ui/card';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  color?: 'blue' | 'orange' | 'purple' | 'green';
}

const colorClasses = {
  blue: 'bg-blue-500',
  orange: 'bg-orange-400',
  purple: 'bg-purple-500',
  green: 'bg-green-500',
};

export default function StatCard({ title, value, icon, color = 'blue' }: StatCardProps) {
  return (
    <Card className="p-6">
      <h3 className="text-gray-600 text-sm font-medium mb-4">{title}</h3>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        {icon && (
          <div className={`w-12 h-12 ${colorClasses[color]} rounded-lg flex items-center justify-center text-white`}>
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}
