import React from 'react';
import { Menu, X, BarChart3, TrendingUp, Users, Package, Globe, FileText, Settings, Home, LogIn, UserPlus, Lightbulb, UploadCloud } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  currentPage: string;
  setCurrentPage: (page: string) => void;
  isAuthenticated: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen, currentPage, setCurrentPage, isAuthenticated }) => {
  const menuItems = [
    { id: 'upload', label: 'Upload Dataset', icon: UploadCloud },
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'sales', label: 'Sales Analytics', icon: TrendingUp },
    { id: 'profit', label: 'Profit Analytics', icon: BarChart3 },
    { id: 'customers', label: 'Customer Insights', icon: Users },
    { id: 'products', label: 'Product Performance', icon: Package },
    { id: 'regions', label: 'Regional Analysis', icon: Globe },
    { id: 'insights', label: 'Insights & Reports', icon: Lightbulb },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
    ...(!isAuthenticated
      ? [
          { id: 'register', label: 'Register', icon: UserPlus },
          { id: 'login', label: 'Login', icon: LogIn },
        ]
      : []),
  ];

  return (
    <>
      {/* Mobile toggle button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 text-white bg-blue-600 rounded-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed lg:static left-0 top-0 h-screen w-64 bg-gray-900 dark:bg-gray-950 text-white transition-all duration-300 z-40 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <BarChart3 size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold">BI Dashboard</h1>
              <p className="text-xs text-gray-400">Analytics Platform</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentPage(item.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Icon size={20} />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700">
          <p className="text-xs text-gray-500 text-center">© 2024 BI Dashboard</p>
          <p className="text-xs text-gray-600 text-center mt-1">Version 1.0</p>
        </div>
      </aside>

      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
