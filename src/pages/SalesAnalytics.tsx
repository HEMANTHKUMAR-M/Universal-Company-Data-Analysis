import React, { useMemo } from 'react';
import { TrendingUp, DollarSign } from 'lucide-react';
import KPICard from '../components/KPICard';
import Chart from '../components/Chart';
import FilterBar from '../components/FilterBar';
import EmptyDataState from '../components/EmptyDataState';
import { useDataset } from '../context/DataContext';

const SalesAnalytics: React.FC = () => {
  const { filteredRecords, hasData, metrics } = useDataset();

  const monthlyData = useMemo(() => {
    if (!hasData) return [];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const map: Record<string, { month: string; sales: number; profit: number; orders: number }> = {};
    filteredRecords.forEach((record: Record<string, any>) => {
      const dateStr = String(record.date || '');
      if (!dateStr) return;
      const date = new Date(dateStr);
      const m = months[date.getMonth()];
      if (!map[m]) map[m] = { month: m, sales: 0, profit: 0, orders: 0 };
      map[m].sales += Number(record.sales || 0);
      map[m].profit += Number(record.profit || 0);
      map[m].orders += 1;
    });
    return Object.values(map).sort((a, b) => months.indexOf(a.month) - months.indexOf(b.month));
  }, [filteredRecords, hasData]);

  const productData = useMemo(() => {
    if (!hasData) return [];
    const groups: Record<string, { product: string; sales: number; profit: number; quantity: number }> = {};
    filteredRecords.forEach((record: Record<string, any>) => {
      const product = String(record.product || 'Unknown');
      if (!groups[product]) groups[product] = { product, sales: 0, profit: 0, quantity: 0 };
      groups[product].sales += Number(record.sales || 0);
      groups[product].profit += Number(record.profit || 0);
      groups[product].quantity += Number(record.quantity || 0);
    });
    return Object.values(groups).sort((a, b) => b.sales - a.sales);
  }, [filteredRecords, hasData]);

  if (!hasData) {
    return (
      <div className="fade-in">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Sales Analytics</h1>
          <p className="text-gray-600 dark:text-gray-400">Detailed sales performance analysis</p>
        </div>
        <EmptyDataState />
      </div>
    );
  }

  const topProduct = productData[0];

  return (
    <div className="fade-in">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Sales Analytics</h1>
        <p className="text-gray-600 dark:text-gray-400">Detailed sales performance analysis</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <KPICard
          title="Total Sales"
          value={`$${(((metrics?.totalSales ?? 0) / 1000).toFixed(1))}K`}
          icon={<DollarSign size={24} />}
          bgColor="from-blue-500 to-blue-600"
          change={18}
          trend="up"
        />
        <KPICard
          title="Average Sale"
          value={`$${metrics?.averageOrderValue ?? 0}`}
          icon={<TrendingUp size={24} />}
          bgColor="from-green-500 to-green-600"
          change={12}
          trend="up"
        />
        <KPICard
          title="Total Orders"
          value={String(metrics?.recordCount ?? 0)}
          icon={<DollarSign size={24} />}
          bgColor="from-purple-500 to-purple-600"
        />
        <KPICard
          title="Top Product"
          value={topProduct ? topProduct.product : '—'}
          icon={<TrendingUp size={24} />}
          bgColor="from-orange-500 to-orange-600"
          suffix={`$${(((topProduct?.sales ?? 0) / 1000).toFixed(0))}K`}
        />
      </div>

      {/* Filters */}
      <FilterBar />

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Chart
          data={monthlyData}
          title="Monthly Sales Trend"
          description="Track how sales evolve month over month across all uploaded orders."
          type="line"
          dataKey="sales"
          xDataKey="month"
          height={350}
        />
        <Chart
          data={monthlyData}
          title="Monthly Sales Volume"
          description="A clear look at revenue movement with rounded bars and grid lines for quick comparisons."
          type="bar"
          dataKey="sales"
          xDataKey="month"
          height={350}
          highlightExtremes
        />
      </div>

      {/* Product Sales */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top 10 Products by Sales</h3>
        <Chart
          data={productData.slice(0, 10)}
          title="Top Products by Revenue"
          description="Highlight your strongest products and spot winners in the current dataset."
          type="bar"
          dataKey="sales"
          xDataKey="product"
          height={400}
          highlightExtremes
        />
      </div>

      {/* Sales Table */}
      <div className="card mt-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Sales</h3>
        <div className="table-responsive">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Order ID</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Customer</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Product</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Amount</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Region</th>
              </tr>
            </thead>
            <tbody>
              {(filteredRecords || []).slice(-10).reverse().map((record, idx) => (
                <tr key={idx} className="table-row">
                  <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-300">{String(record.date || `Record ${idx + 1}`)}</td>
                  <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-300">{String(record.customer || 'N/A')}</td>
                  <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-300">{String(record.product || 'N/A')}</td>
                  <td className="py-3 px-4 text-sm font-semibold text-green-600 dark:text-green-400">${Number(record.sales || 0)}</td>
                  <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-300">{String(record.region || 'N/A')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SalesAnalytics;
