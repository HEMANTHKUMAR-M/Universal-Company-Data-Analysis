import React from 'react';
import { TrendingUp } from 'lucide-react';
import KPICard from '../components/KPICard';
import Chart from '../components/Chart';
import FilterBar from '../components/FilterBar';
import { ordersData, getMonthlyData } from '../data/sampleData';

const ProfitAnalytics: React.FC = () => {
  const monthlyData = getMonthlyData();
  const totalProfit = ordersData.reduce((sum, order) => sum + order.profit, 0);
  const avgProfit = Math.round(totalProfit / ordersData.length);
  const totalSales = ordersData.reduce((sum, order) => sum + order.sales, 0);
  const profitMargin = ((totalProfit / totalSales) * 100).toFixed(2);

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
          value={`$${(totalProfit / 1000).toFixed(1)}K`}
          icon={<TrendingUp size={24} />}
          bgColor="from-green-500 to-green-600"
          change={25}
          trend="up"
        />
        <KPICard
          title="Average Profit"
          value={`$${avgProfit}`}
          icon={<TrendingUp size={24} />}
          bgColor="from-blue-500 to-blue-600"
          change={15}
          trend="up"
        />
        <KPICard
          title="Profit Margin"
          value={`${profitMargin}%`}
          icon={<TrendingUp size={24} />}
          bgColor="from-purple-500 to-purple-600"
        />
        <KPICard
          title="Total Sales"
          value={`$${(totalSales / 1000).toFixed(1)}K`}
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
          type="line"
          dataKey="profit"
          height={350}
        />
        <Chart
          data={monthlyData}
          title="Profit vs Sales Comparison"
          type="bar"
          dataKey={['profit', 'sales']}
          xDataKey="month"
          height={350}
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
