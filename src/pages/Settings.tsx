import React from 'react';
import { Settings, Moon, Sun, Bell, Lock, User } from 'lucide-react';

interface SettingsProps {
  isDark: boolean;
  setIsDark: (dark: boolean) => void;
}

const SettingsPage: React.FC<SettingsProps> = ({ isDark, setIsDark }) => {
  const [settings, setSettings] = React.useState({
    notifications: true,
    emailAlerts: true,
    darkMode: isDark,
    autoRefresh: true,
    refreshInterval: 300,
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    if (key === 'darkMode') {
      setIsDark(value);
    }
  };

  return (
    <div className="fade-in">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage your dashboard preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings Menu */}
        <div className="card h-fit">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Settings size={20} />
            Settings Menu
          </h3>
          <nav className="space-y-2">
            {[
              { id: 'general', label: 'General', icon: Settings },
              { id: 'notifications', label: 'Notifications', icon: Bell },
              { id: 'security', label: 'Security', icon: Lock },
              { id: 'account', label: 'Account', icon: User },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2 text-gray-700 dark:text-gray-300"
                >
                  <Icon size={18} />
                  <span className="text-sm">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* General Settings */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">General Settings</h2>
            
            <div className="space-y-4">
              {/* Theme */}
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center gap-3">
                  {isDark ? <Moon size={20} /> : <Sun size={20} />}
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Theme</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Choose light or dark mode</p>
                  </div>
                </div>
                <button
                  onClick={() => handleSettingChange('darkMode', !settings.darkMode)}
                  className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                    settings.darkMode ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                      settings.darkMode ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Auto-refresh */}
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Auto-Refresh</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Automatically refresh data</p>
                </div>
                <button
                  onClick={() => handleSettingChange('autoRefresh', !settings.autoRefresh)}
                  className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                    settings.autoRefresh ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                      settings.autoRefresh ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Refresh Interval */}
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="font-medium text-gray-900 dark:text-white mb-2">Refresh Interval (seconds)</p>
                <input
                  type="range"
                  min="60"
                  max="600"
                  step="60"
                  value={settings.refreshInterval}
                  onChange={(e) => handleSettingChange('refreshInterval', Number(e.target.value))}
                  className="w-full"
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Current: {settings.refreshInterval}s</p>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Notifications</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Enable Notifications</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Receive dashboard notifications</p>
                </div>
                <button
                  onClick={() => handleSettingChange('notifications', !settings.notifications)}
                  className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                    settings.notifications ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                      settings.notifications ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Email Alerts</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Send email notifications</p>
                </div>
                <button
                  onClick={() => handleSettingChange('emailAlerts', !settings.emailAlerts)}
                  className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                    settings.emailAlerts ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                      settings.emailAlerts ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Account Settings */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Account</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  defaultValue="Admin User"
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  defaultValue="admin@bidashboard.com"
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Role
                </label>
                <select className="select-field">
                  <option>Manager</option>
                  <option>Analyst</option>
                  <option>Viewer</option>
                </select>
              </div>

              <button className="btn-primary w-full">Save Changes</button>
            </div>
          </div>

          {/* Security Settings */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Security</h2>
            
            <div className="space-y-4">
              <button className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left">
                <p className="font-medium text-gray-900 dark:text-white">Change Password</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Update your password</p>
              </button>

              <button className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left">
                <p className="font-medium text-gray-900 dark:text-white">Two-Factor Authentication</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Enable 2FA for extra security</p>
              </button>

              <button className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left">
                <p className="font-medium text-gray-900 dark:text-white">Active Sessions</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Manage your active sessions</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
