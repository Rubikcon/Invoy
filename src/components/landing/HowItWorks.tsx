import React from 'react';
import { ArrowRight, Wallet, FileText, Mail, CheckCircle, Shield, Zap } from 'lucide-react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

export default function HowItWorks() {
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation(0.3);
  const { ref: stepsRef, isVisible: stepsVisible } = useScrollAnimation(0.2);
  const { ref: ctaRef, isVisible: ctaVisible } = useScrollAnimation(0.3);

  const steps = [
    {
      icon: Wallet,
      title: "Connect Your Wallet",
      description: "Link your MetaMask or supported Web3 wallet. Invoy automatically detects your address and preferred network.",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50 dark:bg-blue-900/20"
    },
    {
      icon: FileText,
      title: "Create Professional Invoice",
      description: "Fill in work details, amount, and employer email. Our system verifies wallet compatibility and network settings.",
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50 dark:bg-green-900/20"
    },
    {
      icon: Mail,
      title: "Send Secure Link",
      description: "Employer receives a secure invoice link with all payment details. No more copy-pasting wallet addresses!",
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50 dark:bg-purple-900/20"
    },
    {
      icon: CheckCircle,
      title: "Get Paid Safely",
      description: "Employer reviews and approves payment. Funds are sent to the verified wallet on the correct network.",
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-50 dark:bg-orange-900/20"
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-gray-900 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          ref={titleRef}
          className={`text-center mb-16 transition-all duration-1000 ${
            titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <p className="text-sm text-gray-400 uppercase tracking-wider mb-4">HOW IT WORKS</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Secure Web3 Payments in
            <br />
            <span className="text-blue-400">4 Simple Steps</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            From wallet connection to payment completion, Invoy ensures every transaction is verified and secure
          </p>
        </div>

        {/* Steps */}
        <div 
          ref={stepsRef}
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20 transition-all duration-1000 delay-300 ${
            stepsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative group"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              {/* Step Number */}
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-sm font-bold z-10">
                {index + 1}
              </div>

              {/* Card */}
              <div className={`${step.bgColor} rounded-2xl p-6 h-full hover:scale-105 transition-all duration-300 relative overflow-hidden`}>
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-10 group-hover:opacity-20 transition-opacity duration-300`}></div>
                
                <div className="relative z-10">
                  {/* Icon */}
                  <div className={`w-12 h-12 bg-gradient-to-br ${step.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <step.icon size={24} className="text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Arrow for desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute -right-4 top-1/2 transform -translate-y-1/2 z-20">
                    <ArrowRight size={24} className="text-blue-400" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          {/* Left Column - Content */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">Why Choose Invoy?</h3>
              <h3 className="text-2xl font-bold mb-6">
                <span className="text-blue-400">Eliminate</span> Payment Errors Forever
              </h3>
            </div>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield size={16} className="text-white" />
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Chain Verification</h4>
                  <p className="text-gray-300">Automatically prevents wrong network transactions</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Zap size={16} className="text-white" />
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Instant Notifications</h4>
                  <p className="text-gray-300">Real-time updates for both parties</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText size={16} className="text-white" />
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Professional Invoices</h4>
                  <p className="text-gray-300">Clean, detailed invoices that build trust</p>
                </div>
              </div>
            </div>

            <button className="bg-blue-500 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors duration-200 flex items-center space-x-2">
              <span>Start Using Invoy</span>
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Right Column - Image */}
          <div className="relative">
            <img
              src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=500&h=600&fit=crop"
              alt="Professional using Invoy for Web3 payments"
              className="w-full max-w-md mx-auto rounded-2xl shadow-2xl"
            />
            
            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium animate-pulse">
              ✓ Verified Safe
            </div>
            
            <div className="absolute -bottom-4 -left-4 bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium animate-bounce">
              🔒 Secure Payment
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div 
          ref={ctaRef}
          className={`text-center transition-all duration-1000 delay-500 ${
            ctaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16"></div>
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-white rounded-full translate-x-16 translate-y-16"></div>
            </div>
            
            <div className="relative z-10">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                Ready to Secure Your Web3 Payments?
              </h3>
              <p className="text-blue-100 mb-8 max-w-2xl mx-auto text-lg">
                Join thousands of freelancers who trust Invoy for error-free crypto invoicing. Start creating professional invoices today.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center space-x-2">
                  <Wallet size={20} />
                  <span>Connect Wallet</span>
                </button>
                <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors duration-200 flex items-center justify-center space-x-2">
                  <FileText size={20} />
                  <span>View Demo</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}