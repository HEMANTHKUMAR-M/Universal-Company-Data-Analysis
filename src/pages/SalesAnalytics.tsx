import React from 'react';
import { TrendingUp, DollarSign } from 'lucide-react';
import KPICard from '../components/KPICard';
import Chart from '../components/Chart';
import FilterBar from '../components/FilterBar';
import { ordersData, getMonthlyData, getProductData } from '../data/sampleData';

const SalesAnalytics: React.FC = () => {
  const monthlyData = getMonthlyData();
  const productData = getProductData();

  const totalSales = ordersData.reduce((sum, order) => sum + order.sales, 0);
  const avgSales = Math.round(totalSales / ordersData.length);
  const maxSale = Math.max(...ordersData.map(o => o.sales));
  const topProduct = productData[0];

  return (
    <div className="fade-in">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Sales Analytics</h1>
        <p className="text-gray-600 dark:text-gray-400">Detailed sales performance analysis</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <KPICard
          title="Total Sales"
          value={`$${(totalSales / 1000).toFixed(1)}K`}
          icon={<DollarSign size={24} />}
          bgColor="from-blue-500 to-blue-600"
          change={18}
          trend="up"
        />
        <KPICard
          title="Average Sale"
          value={`$${avgSales}`}
          icon={<TrendingUp size={24} />}
          bgColor="from-green-500 to-green-600"
          change={12}
          trend="up"
        />
        <KPICard
          title="Highest Sale"
          value={`$${maxSale}`}
          icon={<DollarSign size={24} />}
          bgColor="from-purple-500 to-purple-600"
        />
        <KPICard
          title="Top Product"
          value={topProduct.product}
          icon={<TrendingUp size={24} />}
          bgColor="from-orange-500 to-orange-600"
          suffix={`$${(topProduct.sales / 1000).toFixed(0)}K`}
        />
      </div>

      {/* Filters */}
      <FilterBar />

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Chart
          data={monthlyData}
          title="Monthly Sales Trend"
          type="line"
          dataKey="sales"
          height={350}
        />
        <Chart
          data={monthlyData}
          title="Sales by Month"
          type="bar"
          dataKey="sales"
          xDataKey="month"
          height={350}
        />
      </div>

      {/* Product Sales */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top 10 Products by Sales</h3>
        <Chart
          data={productData}
          title=""
          type="bar"
          dataKey="sales"
          xDataKey="product"
          height={400}
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
              {ordersData.slice(-10).reverse().map((order) => (
                <tr key={order.orderId} className="table-row">
                  <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-300">{order.orderId}</td>
                  <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-300">{order.customerName}</td>
                  <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-300">{order.product}</td>
                  <td className="py-3 px-4 text-sm font-semibold text-green-600 dark:text-green-400">${order.sales}</td>
                  <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-300">{order.region}</td>
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
