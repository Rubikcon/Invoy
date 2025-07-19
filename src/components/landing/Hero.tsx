import React from 'react';
import { Wallet, FileText, ArrowRight, Play, Users, Globe, Shield, Zap, CheckCircle } from 'lucide-react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import AnimatedFreelancer from '../ui/AnimatedFreelancer';
import LinkPaymentAnimation from '../ui/LinkPaymentAnimation';
import CryptoLogos from '../ui/CryptoLogos';

interface HeroProps {
  onConnectWallet: () => void;
  onCreateInvoice: () => void;
  isWalletConnected: boolean;
  isConnecting?: boolean;
  walletAddress?: string;
}

export default function Hero({ onConnectWallet, onCreateInvoice, isWalletConnected, isConnecting, walletAddress }: HeroProps) {
  const { ref: heroRef, isVisible: heroVisible } = useScrollAnimation(0.1);
  const { ref: statsRef, isVisible: statsVisible } = useScrollAnimation(0.3);
  const { ref: animationRef, isVisible: animationVisible } = useScrollAnimation(0.2);

  const formatAddress = (address: string): string => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <section id="hero" className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20 pt-16 transition-colors duration-300 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Main Hero Section */}
        <div 
          ref={heroRef}
          className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20 transition-all duration-1000 ${
            heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Left Column - Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400 text-sm font-medium animate-pulse">
                <Zap size={16} className="mr-2" />
                Web3 Invoicing Made Simple
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                Never Send Crypto to the
                <br />
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Wrong Wallet Again
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-lg">
                Invoy verifies everything before you click Send. Create secure, chain-aware invoices for seamless Web3 payments.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={onCreateInvoice}
                disabled={isConnecting}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 group"
              >
                {isConnecting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Connecting...</span>
                  </>
                ) : isWalletConnected ? (
                  <>
                    <FileText size={20} />
                    <span>Create Invoice</span>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </>
                ) : (
                  <>
                    <Wallet size={20} />
                    <span>Connect Wallet</span>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
              
              <button className="border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-8 py-4 rounded-lg font-semibold hover:border-blue-500 hover:text-blue-500 dark:hover:border-blue-400 dark:hover:text-blue-400 transition-all duration-200 flex items-center justify-center space-x-2 group">
                <Play size={20} />
                <span>Watch Demo</span>
              </button>
            </div>

            {isWalletConnected && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 animate-slide-down">
                <div className="flex items-center space-x-3">
                  <CheckCircle size={20} className="text-green-600 dark:text-green-400" />
                  <div>
                    <p className="text-green-800 dark:text-green-200 font-medium">Wallet Connected</p>
                    <p className="text-green-600 dark:text-green-400 text-sm font-mono">
                      {formatAddress(walletAddress || '')}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Hero Image with Stats */}
          <div className="relative">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-purple-900/20 rounded-2xl p-8 relative overflow-hidden">
              {/* Global Network Stats Card */}
              <div className="absolute top-4 right-4 bg-white dark:bg-gray-700 rounded-xl p-4 shadow-lg animate-float z-10">
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-300">Secure Web3</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Invoicing Across</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    10+ <span className="text-base font-normal">Networks</span>
                  </p>
                </div>
                <div className="mt-3 flex justify-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <Shield size={20} className="text-white" />
                  </div>
                </div>
              </div>
              
              {/* Verification Badge */}
              <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium animate-pulse">
                ✓ Chain Verified
              </div>
              
              <div className="flex justify-center relative">
                <img
                  src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop"
                  alt="Professional freelancer working on Web3 invoicing"
                  className="w-64 h-80 object-cover rounded-lg shadow-lg"
                />
                
                {/* Floating Web3 Elements */}
                <div className="absolute -bottom-4 -left-4 bg-white dark:bg-gray-800 rounded-lg p-3 shadow-lg animate-float animation-delay-1000">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-xs">₿</span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-300">Payment</p>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">Verified</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Crypto Logos Section */}
        <div 
          ref={animationRef}
          className={`mb-20 transition-all duration-1000 delay-300 ${
            animationVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="text-center mb-8">
            <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Supported Networks</p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Multi-Chain Compatible</h3>
          </div>
          <CryptoLogos />
        </div>

        {/* Animations Section */}
        <div 
          className={`grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20 transition-all duration-1000 delay-500 ${
            animationVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Link Payment Animation */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white text-center">
              Secure Invoice Flow
            </h3>
            <LinkPaymentAnimation />
          </div>

          {/* Freelancer Animation */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white text-center">
              Web3 Workspace
            </h3>
            <div className="bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-gray-800/50 dark:to-purple-900/20 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm">
              <AnimatedFreelancer />
            </div>
          </div>
        </div>

        {/* Growth Section */}
        <div 
          ref={statsRef}
          className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20 transition-all duration-1000 delay-700 ${
            statsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Left Column - Content */}
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              Streamline Your
              <br />
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Web3 Payments
              </span>
              <br />
              Today
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Our platform eliminates payment errors and ensures every transaction reaches the right wallet on the correct network.
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <CheckCircle size={20} className="text-green-500" />
                <span className="text-gray-700 dark:text-gray-300">Auto chain verification</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle size={20} className="text-green-500" />
                <span className="text-gray-700 dark:text-gray-300">Secure invoice links</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle size={20} className="text-green-500" />
                <span className="text-gray-700 dark:text-gray-300">Employer approval flow</span>
              </div>
            </div>
          </div>

          {/* Right Column - CTA Card */}
          <div className="relative">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white relative overflow-hidden">
              <div className="absolute top-4 left-4 flex -space-x-2">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
                  <Users size={16} />
                </div>
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center animate-pulse animation-delay-1000">
                  <Shield size={16} />
                </div>
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center animate-pulse animation-delay-2000">
                  <Globe size={16} />
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="text-2xl font-bold mb-2">Ready to Secure Your Web3 Payments?</h3>
                <p className="text-white/90 mb-6">Join thousands of freelancers who trust Invoy for error-free crypto invoicing.</p>
                <button 
                  onClick={onCreateInvoice}
                  className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-200 flex items-center space-x-2 group"
                >
                  <span>Start Invoicing</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
            
            <div className="absolute -right-4 -bottom-4 lg:-right-8 lg:-bottom-8">
              <img
                src="https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop"
                alt="Professional using Web3 payment platform"
                className="w-32 h-40 lg:w-40 lg:h-48 object-cover rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>

        {/* Features Preview */}
        <div className="text-center mb-12">
          <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">Why Choose Invoy</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Built for <span className="text-blue-600">Web3 Freelancers</span>
            <br />
            and Forward-Thinking Employers
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Image */}
          <div className="relative">
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=500&h=600&fit=crop"
                alt="Professional Web3 freelancer managing crypto invoices"
                className="w-full max-w-md mx-auto rounded-lg shadow-lg"
              />
              
              {/* Floating Stats */}
              <div className="absolute -right-4 top-1/4 bg-white dark:bg-gray-800 rounded-full p-4 shadow-lg animate-float">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">99%</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Success Rate</p>
                </div>
              </div>
              
              <div className="absolute -left-4 bottom-1/4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full p-4 shadow-lg animate-float animation-delay-2000">
                <div className="text-center text-white">
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-sm">Wrong Chains</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Features */}
          <div className="space-y-8">
            <div className="flex items-start space-x-4 group hover:bg-blue-50 dark:hover:bg-blue-900/20 p-4 rounded-lg transition-colors duration-200">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
                <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Chain Verification</h3>
                <p className="text-gray-600 dark:text-gray-300">Automatically verifies wallet addresses and networks to prevent costly mistakes and ensure payments reach the right destination.</p>
              </div>
            </div>

            <div className="flex items-start space-x-4 group hover:bg-green-50 dark:hover:bg-green-900/20 p-4 rounded-lg transition-colors duration-200">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
                <FileText className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Professional Invoicing</h3>
                <p className="text-gray-600 dark:text-gray-300">Create detailed, professional invoices with work descriptions, amounts, and secure approval flows that build trust with employers.</p>
              </div>
            </div>

            <div className="flex items-start space-x-4 group hover:bg-purple-50 dark:hover:bg-purple-900/20 p-4 rounded-lg transition-colors duration-200">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
                <Zap className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Instant Notifications</h3>
                <p className="text-gray-600 dark:text-gray-300">Real-time email alerts keep both parties informed throughout the payment process, ensuring transparency and quick resolution.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}