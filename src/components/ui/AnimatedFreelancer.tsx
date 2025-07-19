import React from 'react';
import { Laptop, Wifi, Zap, Send, Shield, Globe, Coins, TrendingUp } from 'lucide-react';

export default function AnimatedFreelancer() {
  return (
    <div className="relative w-full h-96 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        {/* Floating Network Nodes */}
        <div className="absolute top-8 left-8 w-3 h-3 bg-blue-400 rounded-full animate-pulse opacity-60">
          <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-30"></div>
        </div>
        <div className="absolute top-16 right-12 w-2 h-2 bg-purple-400 rounded-full animate-pulse opacity-40 animation-delay-1000">
          <div className="absolute inset-0 bg-purple-400 rounded-full animate-ping opacity-30"></div>
        </div>
        <div className="absolute bottom-20 left-16 w-4 h-4 bg-green-400 rounded-full animate-pulse opacity-50 animation-delay-2000">
          <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-30"></div>
        </div>
        
        {/* Additional Web3 Elements */}
        <div className="absolute top-12 right-20 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center animate-bounce opacity-70 animation-delay-3000">
          <Coins size={16} className="text-white" />
        </div>
        <div className="absolute bottom-32 right-8 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center animate-pulse opacity-60 animation-delay-4000">
          <TrendingUp size={12} className="text-white" />
        </div>
        
        {/* Connection Lines */}
        <svg className="absolute inset-0 w-full h-full opacity-20">
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="50%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#8B5CF6" />
            </linearGradient>
            <linearGradient id="lineGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#EF4444" />
            </linearGradient>
          </defs>
          <path
            d="M50 50 Q150 100 250 80 T400 120"
            stroke="url(#lineGradient)"
            strokeWidth="2"
            fill="none"
            className="animate-pulse"
            strokeDasharray="5,5"
          />
          <path
            d="M100 200 Q200 150 300 180 T450 160"
            stroke="url(#lineGradient2)"
            strokeWidth="1.5"
            fill="none"
            className="animate-pulse animation-delay-1000"
            strokeDasharray="3,3"
          />
          <path
            d="M80 120 Q180 80 280 100 T420 90"
            stroke="url(#lineGradient)"
            strokeWidth="1"
            fill="none"
            className="animate-pulse animation-delay-2000"
            strokeDasharray="2,2"
          />
        </svg>
      </div>

      {/* Main Freelancer Scene */}
      <div className="relative z-10 flex items-center justify-center h-full">
        {/* Freelancer Workspace */}
        <div className="relative">
          {/* Laptop */}
          <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 dark:from-gray-700 dark:to-gray-800 rounded-lg p-4 shadow-2xl transform hover:scale-105 transition-all duration-500 group">
            {/* Laptop Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="w-48 h-32 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded border-2 border-gray-300 dark:border-gray-600 relative overflow-hidden">
              {/* Screen Content - Invoice Interface */}
              <div className="p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="w-16 h-2 bg-blue-400 rounded animate-pulse">
                    <div className="w-full h-full bg-gradient-to-r from-blue-300 to-blue-500 rounded animate-pulse"></div>
                  </div>
                  <div className="w-8 h-2 bg-green-400 rounded animate-bounce animation-delay-1000"></div>
                </div>
                <div className="space-y-1">
                  <div className="w-20 h-1.5 bg-gray-300 dark:bg-gray-600 rounded animate-pulse animation-delay-500"></div>
                  <div className="w-24 h-1.5 bg-gray-300 dark:bg-gray-600 rounded animate-pulse animation-delay-1000"></div>
                  <div className="w-16 h-1.5 bg-gray-300 dark:bg-gray-600 rounded animate-pulse animation-delay-1500"></div>
                </div>
                <div className="mt-3 p-2 bg-blue-100 dark:bg-blue-900 rounded text-center relative overflow-hidden">
                  <div className="w-12 h-1 bg-blue-500 rounded mx-auto animate-pulse"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 animate-slide-right"></div>
                </div>
              </div>
              
              {/* Animated Send Button */}
              <div className="absolute bottom-2 right-2">
                <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center animate-bounce shadow-lg">
                  <Send size={10} className="text-white" />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-ping opacity-30"></div>
                </div>
              </div>
              
              {/* Screen Reflection */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none"></div>
            </div>
            
            {/* Laptop Base */}
            <div className="w-52 h-3 bg-gradient-to-r from-gray-700 to-gray-800 dark:from-gray-600 dark:to-gray-700 rounded-b-lg -mt-1"></div>
          </div>

          {/* Floating Icons */}
          <div className="absolute -top-8 -left-8 animate-float">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-300 group">
              <Laptop size={20} className="text-white" />
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </div>
          </div>
          
          <div className="absolute -top-4 -right-12 animate-float animation-delay-1000">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-300 group">
              <Globe size={16} className="text-white" />
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </div>
          </div>
          
          <div className="absolute -bottom-6 -right-8 animate-float animation-delay-2000">
            <div className="w-11 h-11 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-300 group">
              <Shield size={18} className="text-white" />
              <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-400 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </div>
          </div>
          
          {/* Additional Floating Elements */}
          <div className="absolute -top-12 right-4 animate-float animation-delay-3000">
            <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
              <Zap size={14} className="text-white" />
            </div>
          </div>

          {/* Crypto Transaction Animation */}
          <div className="absolute top-1/2 -right-20 transform -translate-y-1/2">
            <div className="flex items-center space-x-2 animate-slide-right hover:scale-110 transition-transform duration-300">
              <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg relative">
                <span className="text-white font-bold text-xs">₿</span>
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-orange-400 rounded-full animate-ping opacity-30"></div>
              </div>
              <div className="w-6 h-0.5 bg-gradient-to-r from-yellow-400 to-transparent relative">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-transparent animate-pulse"></div>
              </div>
              <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center shadow-lg relative">
                <span className="text-white font-bold text-xs">W</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg animate-pulse opacity-50"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Glassmorphism Overlay Elements */}
      <div className="absolute top-12 right-8 w-24 h-24 bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-white/10 animate-float animation-delay-3000 hover:bg-white/20 dark:hover:bg-white/10 transition-all duration-300 group">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      <div className="absolute bottom-16 left-12 w-16 h-16 bg-blue-500/10 backdrop-blur-sm rounded-xl border border-blue-500/20 animate-float animation-delay-4000 hover:bg-blue-500/20 transition-all duration-300 group">
        <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-blue-400/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      
      {/* Additional Floating Web3 Elements */}
      <div className="absolute top-20 left-20 w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-lg border border-purple-500/30 animate-float animation-delay-2000 hover:scale-110 transition-transform duration-300">
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}