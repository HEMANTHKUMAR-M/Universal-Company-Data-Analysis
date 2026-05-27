import { read, utils, write } from 'xlsx';
import Papa from 'papaparse';

export type FieldKey =
  | 'date'
  | 'revenue'
  | 'profit'
  | 'sales'
  | 'quantity'
  | 'customer'
  | 'product'
  | 'category'
  | 'region'
  | 'department'
  | 'employee'
  | 'expense'
  | 'paymentMode';

export const BUSINESS_FIELDS: FieldKey[] = [
  'date',
  'revenue',
  'profit',
  'sales',
  'quantity',
  'customer',
  'product',
  'category',
  'region',
  'department',
  'employee',
  'expense',
  'paymentMode',
];

export const FIELD_LABELS: Record<FieldKey, string> = {
  date: 'Date',
  revenue: 'Revenue',
  profit: 'Profit',
  sales: 'Sales',
  quantity: 'Quantity',
  customer: 'Customer',
  product: 'Product',
  category: 'Category',
  region: 'Region',
  department: 'Department',
  employee: 'Employee',
  expense: 'Expense',
  paymentMode: 'Payment Mode',
};

export const FIELD_SUGGESTIONS: Record<FieldKey, string[]> = {
  date: ['date', 'time', 'timestamp', 'orderdate', 'transactiondate'],
  revenue: ['revenue', 'income', 'turnover', 'amount', 'salesamount', 'gross'],
  profit: ['profit', 'margin', 'netincome'],
  sales: ['sales', 'units', 'transactions', 'orders'],
  quantity: ['quantity', 'qty', 'unitcount', 'amount'],
  customer: ['customer', 'client', 'buyer', 'account'],
  product: ['product', 'item', 'sku', 'service'],
  category: ['category', 'segment', 'group', 'department'],
  region: ['region', 'location', 'territory', 'zone', 'area'],
  department: ['department', 'division', 'businessunit', 'team'],
  employee: ['employee', 'staff', 'associate', 'owner'],
  expense: ['expense', 'cost', 'spend', 'expenditure'],
  paymentMode: ['paymentmode', 'paymethod', 'paymenttype', 'payment'],
};

export type FieldMapping = Partial<Record<FieldKey, string>>;

export type ColumnType = 'string' | 'number' | 'date' | 'boolean' | 'unknown';

export interface ParsedDataset {
  records: Record<string, any>[];
  headers: string[];
  errors: string[];
  warnings: string[];
}

export interface ChartConfig {
  id: string;
  title: string;
  type: 'line' | 'bar' | 'pie';
  data: any[];
  xDataKey: string;
  dataKey: string | string[];
  colors?: string[];
}

export const normalizeHeader = (text: string) =>
  String(text)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[^a-z0-9 ]/g, '')
    .replace(/\s+/g, '_');

export const parseFileToRecords = async (file: File): Promise<ParsedDataset> => {
  const extension = file.name.split('.').pop()?.toLowerCase() || '';
  const errors: string[] = [];
  const warnings: string[] = [];
  let records: Record<string, any>[] = [];

  try {
    if (extension === 'json') {
      const text = await file.text();
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed)) {
        records = parsed.map((row: Record<string, any>) => ({ ...row }));
      } else if (Array.isArray(parsed.data)) {
        records = parsed.data.map((row: Record<string, any>) => ({ ...row }));
      } else {
        errors.push('JSON file must contain an array of objects or a data array.');
      }
    } else if (extension === 'csv') {
      // Use PapaParse for robust CSV parsing (supports headers, quotes, large files)
      const text = await file.text();
      const parsed = Papa.parse<Record<string, any>>(text, { header: true, skipEmptyLines: true, dynamicTyping: false });
      if (parsed.errors && parsed.errors.length) {
        parsed.errors.forEach((e: any) => errors.push(`CSV parse error: ${e.message}`));
      }
      records = parsed.data as Record<string, any>[];
    } else {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = read(arrayBuffer, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      records = utils.sheet_to_json(sheet, { defval: null, raw: false }) as Record<string, any>[];
    }
  } catch (err) {
    errors.push('Unable to parse file. Please upload a valid CSV, Excel, or JSON dataset.');
  }

  const headers = records.length > 0 ? Object.keys(records[0]) : [];
  if (headers.length === 0 && rowsAreObjects(records)) {
    warnings.push('No header row was detected. Dataset can still be processed, but mapping will rely on inferred fields.');
  }

  return { records, headers, errors, warnings };
};

const rowsAreObjects = (records: Record<string, any>[]) => records.every((row) => row && typeof row === 'object' && !Array.isArray(row));

export const autoMapColumns = (headers: string[]): FieldMapping => {
  const mapping: FieldMapping = {};
  const used: Set<string> = new Set();

  const normalizedHeaders = headers.map((header) => ({ raw: header, normalized: normalizeHeader(header) }));

  BUSINESS_FIELDS.forEach((field) => {
    const suggestions = FIELD_SUGGESTIONS[field] || [field];
    const match = normalizedHeaders.find((header) => {
      if (used.has(header.raw)) return false;
      return suggestions.some((term) => header.normalized.includes(term));
    });
    if (match) {
      mapping[field] = match.raw;
      used.add(match.raw);
    }
  });

  return mapping;
};

export const inferColumnTypes = (records: Record<string, any>[], headers: string[]): Record<string, ColumnType> => {
  const types: Record<string, ColumnType> = {};

  headers.forEach((header) => {
    const sample = records.map((row) => row[header]).find((value) => value !== null && value !== undefined && value !== '');
    if (sample == null) {
      types[header] = 'unknown';
      return;
    }

    if (typeof sample === 'boolean') {
      types[header] = 'boolean';
    } else if (!Number.isNaN(Number(sample)) && sample !== '') {
      types[header] = 'number';
    } else if (!Number.isNaN(Date.parse(String(sample)))) {
      types[header] = 'date';
    } else {
      types[header] = 'string';
    }
  });

  return types;
};

const formatDateValue = (value: any) => {
  if (value == null || value === '') return '';
  if (value instanceof Date) return value.toISOString().split('T')[0];
  const candidate = new Date(String(value));
  if (!Number.isNaN(candidate.getTime())) return candidate.toISOString().split('T')[0];
  return String(value);
};

const normalizeMappedRow = (row: Record<string, any>, mapping: FieldMapping): Record<string, any> => {
  const normalized: Record<string, any> = {};

  BUSINESS_FIELDS.forEach((field) => {
    const column = mapping[field];
    if (!column) return;
    const rawValue = row[column];
    switch (field) {
      case 'date':
        normalized[field] = formatDateValue(rawValue);
        break;
      case 'revenue':
      case 'profit':
      case 'sales':
      case 'quantity':
      case 'expense':
        normalized[field] = Number(rawValue) || 0;
        break;
      default:
        normalized[field] = rawValue == null ? '' : String(rawValue).trim();
    }
  });

  return normalized;
};

export const mapDataset = (records: Record<string, any>[], mapping: FieldMapping): Record<string, any>[] => {
  if (Object.keys(mapping).length === 0) return records;
  return records.map((row) => normalizeMappedRow(row, mapping));
};

export type MissingValueStrategy = 'ignore' | 'fill-zero' | 'fill-empty' | 'fill-average';
export type DuplicateStrategy = 'none' | 'drop-duplicates';

export interface CleaningOptions {
  missingValueStrategy: MissingValueStrategy;
  duplicateStrategy: DuplicateStrategy;
}

export const applyCleaningOptions = (
  records: Record<string, any>[],
  mapping: FieldMapping,
  options: CleaningOptions,
): Record<string, any>[] => {
  const numericFields = BUSINESS_FIELDS.filter((field) => ['revenue', 'profit', 'sales', 'quantity', 'expense'].includes(field));
  const averages: Record<string, number> = {};

  numericFields.forEach((field) => {
    const values = records
      .map((row) => Number(row[field]))
      .filter((value) => !Number.isNaN(value));
    averages[field] = values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
  });

  const filled = records.map((row) => {
    const result = { ...row };
    BUSINESS_FIELDS.forEach((field) => {
      if (!mapping[field]) return;
      const value = result[field];
      const isMissing = value === null || value === undefined || value === '';
      if (!isMissing) return;

      if (options.missingValueStrategy === 'fill-zero' && numericFields.includes(field)) {
        result[field] = 0;
      }
      if (options.missingValueStrategy === 'fill-average' && numericFields.includes(field)) {
        result[field] = Math.round(averages[field] || 0);
      }
      if (options.missingValueStrategy === 'fill-empty') {
        result[field] = '';
      }
    });
    return result;
  });

  if (options.duplicateStrategy !== 'drop-duplicates') return filled;

  const seen = new Set<string>();
  return filled.filter((row) => {
    const key = JSON.stringify(row);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

export interface DatasetMetrics {
  recordCount: number;
  dateRange: string;
  totalRevenue: number;
  totalProfit: number;
  totalSales: number;
  totalQuantity: number;
  totalExpense: number;
  uniqueCustomers: number;
  averageOrderValue: number;
  profitMargin: number;
  topProduct: string;
  topRegion: string;
  topCategory: string;
  topDepartment: string;
  topEmployee: string;
  paymentModeBreakdown: Record<string, number>;
}

const buildTopGroup = (records: Record<string, any>[], field: string, metricField: string): string => {
  const totals: Record<string, number> = {};
  records.forEach((row) => {
    const key = String(row[field] || 'Unknown');
    totals[key] = (totals[key] || 0) + Number(row[metricField] || 0);
  });
  const best = Object.entries(totals).sort((a, b) => b[1] - a[1])[0];
  return best ? best[0] : 'Unknown';
};

export const computeDynamicMetrics = (
  records: Record<string, any>[],
  mapping: FieldMapping,
): DatasetMetrics => {
  const rows = records.length;
  const revenueField = mapping.revenue || mapping.sales || 'revenue';
  const profitField = mapping.profit || 'profit';
  const salesField = mapping.sales || 'sales';
  const quantityField = mapping.quantity || 'quantity';
  const expenseField = mapping.expense || 'expense';
  const customerField = mapping.customer || 'customer';
  const dateField = mapping.date || 'date';
  const categoryField = mapping.category || 'category';
  const regionField = mapping.region || 'region';
  const departmentField = mapping.department || 'department';
  const employeeField = mapping.employee || 'employee';
  const paymentModeField = mapping.paymentMode || 'paymentMode';

  const productField = mapping.product || 'product';
  const totalRevenue = records.reduce((sum, row) => sum + Number(row[revenueField] || 0), 0);
  const totalProfit = records.reduce((sum, row) => sum + Number(row[profitField] || 0), 0);
  const totalSales = records.reduce((sum, row) => sum + Number(row[salesField] || 0), 0);
  const totalQuantity = records.reduce((sum, row) => sum + Number(row[quantityField] || 0), 0);
  const totalExpense = records.reduce((sum, row) => sum + Number(row[expenseField] || 0), 0);
  const uniqueCustomers = new Set(records.map((row) => String(row[customerField] || ''))).size;
  const averageOrderValue = rows ? Math.round(totalRevenue / rows) : 0;
  const profitMargin = totalRevenue ? Math.round((totalProfit / totalRevenue) * 10000) / 100 : 0;
  const rawDates = records
    .map((row) => String(row[dateField] || ''))
    .filter((value) => !Number.isNaN(Date.parse(value)))
    .sort();
  const dateRange = rawDates.length ? `${rawDates[0]} → ${rawDates[rawDates.length - 1]}` : 'N/A';

  const paymentModeBreakdown: Record<string, number> = {};
  records.forEach((row) => {
    const value = String(row[paymentModeField] || 'Unknown');
    paymentModeBreakdown[value] = (paymentModeBreakdown[value] || 0) + 1;
  });

  return {
    recordCount: rows,
    dateRange,
    totalRevenue: Math.round(totalRevenue),
    totalProfit: Math.round(totalProfit),
    totalSales: Math.round(totalSales),
    totalQuantity: Math.round(totalQuantity),
    totalExpense: Math.round(totalExpense),
    uniqueCustomers,
    averageOrderValue,
    profitMargin,
    topProduct: buildTopGroup(records, productField, revenueField),
    topRegion: buildTopGroup(records, regionField, revenueField),
    topCategory: buildTopGroup(records, categoryField, revenueField),
    topDepartment: buildTopGroup(records, departmentField, revenueField),
    topEmployee: buildTopGroup(records, employeeField, revenueField),
    paymentModeBreakdown,
  };
};

export const generateDatasetInsights = (
  metrics: DatasetMetrics,
): { title: string; description: string; impact: 'positive' | 'negative' | 'neutral'; recommendation: string }[] => {
  const insights: { title: string; description: string; impact: 'positive' | 'negative' | 'neutral'; recommendation: string }[] = [];
  if (metrics.totalRevenue > 0) {
    insights.push({
      title: 'Revenue Signals',
      description: `Revenue is ${metrics.totalRevenue.toLocaleString()} across ${metrics.recordCount} records.`,
      impact: metrics.profitMargin >= 20 ? 'positive' : 'neutral',
      recommendation: metrics.profitMargin >= 20 ? 'Keep promoting the strongest channels.' : 'Review pricing and expense control to improve margins.',
    });
  }
  if (metrics.profitMargin < 15) {
    insights.push({
      title: 'Profit Margin Alert',
      description: `Profit margin is ${metrics.profitMargin}%, which is below a healthy benchmark.`,
      impact: 'negative',
      recommendation: 'Investigate cost drivers and increase revenue efficiency.',
    });
  }
  if (metrics.uniqueCustomers > 0) {
    insights.push({
      title: 'Customer Reach',
      description: `${metrics.uniqueCustomers} distinct customer records are available for segmentation.`,
      impact: 'positive',
      recommendation: 'Use customer-level insights to personalize offers and retention campaigns.',
    });
  }
  if (metrics.paymentModeBreakdown && Object.keys(metrics.paymentModeBreakdown).length > 1) {
    insights.push({
      title: 'Payment Mix',
      description: `Multiple payment modes were detected. ${Object.keys(metrics.paymentModeBreakdown).join(', ')} are in use.`,
      impact: 'neutral',
      recommendation: 'Track payment channel performance and offer incentives for preferred methods.',
    });
  }
  insights.push({
    title: 'Top Performer',
    description: `${metrics.topProduct || 'N/A'} is the best-performing product by revenue.`, 
    impact: 'positive',
    recommendation: 'Consider scaling availability and promotions for top performers.',
  });
  return insights;
};

const groupByField = (records: Record<string, any>[], dimension: string, metricField: string) => {
  const totals: Record<string, number> = {};
  records.forEach((row) => {
    const key = String(row[dimension] || 'Unknown');
    totals[key] = (totals[key] || 0) + Number(row[metricField] || 0);
  });
  return Object.entries(totals)
    .map(([name, value]) => ({ [dimension]: name, value }))
    .sort((a, b) => b.value - a.value);
};

export const generateChartConfigs = (
  records: Record<string, any>[],
  mapping: FieldMapping,
): ChartConfig[] => {
  const configs: ChartConfig[] = [];
  const dateField = mapping.date;
  const revenueField = mapping.revenue || mapping.sales;
  const categoryField = mapping.category;
  const regionField = mapping.region;
  const productField = mapping.product;
  const paymentModeField = mapping.paymentMode;

  if (dateField && revenueField) {
    const timeSeries: Record<string, number> = {};
    records.forEach((row) => {
      const dateValue = formatDateValue(row[dateField]);
      if (!dateValue) return;
      timeSeries[dateValue] = (timeSeries[dateValue] || 0) + Number(row[revenueField] || 0);
    });
    const data = Object.entries(timeSeries)
      .map(([date, total]) => ({ date, [FIELD_LABELS.revenue]: Math.round(total) }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    if (data.length) {
      configs.push({
        id: 'time-revenue',
        title: 'Revenue Over Time',
        type: 'line',
        data,
        xDataKey: 'date',
        dataKey: FIELD_LABELS.revenue,
      });
    }
  }

  if (categoryField && revenueField) {
    const chartData = groupByField(records, categoryField, revenueField).map((row) => ({ category: row[categoryField], sales: row.value }));
    if (chartData.length) {
      configs.push({
        id: 'category-sales',
        title: 'Sales by Category',
        type: 'bar',
        data: chartData,
        xDataKey: 'category',
        dataKey: 'sales',
      });
    }
  }

  if (regionField && revenueField) {
    const chartData = groupByField(records, regionField, revenueField).map((row) => ({ region: row[regionField], sales: row.value }));
    if (chartData.length) {
      configs.push({
        id: 'region-sales',
        title: 'Sales by Region',
        type: 'bar',
        data: chartData,
        xDataKey: 'region',
        dataKey: 'sales',
      });
    }
  }

  if (productField && revenueField) {
    const chartData = groupByField(records, productField, revenueField)
      .slice(0, 8)
      .map((row) => ({ product: row[productField], sales: row.value }));
    if (chartData.length) {
      configs.push({
        id: 'top-products',
        title: 'Top Products',
        type: 'bar',
        data: chartData,
        xDataKey: 'product',
        dataKey: 'sales',
      });
    }
  }

  if (paymentModeField) {
    const salesField = mapping.sales || 'sales';
    const chartData = groupByField(records, paymentModeField, revenueField || salesField || 'sales').map((row) => ({ paymentMode: row[paymentModeField], value: row.value }));
    if (chartData.length) {
      configs.push({
        id: 'payment-mode',
        title: 'Payment Methods',
        type: 'pie',
        data: chartData,
        xDataKey: 'paymentMode',
        dataKey: 'value',
      });
    }
  }

  return configs;
};

export const generateCSVFromRecords = (records: Record<string, any>[]) => {
  if (records.length === 0) return '';
  const headers = Object.keys(records[0]);
  const rows = records.map((row) => headers.map((key) => JSON.stringify(row[key] ?? '')).join(','));
  return [headers.join(','), ...rows].join('\n');
};

export const generateExcelFile = (records: Record<string, any>[]): Blob => {
  const worksheet = utils.json_to_sheet(records);
  const workbook = utils.book_new();
  utils.book_append_sheet(workbook, worksheet, 'Data');
  const wopts = { bookType: 'xlsx' as const, type: 'array' as const };
  const buffer = write(workbook, wopts);
  return new Blob([buffer], { type: 'application/octet-stream' });
};

export const downloadBlob = (blob: Blob, filename: string) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};
