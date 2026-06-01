import React from 'react';
import { Download, FileText } from 'lucide-react';
import { useDataset } from '../context/DataContext';
import Chart from '../components/Chart';
import { downloadCSV, exportPDF } from '../utils/helpers';
import EmptyState from '../components/EmptyState';

const Reports: React.FC = () => {
  const { filteredRecords, cleanedRecords, metrics, chartConfigs, hasData, loading } = useDataset();
  if (!hasData && !loading) return <EmptyState title="Upload your company dataset to generate analytics dashboard" description="Upload a dataset to enable this view" />;

  const kpis = metrics || {
    recordCount: 0,
    dateRange: 'N/A',
    totalRevenue: 0,
    totalProfit: 0,
    totalSales: 0,
    totalQuantity: 0,
    totalExpense: 0,
    uniqueCustomers: 0,
    averageOrderValue: 0,
    profitMargin: 0,
    topProduct: '',
    topRegion: '',
    topCategory: '',
    topDepartment: '',
    topEmployee: '',
    paymentModeBreakdown: {},
  } as any;
  const monthlyData = (chartConfigs || []).find((c) => c.id === 'time-revenue')?.data || [];
  const productData = Object.values((filteredRecords || []).reduce((acc: any, row: any) => {
    const key = row.product || 'Unknown';
    acc[key] = acc[key] || { product: key, sales: 0, profit: 0 };
    acc[key].sales += Number(row.revenue || row.sales || 0);
    acc[key].profit += Number(row.profit || 0);
    return acc;
  }, {})).sort((a:any,b:any)=>b.sales-a.sales);
  const regionalData = Object.values((filteredRecords || []).reduce((acc: any, row: any) => {
    const key = row.region || 'Unknown';
    acc[key] = acc[key] || { region: key, sales: 0 };
    acc[key].sales += Number(row.revenue || row.sales || 0);
    return acc;
  }, {})).sort((a:any,b:any)=>b.sales-a.sales);
  const categoryData = Object.values((filteredRecords || []).reduce((acc: any, row: any) => {
    const key = row.category || 'Unknown';
    acc[key] = acc[key] || { category: key, sales: 0 };
    acc[key].sales += Number(row.revenue || row.sales || 0);
    return acc;
  }, {})).sort((a:any,b:any)=>b.sales-a.sales);

  const filteredOrders = filteredRecords || [];

  // Summarized insights
  const bestRegion = regionalData && regionalData.length ? [...(regionalData as any[])].sort((a:any,b:any)=> b.sales - a.sales)[0] as any : null;
  const topProduct = productData && productData.length ? (productData[0] as any) : null;
  const categoryProfitMap: Record<string, { sales:number; profit:number }> = {};
  filteredOrders.forEach(o => {
    if (!categoryProfitMap[o.category]) categoryProfitMap[o.category] = { sales:0, profit:0 };
    categoryProfitMap[o.category].sales += o.sales;
    categoryProfitMap[o.category].profit += o.profit;
  });
  const mostProfitableCategoryEntry = Object.entries(categoryProfitMap).sort((a,b)=> b[1].profit - a[1].profit)[0];
  const mostProfitableCategory = mostProfitableCategoryEntry ? { category: mostProfitableCategoryEntry[0], ...mostProfitableCategoryEntry[1] } : null;

  // Monthly growth (MoM)
  let monthlyGrowth = 0;
  if (monthlyData.length >= 2) {
    const last = monthlyData[monthlyData.length-1].sales;
    const prev = monthlyData[monthlyData.length-2].sales || 1;
    monthlyGrowth = ((last - prev) / prev) * 100;
  }

  // Customer purchase patterns
  const customerMap: Record<string, { sales:number; orders:number }> = {};
  filteredOrders.forEach(o => {
    const customerKey = o.customer || 'Unknown';
    if (!customerMap[customerKey]) customerMap[customerKey] = { sales:0, orders:0 };
    customerMap[customerKey].sales += o.sales;
    customerMap[customerKey].orders += 1;
  });
  const topCustomers = Object.entries(customerMap)
    .map(([name, stats]) => ({ name, avgOrder: stats.sales / stats.orders, ...stats }))
    .sort((a,b)=> b.sales - a.sales)
    .slice(0,5);

  const handleExportCSV = (data: any[], filename: string) => {
    downloadCSV(data, filename);
  };

  const totalRevenue = kpis.totalRevenue || kpis.totalSales || 0;
  const totalProfit = kpis.totalProfit || 0;
  const profitMargin = kpis.profitMargin || 0;
  const growthPercentage = (kpis as any).growthPercentage || 0;

  return (
    <div className="fade-in">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Reports</h1>
        <p className="text-gray-600 dark:text-gray-400">Download and view detailed business reports</p>
      </div>

      {/* Customer Purchase Patterns */}
      <div className="card mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Customer Purchase Patterns</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded">
            <p className="text-sm text-gray-600 dark:text-gray-400">Top Customers by Sales</p>
            <ul className="mt-2 space-y-2">
              {topCustomers.map(c => (
                <li key={c.name} className="flex justify-between">
                  <span className="font-medium">{c.name}</span>
                  <span className="text-sm text-gray-600">${Math.round(c.sales)} ({c.orders} orders)</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded">
            <p className="text-sm text-gray-600 dark:text-gray-400">Avg Order Value (Top Customers)</p>
            <ul className="mt-2 space-y-2">
              {topCustomers.map(c => (
                <li key={c.name} className="flex justify-between">
                  <span className="font-medium">{c.name}</span>
                  <span className="text-sm text-gray-600">${Math.round(c.avgOrder)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="card mb-6" id="report-content">
        <div className="flex items-center gap-2 mb-4">
          <FileText size={24} className="text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Executive Summary</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</p>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-2">${(totalRevenue / 1000).toFixed(1)}K</p>
          </div>
          <div className="p-4 bg-green-50 dark:bg-green-900 dark:bg-opacity-20 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Profit</p>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">${(totalProfit / 1000).toFixed(1)}K</p>
          </div>
          <div className="p-4 bg-purple-50 dark:bg-purple-900 dark:bg-opacity-20 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">Profit Margin</p>
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400 mt-2">{profitMargin}%</p>
          </div>
          <div className="p-4 bg-orange-50 dark:bg-orange-900 dark:bg-opacity-20 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Orders</p>
            <p className="text-3xl font-bold text-orange-600 dark:text-orange-400 mt-2">{kpis.recordCount}</p>
          </div>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Key Metrics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-gray-600 dark:text-gray-400">Total Customers</p>
              <p className="font-bold text-gray-900 dark:text-white mt-1">{kpis.uniqueCustomers}</p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400">Avg Order Value</p>
              <p className="font-bold text-gray-900 dark:text-white mt-1">${kpis.averageOrderValue}</p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400">YoY Growth</p>
              <p className="font-bold text-gray-900 dark:text-white mt-1">{growthPercentage}%</p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400">Regions</p>
              <p className="font-bold text-gray-900 dark:text-white mt-1">3</p>
            </div>
          </div>
        </div>
        {/* Insights + export */}
        <div className="mt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex gap-4 items-start">
            <div className="p-3 bg-white dark:bg-gray-800 rounded shadow">
              <p className="text-sm text-gray-600 dark:text-gray-400">Best Performing Region</p>
              <p className="font-bold text-lg mt-1">{bestRegion ? `${bestRegion.region} — $${bestRegion.sales}` : '—'}</p>
            </div>
            <div className="p-3 bg-white dark:bg-gray-800 rounded shadow">
              <p className="text-sm text-gray-600 dark:text-gray-400">Top Product</p>
              <p className="font-bold text-lg mt-1">{topProduct ? `${topProduct.product} — $${topProduct.sales}` : '—'}</p>
            </div>
            <div className="p-3 bg-white dark:bg-gray-800 rounded shadow">
              <p className="text-sm text-gray-600 dark:text-gray-400">Most Profitable Category</p>
              <p className="font-bold text-lg mt-1">{mostProfitableCategory ? `${mostProfitableCategory.category} — $${mostProfitableCategory.profit}` : '—'}</p>
            </div>
            <div className="p-3 bg-white dark:bg-gray-800 rounded shadow">
              <p className="text-sm text-gray-600 dark:text-gray-400">Monthly Growth (MoM)</p>
              <p className={`font-bold text-lg mt-1 ${monthlyGrowth>=0 ? 'text-green-600' : 'text-red-600'}`}>{monthlyGrowth.toFixed(1)}%</p>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => handleExportCSV([{ bestRegion: bestRegion?.region || '', topProduct: topProduct?.product || '', mostProfitableCategory: mostProfitableCategory?.category || '', monthlyGrowth: monthlyGrowth.toFixed(2) }], 'executive_summary')} className="btn-secondary flex items-center gap-2">
              <Download size={14} /> Export CSV
            </button>
            <button onClick={() => exportPDF('report-content', 'executive_summary')} className="btn-primary flex items-center gap-2">
              <Download size={14} /> Export PDF
            </button>
          </div>
        </div>
      </div>

      {/* Available Reports */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Sales Report */}
        <div className="card">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Sales Report</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Monthly sales trends and analysis</p>
            </div>
            <FileText size={24} className="text-blue-600" />
          </div>
          <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">Last Updated: Today</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">35 data points</p>
          </div>
          <button
            onClick={() => handleExportCSV(monthlyData, 'sales_report')}
            className="w-full btn-primary flex items-center justify-center gap-2"
          >
            <Download size={16} />
            Download CSV
          </button>
        </div>

        {/* Product Report */}
        <div className="card">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Product Report</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Product performance metrics</p>
            </div>
            <FileText size={24} className="text-green-600" />
          </div>
          <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">Last Updated: Today</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">10 products analyzed</p>
          </div>
          <button
            onClick={() => handleExportCSV(productData, 'product_report')}
            className="w-full btn-primary flex items-center justify-center gap-2"
          >
            <Download size={16} />
            Download CSV
          </button>
        </div>

        {/* Regional Report */}
        <div className="card">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Regional Report</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Geographic performance analysis</p>
            </div>
            <FileText size={24} className="text-purple-600" />
          </div>
          <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">Last Updated: Today</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">3 regions covered</p>
          </div>
          <button
            onClick={() => handleExportCSV(regionalData, 'regional_report')}
            className="w-full btn-primary flex items-center justify-center gap-2"
          >
            <Download size={16} />
            Download CSV
          </button>
        </div>

        {/* Complete Data Report */}
        <div className="card">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Complete Data</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">All transactions and orders</p>
            </div>
            <FileText size={24} className="text-orange-600" />
          </div>
          <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">Last Updated: Today</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{cleanedRecords.length} orders</p>
          </div>
          <button
            onClick={() => handleExportCSV(cleanedRecords, 'complete_data')}
            className="w-full btn-primary flex items-center justify-center gap-2"
          >
            <Download size={16} />
            Download CSV
          </button>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Chart
          data={monthlyData}
          title="Monthly Sales Trend"
          type="line"
          dataKey={['sales']}
          xDataKey="month"
          height={320}
        />

        <Chart
          data={monthlyData}
          title="Profit by Month"
          type="bar"
          dataKey={'profit'}
          xDataKey="month"
          height={320}
        />

        <Chart
          data={regionalData}
          title="Region-wise Sales"
          type="pie"
          dataKey={'sales'}
          xDataKey="region"
          height={320}
        />

        <Chart
          data={categoryData}
          title="Category-wise Revenue"
          type="pie"
          dataKey={'sales'}
          height={320}
        />
      </div>

      {/* Top Products Chart */}
      <div className="grid grid-cols-1 gap-6 mb-6">
        <Chart
          data={productData}
          title="Top-selling Products"
          type="bar"
          dataKey={'sales'}
          xDataKey={'product'}
          height={380}
        />
      </div>

      {/* Recent Orders Table */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Recent Transactions</h2>
        <div className="table-responsive">
          {filteredOrders.length === 0 ? (
            <EmptyState title="No transactions" description="No transactions match the current filters." />
          ) : (
            <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Order ID</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Date</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Customer</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Sales</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Profit</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.slice(-15).reverse().map((order, index) => (
                <tr key={index} className="table-row">
                  <td className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">{order.date || `Record ${index + 1}`}</td>
                  <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-300">{order.customer || 'N/A'}</td>
                  <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-300">{order.product || 'N/A'}</td>
                  <td className="py-3 px-4 text-sm font-semibold text-green-600 dark:text-green-400">${order.sales ?? 0}</td>
                  <td className="py-3 px-4 text-sm font-semibold text-blue-600 dark:text-blue-400">${order.profit ?? 0}</td>
                </tr>
              ))}
            </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;
