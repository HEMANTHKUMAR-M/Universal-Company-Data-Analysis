import React, { useMemo } from 'react';
import { TrendingUp } from 'lucide-react';
import KPICard from '../components/KPICard';
import Chart from '../components/Chart';
import FilterBar from '../components/FilterBar';
import EmptyDataState from '../components/EmptyDataState';
import { useDataset } from '../context/DataContext';

const ProfitAnalytics: React.FC = () => {
  const { filteredRecords, hasData, metrics } = useDataset();

  const monthlyData = useMemo(() => {
    if (!hasData) return [];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const map: Record<string, { month: string; profit: number; sales: number; orders: number }> = {};
    filteredRecords.forEach((record: Record<string, any>) => {
      const dateStr = String(record.date || '');
      if (!dateStr) return;
      const date = new Date(dateStr);
      const m = months[date.getMonth()];
      if (!map[m]) map[m] = { month: m, profit: 0, sales: 0, orders: 0 };
      map[m].profit += Number(record.profit || 0);
      map[m].sales += Number(record.sales || 0);
      map[m].orders += 1;
    });
    return Object.values(map).sort((a, b) => months.indexOf(a.month) - months.indexOf(b.month));
  }, [filteredRecords, hasData]);

  if (!hasData) {
    return (
      <div className="fade-in">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Profit Analytics</h1>
          <p className="text-gray-600 dark:text-gray-400">Comprehensive profit analysis and insights</p>
        </div>
        <EmptyDataState />
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Profit Analytics</h1>
        <p className="text-gray-600 dark:text-gray-400">Comprehensive profit analysis and insights</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <KPICard
          title="Total Profit"
          value={`$${(((metrics?.totalProfit ?? 0) / 1000).toFixed(1))}K`}
          icon={<TrendingUp size={24} />}
          bgColor="from-green-500 to-green-600"
          change={25}
          trend="up"
        />
        <KPICard
          title="Average Profit"
          value={`$${Math.round(((metrics?.totalProfit ?? 0) / Math.max((metrics?.recordCount ?? 1),1)))}`}
          icon={<TrendingUp size={24} />}
          bgColor="from-blue-500 to-blue-600"
          change={15}
          trend="up"
        />
        <KPICard
          title="Profit Margin"
          value={`${metrics?.profitMargin ?? 0}%`}
          icon={<TrendingUp size={24} />}
          bgColor="from-purple-500 to-purple-600"
        />
        <KPICard
          title="Total Sales"
          value={`$${(((metrics?.totalSales ?? 0) / 1000).toFixed(1))}K`}
          icon={<TrendingUp size={24} />}
          bgColor="from-orange-500 to-orange-600"
        />
      </div>

      {/* Filters */}
      <FilterBar />

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Chart
          data={monthlyData}
          title="Monthly Profit Trend"
          description="Smooth area chart showing profit progression across the selected period."
          type="area"
          dataKey="profit"
          xDataKey="month"
          height={350}
        />
        <Chart
          data={monthlyData}
          title="Profit vs Sales"
          description="Compare profit and total sales across each month to identify seasonal performance shifts."
          type="bar"
          dataKey={['profit', 'sales']}
          xDataKey="month"
          height={350}
          highlightExtremes
        />
      </div>

      {/* Profitability Metrics */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Profitability Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-green-50 dark:bg-green-900 dark:bg-opacity-20 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Best Month</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">July</p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">$11.5K profit</p>
          </div>
          <div className="p-4 bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Avg Discount</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">6.1%</p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">Impact on margin</p>
          </div>
          <div className="p-4 bg-purple-50 dark:bg-purple-900 dark:bg-opacity-20 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Total Discount Cost</p>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">$6.2K</p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">Across all orders</p>
          </div>
        </div>
      </div>

      {/* Regional Profit */}
      <div className="card mt-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Regional Profit Distribution</h3>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">North America</span>
              <span className="text-sm font-semibold text-green-600 dark:text-green-400">$13.8K</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '45%' }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Europe</span>
              <span className="text-sm font-semibold text-green-600 dark:text-green-400">$12.6K</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: '41%' }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Asia Pacific</span>
              <span className="text-sm font-semibold text-green-600 dark:text-green-400">$9.6K</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-purple-500 h-2 rounded-full" style={{ width: '31%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfitAnalytics;
