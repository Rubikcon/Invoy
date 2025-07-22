import React from 'react';
import { Twitter, Linkedin, Github, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Invoy */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 relative">
                <svg viewBox="0 0 32 32" className="w-full h-full">
                  <defs>
                    <linearGradient id="footerLogoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#3B82F6" />
                      <stop offset="50%" stopColor="#8B5CF6" />
                      <stop offset="100%" stopColor="#06B6D4" />
                    </linearGradient>
                  </defs>
                  
                  {/* Outer hexagon */}
                  <path
                    d="M16 2 L26 8 L26 24 L16 30 L6 24 L6 8 Z"
                    fill="url(#footerLogoGradient)"
                    className="drop-shadow-lg"
                  />
                  
                  {/* Inner blockchain links */}
                  <g fill="white" opacity="0.9">
                    {/* Center node */}
                    <circle cx="16" cy="16" r="2.5" />
                    
                    {/* Connected nodes */}
                    <circle cx="12" cy="10" r="1.5" />
                    <circle cx="20" cy="10" r="1.5" />
                    <circle cx="12" cy="22" r="1.5" />
                    <circle cx="20" cy="22" r="1.5" />
                    
                    {/* Connection lines */}
                    <line x1="16" y1="16" x2="12" y2="10" stroke="white" strokeWidth="1" opacity="0.7" />
                    <line x1="16" y1="16" x2="20" y2="10" stroke="white" strokeWidth="1" opacity="0.7" />
                    <line x1="16" y1="16" x2="12" y2="22" stroke="white" strokeWidth="1" opacity="0.7" />
                    <line x1="16" y1="16" x2="20" y2="22" stroke="white" strokeWidth="1" opacity="0.7" />
                  </g>
                </svg>
              </div>
              <span className="text-xl font-bold">Invoy</span>
            </div>
            <h3 className="text-lg font-semibold mb-3">About Invoy</h3>
            <p className="text-gray-300 mb-6">
              Invoy is a Web3 invoicing tool that enables freelancers to send verified crypto payment requests to employers with network checks, wallet alignment, and employer approvals built in.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors duration-200">
                <Twitter size={18} className="text-white" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors duration-200">
                <Linkedin size={18} className="text-white" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors duration-200">
                <Github size={18} className="text-white" />
              </a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <div className="space-y-3">
              <a 
                href="mailto:support@invoy.xyz"
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-200"
              >
                <Mail size={16} />
                <span>support@invoy.xyz</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <div className="space-y-3">
              <a href="#hero" className="block text-gray-300 hover:text-white transition-colors duration-200">
                Home
              </a>
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="block text-gray-300 hover:text-white transition-colors duration-200 text-left"
              >
                About
              </button>
              <a href="#features" className="block text-gray-300 hover:text-white transition-colors duration-200">
                Features
              </a>
              <a href="#how-it-works" className="block text-gray-300 hover:text-white transition-colors duration-200">
                How It Works
              </a>
              <a href="#testimonials" className="block text-gray-300 hover:text-white transition-colors duration-200">
                Testimonials
              </a>
              <a href="#faq" className="block text-gray-300 hover:text-white transition-colors duration-200">
                FAQs
              </a>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <div className="space-y-3">
              <a href="#" className="block text-gray-300 hover:text-white transition-colors duration-200">
                Terms of Service
              </a>
              <a href="#" className="block text-gray-300 hover:text-white transition-colors duration-200">
                Privacy Policy
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="text-center">
            <div className="text-gray-400 text-sm">
              Copyright © 2025 Invoy - Web3 Invoicing Made Simple
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}