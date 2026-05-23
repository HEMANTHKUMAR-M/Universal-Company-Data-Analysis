import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { formatNumber } from '../utils/helpers';

interface KPICardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: number;
  trend?: 'up' | 'down';
  bgColor?: string;
  suffix?: string;
}

const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  icon,
  change,
  trend = 'up',
  bgColor = 'from-blue-500 to-blue-600',
  suffix = '',
}) => {
  return (
    <div className={`kpi-card bg-gradient-to-br ${bgColor} relative overflow-hidden group`}>
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -mr-8 -mt-8 w-24 h-24 bg-white opacity-10 rounded-full group-hover:scale-150 transition-transform duration-300"></div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-white text-opacity-90">{title}</h3>
          <div className="text-white text-opacity-80">{icon}</div>
        </div>

        <div className="mb-4">
          <p className="text-3xl font-bold text-white">
            {typeof value === 'number' ? formatNumber(value) : value}
          </p>
          {suffix && <p className="text-sm text-white text-opacity-80 mt-1">{suffix}</p>}
        </div>

        {change !== undefined && (
          <div className="flex items-center gap-2">
            {trend === 'up' ? (
              <TrendingUp size={16} className="text-green-300" />
            ) : (
              <TrendingDown size={16} className="text-red-300" />
            )}
            <span className={`text-sm font-semibold ${trend === 'up' ? 'text-green-300' : 'text-red-300'}`}>
              {Math.abs(change)}% {trend === 'up' ? 'up' : 'down'}
            </span>
            <span className="text-xs text-white text-opacity-70">vs last month</span>
          </div>
        )}
      </div>

      {/* Bottom border */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-50"></div>
    </div>
  );
};

export default KPICard;
