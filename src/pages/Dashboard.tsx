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

  const revenue = kpis.totalRevenue || kpis.totalSales || 0;
  const averageRevenuePerOrder = kpis.recordCount > 0 ? revenue / kpis.recordCount : 0;
  const monthlyAverage = revenue / 12;
  const monthlyData = (chartConfigs || []).find((c) => c.id === 'time-revenue')?.data || [];
  const regionalData = (chartConfigs || []).find((c) => c.id === 'region-sales')?.data || [];
  const categoryData = (chartConfigs || []).find((c) => c.id === 'category-sales')?.data || [];

  return (
    <div className="fade-in space-y-6 px-4 py-6 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950 min-h-screen">
      <section className="rounded-[28px] border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-slate-900 via-slate-700 to-indigo-700 text-white shadow-2xl shadow-slate-600/10 overflow-hidden">
        <div className="relative overflow-hidden px-6 py-8 sm:px-10 sm:py-10">
          <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.25),_transparent_38%)]" />
          <div className="relative z-10 grid gap-6 lg:grid-cols-[1.7fr_1fr] items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-200/80">Executive snapshot</p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">Modern analytics dashboard</h1>
              <p className="mt-4 max-w-2xl text-slate-200/80 text-base sm:text-lg">A clean, high-contrast layout with standardized business colors for measurable insights, active trends, and operational performance.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-white/10 border border-white/10 p-5 backdrop-blur-sm">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-200/75">Revenue</p>
                <p className="mt-3 text-2xl font-semibold">{formatCurrency(revenue)}</p>
                <p className="mt-2 text-sm text-slate-200/70">Total revenue for the selected period</p>
              </div>
              <div className="rounded-3xl bg-white/10 border border-white/10 p-5 backdrop-blur-sm">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-200/75">Profit margin</p>
                <p className="mt-3 text-2xl font-semibold">{formatPercentage(kpis.profitMargin)}</p>
                <p className="mt-2 text-sm text-slate-200/70">Current net profitability</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <KPICard
          title="Total Revenue"
          value={formatCurrency(revenue)}
          icon={<DollarSign size={24} />}
          bgColor="from-sky-500 to-blue-600"
        />
        <KPICard
          title="Total Profit"
          value={formatCurrency(kpis.totalProfit || 0)}
          icon={<TrendingUp size={24} />}
          bgColor="from-emerald-500 to-teal-600"
        />
        <KPICard
          title="Total Orders"
          value={kpis.recordCount || 0}
          icon={<ShoppingCart size={24} />}
          bgColor="from-violet-500 to-indigo-600"
        />
        <KPICard
          title="Total Customers"
          value={kpis.uniqueCustomers || 0}
          icon={<Users size={24} />}
          bgColor="from-orange-500 to-amber-500"
        />
        <KPICard
          title="Avg Order Value"
          value={formatCurrency(averageRevenuePerOrder)}
          icon={<BarChart3 size={24} />}
          bgColor="from-fuchsia-500 to-pink-600"
        />
        <KPICard
          title="Profit Margin"
          value={formatPercentage(kpis.profitMargin || 0)}
          icon={<Zap size={24} />}
          bgColor="from-cyan-500 to-sky-600"
        />
      </section>

      <section className="rounded-[28px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <div className="p-6 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Insight filters</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Refine your dashboard data with quick filters and time range controls.</p>
            </div>
            <div className="inline-flex flex-wrap items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
              <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1">Standard palette</span>
              <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1">Business-grade</span>
              <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1">Live data</span>
            </div>
          </div>
          <div className="mt-6">
            <FilterBar />
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Chart
          data={monthlyData}
          title="Monthly Sales & Profit Trend"
          description="Track revenue and profit performance over time with an easy-to-read trend line."
          type="line"
          dataKey={['sales', 'profit']}
          xDataKey="month"
          height={360}
        />
        <Chart
          data={monthlyData}
          title="Profit vs Sales"
          description="Compare profit and sales side-by-side to see where margins are strongest."
          type="bar"
          dataKey={['profit', 'sales']}
          xDataKey="month"
          height={360}
          highlightExtremes
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Chart
          data={regionalData}
          title="Regional Sales Breakdown"
          description="See where your revenue is concentrated and which regions are improving fastest."
          type="bar"
          dataKey="sales"
          xDataKey="region"
          height={340}
          highlightExtremes
        />
        <Chart
          data={categoryData}
          title="Category Revenue Share"
          description="Visualize top-selling segments with a clean donut chart."
          type="pie"
          dataKey="sales"
          height={340}
          isDonut
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-4">
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Average</p>
          <p className="mt-4 text-3xl font-semibold text-slate-900 dark:text-white">{formatCurrency(Math.round(monthlyAverage))}</p>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Projected monthly revenue</p>
        </div>
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Profit</p>
          <p className="mt-4 text-3xl font-semibold text-emerald-600 dark:text-emerald-400">{formatCurrency(Math.round((kpis.totalProfit || 0) / 12))}</p>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Average monthly profitability</p>
        </div>
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Regions</p>
          <p className="mt-4 text-3xl font-semibold text-violet-600 dark:text-violet-400">{kpis.topRegion ? 1 : 0}</p>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Identified by your dataset</p>
        </div>
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Top Region</p>
          <p className="mt-4 text-3xl font-semibold text-orange-600 dark:text-orange-400">{kpis.topRegion || '–'}</p>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Highest-performing area</p>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
