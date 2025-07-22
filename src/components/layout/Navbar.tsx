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
            <div className="w-6 h-6 relative flex-shrink-0">
              <svg viewBox="0 0 32 32" className="w-full h-full">
                <defs>
                  <linearGradient id="navLogoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="50%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#06B6D4" />
                  </linearGradient>
                  <linearGradient id="navInvoiceGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10B981" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                </defs>
                
                {/* Invoice document background */}
                <path
                  d="M6 4 L24 4 L26 6 L26 28 L6 28 Z"
                  fill="url(#navLogoGradient)"
                  className="drop-shadow-lg"
                />
                
                {/* Document corner fold */}
                <path
                  d="M24 4 L24 6 L26 6 Z"
                  fill="url(#navInvoiceGradient)"
                  opacity="0.7"
                />
                
                {/* Invoice content lines */}
                <g stroke="white" strokeWidth="1" opacity="0.8" fill="none">
                  <line x1="9" y1="10" x2="20" y2="10" />
                  <line x1="9" y1="13" x2="23" y2="13" />
                  <line x1="9" y1="16" x2="18" y2="16" />
                </g>
                
                {/* Crypto/Web3 elements */}
                <g fill="white" opacity="0.9">
                  {/* Ethereum symbol */}
                  <path d="M16 19 L13 21 L16 22.5 L19 21 Z" />
                  <path d="M16 18.5 L13 20.5 L16 17 L19 20.5 Z" opacity="0.6" />
                  
                  {/* Blockchain dots */}
                  <circle cx="11" cy="25" r="0.8" />
                  <circle cx="16" cy="25" r="0.8" />
                  <circle cx="21" cy="25" r="0.8" />
                  
                  {/* Connection lines */}
                  <line x1="12" y1="25" x2="15" y2="25" stroke="white" strokeWidth="0.4" opacity="0.6" />
                  <line x1="17" y1="25" x2="20" y2="25" stroke="white" strokeWidth="0.4" opacity="0.6" />
                </g>
              </svg>
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Invoy
            </span>
          </div>

          {/* Desktop Navigation */}
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

          {/* Dashboard title when wallet is connected */}

          {/* Dark Mode Toggle & Connect Wallet Button */}
          <div className="hidden md:flex items-center space-x-4">
            {!isWalletConnected && <DarkModeToggle isDarkMode={isDarkMode} onToggle={onToggleDarkMode} />}
            {!isWalletConnected && (
              <button
                onClick={onConnectWallet}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
              >
                <Wallet size={18} />
                <span>Connect Wallet</span>
              </button>
            )}
              <button
                onClick={onDisconnectWallet}
                className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors duration-200 flex items-center space-x-2"
              >
                <LogOut size={16} />
                <span>Disconnect Wallet</span>
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
                <>
                  {navItems.slice(0, -1).map((item) => (
                    <button
                      key={item.label}
                      onClick={item.action}
                      className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors duration-200 text-left px-2 py-1"
                    >
                      {item.label}
                    </button>
                  ))}
                </>
              )}
              
              <div className={`flex items-center ${isWalletConnected ? 'justify-end' : 'justify-between'} pt-3 border-t border-gray-200 dark:border-gray-700`}>
                {!isWalletConnected && <DarkModeToggle isDarkMode={isDarkMode} onToggle={onToggleDarkMode} />}
                {!isWalletConnected && (
                  <button
                    onClick={() => {
                      onConnectWallet();
                      setIsMobileMenuOpen(false);
                    }}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
                  >
                    <Wallet size={16} />
                    <span>Connect</span>
                  </button>
                )}
              </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}