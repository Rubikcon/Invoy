import React from 'react';
import { Wallet, FileText, ArrowRight, Play, Users, Globe, Shield } from 'lucide-react';

interface HeroProps {
  onConnectWallet: () => void;
  onCreateInvoice: () => void;
  isWalletConnected: boolean;
  isConnecting?: boolean;
  walletAddress?: string;
}

export default function Hero({ onConnectWallet, onCreateInvoice, isWalletConnected, isConnecting, walletAddress }: HeroProps) {
  const formatAddress = (address: string): string => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <section id="hero" className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20 pt-16 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Main Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          {/* Left Column - Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                Web3 Payment
                <br />
                <span className="text-4xl md:text-5xl">& Invoicing</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-lg">
                Grow revenue with Direct-to-Customer distribution models to reach customers in more geographies.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={onCreateInvoice}
                className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-8 py-4 rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <span>Read More</span>
              </button>
            </div>
          </div>

          {/* Right Column - Hero Image */}
          <div className="relative">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-8 relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-white dark:bg-gray-700 rounded-lg p-4 shadow-lg">
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-300">The Global B2B</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Payment Network</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">That Across</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">75+ <span className="text-base font-normal">Countries</span></p>
                </div>
                <div className="mt-4 flex justify-center">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <Globe size={24} className="text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center">
                <img
                  src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop"
                  alt="Professional woman with laptop"
                  className="w-64 h-80 object-cover rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Growth Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          {/* Left Column - Content */}
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              Growth Your
              <br />
              Revenue
              <br />
              Today
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Our services platform will help you to growth in easy way.
            </p>
          </div>

          {/* Right Column - CTA Card */}
          <div className="relative">
            <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-2xl p-8 text-white relative overflow-hidden">
              <div className="absolute top-4 left-4 flex -space-x-2">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Users size={16} />
                </div>
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Shield size={16} />
                </div>
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Globe size={16} />
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="text-2xl font-bold mb-2">Let's Accelerate Your Business Goals</h3>
                <p className="text-white/90 mb-6">Our top experts will help you to manage your business payment and invoicing in easy way.</p>
                <button className="bg-gray-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors duration-200 flex items-center space-x-2">
                  <span>Contact Our Expert</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
            
            <div className="absolute -right-4 -bottom-4 lg:-right-8 lg:-bottom-8">
              <img
                src="https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop"
                alt="Professional woman with phone"
                className="w-32 h-40 lg:w-40 lg:h-48 object-cover rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="text-center mb-12">
          <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">ABOUT US</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            We Prefer <span className="text-red-500">B2B Payment</span> Method
            <br />
            of Corporate Sellers
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Image */}
          <div className="relative">
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=500&h=600&fit=crop"
                alt="Professional woman with curly hair using phone"
                className="w-full max-w-md mx-auto rounded-lg shadow-lg"
              />
              
              {/* Floating Stats */}
              <div className="absolute -right-4 top-1/4 bg-white dark:bg-gray-800 rounded-full p-4 shadow-lg">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">80k</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Sellers</p>
                </div>
              </div>
              
              <div className="absolute -left-4 bottom-1/4 bg-red-500 rounded-full p-4 shadow-lg">
                <div className="text-center text-white">
                  <p className="text-2xl font-bold">90K</p>
                  <p className="text-sm">Buyers</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Features */}
          <div className="space-y-8">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <div className="w-6 h-6 bg-red-500 rounded"></div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Increase Sale & Profitability</h3>
                <p className="text-gray-600 dark:text-gray-300">Create a strengthened one-stop cost of your business to drastically reduced lot sellers and buyers on our closed-loop Payment Network.</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <div className="w-6 h-6 bg-red-500 rounded"></div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Disrupt <span className="text-red-500">Distribution Model</span></h3>
                <p className="text-gray-600 dark:text-gray-300">Grow revenue with Direct-to-Customer distribution models to reach customers in more geographies – all without straining your finance or IT teams.</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <div className="w-6 h-6 bg-red-500 rounded"></div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Automate Complex Billing</h3>
                <p className="text-gray-600 dark:text-gray-300">Eliminate manual invoicing, compliance requirements, net terms and upfront spending controls mean streamlined purchasing for accounts receivable and Accounts Payable departments.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}