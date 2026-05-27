import { useMemo } from 'react';
import { Users, TrendingUp } from 'lucide-react';
import KPICard from '../components/KPICard';
import Chart from '../components/Chart';
import FilterBar from '../components/FilterBar';
import EmptyState from '../components/EmptyState';
import { useDataset } from '../context/DataContext';

export default function CustomerInsights() {
  const { filteredRecords, hasData, loading } = useDataset();

  const customerMetrics = useMemo(() => {
    if (!hasData) return null;
    const records = filteredRecords || [];
    const uniqueCustomers = new Set(records.map((r: Record<string, any>) => String(r.customer || ''))).size;
    const avgOrdersPerCustomer = uniqueCustomers > 0 ? records.length / uniqueCustomers : 0;
    const customerRegionsMap: Record<string, number> = {};
    records.forEach((record: Record<string, any>) => {
      const region = String(record.region || 'Unknown');
      customerRegionsMap[region] = (customerRegionsMap[region] || 0) + 1;
    });
    const customerRegions = Object.entries(customerRegionsMap).map(([region, count]) => ({ region, count }));

    const topCustomers = Object.values(
      records.reduce((acc: Record<string, any>, order: Record<string, any>) => {
        const name = String(order.customer || 'Unknown');
        acc[name] = acc[name] || { name, orders: 0, sales: 0 };
        acc[name].orders += 1;
        acc[name].sales += Number(order.revenue || order.sales || 0);
        return acc;
      }, {}),
    )
      .sort((a: any, b: any) => b.sales - a.sales)
      .slice(0, 8);

    return { uniqueCustomers, avgOrdersPerCustomer, customerRegions, topCustomers };
  }, [filteredRecords, hasData]);

  const customerGrowthData = useMemo(() => {
    if (!hasData) return [];
    const firstPurchase: Record<string, Date> = {};
    filteredRecords.forEach((record: Record<string, any>) => {
      const customer = String(record.customer || 'Unknown');
      const dateValue = record.date || record.orderDate || record.transactionDate;
      if (!dateValue) return;
      const date = new Date(String(dateValue));
      if (!customer || Number.isNaN(date.getTime())) return;
      if (!firstPurchase[customer] || date < firstPurchase[customer]) {
        firstPurchase[customer] = date;
      }
    });

    const monthMap: Record<string, { month: string; newCustomers: number; order: number }> = {};
    Object.values(firstPurchase).forEach((date) => {
      const monthLabel = date.toLocaleString('default', { month: 'short' });
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
      if (!monthMap[monthKey]) monthMap[monthKey] = { month: `${monthLabel} ${date.getFullYear()}`, newCustomers: 0, order: date.getTime() };
      monthMap[monthKey].newCustomers += 1;
    });

    return Object.values(monthMap).sort((a, b) => a.order - b.order);
  }, [filteredRecords, hasData]);

  const salesChannelData = useMemo(() => {
    if (!hasData) return [];
    const channelMap: Record<string, { channel: string; sales: number }> = {};
    filteredRecords.forEach((record: Record<string, any>) => {
      const channel = String(record.salesChannel || record.channel || 'Direct');
      const sales = Number(record.revenue || record.sales || 0);
      channelMap[channel] = channelMap[channel] || { channel, sales: 0 };
      channelMap[channel].sales += sales;
    });
    return Object.values(channelMap).sort((a, b) => b.sales - a.sales);
  }, [filteredRecords, hasData]);

  if (!hasData && !loading) {
    return (
      <div className="fade-in">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Customer Insights</h1>
          <p className="text-gray-600 dark:text-gray-400">Customer analysis and behavior</p>
        </div>
        <EmptyState title="Upload your company dataset to generate analytics dashboard" description="Upload a dataset to enable this view" />
      </div>
    );
  }

  const uniqueCustomers = customerMetrics?.uniqueCustomers || 0;
  const avgOrdersPerCustomer = customerMetrics ? Number(customerMetrics.avgOrdersPerCustomer).toFixed(1) : '0';
  const customerRegions = customerMetrics?.customerRegions || [];
  const topCustomers = customerMetrics?.topCustomers || [];

  return (
    <div className="fade-in">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Customer Insights</h1>
        <p className="text-gray-600 dark:text-gray-400">Understand your customer base and behavior</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <KPICard
          title="Total Customers"
          value={uniqueCustomers}
          icon={<Users size={24} />}
          bgColor="from-blue-500 to-blue-600"
        />
        <KPICard
          title="Avg Orders / Customer"
          value={String(avgOrdersPerCustomer)}
          icon={<TrendingUp size={24} />}
          bgColor="from-green-500 to-green-600"
        />
        <KPICard
          title="Customer Growth"
          value={customerGrowthData.reduce((total, item) => total + item.newCustomers, 0)}
          icon={<TrendingUp size={24} />}
          bgColor="from-purple-500 to-purple-600"
        />
        <KPICard
          title="Sales Channels"
          value={salesChannelData.length}
          icon={<Users size={24} />}
          bgColor="from-orange-500 to-orange-600"
        />
      </div>

      {/* Filters */}
      <FilterBar />

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Chart
          data={customerGrowthData}
          title="Customer Growth Over Time"
          description="Track newly acquired customers by period to measure acquisition momentum."
          type="area"
          dataKey="newCustomers"
          xDataKey="month"
          height={360}
          highlightExtremes
        />
        <Chart
          data={salesChannelData}
          title="Sales Channel Revenue Share"
          description="See channel mix and revenue distribution across all active sales channels."
          type="pie"
          dataKey="sales"
          height={360}
          isDonut
        />
      </div>

      {/* Customer Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Customers by Region</h3>
          <div className="space-y-3">
            {customerRegions.sort((a: any, b: any) => b.count - a.count).map((region: any, idx: number) => (
              <div key={idx}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{region.region}</span>
                  <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">{region.count} customers</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${(region.count / Math.max(uniqueCustomers, 1)) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Customers</h3>
          <div className="space-y-2">
            {topCustomers.map((customer: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{customer.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{customer.orders} orders</p>
                </div>
                <p className="text-sm font-semibold text-green-600 dark:text-green-400">${Math.round(customer.sales)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
