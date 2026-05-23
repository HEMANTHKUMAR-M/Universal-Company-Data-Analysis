import React from 'react';
import { Moon, Sun, Bell, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  isDark: boolean;
  setIsDark: (dark: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({ isDark, setIsDark }) => {
  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const { user, logout } = useAuth();

  return (
    <nav className="sticky top-0 bg-white dark:bg-gray-800 shadow-md border-b border-gray-200 dark:border-gray-700 z-30">
      <div className="flex items-center justify-between px-4 sm:px-6 py-4">
        {/* Left section - Title */}
        <div className="hidden sm:block">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Company Performance Analytics</h2>
        </div>

        {/* Right section - Actions */}
        <div className="flex items-center gap-4 ml-auto">
          {/* Theme toggle */}
          <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" title="Toggle theme">
            {isDark ? <Sun size={20} className="text-yellow-500" /> : <Moon size={20} className="text-gray-600" />}
          </button>

          {/* Notifications */}
          <button className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <Bell size={20} className="text-gray-600 dark:text-gray-300" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User profile / auth */}
          <div className="flex items-center gap-3 pl-3 border-l border-gray-200 dark:border-gray-700">
            {user ? (
              <>
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{user.displayName || user.email}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Member</p>
                </div>
                <button onClick={() => logout()} title="Logout" className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <LogOut size={14} className="text-white" />
                </button>
              </>
            ) : (
              <>
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Guest</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Sign in</p>
                </div>
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <User size={16} className="text-white" />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
