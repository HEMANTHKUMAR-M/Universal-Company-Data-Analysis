import React from 'react';
import { Package, TrendingUp } from 'lucide-react';
import KPICard from '../components/KPICard';
import Chart from '../components/Chart';
import FilterBar from '../components/FilterBar';
import { useDataset } from '../context/DataContext';
import EmptyState from '../components/EmptyState';

const ProductPerformance: React.FC = () => {
  const { filteredRecords, hasData, loading } = useDataset();
  if (!hasData && !loading) return <EmptyState title="Upload your company dataset to generate analytics dashboard" description="Upload a dataset to enable this view" />;

  const productMap: Record<string, { product: string; category: string; sales: number; profit: number; quantity: number }> = {};
  filteredRecords.forEach((row) => {
    const name = String(row.product || 'Unknown');
    const category = String(row.category || 'Other');
    productMap[name] = productMap[name] || { product: name, category, sales: 0, profit: 0, quantity: 0 };
    productMap[name].sales += Number(row.revenue || row.sales || 0);
    productMap[name].profit += Number(row.profit || 0);
    productMap[name].quantity += Number(row.quantity || 0);
  });
  const productData = Object.values(productMap).sort((a, b) => b.sales - a.sales);
  const categoryMap: Record<string, { category: string; sales: number }> = {};
  productData.forEach((product) => {
    categoryMap[product.category] = categoryMap[product.category] || { category: product.category, sales: 0 };
    categoryMap[product.category].sales += product.sales;
  });
  const categoryData = Object.values(categoryMap).sort((a, b) => b.sales - a.sales);
  const topProduct = productData[0] || { product: '—', sales: 0 };
  const avgProductSales = productData.length ? Math.round(productData.reduce((sum, p) => sum + p.sales, 0) / productData.length) : 0;

  return (
    <div className="fade-in">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Product Performance</h1>
        <p className="text-gray-600 dark:text-gray-400">Analyze your product sales and profitability</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <KPICard
          title="Total Products"
          value={productData.length}
          icon={<Package size={24} />}
          bgColor="from-blue-500 to-blue-600"
        />
        <KPICard
          title="Top Product"
          value={topProduct.product}
          icon={<TrendingUp size={24} />}
          bgColor="from-green-500 to-green-600"
          suffix={`$${(topProduct.sales / 1000).toFixed(0)}K`}
        />
        <KPICard
          title="Avg Product Sales"
          value={`$${avgProductSales}`}
          icon={<Package size={24} />}
          bgColor="from-purple-500 to-purple-600"
        />
        <KPICard
          title="Total Units Sold"
          value={productData.reduce((sum, p) => sum + p.quantity, 0)}
          icon={<TrendingUp size={24} />}
          bgColor="from-orange-500 to-orange-600"
        />
      </div>

      {/* Filters */}
      <FilterBar />

      {/* Product Sales Chart */}
      <div className="card mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Product Sales Performance</h3>
        <Chart
          data={productData.slice(0, 12)}
          title="Top Products by Sales"
          description="Compare the highest revenue-generating products in your catalog."
          type="bar"
          dataKey="sales"
          xDataKey="product"
          height={400}
          highlightExtremes
        />
      </div>

      {/* Category Revenue Chart */}
      <div className="card mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Category Revenue Share</h3>
        <Chart
          data={categoryData}
          title="Category Revenue Breakdown"
          description="See which product categories contribute most to revenue."
          type="pie"
          dataKey="sales"
          height={360}
          isDonut
        />
      </div>

      {/* Detailed Product Table */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Product Details</h3>
        <div className="table-responsive">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Product Name</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900 dark:text-white">Sales</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900 dark:text-white">Profit</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900 dark:text-white">Quantity</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900 dark:text-white">Margin</th>
              </tr>
            </thead>
            <tbody>
              {productData.map((product, idx) => {
                const margin = ((product.profit / product.sales) * 100).toFixed(1);
                return (
                  <tr key={idx} className="table-row">
                    <td className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">{product.product}</td>
                    <td className="py-3 px-4 text-sm text-right font-semibold text-green-600 dark:text-green-400">${product.sales.toLocaleString()}</td>
                    <td className="py-3 px-4 text-sm text-right font-semibold text-blue-600 dark:text-blue-400">${product.profit.toLocaleString()}</td>
                    <td className="py-3 px-4 text-sm text-right text-gray-700 dark:text-gray-300">{product.quantity}</td>
                    <td className="py-3 px-4 text-sm text-right font-semibold text-purple-600 dark:text-purple-400">{margin}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Category Performance */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {productData.slice(0, 3).map((p, idx) => (
          <div key={p.product || idx} className="card text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{p.product}</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{Math.max(1, Math.round(p.sales / 1000))} products</p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">${p.sales.toLocaleString()} sales</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductPerformance;
