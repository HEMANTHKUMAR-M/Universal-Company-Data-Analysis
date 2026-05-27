import React, { useMemo, useRef, useState } from 'react';
import {
  UploadCloud,
  Sparkles,
  FileText,
  Filter,
  Database,
  ArrowDownUp,
  Save,
  Download,
  SlidersHorizontal,
  ShieldCheck,
} from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Chart from '../components/Chart';
import { useDataset } from '../context/DataContext';
import { FIELD_LABELS, BUSINESS_FIELDS } from '../utils/datasetUtils';
import type { FieldKey } from '../utils/datasetUtils';

const UniversalAnalytics: React.FC = () => {
  const {
    headers,
    mapping,
    settings,
    fileName,
    errors,
    warnings,
    cleanedRecords,
    metrics,
    chartConfigs,
    insights,
    hasData,
    uploadFile,
    setFieldMapping,
    autoDetectMapping,
    setMissingValueStrategy,
    setDuplicateStrategy,
    setSavePreferences,
    exportCSV,
    exportExcel,
    exportJSON,
    clearData,
  } = useDataset();

  const [selectedPreviewRows, setSelectedPreviewRows] = useState(10);
  const exportArea = useRef<HTMLDivElement | null>(null);

  const previewHeaders = useMemo(() => {
    const selectedFields = BUSINESS_FIELDS.filter((field) => mapping[field]);
    return selectedFields.length > 0 ? selectedFields : headers.slice(0, 8);
  }, [headers, mapping]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    await uploadFile(file);
  };

  const handleExportPDF = async () => {
    if (!exportArea.current) return;
    const canvas = await html2canvas(exportArea.current, { scale: 2, backgroundColor: '#ffffff' });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('landscape', 'px', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pageWidth / imgWidth, pageHeight / imgHeight);
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth * ratio, imgHeight * ratio);
    pdf.save(`${fileName || 'analytics-report'}-summary.pdf`);
  };

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 text-blue-700 px-3 py-1 text-sm font-medium dark:bg-blue-950 dark:text-blue-200">
              <Sparkles size={16} /> Universal Analytics
            </div>
            <h1 className="mt-4 text-3xl font-semibold text-gray-900 dark:text-white">Upload any company dataset and map your business model</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-2xl">Supports CSV, Excel, and JSON uploads. Auto-detect columns, map fields, clean your data, and generate charts and KPI cards for any industry.</p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <button onClick={exportJSON} disabled={!hasData} className="btn-secondary w-full flex items-center justify-center gap-2">
              <FileText size={16} /> JSON
            </button>
            <button onClick={exportCSV} disabled={!hasData} className="btn-secondary w-full flex items-center justify-center gap-2">
              <Download size={16} /> CSV
            </button>
            <button onClick={exportExcel} disabled={!hasData} className="btn-secondary w-full flex items-center justify-center gap-2">
              <Download size={16} /> XLSX
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 rounded-3xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 shadow-sm">
          <div className="flex items-center gap-3 text-blue-600 dark:text-blue-300">
            <UploadCloud size={24} />
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Upload Dataset</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">CSV, XLSX, XLS or JSON</p>
            </div>
          </div>
          <div className="space-y-3">
            <label className="block rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 p-6 text-center cursor-pointer hover:border-blue-500">
              <input type="file" accept=".csv,.json,.xlsx,.xls" className="hidden" onChange={handleFileChange} />
              <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Choose a file</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">or drag and drop into this area.</p>
            </label>
            <div className="rounded-2xl bg-gray-100 dark:bg-gray-950 p-4 text-sm text-gray-600 dark:text-gray-300">
              <p className="font-semibold">Dataset summary</p>
              <p>File: <span className="font-medium text-gray-900 dark:text-white">{fileName || 'None'}</span></p>
              <p>Columns: <span className="font-medium text-gray-900 dark:text-white">{headers.length}</span></p>
            </div>
            {errors.length > 0 && (
              <div className="rounded-2xl bg-red-50 dark:bg-red-950 p-4 text-sm text-red-700 dark:text-red-300">
                <p className="font-semibold">Upload error</p>
                {errors.map((error, idx) => (<p key={idx}>{error}</p>))}
              </div>
            )}
            {warnings.length > 0 && (
              <div className="rounded-2xl bg-yellow-50 dark:bg-yellow-950 p-4 text-sm text-yellow-700 dark:text-yellow-300">
                <p className="font-semibold">Warnings</p>
                {warnings.map((warning, idx) => (<p key={idx}>{warning}</p>))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4 rounded-3xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 shadow-sm">
          <div className="flex items-center gap-3 text-green-600 dark:text-green-300">
            <Filter size={24} />
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Column Mapping</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Map dataset headers to core business fields.</p>
            </div>
          </div>
          <div className="grid gap-4">
            <button onClick={autoDetectMapping} className="btn-primary w-full flex items-center justify-center gap-2">
              <ArrowDownUp size={16} /> Auto Detect
            </button>
            {BUSINESS_FIELDS.map((field) => (
              <div key={field} className="space-y-2">
                <label className="text-sm font-medium text-gray-900 dark:text-gray-100">{FIELD_LABELS[field]}</label>
                <select
                  value={mapping[field] || ''}
                  onChange={(event) => setFieldMapping(field as FieldKey, event.target.value)}
                  className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm outline-none transition dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
                >
                  <option value="">Select column</option>
                  {headers.map((header) => (
                    <option key={header} value={header}>{header}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4 rounded-3xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 shadow-sm">
          <div className="flex items-center gap-3 text-indigo-600 dark:text-indigo-300">
            <SlidersHorizontal size={24} />
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Data Cleaning</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Handle missing values and duplicates automatically.</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="space-y-2 text-sm">
              <label className="font-medium text-gray-900 dark:text-gray-100">Missing values</label>
              <select
                value={settings.missingValueStrategy}
                onChange={(event) => setMissingValueStrategy(event.target.value as any)}
                className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm outline-none transition dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
              >
                <option value="ignore">Keep blanks</option>
                <option value="fill-zero">Fill zero for numeric fields</option>
                <option value="fill-average">Fill missing numbers with average</option>
                <option value="fill-empty">Fill blanks with empty string</option>
              </select>
            </div>
            <div className="space-y-2 text-sm">
              <label className="font-medium text-gray-900 dark:text-gray-100">Duplicate handling</label>
              <select
                value={settings.duplicateStrategy}
                onChange={(event) => setDuplicateStrategy(event.target.value as any)}
                className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm outline-none transition dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
              >
                <option value="none">Keep duplicates</option>
                <option value="drop-duplicates">Remove duplicate rows</option>
              </select>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-gray-300 bg-gray-50 px-4 py-4 text-sm dark:border-gray-700 dark:bg-gray-950">
              <ShieldCheck size={20} className="text-indigo-600 dark:text-indigo-300" />
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">Save preferences</p>
                <p className="text-gray-500 dark:text-gray-400">Keep column mapping and cleaning settings in localStorage.</p>
              </div>
              <button
                onClick={() => setSavePreferences(!settings.savePreferences)}
                className={`ml-auto rounded-full px-4 py-2 text-sm font-semibold ${settings.savePreferences ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200'}`}
              >
                {settings.savePreferences ? 'On' : 'Off'}
              </button>
            </div>
            <button onClick={clearData} className="btn-secondary w-full flex items-center justify-center gap-2">
              <FileText size={16} /> Clear Dataset
            </button>
          </div>
        </div>
      </div>

      {hasData && metrics && (
        <div ref={exportArea} className="space-y-6">
          <div className="grid gap-4 xl:grid-cols-4">
            <div className="rounded-3xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 shadow-sm">
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Records</p>
              <p className="mt-3 text-3xl font-semibold text-gray-900 dark:text-white">{metrics.recordCount}</p>
            </div>
            <div className="rounded-3xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 shadow-sm">
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Revenue</p>
              <p className="mt-3 text-3xl font-semibold text-gray-900 dark:text-white">${metrics.totalRevenue.toLocaleString()}</p>
            </div>
            <div className="rounded-3xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 shadow-sm">
              <p className="text-sm text-gray-500 dark:text-gray-400">Profit Margin</p>
              <p className="mt-3 text-3xl font-semibold text-gray-900 dark:text-white">{metrics.profitMargin}%</p>
            </div>
            <div className="rounded-3xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 shadow-sm">
              <p className="text-sm text-gray-500 dark:text-gray-400">Unique Customers</p>
              <p className="mt-3 text-3xl font-semibold text-gray-900 dark:text-white">{metrics.uniqueCustomers}</p>
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            <div className="rounded-3xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Date range</p>
                  <p className="mt-2 text-lg font-semibold text-gray-900 dark:text-white">{metrics.dateRange}</p>
                </div>
                <Database size={28} className="text-blue-600 dark:text-blue-300" />
              </div>
            </div>
            <div className="rounded-3xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Average order value</p>
                  <p className="mt-2 text-lg font-semibold text-gray-900 dark:text-white">${metrics.averageOrderValue.toLocaleString()}</p>
                </div>
                <Save size={28} className="text-green-600 dark:text-green-300" />
              </div>
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-3">
            {chartConfigs.map((chart) => (
              <div key={chart.id} className="rounded-3xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 shadow-sm">
                <Chart
                  type={chart.type}
                  title={chart.title}
                  data={chart.data}
                  xDataKey={chart.xDataKey}
                  dataKey={chart.dataKey}
                />
              </div>
            ))}
          </div>

          <div className="rounded-3xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Insights & Recommendations</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Dynamic observations based on your uploaded dataset.</p>
              </div>
              <button onClick={handleExportPDF} className="btn-primary inline-flex items-center gap-2">
                <Download size={16} /> Export PDF
              </button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {insights.map((insight, index) => (
                <div key={index} className="rounded-3xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 p-4">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{insight.title}</p>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{insight.description}</p>
                  <p className="mt-3 text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">{insight.recommendation}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Preview Table</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Review the first {selectedPreviewRows} mapped rows.</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setSelectedPreviewRows(5)} className="rounded-full border border-gray-300 px-3 py-1 text-sm dark:border-gray-700">5</button>
                <button onClick={() => setSelectedPreviewRows(10)} className="rounded-full border border-gray-300 px-3 py-1 text-sm dark:border-gray-700">10</button>
                <button onClick={() => setSelectedPreviewRows(20)} className="rounded-full border border-gray-300 px-3 py-1 text-sm dark:border-gray-700">20</button>
              </div>
            </div>
            <div className="max-h-[360px] overflow-auto rounded-3xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950">
              <table className="min-w-full border-collapse text-left text-sm">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    {previewHeaders.map((header) => (
                      <th key={header} className="whitespace-nowrap px-4 py-3 font-medium text-gray-700 dark:text-gray-300">{FIELD_LABELS[header as FieldKey] || header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {cleanedRecords.slice(0, selectedPreviewRows).map((row, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white dark:bg-gray-950' : 'bg-gray-50 dark:bg-gray-900'}>
                      {previewHeaders.map((header) => (
                        <td key={header} className="whitespace-nowrap px-4 py-3 text-gray-700 dark:text-gray-200">{String(row[header] ?? '')}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {!hasData && (
        <div className="rounded-3xl border border-dashed border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-950 p-6 text-center text-gray-600 dark:text-gray-300">
          <p className="text-lg font-semibold">Upload a dataset to generate a universal analytics dashboard.</p>
          <p className="mt-2">The dashboard will automatically detect available columns and create KPIs, charts, tables, and recommendations for any industry.</p>
        </div>
      )}
    </div>
  );
};

export default UniversalAnalytics;
