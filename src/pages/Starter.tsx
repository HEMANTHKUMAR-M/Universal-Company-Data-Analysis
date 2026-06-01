import React from 'react';
import { Sparkles, UploadCloud, BarChart3 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Starter: React.FC = () => {
  const { user } = useAuth();

  const navigateTo = (page: string) => {
    window.dispatchEvent(new CustomEvent('navigateTo', { detail: page }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-3 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-cyan-200 ring-1 ring-white/10 backdrop-blur-sm">
              <Sparkles size={18} /> Built for fast insights and executive clarity
            </div>

            <div className="space-y-6">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl text-white">
                Turn raw business data into beautiful analytics
              </h1>
              <p className="max-w-2xl text-base text-slate-300 sm:text-lg">
                Upload your dataset, map your business fields, and let the dashboard produce visual KPIs, growth charts, and reports designed for decision makers.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <button
                type="button"
                onClick={() => navigateTo(user ? 'upload' : 'login')}
                className="btn-primary flex items-center justify-center gap-2"
              >
                <UploadCloud size={18} /> {user ? 'Upload Dataset' : 'Login to continue'}
              </button>

              <button
                type="button"
                onClick={() => navigateTo(user ? 'dashboard' : 'register')}
                className="btn-secondary flex items-center justify-center gap-2"
              >
                <BarChart3 size={18} /> {user ? 'Open Dashboard' : 'Create account'}
              </button>

              {/* admin login removed */}
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-cyan-500/10 backdrop-blur-xl">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-200">Fast start</p>
                <h2 className="mt-4 text-2xl font-semibold text-white">Setup in minutes</h2>
                <p className="mt-3 text-sm text-slate-300">Authenticate, upload your dataset, and watch the dashboard come alive with analytics.</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-violet-500/10 backdrop-blur-xl">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-violet-200">Insight-led</p>
                <h2 className="mt-4 text-2xl font-semibold text-white">Guided analytics</h2>
                <p className="mt-3 text-sm text-slate-300">Follow the intuitive workflow to map fields and generate KPIs, charts, and reports.</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-blue-500/10 backdrop-blur-xl">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-200">Secure</p>
                <h2 className="mt-4 text-2xl font-semibold text-white">Role-based access</h2>
                <p className="mt-3 text-sm text-slate-300">Admin, analyst, and viewer roles keep your data and insights protected.</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-slate-950/40 backdrop-blur-xl">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-300">Getting started</p>
                <h3 className="mt-3 text-2xl font-semibold text-white">Your standard analytics onboarding</h3>
                <p className="mt-4 text-sm leading-6 text-slate-300">Follow a simple workflow that takes you from data upload to meaningful business insights without extra complexity.</p>
              </div>

              <div className="mt-8 space-y-4">
                {[
                  {
                    title: '1. Authenticate',
                    description: 'Sign in with email or Google and access your workspace securely.',
                  },
                  {
                    title: '2. Upload data',
                    description: 'Add CSV, Excel, or JSON files and map columns to business fields.',
                  },
                  {
                    title: '3. View insights',
                    description: 'Explore dashboards, reports, and export options to track performance.',
                  },
                ].map((item) => (
                  <div key={item.title} className="rounded-3xl bg-slate-950/85 p-5 ring-1 ring-white/10">
                    <p className="text-sm font-semibold text-cyan-300">{item.title}</p>
                    <p className="mt-2 text-sm text-slate-300">{item.description}</p>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => navigateTo(user ? 'upload' : 'login')}
                className="mt-8 w-full rounded-3xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
              >
                {user ? 'Start uploading' : 'Login to begin'}
              </button>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-950/75 p-6 shadow-2xl shadow-slate-950/30">
              <div className="flex items-center gap-3 text-slate-100">
                <Sparkles size={20} />
                <p className="text-sm font-medium">Secure workflows for every team.</p>
              </div>
              <div className="mt-6 grid gap-3">
                <div className="rounded-3xl bg-slate-900/80 px-4 py-4">
                  <p className="text-sm text-slate-400">Simple setup</p>
                  <p className="mt-2 text-white font-semibold">Fast data onboarding</p>
                </div>
                <div className="rounded-3xl bg-slate-900/80 px-4 py-4">
                  <p className="text-sm text-slate-400">Built-in analytics</p>
                  <p className="mt-2 text-white font-semibold">Insights and exports</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Starter;
