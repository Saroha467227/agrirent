import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Tractor, ChevronDown, User, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const navLinks = [
  { label: 'Catalog', href: '/catalog' },
  { label: 'How It Works', href: '/#how-it-works' },
  { label: 'Pricing', href: '/#pricing' },
  { label: 'About', href: '/#about' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated, isAdmin } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  }, [location.pathname]);

  const handleNavClick = (href: string) => {
    if (href.startsWith('/#')) {
      const id = href.replace('/#', '');
      if (location.pathname === '/') {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      } else {
        navigate('/');
        setTimeout(() => {
          const el = document.getElementById(id);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 300);
      }
    } else {
      navigate(href);
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 h-16 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-cream/95 backdrop-blur-xl shadow-sm'
            : 'bg-cream/92 backdrop-blur-md'
        }`}
      >
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <Tractor className="w-7 h-7 text-terracotta" />
            <span className="font-serif text-xl font-semibold text-charcoal">AgriRent</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.href)}
                className="text-sm font-medium text-text-secondary hover:text-terracotta transition-colors duration-150"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-stone transition-colors"
                >
                  <img
                    src={user?.avatar}
                    alt={user?.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="text-sm font-medium text-text-primary">{user?.name}</span>
                  <ChevronDown className={`w-4 h-4 text-text-muted transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-card-hover border border-stone-dark overflow-hidden">
                    <div className="px-4 py-3 border-b border-stone">
                      <p className="text-sm font-medium text-text-primary">{user?.name}</p>
                      <p className="text-xs text-text-muted">{user?.email}</p>
                    </div>
                    <div className="py-1">
                      <Link
                        to="/dashboard"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-secondary hover:bg-stone/50 hover:text-text-primary transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Dashboard
                      </Link>
                      {isAdmin && (
                        <Link
                          to="/admin"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-secondary hover:bg-stone/50 hover:text-text-primary transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          Admin Panel
                        </Link>
                      )}
                      <Link
                        to="/dashboard?tab=profile"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-secondary hover:bg-stone/50 hover:text-text-primary transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <User className="w-4 h-4" />
                        Profile
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setIsUserMenuOpen(false);
                          navigate('/');
                        }}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-secondary hover:bg-stone/50 hover:text-text-primary transition-colors w-full text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login?mode=signup"
                  className="text-sm font-medium text-text-secondary hover:text-terracotta transition-colors"
                >
                  List Equipment
                </Link>
                <Link
                  to="/catalog"
                  className="bg-terracotta text-white rounded-pill px-5 py-2 text-sm font-medium hover:bg-terracotta-hover hover:scale-[1.02] transition-all duration-200"
                >
                  Rent Now
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-stone transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-text-primary" />
            ) : (
              <Menu className="w-6 h-6 text-text-primary" />
            )}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-cream md:hidden">
          <div className="flex flex-col items-center justify-center h-full gap-8 pt-16">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.href)}
                className="font-serif text-3xl text-text-primary hover:text-terracotta transition-colors"
              >
                {link.label}
              </button>
            ))}
            <div className="flex flex-col items-center gap-4 mt-4">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    className="font-serif text-2xl text-text-primary hover:text-terracotta transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                      navigate('/');
                    }}
                    className="font-serif text-2xl text-text-primary hover:text-terracotta transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="font-serif text-2xl text-text-primary hover:text-terracotta transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/catalog"
                    className="bg-terracotta text-white rounded-pill px-8 py-3 text-lg font-medium hover:bg-terracotta-hover transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Browse Equipment
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
