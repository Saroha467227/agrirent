import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Leaf, ArrowRight, AlertCircle, Loader2, CheckCircle2, ShieldCheck } from 'lucide-react';
import api from '../api/axios';

const resetSchema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(resetSchema),
  });

  const onSubmit = async (data) => {
    try {
      setApiError('');
      await api.post(`/auth/reset-password/${token}`, { password: data.password });
      setSuccess(true);
      setTimeout(() => navigate('/login', { replace: true }), 3000);
    } catch (err) {
      setApiError(err.response?.data?.message || 'Reset failed. The link may have expired.');
    }
  };

  const inputClasses = (hasError) => `
    block w-full rounded-xl border bg-transparent px-4 py-3 text-sm text-white
    placeholder-slate-500 outline-none transition-all duration-200
    ${hasError
      ? 'border-red-500/60 focus:border-red-400 focus:ring-2 focus:ring-red-500/20'
      : 'border-slate-700/80 hover:border-slate-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
    }
  `;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 sm:px-6 lg:px-8 bg-[#0a0f1c]">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-emerald-500/[0.04] blur-[120px]" />
      </div>

      <div className="relative w-full max-w-sm space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2.5 group" aria-label="AgriRent home">
            <div className="bg-gradient-to-br from-emerald-400 to-emerald-600 p-2 rounded-xl shadow-lg shadow-emerald-500/25">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Agri<span className="text-emerald-400">Rent</span>
            </span>
          </Link>

          <h1 className="mt-8 text-2xl font-bold text-white">Set new password</h1>
          <p className="mt-2 text-sm text-slate-400">
            Choose a strong password for your account.
          </p>
        </div>

        {/* Success State */}
        {success ? (
          <div className="space-y-5">
            <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-5 flex flex-col items-center text-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/15">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-emerald-300">Password reset successful!</p>
                <p className="mt-1 text-xs text-slate-400">
                  Redirecting you to login…
                </p>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Error */}
            {apiError && (
              <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4 flex gap-3 items-start">
                <AlertCircle className="text-red-400 w-5 h-5 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-300">{apiError}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
              <div>
                <label htmlFor="reset-password" className="block text-sm font-medium text-slate-300 mb-1.5">
                  New password
                </label>
                <input
                  id="reset-password"
                  type="password"
                  autoComplete="new-password"
                  autoFocus
                  {...register('password')}
                  className={inputClasses(errors.password)}
                  placeholder="••••••••"
                />
                {errors.password && (
                  <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="reset-confirm" className="block text-sm font-medium text-slate-300 mb-1.5">
                  Confirm password
                </label>
                <input
                  id="reset-confirm"
                  type="password"
                  autoComplete="new-password"
                  {...register('confirmPassword')}
                  className={inputClasses(errors.confirmPassword)}
                  placeholder="••••••••"
                />
                {errors.confirmPassword && (
                  <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 px-4 text-sm font-semibold text-white shadow-lg shadow-emerald-600/25 hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-[#0a0f1c] disabled:opacity-60 disabled:cursor-not-allowed transition-all"
              >
                {isSubmitting ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Resetting…</>
                ) : (
                  <>Reset password <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" /></>
                )}
              </button>
            </form>

            <p className="text-center text-sm text-slate-500">
              Remember your password?{' '}
              <Link to="/login" className="font-medium text-emerald-400 hover:text-emerald-300 transition-colors">
                Sign in
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
