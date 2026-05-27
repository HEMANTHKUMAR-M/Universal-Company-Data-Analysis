import React from 'react';
import { Sparkles, UploadCloud, BarChart3, ShieldCheck, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Starter: React.FC = () => {
  const { user } = useAuth();

  const navigateTo = (page: string) => {
    window.dispatchEvent(new CustomEvent('navigateTo', { detail: page }));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr] items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 px-4 py-2 text-sm font-medium">
              <Sparkles size={18} /> Professional BI-style analytics
            </div>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Launch your analytics journey with modern BI flow.</h1>
            <p className="max-w-2xl text-base text-slate-600 dark:text-slate-300">Start with an elegant landing page, authenticate with Google or email, upload your dataset, map columns, and generate a powerful dashboard with charts, scorecards, and insights.</p>

            <div className="grid gap-4 sm:grid-cols-2">
              <button
                onClick={() => navigateTo(user ? 'upload' : 'login')}
                className="btn-primary flex items-center justify-center gap-2"
              >
                <UploadCloud size={18} /> {user ? 'Upload Dataset' : 'Login to continue'}
              </button>
              <button
                onClick={() => navigateTo(user ? 'dashboard' : 'register')}
                className="btn-secondary flex items-center justify-center gap-2"
              >
                <BarChart3 size={18} /> {user ? 'Open Dashboard' : 'Create account'}
              </button>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900 p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="mt-1 rounded-2xl bg-blue-600 p-3 text-white">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Secure, guided setup</h2>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Your first step is to authenticate, then upload a dataset and map your columns. Once your data is ready, the dashboard generates charts automatically.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            {[
              {
                title: 'Step 1',
                label: user ? 'Signed in' : 'Authenticate',
                description: user
                  ? 'You are signed in and ready to upload a dataset.'
                  : 'Sign in with email or Google to access your dashboard.',
              },
              {
                title: 'Step 2',
                label: 'Upload dataset',
                description: 'Add your CSV, Excel, or JSON file and map business fields for instant analytics.',
              },
              {
                title: 'Step 3',
                label: 'Generate insights',
                description: 'View KPI cards, trend charts, regional breakdowns, and executive reports.',
              },
            ].map((block) => (
              <div key={block.title} className="rounded-3xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900 p-6 shadow-sm">
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-300">{block.title}</span>
                <h3 className="mt-3 text-xl font-semibold text-slate-900 dark:text-white">{block.label}</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{block.description}</p>
              </div>
            ))}

            <div className="rounded-3xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900 p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Need inspiration?</p>
                  <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">Start with the sample dataset or upload your own.</p>
                </div>
                <button
                  onClick={() => navigateTo(user ? 'upload' : 'login')}
                  className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 transition-colors"
                >
                  Begin now <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Starter;
