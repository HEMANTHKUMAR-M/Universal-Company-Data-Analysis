import React from 'react';
import { DollarSign, TrendingUp, ShoppingCart, Users, BarChart3, Zap } from 'lucide-react';
import KPICard from '../components/KPICard';
import Chart from '../components/Chart';
import FilterBar from '../components/FilterBar';
import { calculateKPIs, getMonthlyData, getRegionalData, getCategoryData } from '../data/sampleData';
import { useFilters } from '../context/FilterContext';
import { formatCurrency, formatPercentage } from '../utils/helpers';

const Dashboard: React.FC = () => {
  const { filters } = useFilters();
  const kpis = calculateKPIs(filters);
  const monthlyData = getMonthlyData(filters);
  const regionalData = getRegionalData(filters);
  const categoryData = getCategoryData(filters);

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
          value={`$${(kpis.totalSales / 1000).toFixed(1)}K`}
          icon={<DollarSign size={24} />}
          bgColor="from-blue-500 to-blue-600"
          change={15}
          trend="up"
        />
        <KPICard
          title="Total Profit"
          value={`$${(kpis.totalProfit / 1000).toFixed(1)}K`}
          icon={<TrendingUp size={24} />}
          bgColor="from-green-500 to-green-600"
          change={22}
          trend="up"
        />
        <KPICard
          title="Total Orders"
          value={kpis.totalOrders}
          icon={<ShoppingCart size={24} />}
          bgColor="from-purple-500 to-purple-600"
          change={18}
          trend="up"
        />
        <KPICard
          title="Total Customers"
          value={kpis.totalCustomers}
          icon={<Users size={24} />}
          bgColor="from-orange-500 to-orange-600"
          change={12}
          trend="up"
        />
        <KPICard
          title="Avg Order Value"
          value={formatCurrency(kpis.avgOrderValue)}
          icon={<BarChart3 size={24} />}
          bgColor="from-pink-500 to-pink-600"
        />
        <KPICard
          title="Growth Percentage"
          value={formatPercentage(kpis.growthPercentage)}
          icon={<Zap size={24} />}
          bgColor="from-cyan-500 to-cyan-600"
          suffix="YoY"
        />
      </div>

      {/* Filters */}
      <FilterBar />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Chart
          data={monthlyData}
          title="Monthly Sales Trend"
          type="line"
          dataKey={['sales', 'profit']}
          height={350}
        />
        <Chart
          data={monthlyData}
          title="Profit vs Sales"
          type="bar"
          dataKey={['profit', 'sales']}
          xDataKey="month"
          height={350}
        />
      </div>

      {/* Bottom Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Chart
          data={regionalData}
          title="Regional Performance"
          type="bar"
          dataKey="sales"
          xDataKey="region"
          height={320}
        />
        <Chart
          data={categoryData}
          title="Category-wise Revenue"
          type="pie"
          dataKey="percentage"
          height={320}
        />
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        <div className="card text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Avg Sales/Month</p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            ${Math.round(kpis.totalSales / 7 / 1000)}K
          </p>
        </div>
        <div className="card text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Avg Profit/Month</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            ${Math.round(kpis.totalProfit / 7 / 1000)}K
          </p>
        </div>
        <div className="card text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Total Regions</p>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">3</p>
        </div>
        <div className="card text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Top Region</p>
          <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">North America</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
