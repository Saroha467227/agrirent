import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Tractor, Calendar, MessageSquare, User, Settings,
  HelpCircle, Plus, ChevronRight,
  Eye, BarChart3
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { equipmentData } from '@/data/equipment';
import { useMyBookings } from '@/hooks/useBookings';

const sidebarItems = [
  { key: 'rentals', label: 'My Rentals', icon: <Calendar className="w-5 h-5" /> },
  { key: 'listings', label: 'My Listings', icon: <Tractor className="w-5 h-5" /> },
  { key: 'messages', label: 'Messages', icon: <MessageSquare className="w-5 h-5" /> },
  { key: 'profile', label: 'Profile', icon: <User className="w-5 h-5" /> },
  { key: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
  { key: 'help', label: 'Help', icon: <HelpCircle className="w-5 h-5" /> },
];

// Mock conversations for now


const mockConversations = [
  {
    id: 'c1',
    participant: 'Mike Peterson',
    participantAvatar: '/images/avatar-farmer-1.jpg',
    lastMessage: 'The tractor is ready for pickup tomorrow morning.',
    timestamp: '2 min ago',
    unread: 2,
  },
  {
    id: 'c2',
    participant: 'Sarah Mitchell',
    participantAvatar: '/images/avatar-farmer-2.jpg',
    lastMessage: 'Thanks for the rental! Everything went smoothly.',
    timestamp: '1 hour ago',
    unread: 0,
  },
  {
    id: 'c3',
    participant: 'Jim Henderson',
    participantAvatar: '/images/avatar-farmer-3.jpg',
    lastMessage: 'Can we extend the rental for 3 more days?',
    timestamp: '3 hours ago',
    unread: 1,
  },
];

const statusConfig = {
  confirmed: { label: 'Confirmed', className: 'bg-sage text-white' },
  pending: { label: 'Pending', className: 'bg-accent-gold text-white' },
  completed: { label: 'Completed', className: 'bg-text-muted text-white' },
  cancelled: { label: 'Cancelled', className: 'bg-red-500 text-white' },
};

export default function Dashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('rentals');
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);

  const { bookings, loading: bookingsLoading, error: bookingsError } = useMyBookings();

  if (!user) {
    return (
      <main className="min-h-screen bg-cream pt-24 flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-serif text-2xl text-text-primary">Please sign in</h2>
          <p className="text-text-secondary mt-2">You need to be signed in to view your dashboard.</p>
          <Link to="/login" className="btn-primary mt-6 inline-block">
            Sign In
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-cream pt-16">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-60 shrink-0">
            <div className="bg-charcoal rounded-xl p-4 lg:sticky lg:top-24">
              {/* User Info */}
              <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white truncate">{user.name}</p>
                  <p className="text-xs text-white/50 capitalize">{user.role}</p>
                </div>
              </div>

              {/* Nav Items */}
              <nav className="mt-4 space-y-1">
                {sidebarItems.map((item) => (
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
            {/* My Rentals */}
            {activeTab === 'rentals' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-serif text-2xl text-text-primary">My Rentals</h2>
                  <Link to="/catalog" className="text-sm text-terracotta hover:underline">
                    Browse Equipment
                  </Link>
                </div>

                {/* Upcoming */}
                <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-4">Upcoming</h3>
                <div className="space-y-4">
                  {bookingsLoading ? (
                    <div className="py-8 flex justify-center">
                      <span className="w-8 h-8 border-4 border-terracotta/30 border-t-terracotta rounded-full animate-spin" />
                    </div>
                  ) : bookingsError ? (
                    <p className="text-red-500 text-sm">{bookingsError}</p>
                  ) : (
                    <>
                      {bookings.filter(r => r.status === 'confirmed' || r.status === 'pending').map((rental) => (
                        <div key={rental.id} className="bg-white rounded-xl border border-stone-dark p-4 flex flex-col sm:flex-row gap-4">
                          <img
                            src={rental.equipment.image}
                            alt={rental.equipment.name}
                            className="w-full sm:w-32 h-24 object-cover rounded-lg"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h4 className="font-semibold text-text-primary">{rental.equipment.name}</h4>
                                <p className="text-sm text-text-muted">
                                  {rental.startDate} to {rental.endDate}
                                </p>
                              </div>
                              <span className={`shrink-0 text-xs font-medium rounded-pill px-2.5 py-1 ${statusConfig[rental.status].className}`}>
                                {statusConfig[rental.status].label}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 mt-3">
                              <span className="text-sm font-medium text-text-primary">${rental.totalPrice.toLocaleString()}</span>
                              <Link
                                to={`/equipment/${rental.equipment.id}`}
                                className="text-sm text-terracotta hover:underline"
                              >
                                View Details
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
                      {bookings.filter(r => r.status === 'confirmed' || r.status === 'pending').length === 0 && (
                        <p className="text-text-muted text-sm">No upcoming rentals.</p>
                      )}
                    </>
                  )}
                </div>

                {/* History */}
                <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mt-8 mb-4">History</h3>
                <div className="space-y-4">
                  {!bookingsLoading && bookings.filter(r => r.status === 'completed' || r.status === 'cancelled').map((rental) => (
                    <div key={rental.id} className="bg-white rounded-xl border border-stone-dark p-4 flex flex-col sm:flex-row gap-4 opacity-75">
                      <img
                        src={rental.equipment.image}
                        alt={rental.equipment.name}
                        className="w-full sm:w-32 h-24 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-text-primary">{rental.equipment.name}</h4>
                        <p className="text-sm text-text-muted">
                          {rental.startDate} to {rental.endDate}
                        </p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-sm font-medium">${rental.totalPrice.toLocaleString()}</span>
                          <span className={`text-xs font-medium rounded-pill px-2.5 py-0.5 ${statusConfig[rental.status].className}`}>
                            {statusConfig[rental.status].label}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* My Listings */}
            {activeTab === 'listings' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-serif text-2xl text-text-primary">My Listings</h2>
                  <button className="btn-primary flex items-center gap-2 text-sm">
                    <Plus className="w-4 h-4" />
                    Add New Listing
                  </button>
                </div>

                <div className="space-y-4">
                  {equipmentData.slice(0, 2).map((eq) => (
                    <div key={eq.id} className="bg-white rounded-xl border border-stone-dark p-4 flex flex-col sm:flex-row gap-4">
                      <img
                        src={eq.image}
                        alt={eq.name}
                        className="w-full sm:w-40 h-28 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold text-text-primary">{eq.name}</h4>
                            <p className="text-sm text-text-muted">${eq.pricePerDay}/day</p>
                          </div>
                          <span className="text-xs font-medium bg-sage text-white rounded-pill px-2.5 py-1">
                            Active
                          </span>
                        </div>
                        <div className="flex items-center gap-4 mt-3 text-sm text-text-secondary">
                          <span className="flex items-center gap-1">
                            <Eye className="w-4 h-4" /> 234 views
                          </span>
                          <span className="flex items-center gap-1">
                            <BarChart3 className="w-4 h-4" /> 12 inquiries
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" /> 4 bookings
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Messages */}
            {activeTab === 'messages' && (
              <div>
                <h2 className="font-serif text-2xl text-text-primary mb-6">Messages</h2>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 bg-white rounded-xl border border-stone-dark overflow-hidden">
                  {/* Conversation List */}
                  <div className="lg:col-span-1 border-r border-stone-dark">
                    {mockConversations.map((conv) => (
                      <button
                        key={conv.id}
                        onClick={() => setSelectedConversation(conv.id)}
                        className={`w-full flex items-start gap-3 p-4 text-left hover:bg-stone/30 transition-colors border-b border-stone ${
                          selectedConversation === conv.id ? 'bg-stone/30' : ''
                        }`}
                      >
                        <div className="relative shrink-0">
                          <img
                            src={conv.participantAvatar}
                            alt={conv.participant}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          {conv.unread > 0 && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-terracotta text-white text-[10px] font-medium rounded-full flex items-center justify-center">
                              {conv.unread}
                            </span>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-text-primary">{conv.participant}</p>
                          <p className="text-xs text-text-muted truncate">{conv.lastMessage}</p>
                          <p className="text-[10px] text-text-muted mt-1">{conv.timestamp}</p>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Chat Area */}
                  <div className="lg:col-span-2 p-4 min-h-[400px] flex flex-col">
                    {selectedConversation ? (
                      <>
                        <div className="flex items-center gap-3 pb-4 border-b border-stone">
                          <img
                            src={mockConversations.find(c => c.id === selectedConversation)?.participantAvatar}
                            alt=""
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <p className="text-sm font-medium text-text-primary">
                            {mockConversations.find(c => c.id === selectedConversation)?.participant}
                          </p>
                        </div>
                        <div className="flex-1 py-4 space-y-3">
                          <div className="bg-stone rounded-lg p-3 max-w-[80%]">
                            <p className="text-sm text-text-secondary">Hi, is the equipment still available for the dates I requested?</p>
                          </div>
                          <div className="bg-terracotta/10 rounded-lg p-3 max-w-[80%] ml-auto">
                            <p className="text-sm text-text-secondary">Yes, it&apos;s available! I can have it ready for pickup on Monday morning.</p>
                          </div>
                        </div>
                        <div className="flex gap-2 pt-4 border-t border-stone">
                          <input
                            type="text"
                            placeholder="Type a message..."
                            className="flex-1 border border-stone-dark rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-terracotta"
                          />
                          <button className="bg-terracotta text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-terracotta-hover transition-colors">
                            Send
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="flex-1 flex items-center justify-center text-text-muted">
                        Select a conversation to start messaging
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Profile */}
            {activeTab === 'profile' && (
              <div>
                <h2 className="font-serif text-2xl text-text-primary mb-6">Profile</h2>
                <div className="bg-white rounded-xl border border-stone-dark p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-20 h-20 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-text-primary">{user.name}</h3>
                      <p className="text-sm text-text-muted">Member since {user.memberSince}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-text-muted mb-1 block">Full Name</label>
                      <input
                        type="text"
                        defaultValue={user.name}
                        className="w-full border border-stone-dark rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-terracotta"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-text-muted mb-1 block">Email</label>
                      <input
                        type="email"
                        defaultValue={user.email}
                        className="w-full border border-stone-dark rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-terracotta"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-text-muted mb-1 block">Phone</label>
                      <input
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        className="w-full border border-stone-dark rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-terracotta"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-text-muted mb-1 block">Location</label>
                      <input
                        type="text"
                        placeholder="City, State"
                        className="w-full border border-stone-dark rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-terracotta"
                      />
                    </div>
                  </div>

                  <button className="btn-primary mt-6">Save Changes</button>
                </div>
              </div>
            )}

            {/* Settings */}
            {activeTab === 'settings' && (
              <div>
                <h2 className="font-serif text-2xl text-text-primary mb-6">Settings</h2>
                <div className="bg-white rounded-xl border border-stone-dark p-6 space-y-6">
                  <div>
                    <h3 className="text-sm font-semibold text-text-primary mb-3">Notifications</h3>
                    <div className="space-y-3">
                      {[
                        { label: 'Email notifications for new bookings', default: true },
                        { label: 'SMS alerts for booking updates', default: false },
                        { label: 'Marketing emails and promotions', default: true },
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
                    <h3 className="text-sm font-semibold text-text-primary mb-3">Security</h3>
                    <button className="text-sm text-terracotta hover:underline">
                      Change password
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Help */}
            {activeTab === 'help' && (
              <div>
                <h2 className="font-serif text-2xl text-text-primary mb-6">Help Center</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { title: 'How to rent equipment', desc: 'Step-by-step guide to renting' },
                    { title: 'Listing your equipment', desc: 'How to create a listing' },
                    { title: 'Payment & billing', desc: 'Understanding fees and payments' },
                    { title: 'Insurance & safety', desc: 'Coverage and safety guidelines' },
                    { title: 'Cancellation policy', desc: 'How cancellations work' },
                    { title: 'Contact support', desc: 'Get help from our team' },
                  ].map((item, i) => (
                    <button
                      key={i}
                      className="bg-white rounded-xl border border-stone-dark p-5 text-left hover:border-terracotta transition-colors group"
                    >
                      <h4 className="text-sm font-semibold text-text-primary group-hover:text-terracotta transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-xs text-text-muted mt-1">{item.desc}</p>
                      <ChevronRight className="w-4 h-4 text-text-muted mt-3 group-hover:text-terracotta group-hover:translate-x-1 transition-all" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
