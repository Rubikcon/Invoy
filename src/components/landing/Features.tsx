import React from 'react';
import { Shield, CheckCircle, Network, Zap, Globe, Lock } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: Network,
      title: 'Chain-Aware Invoicing',
      description: 'Automatically detects and validates the correct blockchain network to prevent costly mistakes.',
      color: 'from-blue-500 to-cyan-500',
      bgIcon: Globe,
      particles: [
        { size: 'w-2 h-2', color: 'bg-blue-400', position: 'top-4 right-4', animation: 'animate-ping' },
        { size: 'w-1 h-1', color: 'bg-cyan-400', position: 'bottom-6 left-6', animation: 'animate-pulse' }
      ]
    },
    {
      icon: CheckCircle,
      title: 'Employer Approval Flow',
      description: 'Built-in approval system that gives employers full control and transparency over payments.',
      color: 'from-green-500 to-emerald-500',
      bgIcon: Lock,
      particles: [
        { size: 'w-1.5 h-1.5', color: 'bg-green-400', position: 'top-6 right-6', animation: 'animate-bounce' },
        { size: 'w-1 h-1', color: 'bg-emerald-400', position: 'bottom-4 left-8', animation: 'animate-pulse' }
      ]
    },
    {
      icon: Shield,
      title: 'Wallet & Network Verification',
      description: 'Double-check wallet addresses and network compatibility before any transaction occurs.',
      color: 'from-purple-500 to-pink-500',
      bgIcon: Zap,
      particles: [
        { size: 'w-2 h-2', color: 'bg-purple-400', position: 'top-3 right-3', animation: 'animate-pulse' },
        { size: 'w-1 h-1', color: 'bg-pink-400', position: 'bottom-5 left-5', animation: 'animate-ping' }
      ]
    }
  ];

  return (
    <section id="features" className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-40 h-40 bg-blue-500/5 dark:bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-purple-500/5 dark:bg-purple-400/10 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-green-500/5 dark:bg-green-400/10 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-300">
            Why Choose Invoy?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto transition-colors duration-300">
            Built for the modern Web3 workforce with security and simplicity at its core.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl p-8 hover:shadow-xl hover:border-transparent transition-all duration-300 hover:-translate-y-1 overflow-hidden"
            >
              {/* Background Pattern */}
              <div className="absolute top-0 right-0 w-20 h-20 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
                <feature.bgIcon size={80} className="text-gray-900 dark:text-white" />
              </div>
              
              {/* Floating Particles */}
              <div className="absolute inset-0 pointer-events-none">
                {feature.particles.map((particle, pIndex) => (
                  <div
                    key={pIndex}
                    className={`absolute ${particle.size} ${particle.color} ${particle.position} ${particle.animation} opacity-20 rounded-full`}
                  ></div>
                ))}
              </div>
              
              {/* Gradient Overlay on Hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl`}></div>
              
              <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon size={32} className="text-white" />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                {feature.title}
              </h3>
              
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed transition-colors duration-300">
                {feature.description}
              </p>
              
              {/* Bottom Accent Line */}
              <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${feature.color} w-0 group-hover:w-full transition-all duration-500 rounded-b-2xl`}></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}