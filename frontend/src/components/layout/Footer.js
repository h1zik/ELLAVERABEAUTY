import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

const Footer = () => {
  const { settings, loading } = useSettings();

  if (loading || !settings) {
    return null; // or a loading skeleton
  }

  return (
    <footer className="bg-slate-900 text-white pt-16 pb-8" data-testid="main-footer">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold text-gradient mb-4" data-testid="footer-brand">
              {settings.site_name || 'Ellavera Beauty'}
            </h3>
            <p className="text-slate-400 text-sm mb-4">
              {settings.footer_text || 'Premium cosmetic manufacturing solutions for your brand. We create beauty products that inspire confidence.'}
            </p>
            <div className="flex space-x-4">
              {settings.facebook_url && settings.facebook_url !== '#' && (
                <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-cyan-400 transition-colors" data-testid="social-facebook">
                  <Facebook size={20} />
                </a>
              )}
              {settings.instagram_url && settings.instagram_url !== '#' && (
                <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-cyan-400 transition-colors" data-testid="social-instagram">
                  <Instagram size={20} />
                </a>
              )}
              {settings.twitter_url && settings.twitter_url !== '#' && (
                <a href={settings.twitter_url} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-cyan-400 transition-colors" data-testid="social-twitter">
                  <Twitter size={20} />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-slate-400 hover:text-cyan-400 transition-colors text-sm" data-testid="footer-link-home">Home</Link></li>
              <li><Link to="/products" className="text-slate-400 hover:text-cyan-400 transition-colors text-sm" data-testid="footer-link-products">Products</Link></li>
              <li><Link to="/clients" className="text-slate-400 hover:text-cyan-400 transition-colors text-sm" data-testid="footer-link-clients">Our Clients</Link></li>
              <li><Link to="/articles" className="text-slate-400 hover:text-cyan-400 transition-colors text-sm" data-testid="footer-link-articles">Articles</Link></li>
              <li><Link to="/about" className="text-slate-400 hover:text-cyan-400 transition-colors text-sm" data-testid="footer-link-about">About Us</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Our Services</h4>
            <ul className="space-y-2">
              <li className="text-slate-400 text-sm">Skincare Manufacturing</li>
              <li className="text-slate-400 text-sm">Body Care Products</li>
              <li className="text-slate-400 text-sm">Hair Care Solutions</li>
              <li className="text-slate-400 text-sm">Fragrance Development</li>
              <li className="text-slate-400 text-sm">Private Label Services</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2 text-slate-400 text-sm">
                <MapPin size={16} className="mt-1 flex-shrink-0" />
                <span>{settings.contact_address || 'Jakarta, Indonesia'}</span>
              </li>
              <li className="flex items-center space-x-2 text-slate-400 text-sm">
                <Phone size={16} className="flex-shrink-0" />
                <span>{settings.contact_phone || '+62 123 456 7890'}</span>
              </li>
              <li className="flex items-center space-x-2 text-slate-400 text-sm">
                <Mail size={16} className="flex-shrink-0" />
                <span>{settings.contact_email || 'info@ellavera.com'}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 text-center text-slate-400 text-sm">
          <p>&copy; {new Date().getFullYear()} {settings.site_name || 'Ellavera Beauty'}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
