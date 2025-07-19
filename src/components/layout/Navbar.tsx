import React from 'react';
import { Wallet, Menu, X } from 'lucide-react';
import DarkModeToggle from '../ui/DarkModeToggle';

interface NavbarProps {
  currentView: string;
  isWalletConnected: boolean;
  onViewChange: (view: string) => void;
  onConnectWallet: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export default function Navbar({ currentView, isWalletConnected, onViewChange, onConnectWallet, isDarkMode, onToggleDarkMode }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const scrollToSection = (sectionId: string) => {
    if (currentView !== 'landing') {
      onViewChange('landing');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        element?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      element?.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { label: 'Home', action: () => scrollToSection('hero') },
    { label: 'How It Works', action: () => scrollToSection('how-it-works') },
    { label: 'Features', action: () => scrollToSection('features') },
    { label: 'Testimonials', action: () => scrollToSection('testimonials') },
    { label: 'FAQs', action: () => scrollToSection('faq') },
  ];

  if (isWalletConnected) {
    navItems.push({ label: 'Dashboard', action: () => onViewChange('dashboard') });
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => onViewChange('landing')}
          >
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-sm">I</span>
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white transition-colors duration-300">Invoy</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button className="text-gray-700 dark:text-gray-300 hover:text-red-500 font-medium transition-colors duration-200">
              Solution
            </button>
            <button className="text-gray-700 dark:text-gray-300 hover:text-red-500 font-medium transition-colors duration-200">
              Uses Cases
            </button>
            <button className="text-gray-700 dark:text-gray-300 hover:text-red-500 font-medium transition-colors duration-200">
              Industries
            </button>
            <button className="text-gray-700 dark:text-gray-300 hover:text-red-500 font-medium transition-colors duration-200">
              Partners
            </button>
            <button className="text-gray-700 dark:text-gray-300 hover:text-red-500 font-medium transition-colors duration-200">
              Resource Center
            </button>
            <button className="text-gray-700 dark:text-gray-300 hover:text-red-500 font-medium transition-colors duration-200">
              Company
            </button>
          </div>

          {/* Dark Mode Toggle & Connect Wallet Button */}
          <div className="hidden md:flex">
            <div className="flex items-center space-x-4">
              <button className="text-gray-700 dark:text-gray-300 hover:text-red-500 font-medium transition-colors duration-200">
                Log In
              </button>
              <button
                className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-6 py-2 rounded-lg font-medium hover:border-red-500 hover:text-red-500 transition-all duration-200"
              >
                Sign up
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col space-y-3">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={item.action}
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors duration-200 text-left px-2 py-1"
                >
                  {item.label}
                </button>
              ))}
              <div className="flex items-center justify-between mt-4">
                <DarkModeToggle isDarkMode={isDarkMode} onToggle={onToggleDarkMode} />
                <button
                  onClick={onConnectWallet}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
                >
                  <Wallet size={18} />
                  <span>{isWalletConnected ? 'Wallet Connected' : 'Connect Wallet'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}