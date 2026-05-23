import React from 'react';
import { Filter, X } from 'lucide-react';
import { useFilters } from '../context/FilterContext';

const FilterBar: React.FC = () => {
  const { filters, setFilters } = useFilters();
  const [local, setLocal] = React.useState({
    start: filters.dateRange?.start || '',
    end: filters.dateRange?.end || '',
    region: filters.region || 'all',
    category: filters.category || 'all',
    customerType: filters.customerType || 'all',
    salesChannel: filters.salesChannel || 'all',
  });

  const [showFilters, setShowFilters] = React.useState(true);

  const apply = () => {
    setFilters({
      dateRange: { start: local.start, end: local.end },
      region: local.region,
      category: local.category,
      customerType: local.customerType,
      salesChannel: local.salesChannel,
    });
  };

  const reset = () => {
    const resetState = { start: '', end: '', region: 'all', category: 'all', customerType: 'all', salesChannel: 'all' };
    setLocal(resetState);
    setFilters({ dateRange: { start: '', end: '' }, region: 'all', category: 'all', customerType: 'all', salesChannel: 'all' });
  };

  return (
    <div className="card mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter size={20} className="text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h3>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="lg:hidden p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
        >
          {showFilters ? <X size={20} /> : <Filter size={20} />}
        </button>
      </div>

      {showFilters && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Start Date</label>
            <input type="date" className="input-field" value={local.start} onChange={e => setLocal({ ...local, start: e.target.value })} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">End Date</label>
            <input type="date" className="input-field" value={local.end} onChange={e => setLocal({ ...local, end: e.target.value })} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Region</label>
            <select className="select-field" value={local.region} onChange={e => setLocal({ ...local, region: e.target.value })}>
              <option value="all">All Regions</option>
              <option value="North America">North America</option>
              <option value="Europe">Europe</option>
              <option value="Asia Pacific">Asia Pacific</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
            <select className="select-field" value={local.category} onChange={e => setLocal({ ...local, category: e.target.value })}>
              <option value="all">All Categories</option>
              <option value="Electronics">Electronics</option>
              <option value="Furniture">Furniture</option>
              <option value="Accessories">Accessories</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Customer Type</label>
            <select className="select-field" value={local.customerType} onChange={e => setLocal({ ...local, customerType: e.target.value })}>
              <option value="all">All</option>
              <option value="enterprise">Enterprise</option>
              <option value="small">Small Business</option>
              <option value="consumer">Consumer</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Sales Channel</label>
            <select className="select-field" value={local.salesChannel} onChange={e => setLocal({ ...local, salesChannel: e.target.value })}>
              <option value="all">All</option>
              <option value="Online">Online</option>
              <option value="Direct">Direct</option>
              <option value="Partner">Partner</option>
            </select>
          </div>
        </div>
      )}

      {showFilters && (
        <div className="flex gap-3 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button onClick={reset} className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">Reset Filters</button>
          <button onClick={apply} className="flex-1 btn-primary">Apply Filters</button>
        </div>
      )}
    </div>
  );
};

export default FilterBar;
