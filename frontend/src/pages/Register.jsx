import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, ArrowRight, AlertCircle, Loader2, CheckCircle2, Tractor, Warehouse } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

// ─── Zod Validation Schema ──────────────────────────────────────
const registerSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be under 50 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens and apostrophes'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  phone: z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Phone number is too long')
    .regex(/^[0-9+\-\s()]+$/, 'Please enter a valid phone number'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(128, 'Password is too long'),
  role: z.enum(['farmer', 'owner'], {
    required_error: 'Please select a role',
  }),
});

// ─── Reusable Input Component ────────────────────────────────────
const FormInput = ({ id, label, type = 'text', placeholder, error, registration, autoComplete }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-slate-300 mb-1.5">
      {label}
    </label>
    <input
      id={id}
      type={type}
      autoComplete={autoComplete}
      placeholder={placeholder}
      {...registration}
      className={`
        block w-full rounded-xl border bg-transparent px-4 py-3 text-sm text-white
        placeholder-slate-500 outline-none transition-all duration-200
        ${error
          ? 'border-red-500/60 focus:border-red-400 focus:ring-2 focus:ring-red-500/20'
          : 'border-slate-700/80 hover:border-slate-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
        }
      `}
    />
    {error && (
      <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
        <AlertCircle className="w-3 h-3 flex-shrink-0" />
        {error.message}
      </p>
    )}
  </div>
);

// ─── Role Card Component ─────────────────────────────────────────
const RoleCard = ({ value, icon: Icon, title, subtitle, isSelected, registration }) => (
  <label
    className={`
      relative flex items-start gap-3.5 cursor-pointer rounded-xl border p-4
      transition-all duration-200 select-none
      ${isSelected
        ? 'border-emerald-500 bg-emerald-500/[0.07] shadow-[0_0_20px_-4px_rgba(16,185,129,0.15)]'
        : 'border-slate-700/80 bg-transparent hover:border-slate-600 hover:bg-white/[0.02]'
      }
    `}
  >
    <input type="radio" value={value} {...registration} className="sr-only" />
    <div
      className={`
        mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg transition-colors duration-200
        ${isSelected
          ? 'bg-emerald-500/15 text-emerald-400'
          : 'bg-slate-800 text-slate-400'
        }
      `}
    >
      <Icon className="w-[18px] h-[18px]" strokeWidth={1.8} />
    </div>
    <div className="flex flex-col">
      <span className={`text-sm font-semibold transition-colors duration-200 ${isSelected ? 'text-white' : 'text-slate-200'}`}>
        {title}
      </span>
      <span className="mt-0.5 text-xs text-slate-500">{subtitle}</span>
    </div>
    {/* Active indicator dot */}
    <div
      className={`
        absolute top-3.5 right-3.5 h-2 w-2 rounded-full transition-all duration-200
        ${isSelected ? 'bg-emerald-400 scale-100' : 'bg-slate-700 scale-75'}
      `}
    />
  </label>
);

// ─── Register Page Component ─────────────────────────────────────
const Register = () => {
  const { register: registerUser, getDashboardPath } = useAuth();
  const navigate = useNavigate();
  const [authError, setAuthError] = useState('');
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'farmer' },
  });

  const selectedRole = watch('role');

  const onSubmit = async (data) => {
    try {
      setAuthError('');
      const user = await registerUser(data);
      setSuccess(true);
      setTimeout(() => {
        navigate(getDashboardPath(user.role), { replace: true });
      }, 1500);
    } catch (err) {
      setAuthError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 sm:px-6 lg:px-8 bg-[#0a0f1c]">
      {/* Subtle radial glow behind the form */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-emerald-500/[0.04] blur-[120px]" />
      </div>

      <div className="relative w-full max-w-md space-y-8">
        {/* ── Header ───────────────────────────────────────────── */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2.5 group" aria-label="AgriRent home">
            <div className="bg-gradient-to-br from-emerald-400 to-emerald-600 p-2 rounded-xl shadow-lg shadow-emerald-500/25 group-hover:shadow-emerald-500/40 transition-shadow duration-300">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Agri<span className="text-emerald-400">Rent</span>
            </span>
          </Link>

          <h1 className="mt-8 text-[1.7rem] font-bold leading-tight text-white tracking-tight">
            Create your account
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-semibold text-emerald-500 hover:text-emerald-400 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>

        {/* ── Alerts ───────────────────────────────────────────── */}
        {authError && (
          <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4 flex gap-3 items-start animate-fade-in">
            <AlertCircle className="text-red-400 w-5 h-5 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-300">{authError}</p>
          </div>
        )}

        {success && (
          <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4 flex gap-3 items-start animate-fade-in">
            <CheckCircle2 className="text-emerald-400 w-5 h-5 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-emerald-300">Account created! Redirecting to dashboard…</p>
          </div>
        )}

        {/* ── Form ─────────────────────────────────────────────── */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          {/* Name & Phone — side-by-side on sm+ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              id="reg-name"
              label="Full Name"
              placeholder="Rajesh Kumar"
              autoComplete="name"
              error={errors.name}
              registration={register('name')}
            />
            <FormInput
              id="reg-phone"
              label="Phone Number"
              type="tel"
              placeholder="9876543210"
              autoComplete="tel"
              error={errors.phone}
              registration={register('phone')}
            />
          </div>

          {/* Email */}
          <FormInput
            id="reg-email"
            label="Email address"
            type="email"
            placeholder="farmer@example.com"
            autoComplete="email"
            error={errors.email}
            registration={register('email')}
          />

          {/* Password */}
          <FormInput
            id="reg-password"
            label="Password"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            error={errors.password}
            registration={register('password')}
          />

          {/* Role Selector */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2.5">I want to…</label>
            <div className="grid grid-cols-2 gap-3">
              <RoleCard
                value="farmer"
                icon={Tractor}
                title="Rent Equipment"
                subtitle="I am a Farmer"
                isSelected={selectedRole === 'farmer'}
                registration={register('role')}
              />
              <RoleCard
                value="owner"
                icon={Warehouse}
                title="List Equipment"
                subtitle="I am an Owner"
                isSelected={selectedRole === 'owner'}
                registration={register('role')}
              />
            </div>
            {errors.role && (
              <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.role.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || success}
            className={`
              group relative flex w-full items-center justify-center gap-2 rounded-xl
              py-3.5 px-4 text-sm font-semibold text-white transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2
              focus:ring-offset-[#0a0f1c] disabled:cursor-not-allowed
              ${isSubmitting || success
                ? 'bg-emerald-600/50'
                : 'bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-600/25 hover:shadow-emerald-500/30 active:scale-[0.98]'
              }
            `}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Creating account…
              </>
            ) : (
              <>
                Create Account
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </>
            )}
          </button>
        </form>

        {/* ── Footer ───────────────────────────────────────────── */}
        <p className="text-center text-xs text-slate-600 pt-2">
          By creating an account, you agree to our{' '}
          <a href="#" className="text-slate-400 hover:text-white transition-colors">Terms of Service</a>
          {' '}and{' '}
          <a href="#" className="text-slate-400 hover:text-white transition-colors">Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
};

export default Register;