import React from 'react';
import { Shield, CheckCircle, Network, Zap, Globe, Lock, TrendingUp, Users, Star, Wallet, FileText, AlertTriangle } from 'lucide-react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

export default function Features() {
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation();
  const { ref: cardsRef, isVisible: cardsVisible } = useScrollAnimation();
  const { ref: webinarRef, isVisible: webinarVisible } = useScrollAnimation();

  const features = [
    {
      icon: Shield,
      title: 'The Most Trusted and Secure',
      description: [
        'Auto chain and network verification',
        'Secure invoice link generation',
        'Built-in fraud prevention',
        'End-to-end encryption for all transactions'
      ],
      color: 'from-blue-400 to-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      accent: 'text-blue-600 dark:text-blue-400'
    },
    {
      icon: Users,
      title: 'The Most User-Friendly',
      description: [
        'Simple wallet connection with MetaMask',
        'Intuitive invoice creation process',
        'One-click employer approval system',
        'Real-time payment status updates'
      ],
      color: 'from-green-400 to-green-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      accent: 'text-green-600 dark:text-green-400'
    },
    {
      icon: TrendingUp,
      title: 'The Most Efficient Payment',
      description: [
        'Instant invoice generation and sharing',
        'Multi-chain support (Ethereum, Polygon, etc.)',
        'Automated payment verification',
        'Zero wrong-chain transaction errors'
      ],
      color: 'from-purple-400 to-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      accent: 'text-purple-600 dark:text-purple-400'
    }
  ];

  return (
    <section id="features" className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          ref={titleRef}
          className={`text-center mb-16 transition-all duration-1000 ${
            titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">FEATURES</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Why Invoy is the <span className="text-blue-600">Best Choice</span>
            <br />
            for Web3 Invoicing
          </h2>
        </div>

        <div 
          ref={cardsRef}
          className={`grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 transition-all duration-1000 delay-300 ${
            cardsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {features.map((feature, index) => (
            <div
              key={index}
              className={`${feature.bgColor} rounded-2xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group`}
              style={{ animationDelay: `${index * 200}ms` }}
            >
              {/* Decorative Element */}
              <div className="absolute top-0 right-0 w-24 h-24 opacity-20">
                <div className={`w-full h-full bg-gradient-to-br ${feature.color} transform rotate-45 translate-x-8 -translate-y-8`}></div>
              </div>
              
              <div className="relative z-10">
                <div className={`w-12 h-12 ${feature.bgColor} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`w-6 h-6 ${feature.accent}`} />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  {feature.title}
                </h3>
                
                <ul className="space-y-3">
                  {feature.description.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start space-x-3">
                      <CheckCircle className={`w-4 h-4 ${feature.accent} mt-0.5 flex-shrink-0`} />
                      <span className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>

                <button className={`mt-6 ${feature.accent} font-medium text-sm hover:underline transition-all duration-200 flex items-center space-x-1 group`}>
                  <span>Learn More</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Problem Statement Section */}
        <div 
          ref={webinarRef}
          className={`bg-gradient-to-r from-red-500 to-red-600 rounded-2xl overflow-hidden relative mb-20 transition-all duration-1000 delay-500 ${
            webinarVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center">
            {/* Content */}
            <div className="p-8 lg:p-12 text-white">
              <div className="flex items-center space-x-2 mb-4">
                <AlertTriangle size={24} className="text-yellow-300" />
                <span className="text-yellow-300 font-semibold">Problem Solved</span>
              </div>
              
              <h2 className="text-2xl lg:text-3xl font-bold mb-4">
                Stop Losing Money to Wrong Chain Transactions
              </h2>
              <p className="text-white/90 mb-6 leading-relaxed">
                In Web3 freelance work, informal payment methods lead to costly mistakes. Wrong wallets, incorrect networks, and lack of proper invoicing cause delays and lost funds.
              </p>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-yellow-300 rounded-full"></div>
                  <span className="text-white/90">Wrong wallet or network errors</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-yellow-300 rounded-full"></div>
                  <span className="text-white/90">No formal invoicing process</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-yellow-300 rounded-full"></div>
                  <span className="text-white/90">Lack of payment traceability</span>
                </div>
              </div>

              <button className="bg-white text-red-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-200 flex items-center space-x-2">
                <Shield size={20} />
                <span>Secure Your Payments</span>
              </button>
            </div>

            {/* Image */}
            <div className="relative h-64 lg:h-full">
              <img
                src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=500&h=600&fit=crop"
                alt="Professional managing secure Web3 payments"
                className="w-full h-full object-cover"
              />
              
              {/* Floating Error Prevention Badge */}
              <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-2 rounded-lg text-sm font-medium animate-pulse">
                <div className="flex items-center space-x-2">
                  <CheckCircle size={16} />
                  <span>Error Prevention Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Solution Highlight */}
        <div className="text-center">
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-medium text-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <Zap size={20} className="mr-2" />
            Invoy verifies everything before you click Send
          </div>
        </div>
      </div>
    </section>
  );
}