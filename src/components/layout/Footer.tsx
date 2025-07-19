import React from 'react';
import { Twitter, Github, Mail, Linkedin, Facebook } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">I</span>
              </div>
              <span className="text-xl font-bold">Invoy</span>
            </div>
            <h3 className="text-lg font-semibold mb-3">See How We Can Help</h3>
            <h3 className="text-lg font-semibold mb-3">
              <span className="text-red-500">Accelerate</span> Your Business
            </h3>
            <div className="space-y-2 text-gray-300 mb-6">
              <p>No matter how your customers want</p>
              <p>pay, we can help you accept it.</p>
              <p>No matter how your customers</p>
            </div>
            <button className="bg-red-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-600 transition-colors duration-200">
              Get In Touch
            </button>
          </div>

          {/* Contact */}
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

          {/* Links */}
          <div>
            <button className="bg-red-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-600 transition-colors duration-200 mb-6">
              Contact Us
            </button>
            
            <div className="flex space-x-4">
              <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors duration-200">
                <Linkedin size={18} className="text-white" />
              </div>
              <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors duration-200">
                <Facebook size={18} className="text-white" />
              </div>
              <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors duration-200">
                <Twitter size={18} className="text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Legal & Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="text-center">
            <div className="text-gray-400 text-sm">
              Copyright © 2025 Invoy - Web3 Payment & Invoicing Platform
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}