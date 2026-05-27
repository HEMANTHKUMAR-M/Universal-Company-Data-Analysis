import React, { useCallback, useMemo, useRef, useState } from 'react';
import { UploadCloud } from 'lucide-react';
import { useDataset, useDatasetLabels } from '../context/DataContext';
import EmptyState from '../components/EmptyState';

const UploadDataset: React.FC = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { uploadFile, headers, rawRecords, mapping, setFieldMapping, autoDetectMapping, errors, warnings, fileName } = useDataset();
  const labels = useDatasetLabels();
  const [localFileName, setLocalFileName] = useState('');

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setLocalFileName(file.name);
      uploadFile(file);
    }
  }, [uploadFile]);

  const onSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLocalFileName(file.name);
      uploadFile(file);
    }
  }, [uploadFile]);

  const openFileDialog = () => inputRef.current?.click();

  const mappingFields = useMemo(() => Object.keys(labels) as Array<keyof typeof labels>, [labels]);
  const isMappingComplete = useMemo(
    () => mappingFields.every((field) => Boolean(mapping[field])),
    [mapping, mappingFields],
  );

  const navigateTo = (page: string) => {
    window.dispatchEvent(new CustomEvent('navigateTo', { detail: page }));
  };

  if (!rawRecords || rawRecords.length === 0) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Upload Dataset</h1>
          <p className="text-gray-600 dark:text-gray-400">Upload CSV, Excel (.xlsx) or JSON files to generate your analytics dashboard.</p>
        </div>

        <div
          onDrop={onDrop}
          onDragOver={(e) => e.preventDefault()}
          className="p-8 border-2 border-dashed rounded-lg text-center bg-white dark:bg-gray-800"
        >
          <UploadCloud size={48} className="mx-auto text-blue-600 mb-4" />
          <p className="text-lg font-medium">Drag & drop your dataset here</p>
          <p className="text-sm text-gray-500 mt-2">Supported: CSV, Excel (.xlsx), JSON</p>
          <div className="mt-6">
            <button onClick={openFileDialog} className="btn-primary px-4 py-2">Select a file</button>
            <input ref={inputRef} type="file" className="hidden" onChange={onSelect} accept=".csv,.xlsx,.xls,.json" />
          </div>
        </div>

        <div className="mt-6">
          <EmptyState title="Upload your company dataset to generate analytics dashboard" description="Upload a dataset to get started" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dataset: {fileName || localFileName}</h1>
          <p className="text-sm text-gray-500">{rawRecords.length} records • {headers.length} columns</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="rounded-2xl bg-blue-50 px-4 py-3 text-sm text-blue-700 dark:bg-blue-950 dark:text-blue-200">
            {isMappingComplete ? 'Ready to generate analytics dashboard.' : 'Complete column mapping before generating your dashboard.'}
          </div>
          <button
            onClick={() => navigateTo('dashboard')}
            disabled={!isMappingComplete}
            className={`btn-primary ${!isMappingComplete ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Generate dashboard
          </button>
        </div>
      </div>

      {errors.length > 0 && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded">{errors.join('; ')}</div>
      )}
      {warnings.length > 0 && (
        <div className="mb-4 p-3 bg-yellow-50 text-yellow-700 rounded">{warnings.join('; ')}</div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card col-span-2">
          <h3 className="text-lg font-semibold mb-3">Preview (first 10 rows)</h3>
          <div className="overflow-auto max-h-80">
            <table className="w-full table-auto">
              <thead>
                <tr>
                  {headers.map((h) => (
                    <th key={h} className="text-left text-xs px-2 py-1">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rawRecords.slice(0, 10).map((row, idx) => (
                  <tr key={idx} className="align-top">
                    {headers.map((h) => (
                      <td key={h} className="text-sm px-2 py-1">{String(row[h] ?? '')}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold mb-3">Column Mapping</h3>
          <p className="text-sm text-gray-500 mb-4">Map dataset columns to business fields to enable automatic charts and KPIs.</p>
          <div className="space-y-3">
            <button onClick={() => autoDetectMapping()} className="btn-secondary w-full">Auto-detect mapping</button>
            {(Object.keys(labels) as Array<keyof typeof labels>).map((key) => (
              <div key={key} className="flex items-center gap-2">
                <label className="w-32 text-sm font-medium">{labels[key]}</label>
                <select
                  className="flex-1 p-2 border rounded"
                  value={mapping[key] || ''}
                  onChange={(e) => setFieldMapping(key, e.target.value)}
                >
                  <option value="">— select column —</option>
                  {headers.map((h) => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <button onClick={() => { navigator.clipboard.writeText(JSON.stringify({ fileName, mapping }, null, 2)); }} className="btn-outline w-full">Copy mapping JSON</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadDataset;
