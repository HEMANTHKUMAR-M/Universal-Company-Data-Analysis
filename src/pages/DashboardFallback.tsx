import React from 'react';
import { BarChart2, Users, DollarSign, PieChart } from 'lucide-react';

const KPICard: React.FC<{ title: string; value: string; icon: React.ReactNode }> = ({ title, value, icon }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex items-center gap-4">
    <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-600/20 rounded-md flex items-center justify-center text-indigo-600 dark:text-white">
      {icon}
    </div>
    <div>
      <div className="text-sm text-gray-500 dark:text-gray-300">{title}</div>
      <div className="text-xl font-semibold text-gray-900 dark:text-white">{value}</div>
    </div>
  </div>
);

const DashboardFallback: React.FC = () => {
  return (
    <div className="min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
        <KPICard title="Total Revenue" value="$124,320" icon={<DollarSign />} />
        <KPICard title="Active Users" value="4,820" icon={<Users />} />
        <KPICard title="Orders" value="1,230" icon={<BarChart2 />} />
        <KPICard title="Conversion" value="5.2%" icon={<PieChart />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Welcome</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">This is a lightweight starter dashboard. Use the sidebar to navigate to other pages. Authentication is optional — register or login from the sidebar.</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white">Quick Actions</h4>
          <div className="mt-4 grid gap-2">
            <button className="btn-primary">Create Report</button>
            <button className="btn-secondary">Export CSV</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardFallback;
