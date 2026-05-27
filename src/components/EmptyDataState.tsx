import React from 'react';
import { Upload } from 'lucide-react';

interface EmptyDataStateProps {
  title?: string;
  description?: string;
  showUploadHint?: boolean;
}

export const EmptyDataState: React.FC<EmptyDataStateProps> = ({
  title = 'No Data Available',
  description = 'Upload a dataset to view analytics and insights.',
  showUploadHint = true,
}) => (
  <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 py-12 px-6 text-center">
    <div className="w-16 h-16 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
      <Upload size={32} className="text-gray-400 dark:text-gray-600" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
    <p className="text-sm text-gray-600 dark:text-gray-400 max-w-sm mb-4">{description}</p>
    {showUploadHint && (
      <p className="text-xs text-gray-500 dark:text-gray-500">
        Go to <span className="font-semibold">Dashboard</span> and upload a CSV, Excel, or JSON file to get started.
      </p>
    )}
  </div>
);

export default EmptyDataState;
