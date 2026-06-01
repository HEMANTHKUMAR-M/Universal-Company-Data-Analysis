import React, { useState } from 'react';
import { Settings, Moon, Sun, Bell, Lock, User, Database, UploadCloud, BarChart3, ArrowRight } from 'lucide-react';
import { useDataset } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';

interface SettingsProps {
  isDark: boolean;
  setIsDark: (dark: boolean) => void;
}

const SettingsPage: React.FC<SettingsProps> = ({ isDark, setIsDark }) => {
  const [selectedSection, setSelectedSection] = useState('general');
  const [settings, setSettings] = useState({
    notifications: true,
    emailAlerts: true,
    darkMode: isDark,
    autoRefresh: true,
    refreshInterval: 300,
  });
  const { fileName, headers, cleanedRecords, hasData, clearData } = useDataset();
  const { user, role } = useAuth();

  const navigateTo = (page: string) => {
    window.dispatchEvent(new CustomEvent('navigateTo', { detail: page }));
  };

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
        <p className="text-gray-600 dark:text-gray-400">Manage your dashboard preferences and keep your BI workflow aligned.</p>
      </div>

      <div className="grid gap-4 mb-8 xl:grid-cols-4">
        <div className="card p-6">
          <div className="flex items-center gap-3 text-blue-600 dark:text-blue-300 mb-4">
            <Database size={20} />
            <div>
              <p className="text-sm font-medium">Dataset Status</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Ready for analysis</p>
            </div>
          </div>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">{hasData ? 'Live' : 'Waiting'}</p>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{hasData ? `${cleanedRecords.length} rows mapped` : 'Upload a dataset to continue'}</p>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-3 text-green-600 dark:text-green-300 mb-4">
            <UploadCloud size={20} />
            <div>
              <p className="text-sm font-medium">Dataset File</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Current upload</p>
            </div>
          </div>
          <p className="text-xl font-semibold text-gray-900 dark:text-white">{fileName || 'No file uploaded'}</p>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{headers.length ? `${headers.length} columns mapped` : 'Upload and map your fields'}</p>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-3 text-indigo-600 dark:text-indigo-300 mb-4">
            <BarChart3 size={20} />
            <div>
              <p className="text-sm font-medium">Flow Reminder</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Follow the BI flow</p>
            </div>
          </div>
          <p className="text-xl font-semibold text-gray-900 dark:text-white">Step 2</p>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Upload dataset, map columns, then generate analytics.</p>
        </div>

        <div className="card p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 text-slate-700 dark:text-slate-200 mb-4">
              <ArrowRight size={20} />
              <div>
                <p className="text-sm font-medium">Quick Actions</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Open the next step</p>
              </div>
            </div>
            <button onClick={() => navigateTo('upload')} className="btn-primary w-full mb-3">Upload dataset</button>
            <button onClick={() => clearData()} className="btn-secondary w-full">Clear current dataset</button>
          </div>
        </div>
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
              { id: 'account', label: 'Account', icon: User },
              { id: 'security', label: 'Security', icon: Lock },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = selectedSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedSection(item.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center gap-2 ${
                    isActive
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <Icon size={18} />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* General Settings */}
          {selectedSection === 'general' && (
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
          )}

          {/* Notification Settings */}
          {selectedSection === 'notifications' && (
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
          )}

          {/* Account Settings */}
          {selectedSection === 'account' && (
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Account</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  defaultValue={user?.displayName || 'User'}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  defaultValue={user?.email || 'user@example.com'}
                  className="input-field"
                  disabled
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Role
                </label>
                <select className="select-field" disabled>
                  <option>{role ? role.charAt(0).toUpperCase() + role.slice(1) : 'Viewer'}</option>
                </select>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Contact an administrator to change your role</p>
              </div>

              <button className="btn-primary w-full">Save Changes</button>
            </div>
          </div>
          )}

          {/* Security Settings */}
          {selectedSection === 'security' && (
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
          </div>          )}        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
