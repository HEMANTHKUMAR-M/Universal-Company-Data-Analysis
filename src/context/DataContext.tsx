import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useFilters } from './FilterContext';
import {
  applyCleaningOptions,
  autoMapColumns,
  computeDynamicMetrics,
  generateChartConfigs,
  generateCSVFromRecords,
  generateDatasetInsights,
  generateExcelFile,
  parseFileToRecords,
  FIELD_LABELS,
  BUSINESS_FIELDS,
} from '../utils/datasetUtils';
import type { FieldKey, FieldMapping, CleaningOptions } from '../utils/datasetUtils';

const STORAGE_KEY = 'universal-dashboard-config';


type DataContextValue = {
  rawRecords: Record<string, any>[];
  headers: string[];
  mapping: FieldMapping;
  settings: CleaningOptions & { savePreferences: boolean };
  fileName: string;
  errors: string[];
  warnings: string[];
  loading: boolean;
  mappedRecords: Record<string, any>[];
  cleanedRecords: Record<string, any>[];
  metrics: ReturnType<typeof computeDynamicMetrics> | null;
  chartConfigs: ReturnType<typeof generateChartConfigs>;
  insights: ReturnType<typeof generateDatasetInsights>;
  filteredRecords: Record<string, any>[];
  hasData: boolean;
  uploadFile: (file: File) => Promise<void>;
  setFieldMapping: (field: FieldKey, column: string) => void;
  autoDetectMapping: () => void;
  setMissingValueStrategy: (strategy: CleaningOptions['missingValueStrategy']) => void;
  setDuplicateStrategy: (strategy: CleaningOptions['duplicateStrategy']) => void;
  setSavePreferences: (save: boolean) => void;
  exportCSV: () => void;
  exportExcel: () => void;
  exportJSON: () => void;
  clearData: () => void;
};

const createDefaultMapping = (): FieldMapping => {
  return BUSINESS_FIELDS.reduce((acc, field) => ({ ...acc, [field]: '' }), {}) as FieldMapping;
};

const defaultSettings: CleaningOptions & { savePreferences: boolean } = {
  missingValueStrategy: 'ignore',
  duplicateStrategy: 'none',
  savePreferences: true,
};

const DataContext = createContext<DataContextValue | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [rawRecords, setRawRecords] = useState<Record<string, any>[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [mapping, setMapping] = useState<FieldMapping>(createDefaultMapping());
  const [settings, setSettings] = useState(defaultSettings);
  const [fileName, setFileName] = useState('dataset');
  const [errors, setErrors] = useState<string[]>([]);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved);
      if (parsed.mapping) setMapping(parsed.mapping);
      if (parsed.settings) setSettings((prev) => ({ ...prev, ...parsed.settings }));
      if (parsed.fileName) setFileName(parsed.fileName);
    } catch {
      // ignore corrupt saved state
    }
  }, []);

  const uploadFile = async (file: File) => {
    setLoading(true);
    const payload = await parseFileToRecords(file);
    setLoading(false);

    if (payload.errors.length) {
      setErrors(payload.errors);
      setWarnings(payload.warnings);
      return;
    }

    setErrors([]);
    setWarnings(payload.warnings);
    setRawRecords(payload.records);
    setHeaders(payload.headers);
    setFileName(file.name.replace(/\.[^/.]+$/, ''));
    setMapping((prev) => ({ ...prev, ...autoMapColumns(payload.headers) }));
  };

  const setFieldMapping = (field: FieldKey, column: string) => {
    setMapping((current) => ({ ...current, [field]: column }));
  };

  const autoDetectMapping = () => {
    setMapping((current) => ({ ...current, ...autoMapColumns(headers) }));
  };

  const setMissingValueStrategy = (strategy: CleaningOptions['missingValueStrategy']) => {
    setSettings((prev) => ({ ...prev, missingValueStrategy: strategy }));
  };

  const setDuplicateStrategy = (strategy: CleaningOptions['duplicateStrategy']) => {
    setSettings((prev) => ({ ...prev, duplicateStrategy: strategy }));
  };

  const setSavePreferences = (save: boolean) => {
    setSettings((prev) => ({ ...prev, savePreferences: save }));
  };

  const mappedRecords = useMemo(() => {
    if (rawRecords.length === 0) return [];
    const selectedFields = Object.entries(mapping).filter(([, column]) => Boolean(column));
    if (selectedFields.length === 0) return rawRecords;

    return rawRecords.map((row) => {
      const mapped: Record<string, any> = {};
      selectedFields.forEach(([field, column]) => {
        mapped[field] = row[column];
      });
      return mapped;
    });
  }, [rawRecords, mapping]);

  const cleanedRecords = useMemo(() => {
    if (mappedRecords.length === 0) return [];
    return applyCleaningOptions(mappedRecords, mapping, settings);
  }, [mappedRecords, mapping, settings]);

  const { filters } = useFilters();

  const filteredRecords = useMemo(() => {
    if (cleanedRecords.length === 0) return [];
    const startDate = filters?.dateRange?.start;
    const endDate = filters?.dateRange?.end;

    return cleanedRecords.filter((row) => {
      if (startDate && row.date && row.date < startDate) return false;
      if (endDate && row.date && row.date > endDate) return false;
      if (filters?.region && filters.region !== 'all' && row.region !== filters.region) return false;
      if (filters?.category && filters.category !== 'all' && row.category !== filters.category) return false;
      if (filters?.customerType && filters.customerType !== 'all' && row.customerType !== filters.customerType) return false;
      if (filters?.salesChannel && filters.salesChannel !== 'all' && row.salesChannel !== filters.salesChannel) return false;
      return true;
    });
  }, [cleanedRecords, filters]);

  const metrics = useMemo(() => {
    if (filteredRecords.length === 0) return null;
    return computeDynamicMetrics(filteredRecords, mapping);
  }, [filteredRecords, mapping]);

  const chartConfigs = useMemo(() => {
    if (filteredRecords.length === 0) return [];
    return generateChartConfigs(filteredRecords, mapping);
  }, [filteredRecords, mapping]);

  const insights = useMemo(() => {
    if (!metrics) return [];
    return generateDatasetInsights(metrics);
  }, [metrics]);

  useEffect(() => {
    if (!settings.savePreferences) return;
    const payload = JSON.stringify({ mapping, settings, fileName });
    window.localStorage.setItem(STORAGE_KEY, payload);
  }, [mapping, settings, fileName]);

  const exportCSV = () => {
    if (cleanedRecords.length === 0) return;
    const csv = generateCSVFromRecords(cleanedRecords);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute('download', `${fileName || 'dataset'}-export.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const exportExcel = () => {
    if (cleanedRecords.length === 0) return;
    const blob = generateExcelFile(cleanedRecords);
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute('download', `${fileName || 'dataset'}-export.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const exportJSON = () => {
    if (cleanedRecords.length === 0) return;
    const blob = new Blob([JSON.stringify(cleanedRecords, null, 2)], { type: 'application/json;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute('download', `${fileName || 'dataset'}-export.json`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const clearData = () => {
    setRawRecords([]);
    setHeaders([]);
    setMapping(createDefaultMapping());
    setFileName('dataset');
    setErrors([]);
    setWarnings([]);
  };

  const hasData = cleanedRecords.length > 0;

  return (
    <DataContext.Provider
      value={{
        rawRecords,
        headers,
        mapping,
        settings,
        fileName,
        errors,
        warnings,
        loading,
        mappedRecords,
        cleanedRecords,
        filteredRecords,
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
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useDataset = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useDataset must be used within DataProvider');
  }
  return context;
};

export const useDatasetLabels = () => FIELD_LABELS;
