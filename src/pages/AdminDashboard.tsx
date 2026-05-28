import React, { useEffect, useMemo, useState } from 'react';
import { Bell, ShieldCheck, Zap, ArrowRight, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useDataset } from '../context/DataContext';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase/config';

type UserRole = 'admin' | 'analyst' | 'viewer';

type UserProfile = {
  uid: string;
  displayName?: string;
  email?: string;
  role: UserRole;
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
  const {
    rawRecords,
    mappedRecords,
    cleanedRecords,
    hasData,
    settings,
    mapping,
    exportCSV,
    exportExcel,
    exportJSON,
    clearData,
    setMissingValueStrategy,
    setDuplicateStrategy,
  } = useDataset();
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

  const ROLE_OPTIONS: UserRole[] = ['admin', 'analyst', 'viewer'];

  const handleRoleChange = async (uid: string, newRole: UserRole) => {
    await updateUserRole(uid, newRole);
    setActionMessage(`Updated role to ${newRole}`);
    await loadAdminData();
  };

  const totalFields = Object.keys(mapping).length;
  const mappedFieldCount = Object.values(mapping).filter(Boolean).length;
  const adminCount = users.filter((profile) => profile.role === 'admin').length;
  const analystCount = users.filter((profile) => profile.role === 'analyst').length;
  const viewerCount = users.filter((profile) => profile.role === 'viewer').length;

  const missingCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    mappedRecords.forEach((row) => {
      Object.entries(row).forEach(([field, value]) => {
        if (value === null || value === undefined || value === '') {
          counts[field] = (counts[field] || 0) + 1;
        }
      });
    });
    return counts;
  }, [mappedRecords]);

  const missingFields = useMemo(
    () => Object.entries(missingCounts).sort((a, b) => b[1] - a[1]).slice(0, 4),
    [missingCounts],
  );

  const totalMissingValues = useMemo(
    () => Object.values(missingCounts).reduce((sum, value) => sum + value, 0),
    [missingCounts],
  );

  const duplicateCount = useMemo(() => {
    const seen = new Set<string>();
    let duplicates = 0;
    cleanedRecords.forEach((row) => {
      const key = JSON.stringify(row);
      if (seen.has(key)) duplicates += 1;
      else seen.add(key);
    });
    return duplicates;
  }, [cleanedRecords]);

  const dataHealth = rawRecords.length ? Math.max(0, 100 - Math.round((totalMissingValues / rawRecords.length) * 100)) : 100;
  const urgentIssues = totalMissingValues + duplicateCount;

  const dirtyRows = useMemo(
    () => mappedRecords.filter((row) => Object.values(row).some((value) => value === null || value === undefined || value === '')),
    [mappedRecords],
  );

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

      <div className="space-y-6">
        <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-700 to-blue-600 text-white p-8 shadow-xl overflow-hidden relative">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.18),_transparent_40%)]" />
          <div className="relative flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-blue-200">Admin console</p>
              <h2 className="mt-3 text-4xl font-bold">Operations & governance</h2>
              <p className="mt-2 max-w-2xl text-sm text-blue-100/90">Manage users, datasets, audits, and system health from one centralized command center.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
              <div className="rounded-3xl bg-white bg-opacity-10 p-4">
                <p className="text-sm text-blue-100/80">Admins</p>
                <p className="mt-2 text-2xl font-semibold">{adminCount}</p>
              </div>
              <div className="rounded-3xl bg-white bg-opacity-10 p-4">
                <p className="text-sm text-blue-100/80">Analysts</p>
                <p className="mt-2 text-2xl font-semibold">{analystCount}</p>
              </div>
              <div className="rounded-3xl bg-white bg-opacity-10 p-4">
                <p className="text-sm text-blue-100/80">Viewers</p>
                <p className="mt-2 text-2xl font-semibold">{viewerCount}</p>
              </div>
              <div className="rounded-3xl bg-white bg-opacity-10 p-4">
                <p className="text-sm text-blue-100/80">Data health</p>
                <p className="mt-2 text-2xl font-semibold">{dataHealth}%</p>
              </div>
              <div className="rounded-3xl bg-white bg-opacity-10 p-4">
                <p className="text-sm text-blue-100/80">Issues</p>
                <p className="mt-2 text-2xl font-semibold">{urgentIssues}</p>
              </div>
            </div>
            <div className="mt-6 rounded-3xl bg-white/10 p-4 text-sm text-blue-100/90">
              <div className="mb-3 flex items-center justify-between gap-3">
                <span>Data health progress</span>
                <span className="font-semibold">{dataHealth}%</span>
              </div>
              <div className="h-3 rounded-full bg-white/20 overflow-hidden">
                <div className="h-full rounded-full bg-white" style={{ width: `${dataHealth}%` }} />
              </div>
            </div>
          </div>
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
        <div className="rounded-3xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-gray-950 p-6 shadow-sm">
          <div className="mb-4">
            <p className="text-sm font-medium uppercase text-blue-600 dark:text-blue-300">Dataset quality</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">Trusted data controls</h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Inspect and manage data quality from raw intake through cleaned analytics.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
              <p className="text-sm text-slate-500 dark:text-slate-400">Raw records</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{rawRecords.length}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
              <p className="text-sm text-slate-500 dark:text-slate-400">Cleaned rows</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{cleanedRecords.length}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
              <p className="text-sm text-slate-500 dark:text-slate-400">Mapped fields</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{mappedFieldCount}/{totalFields}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
              <p className="text-sm text-slate-500 dark:text-slate-400">Missing values</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{totalMissingValues}</p>
            </div>
          </div>
          <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm font-medium text-slate-900 dark:text-white">Current cleaning strategy</p>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Missing values: <span className="font-semibold text-slate-900 dark:text-white">{settings.missingValueStrategy}</span></p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Duplicate rows removed: <span className="font-semibold text-slate-900 dark:text-white">{duplicateCount}</span></p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Duplicate strategy: <span className="font-semibold text-slate-900 dark:text-white">{settings.duplicateStrategy}</span></p>
          </div>
          {missingFields.length > 0 && (
            <div className="mt-6">
              <p className="text-sm font-medium text-slate-900 dark:text-white">Fields with the most missing data</p>
              <ul className="mt-3 space-y-2 text-sm text-slate-500 dark:text-slate-400">
                {missingFields.map(([field, count]) => (
                  <li key={field} className="flex items-center justify-between rounded-2xl bg-white p-3 dark:bg-slate-950">
                    <span>{field}</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{count}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-gray-950 p-6 shadow-sm">
          <div className="mb-4">
            <p className="text-sm font-medium uppercase text-blue-600 dark:text-blue-300">Data operations</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">Admin dataset tools</h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Export, clear, and normalize the dataset directly from the admin console.</p>
          </div>
          <div className="grid gap-3">
            <button onClick={exportCSV} className="btn-secondary w-full">Export CSV</button>
            <button onClick={exportExcel} className="btn-secondary w-full">Export Excel</button>
            <button onClick={exportJSON} className="btn-secondary w-full">Export JSON</button>
            <button onClick={clearData} className="btn-secondary w-full text-red-700 border-red-200 hover:border-red-300 dark:text-red-300">Clear dataset</button>
          </div>
          <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">Data remediation</p>
            <div className="mt-3 space-y-3">
              <button onClick={() => setMissingValueStrategy('fill-average')} className="btn-secondary w-full">Fill missing values with average</button>
              <button onClick={() => setDuplicateStrategy('drop-duplicates')} className="btn-secondary w-full">Drop duplicates</button>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-gray-950 p-6 shadow-sm">
          <div className="mb-4">
            <p className="text-sm font-medium uppercase text-blue-600 dark:text-blue-300">Problem preview</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">Dirty record sample</h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Review a small sample of rows with missing fields for fast troubleshooting.</p>
          </div>
          {dirtyRows.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">No incomplete rows detected.</p>
          ) : (
            <div className="space-y-3">
              {dirtyRows.slice(0, 3).map((row, idx) => (
                <div key={idx} className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
                  <div className="text-sm text-slate-500 dark:text-slate-400">Row {idx + 1}</div>
                  <pre className="mt-2 overflow-x-auto text-xs text-slate-700 dark:text-slate-200">{JSON.stringify(row, null, 2)}</pre>
                </div>
              ))}
            </div>
          )}
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
                    <td className="px-4 py-4 text-slate-900 dark:text-slate-100">
                      <select
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                        value={profile.role}
                        onChange={(e) => handleRoleChange(profile.uid, e.target.value as UserRole)}
                      >
                        {ROLE_OPTIONS.map((roleOption) => (
                          <option key={roleOption} value={roleOption}>
                            {roleOption.charAt(0).toUpperCase() + roleOption.slice(1)}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-4 text-slate-500 dark:text-slate-300">{profile.lastSeen || 'Never'}</td>
                    <td className="px-4 py-4 text-right text-sm font-medium text-slate-600 dark:text-slate-400">Select to update</td>
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
