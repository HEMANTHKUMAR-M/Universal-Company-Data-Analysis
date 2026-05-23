import React from 'react';

const LoadingSpinner: React.FC<{ size?: number }> = ({ size = 24 }) => {
  return (
    <div className="flex items-center justify-center">
      <svg className="animate-spin text-indigo-600" width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.2" strokeWidth="4"></circle>
        <path d="M22 12a10 10 0 00-10-10" stroke="currentColor" strokeWidth="4" strokeLinecap="round"></path>
      </svg>
    </div>
  );
};

export default LoadingSpinner;
