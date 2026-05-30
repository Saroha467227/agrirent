import { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Tractor, CheckCircle2 } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '@/contexts/AuthContext';
import type { UserRole } from '@/contexts/AuthContext';

export default function Auth() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login, signup, googleLogin, isAuthenticated } = useAuth();
  const mode = searchParams.get('mode') || 'login';
  const isSignup = mode === 'signup';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('both');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      let success: boolean;
      if (isSignup) {
        if (!name || !email || !phone || password.length < 6) {
          setError('Please fill in all fields. Password must be at least 6 characters.');
          setIsLoading(false);
          return;
        }
        success = await signup(name, email, password, role, phone);
      } else {
        success = await login(email, password);
      }

      if (success) {
        setIsSuccess(true);
        setTimeout(() => navigate('/'), 1000);
      } else {
        setError(isSignup ? 'Signup failed. Please try again.' : 'Invalid email or password.');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    if (credentialResponse.credential) {
      setIsLoading(true);
      setError('');
      const success = await googleLogin(credentialResponse.credential);
      if (success) {
        setIsSuccess(true);
        setTimeout(() => navigate('/'), 1000);
      } else {
        setError('Google login failed. Please try again.');
        setIsLoading(false);
      }
    }
  };

  return (
    <main className="min-h-screen bg-cream flex">
      {/* Left Image Panel */}
      <div className="hidden lg:block lg:w-[45%] relative">
        <img
          src="/images/auth-farm.jpg"
          alt="Farm landscape"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent" />
        <div className="absolute bottom-12 left-12 right-12 text-white">
          <div className="flex items-center gap-2 mb-4">
            <Tractor className="w-8 h-8 text-terracotta" />
            <span className="font-serif text-2xl font-semibold">AgriRent</span>
          </div>
          <p className="text-white/80 text-lg leading-relaxed">
            Join thousands of farmers who trust AgriRent for their equipment needs. Rent smarter, farm better.
          </p>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Logo (mobile) */}
          <div className="flex items-center gap-2 lg:hidden mb-8">
            <Tractor className="w-7 h-7 text-terracotta" />
            <span className="font-serif text-xl font-semibold text-charcoal">AgriRent</span>
          </div>

          {isSuccess ? (
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-sage/10 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-sage" />
              </div>
              <h2 className="font-serif text-2xl text-text-primary mt-4">
                {isSignup ? 'Welcome to AgriRent!' : 'Welcome back!'}
              </h2>
              <p className="text-text-secondary mt-2">Redirecting you...</p>
            </div>
          ) : (
            <>
              <h1 className="font-serif font-h1 text-text-primary">
                {isSignup ? 'Join AgriRent' : 'Welcome Back'}
              </h1>
              <p className="text-text-secondary mt-2">
                {isSignup
                  ? 'Start renting or listing equipment today'
                  : 'Sign in to your account to continue'}
              </p>

              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-600">
                    {error}
                  </div>
                )}

                {isSignup && (
                  <div>
                    <label className="text-sm font-medium text-text-primary mb-2 block">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Smith"
                      className="w-full border border-stone-dark rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-terracotta transition-colors"
                    />
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium text-text-primary mb-2 block">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full border border-stone-dark rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-terracotta transition-colors"
                  />
                </div>

                {isSignup && (
                  <div>
                    <label className="text-sm font-medium text-text-primary mb-2 block">Phone Number</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full border border-stone-dark rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-terracotta transition-colors"
                    />
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium text-text-primary mb-2 block">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={isSignup ? 'Min 6 characters' : 'Your password'}
                      className="w-full border border-stone-dark rounded-lg px-4 py-3 pr-12 text-sm focus:outline-none focus:border-terracotta transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {isSignup && (
                  <div>
                    <label className="text-sm font-medium text-text-primary mb-3 block">Account Type</label>
                    <div className="space-y-2">
                      {[
                        { value: 'renter' as UserRole, label: 'I want to rent equipment' },
                        { value: 'farmer' as UserRole, label: 'I want to list my equipment' },
                        { value: 'both' as UserRole, label: 'Both' },
                      ].map((opt) => (
                        <label
                          key={opt.value}
                          className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                            role === opt.value
                              ? 'border-terracotta bg-terracotta/5'
                              : 'border-stone-dark hover:bg-stone/30'
                          }`}
                        >
                          <input
                            type="radio"
                            name="role"
                            value={opt.value}
                            checked={role === opt.value}
                            onChange={(e) => setRole(e.target.value as UserRole)}
                            className="accent-terracotta"
                          />
                          <span className="text-sm text-text-primary">{opt.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {!isSignup && (
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="accent-terracotta" />
                      <span className="text-sm text-text-secondary">Remember me</span>
                    </label>
                    <Link to="#" className="text-sm text-terracotta hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary w-full flex items-center justify-center disabled:opacity-60"
                >
                  {isLoading ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : isSignup ? (
                    'Create Account'
                  ) : (
                    'Sign In'
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="relative mt-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-stone-dark" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-cream px-4 text-text-muted">or continue with</span>
                </div>
              </div>

              {/* Social Auth */}
              <div className="mt-6 flex flex-col gap-3 items-center">
                <div className="w-full flex justify-center">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => setError('Google login failed')}
                    useOneTap
                  />
                </div>
              </div>

              {/* Toggle Mode */}
              <p className="mt-8 text-center text-sm text-text-secondary">
                {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
                <Link
                  to={isSignup ? '/login' : '/login?mode=signup'}
                  className="text-terracotta font-medium hover:underline"
                >
                  {isSignup ? 'Sign In' : 'Sign Up'}
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
