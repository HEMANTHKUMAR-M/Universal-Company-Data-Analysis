import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Mail, Key, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';

type FormValues = {
  email: string;
  password: string;
};

interface AdminLoginProps {
  setCurrentPage?: (page: string) => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ setCurrentPage }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({ mode: 'onTouched' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login, loginWithGoogle } = useAuth();

  const navigateTo = (page: string) => {
    if (setCurrentPage) {
      setCurrentPage(page);
    } else {
      window.dispatchEvent(new CustomEvent('navigateTo', { detail: page }));
    }
  };

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    setError(null);
    try {
      const role = await login(data.email, data.password);
      if (role === 'admin') {
        navigateTo('admin');
      } else {
        setError('Your account does not have admin access.');
      }
    } catch (err: any) {
      setError(err.message || 'Admin sign-in failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      const role = await loginWithGoogle();
      if (role === 'admin') {
        navigateTo('admin');
      } else {
        setError('Google account does not have admin access.');
      }
    } catch (err: any) {
      setError(err.message || 'Google sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        <div className="hidden lg:flex flex-col items-center justify-center p-12 bg-gradient-to-br from-slate-900 to-slate-700 text-white">
          <div className="mb-6 rounded-3xl bg-white/10 p-8">
            <ShieldCheck size={48} className="text-blue-300" />
          </div>
          <h2 className="text-3xl font-bold">Administrator Access</h2>
          <p className="mt-4 text-sm text-slate-200 max-w-sm">Sign in with your admin credentials to manage users, datasets, reports, and system-level features.</p>
        </div>

        <div className="p-8 sm:p-12">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-slate-900 rounded-md flex items-center justify-center text-white font-bold">AD</div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Login</h1>
                <p className="text-sm text-gray-500 dark:text-gray-300">Use your admin account to manage users and dataset workflows.</p>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-lg mb-4 text-sm bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Admin email</label>
                <div className={`mt-1 relative rounded-md shadow-sm ${errors.email ? 'ring-2 ring-red-500' : ''}`}>
                  <input
                    type="email"
                    placeholder="admin@company.com"
                    className="input-field w-full pl-10"
                    {...register('email', { required: 'Email is required', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email address' } })}
                  />
                  <span className="absolute left-3 top-2.5 text-gray-400"><Mail size={18} /></span>
                </div>
                {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                <div className={`mt-1 relative rounded-md shadow-sm ${errors.password ? 'ring-2 ring-red-500' : ''}`}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter password"
                    className="input-field w-full pl-10 pr-12"
                    {...register('password', { required: 'Password is required' })}
                  />
                  <span className="absolute left-3 top-2.5 text-gray-400"><Key size={18} /></span>
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-2 text-gray-500">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>}
              </div>

              <button type="submit" className="w-full btn-primary flex items-center justify-center gap-3">
                {loading ? <LoadingSpinner size={18} /> : 'Continue as admin'}
              </button>

              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                <div className="text-xs text-gray-400 uppercase">or</div>
                <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
              </div>

              <button type="button" onClick={handleGoogleSignIn} className="btn-secondary w-full">
                Continue with Google
              </button>

              <div className="text-center pt-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Not an admin?{' '}
                  <button
                    type="button"
                    onClick={() => navigateTo('login')}
                    className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                  >
                    Go to standard login
                  </button>
                </p>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
