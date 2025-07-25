import React from 'react';
import { FileText, ArrowRight, CheckCircle, Shield, Zap, User, LogIn } from 'lucide-react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import AnimatedHeroSlider from '../ui/AnimatedHeroSlider';
import { User as UserType } from '../../types';

interface HeroProps {
  user: UserType | null;
  isAuthenticated: boolean;
  onLogin: () => void;
  onCreateInvoice: () => void;
  onEmployerLogin: () => void;
}

export default function Hero({ user, isAuthenticated, onLogin, onCreateInvoice, onEmployerLogin }: HeroProps) {
  const { ref: heroRef, isVisible: heroVisible } = useScrollAnimation(0.1);

  return (
    <section id="hero" className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20 pt-16 transition-colors duration-300">
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
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400 text-sm font-medium">
                <Zap size={16} className="mr-2" />
                Web3 Invoicing Made Simple
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                Web3 Invoicing
                <br />
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Made Simple
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-lg">
                Never send crypto to the wrong wallet or chain again. Invoy verifies everything before you click Send.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={isAuthenticated ? onCreateInvoice : onLogin}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2 group"
              >
                {isAuthenticated ? (
                  <>
                    <FileText size={20} />
                    <span>Create Invoice</span>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </>
                ) : (
                  <>
                    <LogIn size={20} />
                    <span>Freelancer Login</span>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
              
              <button 
                onClick={onEmployerLogin}
                className="flex-1 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-8 py-4 rounded-lg font-semibold hover:border-green-500 hover:text-green-500 dark:hover:border-green-400 dark:hover:text-green-400 transition-all duration-200 flex items-center justify-center space-x-2 group"
              >
                <User size={20} />
                <span>Employer Portal</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {isAuthenticated && user && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 animate-slide-down">
                <div className="flex items-center space-x-3">
                  <CheckCircle size={20} className="text-blue-600 dark:text-blue-400" />
                  <div>
                    <p className="text-blue-800 dark:text-blue-200 font-medium">Welcome back, {user.name}!</p>
                    <p className="text-blue-600 dark:text-blue-400 text-sm">
                      Ready to create your next invoice?
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Animated Woman with Invoice */}
          <div className="relative">
            <AnimatedHeroSlider />
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield size={32} className="text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Chain Verified</h3>
            <p className="text-gray-600 dark:text-gray-300">Automatic network verification prevents costly mistakes</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} className="text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Employer Approved</h3>
            <p className="text-gray-600 dark:text-gray-300">Secure approval flow builds trust with clients</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Zap size={32} className="text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Instant Payments</h3>
            <p className="text-gray-600 dark:text-gray-300">Get paid faster with streamlined crypto invoicing</p>
          </div>
        </div>
      </div>
    </section>
  );
}