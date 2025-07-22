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
            <div className="w-10 h-10 relative">
              <svg viewBox="0 0 32 32" className="w-full h-full">
                <defs>
                  <linearGradient id="navLogoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="50%" stopColor="#6366F1" />
                    <stop offset="100%" stopColor="#8B5CF6" />
                  </linearGradient>
                  <linearGradient id="navAccentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#06B6D4" />
                    <stop offset="100%" stopColor="#0891B2" />
                  </linearGradient>
                </defs>
                
                {/* Main invoice document */}
                <path
                  d="M5 3 L23 3 L25 5 L25 29 L5 29 Z"
                  fill="url(#navLogoGradient)"
                  className="drop-shadow-lg"
                />
                
                {/* Folded corner detail */}
                <path
                  d="M23 3 L23 5 L25 5 Z"
                  fill="url(#navAccentGradient)"
                  opacity="0.8"
                />
                
                {/* Invoice line items */}
                <g stroke="white" strokeWidth="1.2" opacity="0.9" fill="none">
                  <line x1="8" y1="9" x2="19" y2="9" />
                  <line x1="8" y1="12" x2="22" y2="12" />
                  <line x1="8" y1="15" x2="17" y2="15" />
                </g>
                
                {/* Web3 crypto elements */}
                <g fill="white" opacity="0.95">
                  {/* Ethereum diamond */}
                  <path d="M15 18 L12.5 20 L15 21.2 L17.5 20 Z" />
                  <path d="M15 17.5 L12.5 19.5 L15 16.5 L17.5 19.5 Z" opacity="0.7" />
                  
                  {/* Blockchain network nodes */}
                  <circle cx="10" cy="25" r="0.8" />
                  <circle cx="15" cy="25" r="0.8" />
                  <circle cx="20" cy="25" r="0.8" />
                  
                  {/* Network connections */}
                  <line x1="10.8" y1="25" x2="14.2" y2="25" stroke="white" strokeWidth="0.4" opacity="0.7" />
                  <line x1="15.8" y1="25" x2="19.2" y2="25" stroke="white" strokeWidth="0.4" opacity="0.7" />
                </g>
                
                {/* Subtle glow animation */}
                <circle cx="15" cy="19" r="3.5" fill="none" stroke="white" strokeWidth="0.2" opacity="0.15">
                  <animate attributeName="r" values="3.5;4.2;3.5" dur="4s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.15;0.05;0.15" dur="4s" repeatCount="indefinite" />
                </circle>
              </svg>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
              Invoy
            </span>
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