import React from 'react';
import { Globe, TrendingUp } from 'lucide-react';
import KPICard from '../components/KPICard';
import Chart from '../components/Chart';
import FilterBar from '../components/FilterBar';
import { ordersData, getRegionalData } from '../data/sampleData';

const RegionalAnalysis: React.FC = () => {
  const regionalData = getRegionalData();
  const topRegion = regionalData[0];

  const regionOrderCounts = ordersData.reduce((acc, order) => {
    const existing = acc.find(r => r.region === order.region);
    if (existing) {
      existing.orders++;
    } else {
      acc.push({ region: order.region, orders: 1 });
    }
    return acc;
  }, [] as { region: string; orders: number }[]);

  return (
    <div className="fade-in">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Regional Analysis</h1>
        <p className="text-gray-600 dark:text-gray-400">Analyze performance across different regions</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <KPICard
          title="Total Regions"
          value={regionalData.length}
          icon={<Globe size={24} />}
          bgColor="from-blue-500 to-blue-600"
        />
        <KPICard
          title="Top Region"
          value={topRegion.region}
          icon={<TrendingUp size={24} />}
          bgColor="from-green-500 to-green-600"
          suffix={`$${(topRegion.sales / 1000).toFixed(0)}K`}
        />
        <KPICard
          title="Avg Regional Sales"
          value={`$${Math.round(regionalData.reduce((sum, r) => sum + r.sales, 0) / regionalData.length / 1000)}K`}
          icon={<Globe size={24} />}
          bgColor="from-purple-500 to-purple-600"
        />
        <KPICard
          title="Regional Growth"
          value="28%"
          icon={<TrendingUp size={24} />}
          bgColor="from-orange-500 to-orange-600"
          change={18}
          trend="up"
        />
      </div>

      {/* Filters */}
      <FilterBar />

      {/* Regional Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Chart
          data={regionalData}
          title="Regional Sales Distribution"
          type="bar"
          dataKey="sales"
          xDataKey="region"
          height={350}
        />
        <Chart
          data={regionalData}
          title="Regional Profit Distribution"
          type="bar"
          dataKey="profit"
          xDataKey="region"
          height={350}
        />
      </div>

      {/* Regional Details Table */}
      <div className="card mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Regional Performance Details</h3>
        <div className="table-responsive">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Region</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900 dark:text-white">Sales</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900 dark:text-white">Profit</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900 dark:text-white">Orders</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900 dark:text-white">Margin</th>
              </tr>
            </thead>
            <tbody>
              {regionalData.map((region, idx) => {
                const regionOrders = regionOrderCounts.find(r => r.region === region.region)?.orders || 0;
                const margin = ((region.profit / region.sales) * 100).toFixed(1);
                return (
                  <tr key={idx} className="table-row">
                    <td className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">{region.region}</td>
                    <td className="py-3 px-4 text-sm text-right font-semibold text-green-600 dark:text-green-400">${region.sales.toLocaleString()}</td>
                    <td className="py-3 px-4 text-sm text-right font-semibold text-blue-600 dark:text-blue-400">${region.profit.toLocaleString()}</td>
                    <td className="py-3 px-4 text-sm text-right text-gray-700 dark:text-gray-300">{regionOrders}</td>
                    <td className="py-3 px-4 text-sm text-right font-semibold text-purple-600 dark:text-purple-400">{margin}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Regional Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {regionalData.map((region, idx) => (
          <div key={idx} className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{region.region}</h3>
              <Globe size={20} className="text-blue-600" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Sales</span>
                <span className="text-sm font-semibold text-green-600 dark:text-green-400">${(region.sales / 1000).toFixed(1)}K</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Profit</span>
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">${(region.profit / 1000).toFixed(1)}K</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Orders</span>
                <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">{region.orders}</span>
              </div>
              <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Market Share</span>
                  <span className="text-sm font-semibold text-orange-600 dark:text-orange-400">
                    {((region.sales / (regionalData.reduce((sum, r) => sum + r.sales, 0))) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RegionalAnalysis;
