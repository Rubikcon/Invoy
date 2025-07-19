import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

export default function HowItWorks() {
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation(0.3);

  return (
    <section id="how-it-works" className="py-20 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          ref={titleRef}
          className={`text-center mb-16 transition-all duration-1000 ${
            titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <p className="text-sm text-gray-400 uppercase tracking-wider mb-4">HOW IT WORKS</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Grow Revenue with SeePay
            <br />
            <span className="text-red-500">Services</span> Platform
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">See How We Can Help</h3>
              <h3 className="text-2xl font-bold mb-6">
                <span className="text-red-500">Accelerate</span> Your Business
              </h3>
            </div>

            <div className="space-y-4 text-gray-300">
              <p>No matter how your customers want</p>
              <p>pay, we can help you accept it.</p>
              <p>No matter how your customers</p>
            </div>

            <button className="bg-red-500 text-white px-8 py-3 rounded-lg font-medium hover:bg-red-600 transition-colors duration-200">
              Get In Touch
            </button>
          </div>

          {/* Right Column - Contact Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">S</span>
                </div>
                <span className="text-xl font-bold">SeePay</span>
              </div>
              
              <div className="space-y-2 text-gray-300">
                <p>hello@seepay@seepay.com</p>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span>8502 Preston Rd,</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="ml-4">Inglewood, Maine 98380,</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="ml-4">USA</span>
                </div>
              </div>
            </div>

            <button className="bg-red-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-600 transition-colors duration-200">
              Contact Us
            </button>

            {/* Social Icons */}
            <div className="flex space-x-4">
              <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors duration-200">
                <span className="text-white text-sm">in</span>
              </div>
              <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors duration-200">
                <span className="text-white text-sm">f</span>
              </div>
              <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors duration-200">
                <span className="text-white text-sm">t</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}