import React from 'react';
import { ArrowLeft, Users, Target, Zap, Shield, Globe, Heart } from 'lucide-react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import CountUpAnimation from '../ui/CountUpAnimation';
import Footer from '../layout/Footer';

interface AboutUsProps {
  onBack: () => void;
}

export default function AboutUs({ onBack }: AboutUsProps) {
  const { ref: heroRef, isVisible: heroVisible } = useScrollAnimation(0.1);
  const { ref: storyRef, isVisible: storyVisible } = useScrollAnimation(0.2);
  const { ref: valuesRef, isVisible: valuesVisible } = useScrollAnimation(0.2);

  const values = [
    {
      icon: Shield,
      title: "Security First",
      description: "We prioritize the security of your crypto transactions with built-in verification and network validation.",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50 dark:bg-blue-900/20"
    },
    {
      icon: Zap,
      title: "Simplicity",
      description: "Complex Web3 payments made simple. No technical expertise required to send secure crypto invoices.",
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50 dark:bg-purple-900/20"
    },
    {
      icon: Globe,
      title: "Accessibility",
      description: "Making Web3 invoicing accessible to freelancers and employers worldwide, regardless of technical background.",
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50 dark:bg-green-900/20"
    }
  ];


  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pt-16 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200 mb-6"
          >
            <ArrowLeft size={20} />
            <span>Back to Home</span>
          </button>
        </div>

        {/* Hero Section */}
        <div 
          ref={heroRef}
          className={`text-center mb-20 transition-all duration-1000 ${
            heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400 text-sm font-medium mb-6">
            <Heart size={16} className="mr-2" />
            About Invoy
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Revolutionizing
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Web3 Payments
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            We're building the future of freelance payments in the Web3 economy, making crypto invoicing as simple as sending an email.
          </p>
        </div>

        {/* Our Story */}
        <div 
          ref={storyRef}
          className={`mb-20 transition-all duration-1000 delay-300 ${
            storyVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-300 leading-relaxed">
                <p>
                  Invoy was born from a simple frustration: sending crypto payments to freelancers was unnecessarily complex and risky. Too many talented developers, designers, and creators were losing money to wrong wallet addresses, incompatible networks, and failed transactions.
                </p>
                <p>
                  As Web3 natives ourselves, we knew there had to be a better way. We envisioned a world where crypto payments could be as simple and secure as traditional invoicing, but with all the benefits of blockchain technology.
                </p>
                <p>
                  Today, Invoy serves thousands of freelancers and employers worldwide, processing millions in secure crypto payments. We're not just building a product – we're building the infrastructure for the future of work.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-purple-900/20 rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <CountUpAnimation 
                      end={500} 
                      suffix="+" 
                      className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2"
                    />
                    <div className="text-sm text-gray-600 dark:text-gray-300">Active Users</div>
                  </div>
                  <div className="text-center">
                    <CountUpAnimation 
                      end={50} 
                      prefix="$" 
                      suffix="K+" 
                      className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2"
                    />
                    <div className="text-sm text-gray-600 dark:text-gray-300">Processed</div>
                  </div>
                  <div className="text-center">
                    <CountUpAnimation 
                      end={98} 
                      suffix="%" 
                      className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2"
                    />
                    <div className="text-sm text-gray-600 dark:text-gray-300">Success Rate</div>
                  </div>
                  <div className="text-center">
                    <CountUpAnimation 
                      end={15} 
                      suffix="+" 
                      className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2"
                    />
                    <div className="text-sm text-gray-600 dark:text-gray-300">Countries</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Our Values */}
        <div 
          ref={valuesRef}
          className={`mb-20 transition-all duration-1000 delay-500 ${
            valuesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Our Values
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              The principles that guide everything we build
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className={`${value.bgColor} rounded-2xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group`}
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="absolute top-0 right-0 w-24 h-24 opacity-20">
                  <div className={`w-full h-full bg-gradient-to-br ${value.color} transform rotate-45 translate-x-8 -translate-y-8`}></div>
                </div>
                
                <div className="relative z-10">
                  <div className={`w-12 h-12 ${value.bgColor} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <value.icon className={`w-6 h-6 text-blue-600 dark:text-blue-400`} />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    {value.title}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Our Team */}

        {/* Mission Statement */}
        <div className="text-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-purple-900/20 rounded-2xl p-8 md:p-12 border border-gray-200 dark:border-gray-700">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400 text-sm font-medium mb-6">
            <Target size={16} className="mr-2" />
            Our Mission
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Empowering the Web3 Workforce
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
            We believe that the future of work is decentralized, global, and powered by blockchain technology. 
            Our mission is to remove the barriers that prevent talented individuals from participating in the Web3 economy, 
            starting with making crypto payments as simple and secure as possible.
          </p>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}