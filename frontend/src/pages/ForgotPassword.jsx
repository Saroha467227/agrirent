import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link } from 'react-router-dom';
import { Leaf, ArrowLeft, ArrowRight, AlertCircle, Loader2, CheckCircle2, Mail } from 'lucide-react';
import api from '../api/axios';

const forgotSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
});

const ForgotPassword = () => {
  const [submitted, setSubmitted] = useState(false);
  const [apiError, setApiError] = useState('');
  const [devResetUrl, setDevResetUrl] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = async (data) => {
    try {
      setApiError('');
      const res = await api.post('/auth/forgot-password', data);
      setSubmitted(true);

      // In dev mode, the server returns the reset URL directly
      if (res.data.resetUrl) {
        setDevResetUrl(res.data.resetUrl);
      }
    } catch (err) {
      setApiError(err.response?.data?.message || 'Something went wrong. Please try again.');
    }
  };

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

          <h1 className="mt-8 text-2xl font-bold text-white">Reset your password</h1>
          <p className="mt-2 text-sm text-slate-400">
            Enter your email and we'll send you a link to reset your password.
          </p>
        </div>

        {/* Success State */}
        {submitted ? (
          <div className="space-y-5">
            <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-5 flex flex-col items-center text-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/15">
                <Mail className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-emerald-300">Check your email</p>
                <p className="mt-1 text-xs text-slate-400">
                  If an account with that email exists, a password reset link has been sent.
                </p>
              </div>
            </div>

            {/* Dev-only: show the reset link directly */}
            {devResetUrl && (
              <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-4 space-y-2">
                <p className="text-xs font-semibold text-amber-300">🛠 Dev Mode — Reset Link:</p>
                <Link
                  to={devResetUrl.replace(/^https?:\/\/[^/]+/, '')}
                  className="text-xs text-amber-200 underline underline-offset-2 break-all hover:text-white transition-colors"
                >
                  {devResetUrl}
                </Link>
              </div>
            )}

            <Link
              to="/login"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-800 border border-slate-700 py-3 px-4 text-sm font-medium text-white hover:bg-slate-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to login
            </Link>
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
                <label htmlFor="forgot-email" className="block text-sm font-medium text-slate-300 mb-1.5">
                  Email address
                </label>
                <input
                  id="forgot-email"
                  type="email"
                  autoComplete="email"
                  autoFocus
                  {...register('email')}
                  className={`
                    block w-full rounded-xl border bg-transparent px-4 py-3 text-sm text-white
                    placeholder-slate-500 outline-none transition-all duration-200
                    ${errors.email
                      ? 'border-red-500/60 focus:border-red-400 focus:ring-2 focus:ring-red-500/20'
                      : 'border-slate-700/80 hover:border-slate-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                    }
                  `}
                  placeholder="farmer@example.com"
                />
                {errors.email && (
                  <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.email.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 px-4 text-sm font-semibold text-white shadow-lg shadow-emerald-600/25 hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-[#0a0f1c] disabled:opacity-60 disabled:cursor-not-allowed transition-all"
              >
                {isSubmitting ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Sending…</>
                ) : (
                  <>Send reset link <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" /></>
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

export default ForgotPassword;
