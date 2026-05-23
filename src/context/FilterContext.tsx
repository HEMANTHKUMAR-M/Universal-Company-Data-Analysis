import React, { createContext, useContext, useState } from 'react';

export type Filters = {
  dateRange?: { start?: string; end?: string };
  region?: string;
  category?: string;
  customerType?: string;
  salesChannel?: string;
};

type FilterContextValue = {
  filters: Filters;
  setFilters: (f: Filters) => void;
};

const FilterContext = createContext<FilterContextValue | undefined>(undefined);

export const FilterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [filters, setFilters] = useState<Filters>({
    dateRange: { start: '', end: '' },
    region: 'all',
    category: 'all',
    customerType: 'all',
    salesChannel: 'all',
  });

  return (
    <FilterContext.Provider value={{ filters, setFilters }}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilters = () => {
  const ctx = useContext(FilterContext);
  if (!ctx) throw new Error('useFilters must be used within FilterProvider');
  return ctx;
};

export default FilterContext;
