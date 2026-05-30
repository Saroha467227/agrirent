import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Tractor, LogOut, LayoutDashboard, Calendar, Leaf } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const publicLinks = [
  { label: 'Home', to: '/' },
  { label: 'Equipment', to: '#equipment' },
  { label: 'How It Works', to: '#how-it-works' },
  { label: 'Pricing', to: '#pricing' },
];

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/login');
  };

  const roleDashboard = user?.role === 'admin' ? '/admin/dashboard' : user?.role === 'owner' ? '/owner/dashboard' : '/farmer/dashboard';

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'py-3' : 'py-5'
      }`}
    >
      <div className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 transition-all duration-300 ${
        scrolled ? 'glass rounded-2xl mx-4 sm:mx-6 lg:mx-8 shadow-2xl shadow-emerald-900/10' : ''
      }`}>
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group" onClick={() => setMenuOpen(false)}>
            <div className="bg-gradient-to-br from-emerald-400 to-emerald-600 p-2 rounded-xl group-hover:scale-105 transition-transform duration-300 shadow-lg shadow-emerald-500/20">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Agri<span className="text-emerald-400">Rent</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {!isAuthenticated && publicLinks.map((link) => (
              <a
                key={link.to}
                href={link.to}
                className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors relative group"
              >
                {link.label}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-emerald-400 transition-all duration-300 group-hover:w-full opacity-0 group-hover:opacity-100 rounded-full" />
              </a>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <Link
                  to={roleDashboard}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-emerald-300 hover:text-white bg-emerald-500/10 hover:bg-emerald-500/20 rounded-lg transition-colors border border-emerald-500/20"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-5 py-2.5 text-sm font-medium text-white hover:text-emerald-400 transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="relative px-5 py-2.5 text-sm font-semibold text-emerald-950 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-xl hover:scale-105 transition-transform duration-300 shadow-lg shadow-emerald-500/20 glow-border"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-slate-300 hover:text-white transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden border-t border-white/10 mt-2"
            >
              <div className="py-4 space-y-2 flex flex-col">
                {!isAuthenticated && publicLinks.map((link) => (
                  <a
                    key={link.to}
                    href={link.to}
                    className="px-4 py-3 text-base font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                ))}
                
                <div className="pt-4 mt-2 border-t border-white/10 px-4">
                  {isAuthenticated ? (
                    <div className="space-y-3">
                      <Link
                        to={roleDashboard}
                        className="flex items-center justify-center gap-2 w-full py-3 text-sm font-medium text-emerald-300 bg-emerald-500/10 rounded-xl border border-emerald-500/20"
                        onClick={() => setMenuOpen(false)}
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Dashboard
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center justify-center gap-2 w-full py-3 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      <Link
                        to="/login"
                        className="flex items-center justify-center py-3 text-sm font-medium text-white bg-white/5 hover:bg-white/10 rounded-xl transition-colors border border-white/10"
                        onClick={() => setMenuOpen(false)}
                      >
                        Log in
                      </Link>
                      <Link
                        to="/register"
                        className="flex items-center justify-center py-3 text-sm font-semibold text-emerald-950 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-xl shadow-lg shadow-emerald-500/20"
                        onClick={() => setMenuOpen(false)}
                      >
                        Get Started
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;
