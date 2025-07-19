import React from 'react';
import { Shield, CheckCircle, Network, Zap } from 'lucide-react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

export default function Features() {
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation();
  const { ref: cardsRef, isVisible: cardsVisible } = useScrollAnimation();

  const features = [
    {
      icon: Network,
      title: 'Chain-Aware Invoicing',
      description: 'Automatic network detection and verification ensures payments reach the correct blockchain every time.',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      accent: 'text-blue-600 dark:text-blue-400'
    },
    {
      icon: CheckCircle,
      title: 'Employer Approval Flow',
      description: 'Secure review process allows employers to verify work details before approving crypto payments.',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      accent: 'text-green-600 dark:text-green-400'
    },
    {
      icon: Shield,
      title: 'Wallet & Network Verification',
      description: 'Built-in validation prevents wrong wallet addresses and incompatible network transactions.',
      color: 'from-purple-500 to-pink-500',
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
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Feature Highlights
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Secure, verified, and streamlined Web3 invoicing for the modern workforce
          </p>
        </div>

        <div 
          ref={cardsRef}
          className={`grid grid-cols-1 md:grid-cols-3 gap-8 transition-all duration-1000 delay-300 ${
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
                
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}