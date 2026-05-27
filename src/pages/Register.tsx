import React, { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import {
  UserPlus,
  Mail,
  Phone,
  Briefcase,
  Key,
  Eye,
  EyeOff,
  CheckCircle,
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';

type FormValues = {
  fullName: string;
  company: string;
  email: string;
  phone?: string;
  role: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
};

const scorePassword = (pw: string) => {
  let score = 0;
  if (pw.length >= 8) score += 1;
  if (/[A-Z]/.test(pw)) score += 1;
  if (/[0-9]/.test(pw)) score += 1;
  if (/[^A-Za-z0-9]/.test(pw)) score += 1;
  return score; // 0-4
};

const strengthLabel = (score: number) => {
  switch (score) {
    case 0:
    case 1:
      return { label: 'Weak', color: 'bg-red-500' };
    case 2:
      return { label: 'Fair', color: 'bg-yellow-400' };
    case 3:
      return { label: 'Good', color: 'bg-green-400' };
    case 4:
      return { label: 'Strong', color: 'bg-green-600' };
    default:
      return { label: 'Weak', color: 'bg-red-500' };
  }
};

interface RegisterProps {
  setCurrentPage?: (page: string) => void;
}

const Register: React.FC<RegisterProps> = ({ setCurrentPage }) => {
  const { register, handleSubmit, watch, formState: { errors } , reset } = useForm<FormValues>({ mode: 'onTouched' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const password = watch('password', '');

  const strength = useMemo(() => scorePassword(password), [password]);
  const strengthInfo = strengthLabel(strength);

  const { register: doRegister } = useAuth();

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    setError(null);
    try {
      await doRegister({
        email: data.email,
        password: data.password,
        displayName: data.fullName,
        role: data.role as 'analyst' | 'viewer',
      });
      setLoading(false);
      setSuccess(true);
      reset();
      // Redirect to upload dataset on successful registration
      setTimeout(() => {
        if (setCurrentPage) {
          setCurrentPage('upload');
        }
      }, 1500);
    } catch (err: any) {
      setLoading(false);
      setError(err.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-sky-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
      <div className="w-full max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">

          {/* Branding card */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="hidden lg:flex flex-col justify-center rounded-2xl p-10 bg-gradient-to-br from-indigo-600 to-indigo-500 text-white shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-md bg-white bg-opacity-15 flex items-center justify-center text-white font-bold">CP</div>
              <div>
                <h3 className="text-2xl font-semibold">Company Performance</h3>
                <p className="text-sm opacity-90">Business Intelligence Analytics — enterprise-grade insights and reporting.</p>
              </div>
            </div>

            <div className="mt-6 text-sm opacity-95">
              <h4 className="font-medium">Welcome to your analytics hub</h4>
              <p className="mt-3 text-indigo-100 max-w-sm">Sign up to get secure access to dashboards, reports and insights tailored for your organization.</p>
            </div>

            <div className="mt-8 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-white rounded-full opacity-80" />
                <span className="text-sm">Realtime dashboards</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-white rounded-full opacity-80" />
                <span className="text-sm">Secure enterprise access</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-white rounded-full opacity-80" />
                <span className="text-sm">Custom reports & exports</span>
              </div>
            </div>
          </motion.div>

          {/* Form card */}
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-md">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create your account</h2>
                <p className="text-sm text-gray-500 dark:text-gray-300">Start your free trial — no credit card required</p>
              </div>
              <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500">
                <UserPlus className="text-indigo-600" />
                <span>Enterprise</span>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-lg mb-4 text-sm bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full name</label>
                  <div className={`mt-1 relative ${errors.fullName ? 'ring-2 ring-red-500 rounded-md' : ''}`}>
                    <input {...register('fullName', { required: 'Full name is required' })} placeholder="Jane Doe" className="input-field w-full pl-10" />
                    <span className="absolute left-3 top-2.5 text-gray-400"><UserPlus size={16} /></span>
                  </div>
                  {errors.fullName && <p className="text-sm text-red-500 mt-1">{errors.fullName.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Company</label>
                  <div className={`mt-1 relative ${errors.company ? 'ring-2 ring-red-500 rounded-md' : ''}`}>
                    <input {...register('company', { required: 'Company is required' })} placeholder="ACME Inc." className="input-field w-full pl-10" />
                    <span className="absolute left-3 top-2.5 text-gray-400"><Briefcase size={16} /></span>
                  </div>
                  {errors.company && <p className="text-sm text-red-500 mt-1">{errors.company.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email address</label>
                  <div className={`mt-1 relative ${errors.email ? 'ring-2 ring-red-500 rounded-md' : ''}`}>
                    <input {...register('email', { required: 'Email is required', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' } })} placeholder="you@company.com" type="email" className="input-field w-full pl-10" />
                    <span className="absolute left-3 top-2.5 text-gray-400"><Mail size={16} /></span>
                  </div>
                  {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label>
                  <div className="mt-1 relative">
                    <input {...register('phone', { pattern: { value: /^[0-9+\-()\s]{7,20}$/, message: 'Invalid phone' } })} placeholder="+1 (555) 555-5555" className="input-field w-full pl-10" />
                    <span className="absolute left-3 top-2.5 text-gray-400"><Phone size={16} /></span>
                  </div>
                  {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Role</label>
                <div className={`mt-1 relative ${errors.role ? 'ring-2 ring-red-500 rounded-md' : ''}`}>
                  <select
                    {...register('role', { required: 'Role is required' })}
                    className="input-field w-full rounded-xl pl-4"
                    defaultValue="analyst"
                  >
                    <option value="analyst">Analyst</option>
                    <option value="viewer">Viewer</option>
                  </select>
                </div>
                {errors.role && <p className="text-sm text-red-500 mt-1">{errors.role.message}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                  <div className={`mt-1 relative ${errors.password ? 'ring-2 ring-red-500 rounded-md' : ''}`}>
                    <input {...register('password', { required: 'Password is required', validate: (v) => v.length >= 8 || 'Password must be at least 8 characters' })} type={showPassword ? 'text' : 'password'} placeholder="Create a strong password" className="input-field w-full pl-10 pr-12" />
                    <span className="absolute left-3 top-2.5 text-gray-400"><Key size={16} /></span>
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-2 text-gray-500">{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                  </div>
                  {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>}

                  {/* Strength */}
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                      <span>Password strength</span>
                      <span className="font-medium text-gray-700 dark:text-gray-200">{strengthInfo.label}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div style={{ width: `${(strength / 4) * 100}%` }} className={`${strengthInfo.color} h-2 transition-all`} />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirm password</label>
                  <div className={`mt-1 relative ${errors.confirmPassword ? 'ring-2 ring-red-500 rounded-md' : ''}`}>
                    <input {...register('confirmPassword', { required: 'Please confirm password', validate: (v) => v === password || 'Passwords do not match' })} type={showConfirm ? 'text' : 'password'} placeholder="Confirm password" className="input-field w-full pl-10 pr-12" />
                    <span className="absolute left-3 top-2.5 text-gray-400"><Key size={16} /></span>
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-2 top-2 text-gray-500">{showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                  </div>
                  {errors.confirmPassword && <p className="text-sm text-red-500 mt-1">{errors.confirmPassword.message}</p>}
                </div>
              </div>

              <div className="flex items-center">
                <label className="inline-flex items-center">
                  <input {...register('terms', { required: 'You must accept terms' })} type="checkbox" className="form-checkbox h-4 w-4 text-indigo-600" />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">I agree to the <a href="#" className="text-indigo-600 hover:underline">Terms & Conditions</a></span>
                </label>
              </div>
              {errors.terms && <p className="text-sm text-red-500">{errors.terms.message}</p>}

              <div>
                <button type="submit" className="w-full btn-primary flex items-center justify-center gap-3 overflow-hidden" disabled={loading}>
                  {loading ? <LoadingSpinner size={18} /> : <motion.span whileTap={{ scale: 0.98 }} whileHover={{ scale: 1.02 }}>Create account</motion.span>}
                </button>
              </div>

              <div className="text-center text-sm text-gray-500">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setCurrentPage?.('login')}
                  className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                >
                  Login
                </button>
              </div>
            </form>
          </motion.div>
        </div>

        {/* Success toast */}
        {success && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="fixed bottom-6 right-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 shadow-lg flex items-center gap-3">
            <CheckCircle className="text-green-500" />
            <div>
              <div className="font-medium text-sm text-gray-900 dark:text-white">Registration successful</div>
              <div className="text-xs text-gray-500">Redirecting to dashboard...</div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Register;
