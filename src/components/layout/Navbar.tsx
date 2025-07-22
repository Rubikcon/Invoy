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
    { label: 'About', action: () => onViewChange('about-us') },
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
            <div className="w-8 h-8 relative">
              <svg viewBox="0 0 32 32" className="w-full h-full">
                <defs>
                  <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="50%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#06B6D4" />
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                    <feMerge> 
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                
                {/* Outer hexagon */}
                <path
                  d="M16 2 L26 8 L26 24 L16 30 L6 24 L6 8 Z"
                  fill="url(#logoGradient)"
                  filter="url(#glow)"
                  className="drop-shadow-lg"
                />
                
                {/* Inner blockchain links */}
                <g fill="white" opacity="0.9">
                  {/* Center node */}
                  <circle cx="16" cy="16" r="2.5" />
                  
                  {/* Connected nodes */}
                  <circle cx="12" cy="10" r="1.5" />
                  <circle cx="20" cy="10" r="1.5" />
                  <circle cx="12" cy="22" r="1.5" />
                  <circle cx="20" cy="22" r="1.5" />
                  
                  {/* Connection lines */}
                  <line x1="16" y1="16" x2="12" y2="10" stroke="white" strokeWidth="1" opacity="0.7" />
                  <line x1="16" y1="16" x2="20" y2="10" stroke="white" strokeWidth="1" opacity="0.7" />
                  <line x1="16" y1="16" x2="12" y2="22" stroke="white" strokeWidth="1" opacity="0.7" />
                  <line x1="16" y1="16" x2="20" y2="22" stroke="white" strokeWidth="1" opacity="0.7" />
                </g>
                
                {/* Subtle animation */}
                <circle cx="16" cy="16" r="3" fill="none" stroke="white" strokeWidth="0.5" opacity="0.3">
                  <animate attributeName="r" values="3;4;3" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.3;0.1;0.3" dur="2s" repeatCount="indefinite" />
                </circle>
              </svg>
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white transition-colors duration-300">Invoy</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {!isWalletConnected && (
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

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col space-y-3">
              {!isWalletConnected && (
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
              )}
              
              <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                <DarkModeToggle isDarkMode={isDarkMode} onToggle={onToggleDarkMode} />
                {!isWalletConnected && (
                  <button
                    onClick={onConnectWallet}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
                  >
                    <Wallet size={16} />
                    <span>Connect</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}