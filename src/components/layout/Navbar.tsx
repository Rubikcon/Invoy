import React from 'react';
import { Wallet, Menu, X, LogOut } from 'lucide-react';
import DarkModeToggle from '../ui/DarkModeToggle';

interface NavbarProps {
  currentView: string;
  isWalletConnected: boolean;
  onViewChange: (view: string) => void;
  onConnectWallet: () => void;
  onDisconnectWallet: () => void;
  walletAddress: string;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  connectionError?: string;
}

export default function Navbar({ 
  currentView, 
  isWalletConnected, 
  onViewChange, 
  onConnectWallet, 
  onDisconnectWallet,
  walletAddress,
  isDarkMode, 
  onToggleDarkMode,
  connectionError
}: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const formatAddress = (address: string): string => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

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
            {!isWalletConnected ? (
              // Show all navigation links when wallet is not connected
              navItems.slice(0, -1).map((item) => (
                <button
                  key={item.label}
                  onClick={item.action}
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors duration-200"
                >
                  {item.label}
                </button>
              ))
            ) : (
              // Show only Dashboard link when wallet is connected
              <button
                onClick={() => onViewChange('dashboard')}
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors duration-200"
              >
                Dashboard
              </button>
            )}
          </div>

          {/* Dark Mode Toggle & Connect Wallet Button */}
          <div className="hidden md:flex items-center space-x-4">
            <DarkModeToggle isDarkMode={isDarkMode} onToggle={onToggleDarkMode} />
            {!isWalletConnected && (
              <button
                onClick={onConnectWallet}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
              >
                <Wallet size={18} />
                <span>Connect Wallet</span>
              </button>
            )}
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

        {/* Desktop Navigation - Only show when wallet is not connected */}
        {!isWalletConnected && (
          <div className="hidden md:flex items-center space-x-8">
            {navItems.slice(0, -1).map((item) => (
              <button
                key={item.label}
                onClick={item.action}
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors duration-200"
              >
                {item.label}
              </button>
            ))}
          </div>
        )}

        {/* Dashboard Link - Only show when wallet is connected */}
        {isWalletConnected && (
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => onViewChange('dashboard')}
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors duration-200"
            >
              Dashboard
            </button>
          </div>
        )}

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col space-y-3">
              {!isWalletConnected ? (
                // Show all navigation links when wallet is not connected
                navItems.slice(0, -1).map((item) => (
                  <button
                    key={item.label}
                    onClick={item.action}
                    className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors duration-200 text-left px-2 py-1"
                  >
                    {item.label}
                  </button>
                ))
    </nav>
  );
}