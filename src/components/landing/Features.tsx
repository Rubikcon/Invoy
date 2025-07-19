import React from 'react';
import { Shield, CheckCircle, Network, Zap, Globe, Lock, TrendingUp, Users, Star } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: Shield,
      title: 'The Most Trusted and Love',
      description: [
        'Exceptional NPS Score of 55',
        'Annual revenue retention of 134%',
        'Average client tenure of 10+ years',
        'Used by premium brands around the globe'
      ],
      color: 'from-pink-400 to-pink-500',
      bgColor: 'bg-pink-50 dark:bg-pink-900/20'
    },
    {
      icon: Users,
      title: 'The Most Experienced',
      description: [
        'Over 40 years of experience in payments and invoicing',
        'Financial strength and scale with top global banking partners',
        'PCI DSS and ISO 27001 certified'
      ],
      color: 'from-pink-400 to-pink-500',
      bgColor: 'bg-pink-50 dark:bg-pink-900/20'
    },
    {
      icon: TrendingUp,
      title: 'The Most Scalable Payment',
      description: [
        'Advanced features built on a multi-tenant AWS native platform',
        'Pay-out and Pay-in capability in 32 countries'
      ],
      color: 'from-pink-400 to-pink-500',
      bgColor: 'bg-pink-50 dark:bg-pink-900/20'
    }
  ];

  return (
    <section id="features" className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`${feature.bgColor} rounded-2xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group`}
            >
              {/* Decorative Element */}
              <div className="absolute top-0 right-0 w-24 h-24 opacity-20">
                <div className={`w-full h-full bg-gradient-to-br ${feature.color} transform rotate-45 translate-x-8 -translate-y-8`}></div>
              </div>
              
              <div className="relative z-10">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  {feature.title}
                </h3>
                
                <ul className="space-y-3">
                  {feature.description.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>

                <button className="mt-6 text-red-500 font-medium text-sm hover:text-red-600 transition-colors duration-200 flex items-center space-x-1">
                  <span>Learn More</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Webinar Section */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-2xl overflow-hidden relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center">
            {/* Content */}
            <div className="p-8 lg:p-12 text-white">
              <h2 className="text-2xl lg:text-3xl font-bold mb-4">
                Live Webinar: Taking on the Digital Invoicing and Payments Revolution
              </h2>
              <p className="text-white/90 mb-6 leading-relaxed">
                Join us on February 21 at 11 a.m. ET for the live webinar "Taking on the Digital Invoicing and Payments Revolution" with TrePay CEO Brandon Spear, featuring Forrester Principal Analyst Jacob Morgan.
              </p>
              
              <div className="mb-6">
                <p className="text-white/80 text-sm mb-2">Featuring</p>
                <div className="text-white font-semibold">Forrester</div>
              </div>

              <button className="bg-gray-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors duration-200">
                Register Now
              </button>
            </div>

            {/* Image */}
            <div className="relative h-64 lg:h-full">
              <img
                src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=500&h=600&fit=crop"
                alt="Professional man in suit"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}