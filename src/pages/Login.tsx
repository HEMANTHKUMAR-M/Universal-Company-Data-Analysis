import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Mail, Key, Eye, EyeOff } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';

type FormValues = {
  email: string;
  password: string;
  remember: boolean;
};

interface LoginProps {
  setCurrentPage?: (page: string) => void;
}

const Login: React.FC<LoginProps> = ({ setCurrentPage }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({ mode: 'onTouched' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login, loginWithGoogle, resetPassword } = useAuth();

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    setError(null);
    try {
      await login(data.email, data.password);
      setLoading(false);
      if (setCurrentPage) {
        setCurrentPage('upload');
      }
    } catch (err: any) {
      setLoading(false);
      setError(err.message || 'Login failed');
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      await loginWithGoogle();
      setLoading(false);
      if (setCurrentPage) {
        setCurrentPage('upload');
      }
    } catch (err: any) {
      setLoading(false);
      setError(err.message || 'Google sign-in failed');
    }
  };

  const handleForgot = async () => {
    const email = (document.querySelector('input[name="email"]') as HTMLInputElement)?.value;
    if (!email) {
      setError('Please enter your email to reset password');
      return;
    }
    try {
      await resetPassword(email);
      setError('Password reset email sent successfully!');
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">

        {/* Illustration / Banner */}
        <div className="hidden lg:flex flex-col items-center justify-center p-12 bg-gradient-to-br from-indigo-600 to-indigo-500 text-white">
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <div className="mb-6 w-56 h-56 bg-white bg-opacity-10 rounded-xl flex items-center justify-center">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 12h18" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M3 6h18" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
                <path d="M3 18h18" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold">Company Performance</h2>
            <p className="mt-3 text-indigo-100 max-w-xs">Business Intelligence Dashboard — insights, analytics and reporting for your enterprise.</p>
          </motion.div>
        </div>

        {/* Login form */}
        <div className="p-8 sm:p-12">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-indigo-600 rounded-md flex items-center justify-center text-white font-bold">CP</div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Company Performance Analytics</h1>
                <p className="text-sm text-gray-500 dark:text-gray-300">Secure Business Intelligence Analytics Platform</p>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-3 rounded-lg mb-4 text-sm ${
                  error.includes('successfully') 
                    ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800'
                    : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'
                }`}
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                <div className={`mt-1 relative rounded-md shadow-sm ${errors.email ? 'ring-2 ring-red-500' : ''}`}>
                  <input
                    type="email"
                    placeholder="you@company.com"
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
                    placeholder="Enter your password"
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

              <div className="flex items-center justify-between">
                <label className="inline-flex items-center">
                  <input type="checkbox" className="form-checkbox h-4 w-4 text-indigo-600" {...register('remember')} />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Remember me</span>
                </label>
                <button type="button" onClick={handleForgot} className="text-sm text-indigo-600 hover:underline">Forgot password?</button>
              </div>

              <div>
                <button type="submit" className="w-full btn-primary flex items-center justify-center gap-3">
                  {loading ? <LoadingSpinner size={18} /> : <span>Sign in</span>}
                </button>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
                <div className="text-xs text-gray-400">or continue with</div>
                <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button type="button" onClick={handleGoogleSignIn} className="btn-secondary flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21.35 11.1H12v2.8h5.65c-.25 1.5-1.3 2.8-2.75 3.65v3.05h4.45c2.6-2.4 4.1-5.95 4.1-9.95 0-.55-.05-1.1-.15-1.6z" fill="#4285F4" />
                    <path d="M12 22c2.95 0 5.45-.95 7.25-2.55l-4.45-3.05c-1.25.85-2.85 1.35-4.8 1.35-3.65 0-6.75-2.45-7.85-5.75H.95v3.6C2.75 19.7 7.05 22 12 22z" fill="#34A853" />
                    <path d="M4.15 13.05c-.3-.9-.45-1.85-.45-2.85s.15-1.95.45-2.85V3.75H.95C-.15 5.95-.15 8.95.95 11.15l3.2-2.1z" fill="#FBBC05" />
                    <path d="M12 4.6c1.95 0 3.7.7 5.1 2.1l3.8-3.8C17.45.85 14.95 0 12 0 7.05 0 2.75 2.3.95 5.75l3.2 2.1C5.25 6.95 8.35 4.6 12 4.6z" fill="#EA4335" />
                  </svg>
                  <span>Sign in with Google</span>
                </button>
                <button type="button" className="btn-secondary flex items-center justify-center gap-2 opacity-50 cursor-not-allowed" disabled>
                  Microsoft
                </button>
              </div>

              <div className="text-center pt-4 space-y-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setCurrentPage?.('register')}
                    className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                  >
                    Sign up
                  </button>
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Are you an administrator?{' '}
                  <button
                    type="button"
                    onClick={() => setCurrentPage?.('admin-login')}
                    className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                  >
                    Admin login
                  </button>
                </p>
              </div>
            </form>

            <p className="text-xs text-gray-400 mt-6">Secure Business Intelligence Analytics Platform</p>
          </motion.div>
        </div>

      </div>
    </div>
  );
};

export default Login;
