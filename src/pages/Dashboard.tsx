import React from 'react';
import { DollarSign, TrendingUp, ShoppingCart, Users, BarChart3, Zap } from 'lucide-react';
import KPICard from '../components/KPICard';
import Chart from '../components/Chart';
import FilterBar from '../components/FilterBar';
import { useDataset } from '../context/DataContext';
import { formatCurrency, formatPercentage } from '../utils/helpers';
import EmptyState from '../components/EmptyState';

const Dashboard: React.FC = () => {
  const { metrics, chartConfigs, hasData, loading } = useDataset();

  if (!hasData && !loading) {
    return <EmptyState title="Upload your company dataset to generate analytics dashboard" description="Upload a dataset to enable this dashboard" />;
  }

  const kpis = metrics || {
    recordCount: 0,
    dateRange: 'N/A',
    totalRevenue: 0,
    totalProfit: 0,
    totalSales: 0,
    totalQuantity: 0,
    uniqueCustomers: 0,
    averageOrderValue: 0,
    profitMargin: 0,
    topRegion: '',
  };

  const monthlyData = (chartConfigs || []).find((c) => c.id === 'time-revenue')?.data || [];
  const regionalData = (chartConfigs || []).find((c) => c.id === 'region-sales')?.data || [];
  const categoryData = (chartConfigs || []).find((c) => c.id === 'category-sales')?.data || [];

  return (
    <div className="fade-in">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Dashboard Overview</h1>
        <p className="text-gray-600 dark:text-gray-400">Welcome to your Business Intelligence Dashboard</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <KPICard
          title="Total Revenue"
          value={formatCurrency(kpis.totalRevenue || kpis.totalSales || 0)}
          icon={<DollarSign size={24} />}
          bgColor="from-blue-500 to-blue-600"
        />
        <KPICard
          title="Total Profit"
          value={formatCurrency(kpis.totalProfit || 0)}
          icon={<TrendingUp size={24} />}
          bgColor="from-green-500 to-green-600"
        />
        <KPICard
          title="Total Orders"
          value={kpis.recordCount || 0}
          icon={<ShoppingCart size={24} />}
          bgColor="from-purple-500 to-purple-600"
        />
        <KPICard
          title="Total Customers"
          value={kpis.uniqueCustomers || 0}
          icon={<Users size={24} />}
          bgColor="from-orange-500 to-orange-600"
        />
        <KPICard
          title="Avg Order Value"
          value={formatCurrency(kpis.averageOrderValue || 0)}
          icon={<BarChart3 size={24} />}
          bgColor="from-pink-500 to-pink-600"
        />
        <KPICard
          title="Profit Margin"
          value={formatPercentage(kpis.profitMargin || 0)}
          icon={<Zap size={24} />}
          bgColor="from-cyan-500 to-cyan-600"
        />
      </div>

      {/* Filters */}
      <FilterBar />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Chart
          data={monthlyData}
          title="Monthly Sales & Profit Trend"
          description="Track revenue and profit performance over time with a smooth trend line."
          type="line"
          dataKey={['sales', 'profit']}
          xDataKey="month"
          height={350}
        />
        <Chart
          data={monthlyData}
          title="Profit vs Sales"
          description="Compare profit and sales for each month to spot margin shifts and top-performing periods."
          type="bar"
          dataKey={['profit', 'sales']}
          xDataKey="month"
          height={350}
          highlightExtremes
        />
      </div>

      {/* Bottom Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Chart
          data={regionalData}
          title="Regional Sales Breakdown"
          description="See where your revenue is concentrated across regions."
          type="bar"
          dataKey="sales"
          xDataKey="region"
          height={320}
          highlightExtremes
        />
        <Chart
          data={categoryData}
          title="Category Revenue Share"
          description="Visualize category contributions to total revenue in percentage share."
          type="pie"
          dataKey="sales"
          height={320}
          isDonut
        />
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        <div className="card text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Avg Sales/Month</p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {formatCurrency(Math.round((kpis.totalRevenue || kpis.totalSales || 0) / 12))}
          </p>
        </div>
        <div className="card text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Avg Profit/Month</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {formatCurrency(Math.round((kpis.totalProfit || 0) / 12))}
          </p>
        </div>
        <div className="card text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Total Regions</p>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{kpis.topRegion ? 1 : 0}</p>
        </div>
        <div className="card text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Top Region</p>
          <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{kpis.topRegion || '—'}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
