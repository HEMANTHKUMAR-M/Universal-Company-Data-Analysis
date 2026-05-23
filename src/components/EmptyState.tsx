import React from 'react';
import { FileText } from 'lucide-react';

const EmptyState: React.FC<{ title?: string; description?: string }> = ({ title = 'No data', description = 'No records match the current filters.' }) => {
  return (
    <div className="empty-state">
      <div className="mx-auto w-16 h-16 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
        <FileText size={28} className="text-gray-500 dark:text-gray-200" />
      </div>
      <div className="title">{title}</div>
      <div className="desc">{description}</div>
    </div>
  );
};

export default EmptyState;
