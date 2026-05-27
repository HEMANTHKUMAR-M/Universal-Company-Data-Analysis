import React from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { getChartColors, formatCurrency } from '../utils/helpers';

interface ChartProps {
  data: any[];
  title: string;
  description?: string;
  type: 'line' | 'bar' | 'pie' | 'area';
  xDataKey?: string;
  dataKey?: string | string[];
  colors?: string[];
  currency?: 'USD' | 'INR';
  percent?: boolean;
  height?: number;
  showLegend?: boolean;
  isDonut?: boolean;
  highlightExtremes?: boolean;
}

const Chart: React.FC<ChartProps> = ({
  data,
  title,
  description,
  type,
  xDataKey = 'month',
  dataKey = 'value',
  colors = getChartColors(),
  currency = 'USD',
  percent = false,
  height = 300,
  showLegend = true,
  isDonut = false,
  highlightExtremes = false,
}) => {
  const chartId = React.useId();
  const formatValue = (value: any) => {
    if (typeof value !== 'number') return value;
    if (percent) return `${value.toFixed(1)}%`;
    return formatCurrency(value, currency);
  };

  const tooltipFormatter = (value: any) => {
    if (typeof value === 'number') return formatValue(value);
    return value;
  };

  const renderChart = () => {
    switch (type) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart data={data}>
              <defs>
                <linearGradient id={`${chartId}-lineGradient`} x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor={colors[0]} stopOpacity={0.95} />
                  <stop offset="100%" stopColor={colors[1] || colors[0]} stopOpacity={0.6} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" stroke="#e5e7eb" vertical={false} />
              <XAxis dataKey={xDataKey} stroke="#6b7280" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis stroke="#6b7280" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip
                formatter={(value) => [tooltipFormatter(value), 'Value']}
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: '#f3f4f6' }}
              />
              {showLegend && <Legend />}
              {Array.isArray(dataKey) ? (
                dataKey.map((key, idx) => (
                  <Line
                    key={key}
                    type="monotone"
                    dataKey={key}
                    stroke={colors[idx % colors.length]}
                    strokeWidth={3}
                    dot={{ fill: colors[idx % colors.length], r: 4 }}
                    activeDot={{ r: 6 }}
                    animationDuration={1200}
                    isAnimationActive
                  />
                ))
              ) : (
                <Line
                  type="monotone"
                  dataKey={dataKey as string}
                  stroke={colors[0]}
                  strokeWidth={3}
                  dot={{ fill: colors[0], r: 4 }}
                  activeDot={{ r: 6 }}
                  animationDuration={1200}
                  isAnimationActive
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        );

      case 'bar':
        const values = data.map((row) => Number(row[dataKey as string] || 0));
        const maxValue = Math.max(...values, 0);
        const minValue = Math.min(...values, 0);
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart data={data}>
              <defs>
                {Array.isArray(dataKey)
                  ? dataKey.map((key, idx) => (
                      <linearGradient key={key} id={`${chartId}-barGradient-${idx}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={colors[idx % colors.length]} stopOpacity={0.9} />
                        <stop offset="100%" stopColor={colors[idx % colors.length]} stopOpacity={0.4} />
                      </linearGradient>
                    ))
                  : (
                      <linearGradient id={`${chartId}-barGradient`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={colors[0]} stopOpacity={0.9} />
                        <stop offset="100%" stopColor={colors[0]} stopOpacity={0.4} />
                      </linearGradient>
                    )}
              </defs>
              <CartesianGrid strokeDasharray="4 4" stroke="#e5e7eb" vertical={false} />
              <XAxis dataKey={xDataKey} stroke="#6b7280" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis stroke="#6b7280" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip
                formatter={(value) => [tooltipFormatter(value), 'Value']}
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: '#f3f4f6' }}
              />
              {showLegend && <Legend />}
              {Array.isArray(dataKey) ? (
                dataKey.map((key, idx) => (
                  <Bar
                    key={key}
                    dataKey={key}
                    fill={`url(#${chartId}-barGradient-${idx})`}
                    radius={[8, 8, 0, 0]}
                    animationDuration={1200}
                    isAnimationActive
                  />
                ))
              ) : (
                <Bar dataKey={dataKey as string} fill={`url(#${chartId}-barGradient)`} radius={[8, 8, 0, 0]} animationDuration={1200} isAnimationActive>
                  {highlightExtremes &&
                    data.map((entry, index) => {
                      const value = Number(entry[dataKey as string] || 0);
                      let fill = colors[0];
                      if (value === maxValue) fill = '#10B981';
                      if (value === minValue) fill = '#EF4444';
                      return <Cell key={`cell-${index}`} fill={fill} />;
                    })}
                </Bar>
              )}
            </BarChart>
          </ResponsiveContainer>
        );

      case 'pie':
        const totalValue = data.reduce((sum, item) => sum + Number(item[dataKey as string] || 0), 0);
        return (
          <ResponsiveContainer width="100%" height={height}>
            <PieChart>
              <Tooltip
                formatter={(value, name) => [tooltipFormatter(value), name]}
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: '#f3f4f6' }}
              />
              <Legend verticalAlign="bottom" height={36} />
              <Pie
                data={data}
                cx="50%"
                cy="45%"
                labelLine={false}
                label={({ name, value }) => {
                  const percentage = totalValue ? ((Number(value) / totalValue) * 100).toFixed(1) : '0.0';
                  return `${name}: ${percentage}%`;
                }}
                outerRadius={isDonut ? 90 : 110}
                innerRadius={isDonut ? 55 : 0}
                fill="#8884d8"
                dataKey={dataKey as string}
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        );

      case 'area':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id={`${chartId}-areaGradient`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colors[0]} stopOpacity={0.9} />
                  <stop offset="95%" stopColor={colors[0]} stopOpacity={0.2} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" stroke="#e5e7eb" vertical={false} />
              <XAxis dataKey={xDataKey} stroke="#6b7280" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis stroke="#6b7280" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip
                formatter={(value) => [tooltipFormatter(value), 'Value']}
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: '#f3f4f6' }}
              />
              {showLegend && <Legend />}
              <Area
                type="monotone"
                dataKey={dataKey as string}
                stroke={colors[0]}
                fill={`url(#${chartId}-areaGradient)`}
                strokeWidth={3}
                activeDot={{ r: 6 }}
                animationDuration={1200}
                isAnimationActive
              />
            </AreaChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };

  return (
    <div className="card h-full fade-in border border-gray-200 dark:border-gray-700 hover:-translate-y-0.5 transition-transform duration-200">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
        {description && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{description}</p>}
      </div>
      <div className="w-full overflow-x-auto">
        {renderChart()}
      </div>
    </div>
  );
};

export default Chart;
