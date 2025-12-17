import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import { Button } from '../ui/button';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { settings } = useSettings();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Products', path: '/products' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Our Clients', path: '/clients' },
    { name: 'Articles', path: '/articles' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header
      data-testid="main-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'glass-effect shadow-lg py-3' : 'bg-white/90 backdrop-blur-sm py-5'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2" data-testid="logo-link">
            {settings?.logo_url ? (
              <img
                src={settings.logo_url}
                alt={settings.site_name || 'Logo'}
                className="h-10 sm:h-12 w-auto object-contain"
                data-testid="logo-image"
              />
            ) : (
              <div className="text-2xl sm:text-3xl font-bold text-gradient">
                {settings?.logo_text || settings?.site_name || 'Ellavera Beauty'}
              </div>
            )}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                data-testid={`nav-link-${link.name.toLowerCase().replace(' ', '-')}`}
                className={`text-sm font-medium transition-colors hover:text-cyan-600 ${
                  location.pathname === link.path ? 'text-cyan-600' : 'text-slate-700'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Auth & Admin */}
          <div className="hidden lg:flex items-center space-x-4">
            {user ? (
              <>
                {user.is_admin && (
                  <Link to="/admin" data-testid="admin-link">
                    <Button variant="outline" size="sm" className="border-cyan-600 text-cyan-600 hover:bg-cyan-50">
                      Admin Dashboard
                    </Button>
                  </Link>
                )}
                <Button
                  onClick={logout}
                  data-testid="logout-button"
                  variant="outline"
                  size="sm"
                  className="border-slate-300"
                >
                  <User className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <Link to="/auth" data-testid="login-link">
                <Button size="sm" className="bg-cyan-600 hover:bg-cyan-700 text-white">
                  Login
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-slate-700"
            data-testid="mobile-menu-toggle"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 space-y-3 bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-lg" data-testid="mobile-menu">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                data-testid={`mobile-nav-link-${link.name.toLowerCase().replace(' ', '-')}`}
                className={`block py-2 text-sm font-medium transition-colors ${
                  location.pathname === link.path ? 'text-cyan-600' : 'text-slate-700'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-3 border-t border-slate-200">
              {user ? (
                <>
                  {user.is_admin && (
                    <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} data-testid="mobile-admin-link">
                      <Button variant="outline" size="sm" className="w-full mb-2 border-cyan-600 text-cyan-600">
                        Admin Dashboard
                      </Button>
                    </Link>
                  )}
                  <Button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    data-testid="mobile-logout-button"
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)} data-testid="mobile-login-link">
                  <Button size="sm" className="w-full bg-cyan-600 hover:bg-cyan-700 text-white">
                    Login
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
