import React from 'react';
import { Twitter, Github, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">I</span>
              </div>
              <span className="text-xl font-bold">Invoy</span>
            </div>
            <h3 className="text-lg font-semibold mb-3">About Invoy</h3>
            <p className="text-gray-300 leading-relaxed">
              Invoy is a Web3 invoicing tool that enables freelancers to send verified crypto payment requests 
              to employers with network checks, wallet alignment, and employer approvals built in.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <div className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-200">
              <Mail size={18} />
              <a href="mailto:support@invoy.xyz" className="hover:underline">
                support@invoy.xyz
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Links</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-4">
                <a href="#" className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-200">
                  <Twitter size={18} />
                  <span>Twitter</span>
                </a>
              </div>
              <div className="flex items-center space-x-4">
                <a href="#" className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-200">
                  <div className="w-[18px] h-[18px] bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold">L</span>
                  </div>
                  <span>Lens</span>
                </a>
              </div>
              <div className="flex items-center space-x-4">
                <a href="#" className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-200">
                  <Github size={18} />
                  <span>GitHub</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Legal & Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
              <span className="text-gray-300">Legal:</span>
              <div className="flex space-x-6">
                <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Terms of Service
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Privacy Policy
                </a>
              </div>
            </div>
            <div className="text-gray-400 text-sm">
              Copyright © 2025 Invoy
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}