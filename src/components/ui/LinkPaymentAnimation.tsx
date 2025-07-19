import React from 'react';
import { Link, Send, ArrowRight, CheckCircle, Mail, Wallet, Coins } from 'lucide-react';

export default function LinkPaymentAnimation() {
  return (
    <div className="relative w-full h-80 overflow-hidden bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-gray-800/50 dark:to-purple-900/20 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-8 left-8 w-3 h-3 bg-blue-400 rounded-full animate-pulse opacity-60">
          <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-30"></div>
        </div>
        <div className="absolute top-16 right-12 w-2 h-2 bg-purple-400 rounded-full animate-pulse opacity-40 animation-delay-1000">
          <div className="absolute inset-0 bg-purple-400 rounded-full animate-ping opacity-30"></div>
        </div>
        <div className="absolute bottom-20 left-16 w-4 h-4 bg-green-400 rounded-full animate-pulse opacity-50 animation-delay-2000">
          <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-30"></div>
        </div>
      </div>

      {/* Main Animation Container */}
      <div className="relative z-10 flex items-center justify-between h-full px-8">
        
        {/* Freelancer Side */}
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg group hover:scale-110 transition-transform duration-300">
              <Send size={24} className="text-white" />
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
              <Link size={12} className="text-white" />
            </div>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-900 dark:text-white">Freelancer</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Sends Invoice Link</p>
          </div>
        </div>

        {/* Animated Link Flow */}
        <div className="flex-1 relative mx-8">
          {/* Link Animation */}
          <div className="relative mb-8">
            <div className="h-1 bg-gradient-to-r from-blue-200 to-purple-200 dark:from-blue-800 dark:to-purple-800 rounded-full">
              <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
            </div>
            
            {/* Moving Link Icon */}
            <div className="absolute top-1/2 transform -translate-y-1/2 animate-slide-right">
              <div className="w-8 h-8 bg-white dark:bg-gray-800 border-2 border-blue-500 rounded-full flex items-center justify-center shadow-lg">
                <Mail size={14} className="text-blue-500" />
              </div>
            </div>
            
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
              <span className="text-xs text-gray-600 dark:text-gray-400 bg-white/80 dark:bg-gray-800/80 px-2 py-1 rounded-full border border-gray-200 dark:border-gray-600">
                Invoice Link
              </span>
            </div>
          </div>

          {/* Payment Animation */}
          <div className="relative">
            <div className="h-1 bg-gradient-to-l from-green-200 to-yellow-200 dark:from-green-800 dark:to-yellow-800 rounded-full">
              <div className="h-full bg-gradient-to-l from-green-500 to-yellow-500 rounded-full animate-pulse animation-delay-2000"></div>
            </div>
            
            {/* Moving Payment Icon */}
            <div className="absolute top-1/2 right-0 transform -translate-y-1/2 animate-slide-right animation-delay-2000">
              <div className="w-8 h-8 bg-white dark:bg-gray-800 border-2 border-green-500 rounded-full flex items-center justify-center shadow-lg">
                <Coins size={14} className="text-green-500" />
              </div>
            </div>
            
            <div className="absolute -bottom-6 right-1/2 transform translate-x-1/2">
              <span className="text-xs text-gray-600 dark:text-gray-400 bg-white/80 dark:bg-gray-800/80 px-2 py-1 rounded-full border border-gray-200 dark:border-gray-600">
                Crypto Payment
              </span>
            </div>
          </div>
        </div>

        {/* Employer Side */}
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg group hover:scale-110 transition-transform duration-300">
              <Wallet size={24} className="text-white" />
              <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-400 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center animate-bounce animation-delay-1000">
              <CheckCircle size={12} className="text-white" />
            </div>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-900 dark:text-white">Employer</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Approves & Pays</p>
          </div>
        </div>
      </div>

      {/* Status Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-gray-600 dark:text-gray-400">Link Sent</span>
        </div>
        <ArrowRight size={12} className="text-gray-400" />
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse animation-delay-2000"></div>
          <span className="text-xs text-gray-600 dark:text-gray-400">Payment Received</span>
        </div>
      </div>

      {/* Glassmorphism Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none rounded-2xl"></div>
    </div>
  );
}