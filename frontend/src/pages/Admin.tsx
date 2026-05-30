import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard, Tractor, Users, Calendar, Star,
  BarChart3, Settings, Search, CheckCircle2,
  XCircle, AlertTriangle, TrendingUp, DollarSign,
  Activity, Eye
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { equipmentData } from '@/data/equipment';

const adminNavItems = [
  { key: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-5 h-5" /> },
  { key: 'equipment', label: 'Equipment', icon: <Tractor className="w-5 h-5" /> },
  { key: 'users', label: 'Users', icon: <Users className="w-5 h-5" /> },
  { key: 'bookings', label: 'Bookings', icon: <Calendar className="w-5 h-5" /> },
  { key: 'reviews', label: 'Reviews', icon: <Star className="w-5 h-5" /> },
  { key: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-5 h-5" /> },
  { key: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
];

const mockStats = [
  { label: 'Total Users', value: '1,248', change: '+12%', icon: <Users className="w-5 h-5" /> },
  { label: 'Active Listings', value: '2,456', change: '+8%', icon: <Tractor className="w-5 h-5" /> },
  { label: 'Monthly Revenue', value: '$48,320', change: '+23%', icon: <DollarSign className="w-5 h-5" /> },
  { label: 'Pending Approvals', value: '18', change: '-5%', icon: <AlertTriangle className="w-5 h-5" /> },
];

const mockBookings = [
  { id: 'b1', equipment: 'John Deere 8R 370', renter: 'Tom Wilson', owner: 'Mike Peterson', dates: 'Jun 15-22', total: 3150, status: 'confirmed' as const },
  { id: 'b2', equipment: 'CLAAS LEXION 780', renter: 'Anna Lee', owner: 'Sarah Mitchell', dates: 'Jun 20-28', total: 6800, status: 'pending' as const },
  { id: 'b3', equipment: 'Valley Pivot 8000', renter: 'John Davis', owner: 'Jim Henderson', dates: 'Jul 1-14', total: 1680, status: 'confirmed' as const },
  { id: 'b4', equipment: 'Kuhn Discover XL', renter: 'Mike Brown', owner: 'Mike Peterson', dates: 'Jul 5-10', total: 425, status: 'pending' as const },
  { id: 'b5', equipment: 'John Deere DB90', renter: 'Lisa Wong', owner: 'Sarah Mitchell', dates: 'Aug 1-15', total: 3000, status: 'cancelled' as const },
];

const mockUsers = [
  { id: 'u1', name: 'Mike Peterson', email: 'mike@farm.com', role: 'owner', joinDate: '2023-03-15', listings: 5, status: 'active' as const },
  { id: 'u2', name: 'Sarah Mitchell', email: 'sarah@agri.com', role: 'owner', joinDate: '2023-05-22', listings: 3, status: 'active' as const },
  { id: 'u3', name: 'Tom Wilson', email: 'tom@field.com', role: 'renter', joinDate: '2024-01-10', listings: 0, status: 'active' as const },
  { id: 'u4', name: 'Anna Lee', email: 'anna@crop.com', role: 'renter', joinDate: '2024-02-28', listings: 0, status: 'pending' as const },
  { id: 'u5', name: 'John Davis', email: 'john@harvest.com', role: 'both', joinDate: '2023-08-05', listings: 2, status: 'active' as const },
];

const bookingStatusConfig = {
  confirmed: { label: 'Confirmed', className: 'bg-sage/10 text-sage' },
  pending: { label: 'Pending', className: 'bg-accent-gold/10 text-accent-gold' },
  active: { label: 'Active', className: 'bg-blue-100 text-blue-600' },
  completed: { label: 'Completed', className: 'bg-text-muted/10 text-text-muted' },
  cancelled: { label: 'Cancelled', className: 'bg-red-100 text-red-600' },
};

export default function Admin() {
  const { user, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [bookingFilter, setBookingFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  if (!user || !isAdmin) {
    return (
      <main className="min-h-screen bg-cream pt-24 flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-serif text-2xl text-text-primary">Access Denied</h2>
          <p className="text-text-secondary mt-2">You need admin privileges to access this page.</p>
          <Link to="/" className="btn-primary mt-6 inline-block">
            Go Home
          </Link>
        </div>
      </main>
    );
  }

  const filteredBookings = bookingFilter === 'all'
    ? mockBookings
    : mockBookings.filter(b => b.status === bookingFilter);

  return (
    <main className="min-h-screen bg-cream pt-16">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-60 shrink-0">
            <div className="bg-charcoal rounded-xl p-4 lg:sticky lg:top-24">
              <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                <div className="w-10 h-10 rounded-full bg-terracotta flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">A</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Admin</p>
                  <p className="text-xs text-white/50">{user.email}</p>
                </div>
              </div>

              <nav className="mt-4 space-y-1">
                {adminNavItems.map((item) => (
                  <button
                    key={item.key}
                    onClick={() => setActiveTab(item.key)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                      activeTab === item.key
                        ? 'bg-white/10 text-white border-l-[3px] border-terracotta'
                        : 'text-white/60 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Overview */}
            {activeTab === 'overview' && (
              <div>
                <h2 className="font-serif text-2xl text-text-primary mb-6">Dashboard Overview</h2>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  {mockStats.map((stat) => (
                    <div key={stat.label} className="bg-white rounded-xl border border-stone-dark p-5">
                      <div className="flex items-center justify-between">
                        <div className="p-2 bg-stone rounded-lg">{stat.icon}</div>
                        <span className={`text-xs font-medium ${stat.change.startsWith('+') ? 'text-sage' : 'text-red-500'}`}>
                          {stat.change}
                        </span>
                      </div>
                      <p className="text-2xl font-semibold text-text-primary mt-3">{stat.value}</p>
                      <p className="text-xs text-text-muted mt-1">{stat.label}</p>
                    </div>
                  ))}
                </div>

                {/* Quick Actions */}
                <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                  <button className="bg-white rounded-xl border border-stone-dark p-4 text-left hover:border-terracotta transition-colors">
                    <CheckCircle2 className="w-5 h-5 text-sage mb-2" />
                    <p className="text-sm font-medium text-text-primary">Approve Listings</p>
                    <p className="text-xs text-text-muted">12 pending approvals</p>
                  </button>
                  <button className="bg-white rounded-xl border border-stone-dark p-4 text-left hover:border-terracotta transition-colors">
                    <Users className="w-5 h-5 text-terracotta mb-2" />
                    <p className="text-sm font-medium text-text-primary">Manage Users</p>
                    <p className="text-xs text-text-muted">5 new registrations</p>
                  </button>
                  <button className="bg-white rounded-xl border border-stone-dark p-4 text-left hover:border-terracotta transition-colors">
                    <Activity className="w-5 h-5 text-accent-gold mb-2" />
                    <p className="text-sm font-medium text-text-primary">View Reports</p>
                    <p className="text-xs text-text-muted">Monthly analytics</p>
                  </button>
                </div>

                {/* Recent Activity */}
                <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-4">Recent Activity</h3>
                <div className="bg-white rounded-xl border border-stone-dark divide-y divide-stone">
                  {[
                    { action: 'New booking', detail: 'Tom Wilson booked John Deere 8R 370', time: '5 min ago' },
                    { action: 'New listing', detail: 'Sarah Mitchell listed CLAAS LEXION 780', time: '15 min ago' },
                    { action: 'User signup', detail: 'Anna Lee created an account', time: '1 hour ago' },
                    { action: 'Review submitted', detail: 'Lisa Chen rated her rental 5 stars', time: '2 hours ago' },
                    { action: 'Payment processed', detail: 'Booking #1284 payment confirmed', time: '3 hours ago' },
                  ].map((activity, i) => (
                    <div key={i} className="px-4 py-3 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-text-primary">{activity.action}</p>
                        <p className="text-xs text-text-muted">{activity.detail}</p>
                      </div>
                      <span className="text-xs text-text-muted">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Equipment */}
            {activeTab === 'equipment' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-serif text-2xl text-text-primary">Equipment Management</h2>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input
                      type="text"
                      placeholder="Search equipment..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="border border-stone-dark rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-terracotta"
                    />
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-stone-dark overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-stone/50">
                      <tr>
                        <th className="text-left px-4 py-3 font-medium text-text-muted">Equipment</th>
                        <th className="text-left px-4 py-3 font-medium text-text-muted">Category</th>
                        <th className="text-left px-4 py-3 font-medium text-text-muted">Owner</th>
                        <th className="text-left px-4 py-3 font-medium text-text-muted">Price/Day</th>
                        <th className="text-left px-4 py-3 font-medium text-text-muted">Status</th>
                        <th className="text-left px-4 py-3 font-medium text-text-muted">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone">
                      {equipmentData
                        .filter(eq => !searchQuery || eq.name.toLowerCase().includes(searchQuery.toLowerCase()))
                        .map((eq) => (
                        <tr key={eq.id} className="hover:bg-stone/20">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <img src={eq.image} alt={eq.name} className="w-10 h-10 rounded object-cover" />
                              <span className="font-medium text-text-primary">{eq.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-text-secondary">{eq.category}</td>
                          <td className="px-4 py-3 text-text-secondary">{eq.owner.name}</td>
                          <td className="px-4 py-3 font-medium text-text-primary">${eq.pricePerDay}</td>
                          <td className="px-4 py-3">
                            <span className={`text-xs font-medium rounded-pill px-2 py-0.5 ${
                              eq.availability === 'available' ? 'bg-sage/10 text-sage' :
                              eq.availability === 'booked' ? 'bg-accent-gold/10 text-accent-gold' :
                              'bg-text-muted/10 text-text-muted'
                            }`}>
                              {eq.availability}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <button className="p-1.5 hover:bg-stone rounded transition-colors" title="Edit">
                                <Settings className="w-4 h-4 text-text-muted" />
                              </button>
                              <button className="p-1.5 hover:bg-stone rounded transition-colors" title="View">
                                <Eye className="w-4 h-4 text-text-muted" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Users */}
            {activeTab === 'users' && (
              <div>
                <h2 className="font-serif text-2xl text-text-primary mb-6">User Management</h2>
                <div className="bg-white rounded-xl border border-stone-dark overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-stone/50">
                      <tr>
                        <th className="text-left px-4 py-3 font-medium text-text-muted">User</th>
                        <th className="text-left px-4 py-3 font-medium text-text-muted">Role</th>
                        <th className="text-left px-4 py-3 font-medium text-text-muted">Join Date</th>
                        <th className="text-left px-4 py-3 font-medium text-text-muted">Listings</th>
                        <th className="text-left px-4 py-3 font-medium text-text-muted">Status</th>
                        <th className="text-left px-4 py-3 font-medium text-text-muted">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone">
                      {mockUsers.map((u) => (
                        <tr key={u.id} className="hover:bg-stone/20">
                          <td className="px-4 py-3">
                            <div>
                              <p className="font-medium text-text-primary">{u.name}</p>
                              <p className="text-xs text-text-muted">{u.email}</p>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="capitalize text-text-secondary">{u.role}</span>
                          </td>
                          <td className="px-4 py-3 text-text-secondary">{u.joinDate}</td>
                          <td className="px-4 py-3 text-text-secondary">{u.listings}</td>
                          <td className="px-4 py-3">
                            <span className={`text-xs font-medium rounded-pill px-2 py-0.5 ${
                              u.status === 'active' ? 'bg-sage/10 text-sage' : 'bg-accent-gold/10 text-accent-gold'
                            }`}>
                              {u.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <button className="p-1.5 hover:bg-stone rounded transition-colors">
                                <CheckCircle2 className="w-4 h-4 text-sage" />
                              </button>
                              <button className="p-1.5 hover:bg-stone rounded transition-colors">
                                <XCircle className="w-4 h-4 text-red-500" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Bookings */}
            {activeTab === 'bookings' && (
              <div>
                <h2 className="font-serif text-2xl text-text-primary mb-6">Bookings</h2>

                {/* Status Filters */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                  {['all', 'confirmed', 'pending', 'active', 'completed', 'cancelled'].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setBookingFilter(filter)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                        bookingFilter === filter
                          ? 'bg-terracotta text-white'
                          : 'bg-white border border-stone-dark text-text-secondary hover:bg-stone'
                      }`}
                    >
                      {filter.charAt(0).toUpperCase() + filter.slice(1)}
                    </button>
                  ))}
                </div>

                <div className="bg-white rounded-xl border border-stone-dark overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-stone/50">
                      <tr>
                        <th className="text-left px-4 py-3 font-medium text-text-muted">Equipment</th>
                        <th className="text-left px-4 py-3 font-medium text-text-muted">Renter</th>
                        <th className="text-left px-4 py-3 font-medium text-text-muted">Dates</th>
                        <th className="text-left px-4 py-3 font-medium text-text-muted">Total</th>
                        <th className="text-left px-4 py-3 font-medium text-text-muted">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone">
                      {filteredBookings.map((b) => (
                        <tr key={b.id} className="hover:bg-stone/20">
                          <td className="px-4 py-3 font-medium text-text-primary">{b.equipment}</td>
                          <td className="px-4 py-3 text-text-secondary">{b.renter}</td>
                          <td className="px-4 py-3 text-text-secondary">{b.dates}</td>
                          <td className="px-4 py-3 font-medium text-text-primary">${b.total.toLocaleString()}</td>
                          <td className="px-4 py-3">
                            <span className={`text-xs font-medium rounded-pill px-2 py-0.5 ${bookingStatusConfig[b.status].className}`}>
                              {bookingStatusConfig[b.status].label}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Reviews */}
            {activeTab === 'reviews' && (
              <div>
                <h2 className="font-serif text-2xl text-text-primary mb-6">Reviews</h2>
                <div className="bg-white rounded-xl border border-stone-dark divide-y divide-stone">
                  {[
                    { user: 'Robert Carter', equipment: 'John Deere 8R 370', rating: 5, text: 'Excellent equipment, well maintained. Owner was very helpful.', date: '2 weeks ago' },
                    { user: 'Amanda Foster', equipment: 'CLAAS LEXION 780', rating: 5, text: 'Saved our harvest season. Highly recommend!', date: '1 month ago' },
                    { user: 'Walter Brooks', equipment: 'Valley Pivot 8000', rating: 4, text: 'Great irrigation system. Easy to set up and use.', date: '1 month ago' },
                    { user: 'Lisa Chen', equipment: 'Kuhn Discover XL', rating: 5, text: 'Perfect for our tillage needs. Will rent again.', date: '2 months ago' },
                  ].map((review, i) => (
                    <div key={i} className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-stone-dark flex items-center justify-center text-sm font-medium text-text-primary">
                            {review.user.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-text-primary">{review.user}</p>
                            <p className="text-xs text-text-muted">{review.equipment}</p>
                          </div>
                        </div>
                        <span className="text-xs text-text-muted">{review.date}</span>
                      </div>
                      <div className="flex gap-0.5 mt-2">
                        {[...Array(5)].map((_, j) => (
                          <Star
                            key={j}
                            className={`w-3.5 h-3.5 ${
                              j < review.rating ? 'fill-accent-gold text-accent-gold' : 'text-stone-dark'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-sm text-text-secondary mt-2">{review.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Analytics */}
            {activeTab === 'analytics' && (
              <div>
                <h2 className="font-serif text-2xl text-text-primary mb-6">Analytics</h2>

                {/* Charts Placeholder */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl border border-stone-dark p-6">
                    <h3 className="text-sm font-semibold text-text-primary mb-4">Revenue Trend</h3>
                    <div className="h-48 flex items-end gap-2">
                      {[35, 45, 30, 55, 48, 62, 58, 70, 65, 75, 68, 80].map((h, i) => (
                        <div key={i} className="flex-1 bg-terracotta/20 rounded-t hover:bg-terracotta/40 transition-colors relative group">
                          <div
                            className="bg-terracotta rounded-t transition-all"
                            style={{ height: `${h}%` }}
                          />
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-charcoal text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            ${(h * 800).toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-text-muted">
                      <span>Jan</span><span>Mar</span><span>Jun</span><span>Sep</span><span>Dec</span>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border border-stone-dark p-6">
                    <h3 className="text-sm font-semibold text-text-primary mb-4">Equipment Categories</h3>
                    <div className="space-y-3">
                      {[
                        { label: 'Tractors', value: 35, color: 'bg-terracotta' },
                        { label: 'Harvesters', value: 25, color: 'bg-accent-gold' },
                        { label: 'Irrigation', value: 20, color: 'bg-sage' },
                        { label: 'Tillage', value: 12, color: 'bg-blue-400' },
                        { label: 'Other', value: 8, color: 'bg-stone-dark' },
                      ].map((cat) => (
                        <div key={cat.label}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-text-secondary">{cat.label}</span>
                            <span className="text-text-primary font-medium">{cat.value}%</span>
                          </div>
                          <div className="w-full h-2 bg-stone rounded-full overflow-hidden">
                            <div className={`${cat.color} h-full rounded-full`} style={{ width: `${cat.value}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border border-stone-dark p-6">
                    <h3 className="text-sm font-semibold text-text-primary mb-4">Key Metrics</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { label: 'Avg. Rental Duration', value: '7.2 days' },
                        { label: 'Booking Conversion', value: '68%' },
                        { label: 'Repeat Renters', value: '42%' },
                        { label: 'Equipment Utilization', value: '73%' },
                      ].map((m) => (
                        <div key={m.label} className="bg-stone/30 rounded-lg p-3">
                          <p className="text-lg font-semibold text-text-primary">{m.value}</p>
                          <p className="text-xs text-text-muted">{m.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border border-stone-dark p-6">
                    <h3 className="text-sm font-semibold text-text-primary mb-4">Top Performing</h3>
                    <div className="space-y-3">
                      {equipmentData.slice(0, 4).map((eq, i) => (
                        <div key={eq.id} className="flex items-center gap-3">
                          <span className="text-lg font-semibold text-text-muted w-6">{i + 1}</span>
                          <img src={eq.image} alt={eq.name} className="w-10 h-10 rounded object-cover" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-text-primary truncate">{eq.name}</p>
                            <p className="text-xs text-text-muted">{eq.category}</p>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-text-secondary">
                            <TrendingUp className="w-3 h-3 text-sage" />
                            {eq.rating}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Settings */}
            {activeTab === 'settings' && (
              <div>
                <h2 className="font-serif text-2xl text-text-primary mb-6">Admin Settings</h2>
                <div className="bg-white rounded-xl border border-stone-dark p-6 space-y-6">
                  <div>
                    <h3 className="text-sm font-semibold text-text-primary mb-3">Platform Settings</h3>
                    <div className="space-y-3">
                      {[
                        { label: 'Enable new registrations', default: true },
                        { label: 'Require approval for new listings', default: true },
                        { label: 'Enable instant booking', default: false },
                        { label: 'Maintenance mode', default: false },
                      ].map((setting, i) => (
                        <label key={i} className="flex items-center justify-between py-2">
                          <span className="text-sm text-text-secondary">{setting.label}</span>
                          <input
                            type="checkbox"
                            defaultChecked={setting.default}
                            className="accent-terracotta w-4 h-4"
                          />
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-stone pt-6">
                    <h3 className="text-sm font-semibold text-text-primary mb-3">Commission Rates</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-text-muted mb-1 block">Platform Fee (%)</label>
                        <input
                          type="number"
                          defaultValue={5}
                          className="w-full border border-stone-dark rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-terracotta"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-text-muted mb-1 block">Insurance Fee/Day ($)</label>
                        <input
                          type="number"
                          defaultValue={25}
                          className="w-full border border-stone-dark rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-terracotta"
                        />
                      </div>
                    </div>
                  </div>

                  <button className="btn-primary">Save Settings</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
