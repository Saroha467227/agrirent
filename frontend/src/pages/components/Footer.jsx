import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Mail, Phone, MapPin, Globe, Users, Share2, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="relative bg-[#020617] pt-20 pb-10 border-t border-white/10 overflow-hidden">
      {/* Background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-emerald-900/20 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Col */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <div className="bg-gradient-to-br from-emerald-400 to-emerald-600 p-2 rounded-xl shadow-lg shadow-emerald-500/20">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-white">
                Agri<span className="text-emerald-400">Rent</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Empowering Indian farmers with accessible, premium agricultural machinery. Rent smarter, farm better.
            </p>
            <div className="flex items-center gap-4">
              {[Globe, Users, Share2, MessageCircle].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full glass flex items-center justify-center text-slate-400 hover:text-emerald-400 hover:border-emerald-500/30 transition-all duration-300">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-6">Platform</h4>
            <ul className="space-y-4">
              {['Browse Equipment', 'How it Works', 'Pricing', 'Owner Dashboard', 'Farmer Dashboard'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-slate-400 text-sm hover:text-emerald-400 transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-6">Legal</h4>
            <ul className="space-y-4">
              {['Terms of Service', 'Privacy Policy', 'Rental Agreement', 'Insurance Coverage', 'Cookie Policy'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-slate-400 text-sm hover:text-emerald-400 transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li>
                <a href="mailto:support@agrirent.in" className="flex items-center gap-3 text-slate-400 text-sm hover:text-emerald-400 transition-colors">
                  <Mail className="w-4 h-4 text-emerald-500" />
                  support@agrirent.in
                </a>
              </li>
              <li>
                <a href="tel:+919876543210" className="flex items-center gap-3 text-slate-400 text-sm hover:text-emerald-400 transition-colors">
                  <Phone className="w-4 h-4 text-emerald-500" />
                  +91 98765 43210
                </a>
              </li>
              <li className="flex items-start gap-3 text-slate-400 text-sm">
                <MapPin className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Sector 62, Noida<br/>Uttar Pradesh, 201309</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm text-center md:text-left">
            &copy; {new Date().getFullYear()} AgriRent Technologies Pvt. Ltd. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span>Made with</span>
            <span className="text-rose-500 animate-pulse">❤️</span>
            <span>for Indian Farmers</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
