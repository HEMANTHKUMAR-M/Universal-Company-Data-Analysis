import React, { useMemo, useState } from 'react';
import { BarChart3, TrendingUp, AlertCircle, CheckCircle, Download, Filter } from 'lucide-react';
import { ordersData } from '../data/sampleData';
import { 
  generateReport, 
  calculateAdvancedMetrics, 
  generateInsights,
  AdvancedMetrics,
  BusinessInsight 
} from '../utils/dataPipeline';
import { useFilters } from '../context/FilterContext';
import Chart from '../components/Chart';
import { motion } from 'framer-motion';

const InsightsAndReports: React.FC = () => {
  const { filters } = useFilters();
  const [selectedInsight, setSelectedInsight] = useState<BusinessInsight | null>(null);

  // Apply filters and generate metrics
  const filteredData = useMemo(() => {
    let data = [...ordersData];
    if (filters?.dateRange?.start) {
      data = data.filter(o => o.date >= filters.dateRange.start!);
    }
    if (filters?.dateRange?.end) {
      data = data.filter(o => o.date <= filters.dateRange.end!);
    }
    if (filters?.region && filters.region !== 'all') {
      data = data.filter(o => o.region === filters.region);
    }
    if (filters?.category && filters.category !== 'all') {
      data = data.filter(o => o.category === filters.category);
    }
    return data;
  }, [filters]);

  const metrics: AdvancedMetrics = useMemo(() => calculateAdvancedMetrics(filteredData), [filteredData]);
  const insights: BusinessInsight[] = useMemo(() => generateInsights(metrics, filteredData), [metrics, filteredData]);
  const report = useMemo(() => generateReport(filteredData), [filteredData]);

  const handleExportJSON = () => {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(report.exportFormats.json));
    element.setAttribute('download', `report_${new Date().toISOString().split('T')[0]}.json`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleExportCSV = () => {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(report.exportFormats.csv));
    element.setAttribute('download', `report_${new Date().toISOString().split('T')[0]}.csv`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Insights & Reports</h1>
        <p className="text-gray-600 dark:text-gray-400">AI-generated business insights and actionable recommendations</p>
      </div>

      {/* Key Metrics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">${(metrics.totalSales / 1000).toFixed(1)}K</p>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">↑ 12% vs last period</p>
            </div>
            <div className="text-3xl text-blue-500">💰</div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Profit Margin</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{metrics.profitMargin}%</p>
              <p className={`text-xs mt-1 ${metrics.profitMargin >= 30 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {metrics.profitMargin >= 30 ? '✓ Above average' : '⚠️ Below target'}
              </p>
            </div>
            <div className="text-3xl text-green-500">📊</div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Customer Retention</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{metrics.customerRetention}%</p>
              <p className={`text-xs mt-1 ${metrics.customerRetention > 50 ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'}`}>
                {metrics.customerRetention > 50 ? '✓ Strong loyalty' : 'Needs improvement'}
              </p>
            </div>
            <div className="text-3xl text-purple-500">👥</div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Growth Trend</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{metrics.growthTrend > 0 ? '+' : ''}{metrics.growthTrend}%</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Month-over-month</p>
            </div>
            <div className="text-3xl text-orange-500">📈</div>
          </div>
        </div>
      </div>

      {/* Insights Grid */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Business Insights</h2>
          <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm">
            {insights.length} insights
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {insights.map((insight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedInsight(insight)}
              className={`p-6 rounded-lg cursor-pointer transition-all ${
                insight.impact === 'positive'
                  ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 hover:shadow-lg'
                  : insight.impact === 'negative'
                  ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 hover:shadow-lg'
                  : 'bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-lg'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex-1">{insight.title}</h3>
                {insight.impact === 'positive' && <CheckCircle className="text-green-600" size={20} />}
                {insight.impact === 'negative' && <AlertCircle className="text-red-600" size={20} />}
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">{insight.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">{insight.metric}</span>
                {insight.actionable && <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">Actionable</span>}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Selected Insight Details */}
      {selectedInsight && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-8 mb-8 border-l-4 border-blue-500 shadow-lg"
        >
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{selectedInsight.title}</h3>
            <button
              onClick={() => setSelectedInsight(null)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              ✕
            </button>
          </div>
          <p className="text-gray-700 dark:text-gray-300 mb-6">{selectedInsight.description}</p>
          {selectedInsight.recommendation && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">📌 Recommendation</p>
              <p className="text-blue-800 dark:text-blue-200">{selectedInsight.recommendation}</p>
            </div>
          )}
        </motion.div>
      )}

      {/* Performance Metrics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Revenue vs Profit</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Sales</span>
                <span className="font-semibold text-gray-900 dark:text-white">${(metrics.totalSales / 1000).toFixed(1)}K</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div
                  className="bg-blue-500 h-3 rounded-full"
                  style={{ width: '100%' }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Profit</span>
                <span className="font-semibold text-gray-900 dark:text-white">${(metrics.totalProfit / 1000).toFixed(1)}K</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div
                  className="bg-green-500 h-3 rounded-full"
                  style={{ width: `${(metrics.totalProfit / metrics.totalSales) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Performers</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Top Region</p>
                <p className="font-semibold text-gray-900 dark:text-white">{metrics.topRegion.region}</p>
              </div>
              <p className="text-lg font-bold text-blue-600">${(metrics.topRegion.sales / 1000).toFixed(1)}K</p>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Top Product</p>
                <p className="font-semibold text-gray-900 dark:text-white">{metrics.topProduct.product}</p>
              </div>
              <p className="text-lg font-bold text-green-600">${(metrics.topProduct.sales / 1000).toFixed(1)}K</p>
            </div>
          </div>
        </div>
      </div>

      {/* Report Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-md mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <BarChart3 size={28} className="text-blue-600" />
            Report Summary
          </h2>
          <div className="flex gap-2">
            <button
              onClick={handleExportJSON}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download size={16} /> JSON
            </button>
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download size={16} /> CSV
            </button>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg mb-6 font-mono text-sm">
          <pre className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap overflow-auto max-h-48">
            {report.summary}
          </pre>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{metrics.totalOrders}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Orders</p>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-3xl font-bold text-gray-900 dark:text-white">${metrics.avgOrderValue}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Avg Order Value</p>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{metrics.totalQuantitySold}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Units Sold</p>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{metrics.avgDiscount}%</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Avg Discount</p>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-md">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Action Recommendations</h2>
        <div className="space-y-4">
          {report.recommendations.map((rec, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg"
            >
              <div className="flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                {index + 1}
              </div>
              <p className="text-gray-800 dark:text-gray-200">{rec}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InsightsAndReports;
