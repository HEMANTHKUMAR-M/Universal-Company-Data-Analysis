import React from 'react';
import { Users, TrendingUp } from 'lucide-react';
import KPICard from '../components/KPICard';
import Chart from '../components/Chart';
import FilterBar from '../components/FilterBar';
import { ordersData, getCustomerGrowthData } from '../data/sampleData';

const CustomerInsights: React.FC = () => {
  const customerGrowthData = getCustomerGrowthData();
  const uniqueCustomers = new Set(ordersData.map(order => order.customerName)).size;
  const avgOrdersPerCustomer = (ordersData.length / uniqueCustomers).toFixed(1);
  
  const customerRegions = ordersData.reduce((acc, order) => {
    const existing = acc.find(r => r.region === order.region);
    if (existing) {
      existing.count++;
    } else {
      acc.push({ region: order.region, count: 1 });
    }
    return acc;
  }, [] as { region: string; count: number }[]);

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
          change={20}
          trend="up"
        />
        <KPICard
          title="Avg Orders/Customer"
          value={avgOrdersPerCustomer}
          icon={<TrendingUp size={24} />}
          bgColor="from-green-500 to-green-600"
        />
        <KPICard
          title="Customer Growth"
          value="40%"
          icon={<TrendingUp size={24} />}
          bgColor="from-purple-500 to-purple-600"
          change={15}
          trend="up"
        />
        <KPICard
          title="Retention Rate"
          value="85%"
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
          type="line"
          dataKey="customers"
          height={350}
        />
        <Chart
          data={customerGrowthData}
          title="New Customers by Month"
          type="bar"
          dataKey="newCustomers"
          xDataKey="month"
          height={350}
        />
      </div>

      {/* Customer Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Customers by Region</h3>
          <div className="space-y-3">
            {customerRegions.sort((a, b) => b.count - a.count).map((region, idx) => (
              <div key={idx}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{region.region}</span>
                  <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">{region.count} customers</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full" 
                    style={{ width: `${(region.count / uniqueCustomers) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Customers</h3>
          <div className="space-y-2">
            {ordersData
              .reduce((acc, order) => {
                const existing = acc.find(c => c.name === order.customerName);
                if (existing) {
                  existing.orders++;
                  existing.sales += order.sales;
                } else {
                  acc.push({ name: order.customerName, orders: 1, sales: order.sales });
                }
                return acc;
              }, [] as { name: string; orders: number; sales: number }[])
              .sort((a, b) => b.sales - a.sales)
              .slice(0, 8)
              .map((customer, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{customer.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{customer.orders} orders</p>
                  </div>
                  <p className="text-sm font-semibold text-green-600 dark:text-green-400">${customer.sales}</p>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerInsights;
