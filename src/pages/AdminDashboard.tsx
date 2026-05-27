import React, { useEffect, useMemo, useState } from 'react';
import { Bell, ShieldCheck, Zap, ArrowRight, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useDataset } from '../context/DataContext';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase/config';

type UserProfile = {
  uid: string;
  displayName?: string;
  email?: string;
  role: 'admin' | 'analyst' | 'viewer';
  createdAt: string | null;
  lastSeen: string | null;
};

type ActivityLog = {
  id: string;
  message: string;
  userEmail?: string;
  createdAt: string | null;
};

const AdminDashboard: React.FC = () => {
  const { isAdmin, fetchUsers, updateUserRole } = useAuth();
  const { cleanedRecords, hasData } = useDataset();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [, setLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const loadedUsers = await fetchUsers();
      setUsers(loadedUsers);

      const logsQuery = query(collection(db, 'activityLogs'), orderBy('createdAt', 'desc'));
      const logsSnapshot = await getDocs(logsQuery);
      const loadedLogs = logsSnapshot.docs.slice(0, 8).map((docSnapshot) => {
        const data = docSnapshot.data() as any;
        return {
          id: docSnapshot.id,
          message: data.message || 'No activity data',
          userEmail: data.userEmail || 'system',
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toLocaleString() : String(data.createdAt || ''),
        };
      });
      setLogs(loadedLogs);
    } catch (error) {
      console.error('Admin load failed', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAdmin) return;
    loadAdminData();
  }, [isAdmin]);

  const handleRoleChange = async (uid: string, currentRole: string) => {
    const nextRole = currentRole === 'admin' ? 'analyst' : 'admin';
    await updateUserRole(uid, nextRole as 'admin' | 'analyst' | 'viewer');
    setActionMessage(`Updated role to ${nextRole}`);
    await loadAdminData();
  };

  const recentReports = useMemo(
    () => [
      { name: 'Executive Sales Brief', status: 'Published', owner: 'Analytics Team' },
      { name: 'Regional Growth Review', status: 'Draft', owner: 'Data Ops' },
      { name: 'Profit Margin Audit', status: 'Scheduled', owner: 'Finance' },
    ],
    [],
  );

  if (!isAdmin) {
    return (
      <div className="min-h-[70vh] rounded-3xl border border-red-200 bg-red-50 p-8 text-center text-red-700 dark:border-red-700 dark:bg-red-950 dark:text-red-200">
        <div className="mx-auto max-w-xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-red-100 px-4 py-2 text-sm font-semibold text-red-700 dark:bg-red-900 dark:text-red-200">
            <ShieldCheck size={18} /> Admin access required
          </div>
          <h1 className="text-3xl font-semibold">Access denied</h1>
          <p className="mt-3 text-sm text-red-700/80 dark:text-red-200/80">This page is reserved for administrators. Please contact an existing admin if you believe this is an error.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-gray-950 p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-medium uppercase text-blue-600 dark:text-blue-300">Admin Panel</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">Company Performance Command Center</h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Monitor datasets, manage users, review reports, and audit activity logs from a secure admin console.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button onClick={() => setNotificationsEnabled((active) => !active)} className="btn-primary inline-flex items-center gap-2">
              <Bell size={18} /> {notificationsEnabled ? 'Disable notifications' : 'Enable notifications'}
            </button>
            <button onClick={loadAdminData} className="btn-secondary inline-flex items-center gap-2">
              <ArrowRight size={18} /> Refresh data
            </button>
          </div>
        </div>

        {actionMessage && (
          <div className="mt-6 rounded-3xl border border-green-200 bg-green-50 p-4 text-sm text-green-800 dark:border-green-700 dark:bg-green-950 dark:text-green-200">
            {actionMessage}
          </div>
        )}
      </div>

      <div className="grid gap-6 xl:grid-cols-4">
        <div className="rounded-3xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-gray-950 p-6 shadow-sm">
          <p className="text-sm text-slate-500 dark:text-slate-400">Active datasets</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">{hasData ? cleanedRecords.length : 0}</p>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Rows available in the active dataset.</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-gray-950 p-6 shadow-sm">
          <p className="text-sm text-slate-500 dark:text-slate-400">Registered users</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">{users.length}</p>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Users currently stored in your Firestore directory.</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-gray-950 p-6 shadow-sm">
          <p className="text-sm text-slate-500 dark:text-slate-400">Recent reports</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">{recentReports.length}</p>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Reports tracked through the management console.</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-gray-950 p-6 shadow-sm">
          <p className="text-sm text-slate-500 dark:text-slate-400">Activity log</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">{logs.length}</p>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Latest actions captured by the system.</p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2 rounded-3xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-gray-950 p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">User management</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Approve, promote, or audit users with role-based controls.</p>
            </div>
            <div className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-200">Secure role access</div>
          </div>
          <div className="overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800 text-sm">
              <thead className="bg-slate-50 dark:bg-slate-900">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-slate-500 dark:text-slate-400">Name</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500 dark:text-slate-400">Email</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500 dark:text-slate-400">Role</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500 dark:text-slate-400">Last active</th>
                  <th className="px-4 py-3 text-right font-medium text-slate-500 dark:text-slate-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {users.map((profile) => (
                  <tr key={profile.uid}>
                    <td className="px-4 py-4 text-slate-900 dark:text-slate-100">{profile.displayName || 'Unknown user'}</td>
                    <td className="px-4 py-4 text-slate-500 dark:text-slate-300">{profile.email || '—'}</td>
                    <td className="px-4 py-4 text-slate-900 dark:text-slate-100">{profile.role}</td>
                    <td className="px-4 py-4 text-slate-500 dark:text-slate-300">{profile.lastSeen || 'Never'}</td>
                    <td className="px-4 py-4 text-right">
                      <button
                        onClick={() => handleRoleChange(profile.uid, profile.role)}
                        className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition-colors"
                      >
                        {profile.role === 'admin' ? 'Revoke admin' : 'Promote admin'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6 rounded-3xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-gray-950 p-6 shadow-sm">
          <div>
            <div className="flex items-center gap-3 text-slate-900 dark:text-white">
              <Settings size={20} />
              <div>
                <p className="text-lg font-semibold">System settings</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Toggle admin behavior and notifications.</p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 dark:border-slate-800 dark:bg-slate-900">
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">Notifications</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Enable security alerts and admin updates.</p>
              </div>
              <button
                onClick={() => setNotificationsEnabled((active) => !active)}
                className={`rounded-full px-4 py-2 text-sm font-semibold ${notificationsEnabled ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-900 dark:bg-slate-800 dark:text-slate-200'}`}
              >
                {notificationsEnabled ? 'Enabled' : 'Disabled'}
              </button>
            </div>

            <div className="rounded-3xl bg-slate-50 p-4 dark:bg-slate-900">
              <p className="text-sm text-slate-500 dark:text-slate-400">API & Security</p>
              <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">Use Firebase Authentication and Firestore rules to enforce admin-only access at the backend.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-gray-950 p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Activity log</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Recent administration events from Firestore.</p>
            </div>
            <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">Live sync</div>
          </div>
          <div className="space-y-4">
            {logs.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">No activity has been recorded yet.</p>
            ) : (
              logs.map((log) => (
                <div key={log.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
                  <div className="flex items-center justify-between gap-4 text-sm text-slate-500 dark:text-slate-400">
                    <span>{log.userEmail}</span>
                    <span>{log.createdAt}</span>
                  </div>
                  <p className="mt-2 text-slate-900 dark:text-slate-100">{log.message}</p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-gray-950 p-6 shadow-sm">
          <div className="flex items-center gap-3 text-slate-900 dark:text-white mb-4">
            <Zap size={20} />
            <div>
              <h2 className="text-xl font-semibold">Report management</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Track report status and owner assignments.</p>
            </div>
          </div>
          <div className="space-y-4">
            {recentReports.map((report) => (
              <div key={report.name} className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">{report.name}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Owner: {report.owner}</p>
                  </div>
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-200">{report.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
