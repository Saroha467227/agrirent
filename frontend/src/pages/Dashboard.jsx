import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getDashboardPath } from '../utils/auth';

const dashboardConfig = {
  farmer: {
    title: 'Farmer Dashboard',
    greeting: 'Welcome back, Farmer',
    body: 'Browse equipment, manage bookings, and track rental activity from one place.',
    color: '#10b981',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
      </svg>
    ),
    quickActions: [
      { label: 'Browse Equipment', path: '/equipment', icon: '🔍' },
      { label: 'My Bookings', path: '/bookings', icon: '📋' },
    ],
    stats: [
      { label: 'Active Bookings', value: '0', trend: 'neutral' },
      { label: 'Total Spent', value: '₹0', trend: 'neutral' },
      { label: 'Reviews Given', value: '0', trend: 'neutral' },
    ],
  },
  owner: {
    title: 'Equipment Owner Dashboard',
    greeting: 'Welcome back, Owner',
    body: 'Manage listed equipment, rental requests, and booking schedules.',
    color: '#0ea5e9',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    ),
    quickActions: [
      { label: 'My Equipment', path: '/owner/equipment', icon: '🚜' },
      { label: 'Bookings', path: '/owner/bookings', icon: '📅' },
    ],
    stats: [
      { label: 'Listed Equipment', value: '0', trend: 'neutral' },
      { label: 'Active Rentals', value: '0', trend: 'neutral' },
      { label: 'Revenue', value: '₹0', trend: 'neutral' },
    ],
  },
  admin: {
    title: 'Admin Dashboard',
    greeting: 'Welcome, Administrator',
    body: 'Monitor users, equipment listings, bookings, and platform activity.',
    color: '#8b5cf6',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    quickActions: [
      { label: 'Manage Users', path: '/admin/users', icon: '👥' },
    ],
    stats: [
      { label: 'Total Users', value: '0', trend: 'neutral' },
      { label: 'Active Listings', value: '0', trend: 'neutral' },
      { label: 'Total Bookings', value: '0', trend: 'neutral' },
    ],
  },
};

const Dashboard = ({ role }) => {
  const { user } = useAuth();
  const location = useLocation();
  const activeRole = role || user?.role || 'farmer';
  const config = dashboardConfig[activeRole] || dashboardConfig.farmer;

  if (location.pathname === '/dashboard') {
    return <Navigate to={getDashboardPath(user?.role)} replace />;
  }

  return (
    <div className="min-h-screen" style={{ paddingTop: '80px' }}>
      {/* Hero Banner */}
      <section
        className="relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${config.color}15, ${config.color}08)` }}
      >
        <div
          className="absolute -top-20 -right-20 h-64 w-64 rounded-full opacity-20"
          style={{ background: `radial-gradient(circle, ${config.color}, transparent 70%)` }}
        />
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex items-start gap-5 animate-fade-in-up" style={{ opacity: 0 }}>
            <div
              className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl text-white shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${config.color}, ${config.color}cc)`,
                boxShadow: `0 10px 30px ${config.color}30`,
              }}
            >
              {config.icon}
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest" style={{ color: config.color }}>
                {user?.name || user?.email || 'AgriRent User'}
              </p>
              <h1 className="mt-1 text-3xl font-extrabold text-slate-900 sm:text-4xl">{config.title}</h1>
              <p className="mt-2 max-w-2xl text-base text-slate-500">{config.body}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats Cards */}
        <div className="grid gap-5 sm:grid-cols-3 mb-8">
          {config.stats.map((stat, i) => (
            <div
              key={stat.label}
              className="rounded-2xl bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg animate-fade-in-up"
              style={{
                opacity: 0,
                animationDelay: `${i * 100 + 100}ms`,
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
              }}
            >
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <p className="mt-2 text-3xl font-extrabold text-slate-900">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="animate-fade-in-up delay-300" style={{ opacity: 0 }}>
          <h2 className="text-lg font-bold text-slate-900 mb-4">Quick Actions</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {config.quickActions.map((action) => (
              <a
                key={action.path}
                href={action.path}
                className="group flex items-center gap-4 rounded-2xl bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                style={{
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
                }}
              >
                <span className="text-3xl">{action.icon}</span>
                <div>
                  <p className="font-semibold text-slate-900 group-hover:text-emerald-700 transition-colors duration-300">
                    {action.label}
                  </p>
                  <p className="text-sm text-slate-400">Click to navigate</p>
                </div>
                <svg
                  width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  className="ml-auto text-slate-300 transition-all duration-300 group-hover:text-emerald-500 group-hover:translate-x-1"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
