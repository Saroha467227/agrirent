import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Leaf, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const Login = () => {
  const { login, getDashboardPath } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [authError, setAuthError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      setAuthError('');
      const user = await login(data);
      const redirectTo = location.state?.from?.pathname || getDashboardPath(user.role);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setAuthError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-slate-950">
      <div className="w-full max-w-sm space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2 group">
            <div className="bg-gradient-to-br from-emerald-400 to-emerald-600 p-2 rounded-xl shadow-lg shadow-emerald-500/20">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Agri<span className="text-emerald-400">Rent</span>
            </span>
          </Link>
          <h2 className="mt-6 text-2xl font-bold text-white">Welcome back</h2>
          <p className="mt-2 text-sm text-slate-400">
            New to the platform?{' '}
            <Link to="/register" className="font-medium text-emerald-400 hover:text-emerald-300 transition-colors">
              Create an account
            </Link>
          </p>
        </div>

        {/* Error Alert */}
        {authError && (
          <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-4 flex gap-3 items-start">
            <AlertCircle className="text-red-400 w-5 h-5 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-300 font-medium">{authError}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email */}
          <div>
            <label htmlFor="login-email" className="block text-sm font-medium text-slate-300 mb-1.5">
              Email address
            </label>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              {...register('email')}
              className={`block w-full rounded-lg border bg-slate-900 px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-colors ${
                errors.email
                  ? 'border-red-500/50 focus:ring-red-500/40'
                  : 'border-slate-700 focus:border-emerald-500 focus:ring-emerald-500/40'
              }`}
              placeholder="farmer@example.com"
            />
            {errors.email && <p className="mt-1.5 text-xs text-red-400">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="login-password" className="block text-sm font-medium text-slate-300 mb-1.5">
              Password
            </label>
            <input
              id="login-password"
              type="password"
              autoComplete="current-password"
              {...register('password')}
              className={`block w-full rounded-lg border bg-slate-900 px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-colors ${
                errors.password
                  ? 'border-red-500/50 focus:ring-red-500/40'
                  : 'border-slate-700 focus:border-emerald-500 focus:ring-emerald-500/40'
              }`}
              placeholder="••••••••"
            />
            {errors.password && <p className="mt-1.5 text-xs text-red-400">{errors.password.message}</p>}
          </div>

          {/* Remember / Forgot */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-slate-600 bg-slate-900 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-slate-950"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-400">
                Remember me
              </label>
            </div>
            <Link
              to="/forgot-password"
              className="text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full justify-center items-center gap-2 rounded-lg bg-emerald-600 py-3 px-4 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
          >
            {isSubmitting ? (
              <><Loader2 className="animate-spin w-5 h-5" /> Signing in…</>
            ) : (
              <>Sign in <ArrowRight className="w-4 h-4" /></>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;