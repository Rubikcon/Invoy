import React from 'react';
import { Wallet, FileText, ArrowRight } from 'lucide-react';
import AnimatedFreelancer from '../ui/AnimatedFreelancer';
import LinkPaymentAnimation from '../ui/LinkPaymentAnimation';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

interface HeroProps {
  onConnectWallet: () => void;
  onCreateInvoice: () => void;
  isWalletConnected: boolean;
  isConnecting?: boolean;
  walletAddress?: string;
}

export default function Hero({ onConnectWallet, onCreateInvoice, isWalletConnected, isConnecting, walletAddress }: HeroProps) {
  const { ref: contentRef, isVisible: contentVisible } = useScrollAnimation();
  const { ref: visualRef, isVisible: visualVisible } = useScrollAnimation();

  const formatAddress = (address: string): string => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <section id="hero" className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900/20 pt-16 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div 
            ref={contentRef}
            className={`space-y-8 transition-all duration-1000 ${
              contentVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
            }`}
          >
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white leading-tight transition-colors duration-300">
                Web3 Invoicing
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {" "}Made Simple
                </span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed transition-colors duration-300">
                Never send crypto to the wrong wallet or chain again. Invoy verifies everything before you click Send.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={onConnectWallet}
                disabled={isConnecting}
                className={`bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2 group ${
                  isConnecting ? 'opacity-75 cursor-not-allowed' : ''
                } ${
                  isWalletConnected ? 'from-green-600 to-emerald-600' : ''
                }`}
              >
                <Wallet size={20} />
                <span>
                  {isConnecting ? 'Connecting...' : 
                   isWalletConnected ? `Connected: ${formatAddress(walletAddress || '')}` : 
                   'Connect Wallet'}
                </span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-200" />
              </button>
              <button
                onClick={onCreateInvoice}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white px-8 py-4 rounded-lg font-semibold hover:border-blue-500 hover:shadow-md hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2 group"
              >
                <FileText size={20} />
                <span>Create Invoice</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center space-x-8 pt-8">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Secure</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">EVM Compatible</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Free to Use</span>
              </div>
            </div>
          </div>

          {/* Right Column - Animated Visual */}
          <div 
            ref={visualRef}
            className={`relative transition-all duration-1000 delay-300 ${
              visualVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
            }`}
          >
            <div className="space-y-8">
              <AnimatedFreelancer />
              
              {/* Link and Payment Animation */}
              <div className="mt-8">
                <LinkPaymentAnimation />
              </div>
            </div>
            
            {/* Glassmorphism Invoice Card */}
            <div className="absolute -bottom-8 right-0 bg-white/20 dark:bg-gray-800/20 backdrop-blur-lg rounded-2xl border border-white/30 dark:border-gray-700/30 shadow-2xl p-6 transform rotate-3 hover:rotate-0 hover:scale-105 transition-all duration-300">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Invoice #INV-001</h3>
                  <span className="bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 px-3 py-1 rounded-full text-sm font-medium transition-colors duration-300">
                    Approved
                  </span>
                </div>
                
                <div className="border-t border-gray-200/50 dark:border-gray-600/50 pt-4 space-y-3 transition-colors duration-300">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Freelancer:</span>
                    <span className="font-medium text-gray-900 dark:text-white">Sarah Chen</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Network:</span>
                    <span className="font-medium text-blue-600">Ethereum</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Amount:</span>
                    <span className="font-bold text-xl text-gray-900 dark:text-white">2.5 ETH</span>
                  </div>
                </div>

                <div className="bg-gray-50/50 dark:bg-gray-800/50 rounded-lg p-4 transition-colors duration-300">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Wallet Address:</p>
                  <code className="text-xs bg-white/50 dark:bg-gray-900/50 px-2 py-1 rounded border border-gray-200/50 dark:border-gray-600/50 font-mono text-gray-800 dark:text-gray-200">
                    0x742d35Cc6634C0532925a3b8
                  </code>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}