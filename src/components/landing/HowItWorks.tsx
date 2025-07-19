import React from 'react';
import { Wallet, FileText, DollarSign, ArrowRight, Zap, Shield, Network } from 'lucide-react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

export default function HowItWorks() {
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation(0.3);
  const { ref: stepsRef, isVisible: stepsVisible } = useScrollAnimation(0.2);

  const steps = [
    {
      icon: Wallet,
      title: 'Connect Wallet',
      description: 'Link your crypto wallet to get started with secure, verified transactions.',
      color: 'from-blue-500 to-cyan-500',
      bgIcon: Shield
    },
    {
      icon: FileText,
      title: 'Create Invoice',
      description: 'Fill out invoice details with automatic network detection and wallet verification.',
      color: 'from-green-500 to-emerald-500',
      bgIcon: Network
    },
    {
      icon: DollarSign,
      title: 'Get Paid in Crypto',
      description: 'Employers approve and send payments directly to your verified wallet address.',
      color: 'from-purple-500 to-pink-500',
      bgIcon: Zap
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Floating Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500/5 dark:bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-500/5 dark:bg-purple-400/10 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-green-500/5 dark:bg-green-400/10 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
        </div>

        <div 
          ref={titleRef}
          className={`text-center mb-16 transition-all duration-1000 ease-out ${
            titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-300">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto transition-colors duration-300">
            Three simple steps to secure, verified crypto payments.
          </p>
        </div>

        <div className="relative" ref={stepsRef}>
          {/* Mobile Layout */}
          <div 
            className={`block md:hidden space-y-8 transition-all duration-1000 delay-500 ease-out ${
              stepsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            {steps.map((step, index) => (
              <div 
                key={index} 
                className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group overflow-hidden"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 w-20 h-20 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
                  <step.bgIcon size={80} className="text-gray-900 dark:text-white" />
                </div>
                
                <div className="flex items-center space-x-4 mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${step.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <step.icon size={24} className="text-white" />
                  </div>
                  <div className="w-8 h-8 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full flex items-center justify-center font-bold transition-all duration-300 group-hover:scale-110">
                    {index + 1}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-300">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">{step.description}</p>
              </div>
            ))}
          </div>

          {/* Desktop Layout */}
          <div 
            className={`hidden md:block transition-all duration-1000 delay-500 ease-out ${
              stepsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="flex items-center justify-between relative">
              {/* Connection Lines */}
              <div className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-blue-200 via-green-200 to-purple-200 dark:from-blue-800 dark:via-green-800 dark:to-purple-800 transform -translate-y-1/2 z-0 transition-colors duration-300">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-green-400 to-purple-400 opacity-50 animate-pulse"></div>
              </div>
              
              {steps.map((step, index) => (
                <div key={index} className="relative z-10 flex-1 max-w-sm mx-4">
                  <div 
                    className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-200 dark:border-gray-700 group overflow-hidden"
                    style={{ 
                      animationDelay: `${600 + index * 200}ms`,
                      opacity: stepsVisible ? 1 : 0,
                      transform: stepsVisible ? 'translateY(0)' : 'translateY(20px)'
                    }}
                  >
                    {/* Background Pattern */}
                    <div className="absolute top-0 right-0 w-24 h-24 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
                      <step.bgIcon size={96} className="text-gray-900 dark:text-white" />
                    </div>
                    
                    {/* Floating Particles */}
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute top-4 right-4 w-2 h-2 bg-blue-400 rounded-full animate-ping opacity-20"></div>
                      <div className="absolute bottom-6 left-6 w-1 h-1 bg-purple-400 rounded-full animate-pulse opacity-30"></div>
                    </div>
                    
                    <div className="text-center">
                      <div className={`w-16 h-16 bg-gradient-to-r ${step.color} rounded-xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                        <step.icon size={32} className="text-white" />
                      </div>
                      
                      <div className="w-12 h-12 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4 transition-all duration-300 group-hover:scale-110 shadow-lg">
                        {index + 1}
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">{step.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed transition-colors duration-300">{step.description}</p>
                    </div>
                  </div>
                  
                  {/* Arrow */}
                  {index < steps.length - 1 && (
                    <div className="absolute top-1/2 -right-8 transform -translate-y-1/2 z-20 animate-pulse">
                      <div className="relative">
                        <ArrowRight size={24} className="text-gray-400 dark:text-gray-500 transition-colors duration-300" />
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-20 rounded-full blur-sm"></div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}