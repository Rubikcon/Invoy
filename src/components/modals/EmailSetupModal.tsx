import React from 'react';
import { X, Mail, AlertCircle, ExternalLink, Copy, Send } from 'lucide-react';

interface EmailSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendEmail: () => void;
  onCopyEmail: () => void;
  employerEmail: string;
  invoiceId: string;
}

export default function EmailSetupModal({ 
  isOpen, 
  onClose, 
  onSendEmail, 
  onCopyEmail, 
  employerEmail, 
  invoiceId 
}: EmailSetupModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4">
      <div className="flex min-h-screen items-center justify-center">
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>
        
        <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-6 transition-colors duration-300">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
              <Mail size={24} className="text-blue-500" />
              <span>Send Invoice to Employer</span>
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
            >
              <X size={24} />
            </button>
          </div>

          <div className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle size={20} className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-blue-800 dark:text-blue-200 text-sm">
                    <strong>Invoice {invoiceId} Ready to Send</strong>
                  </p>
                  <p className="text-blue-700 dark:text-blue-300 text-sm mt-1">
                    Choose how you'd like to notify <strong>{employerEmail}</strong> about this invoice.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900 dark:text-white">Choose sending method:</h3>
              
              {/* Option 1: Email Client */}
              <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:border-blue-500 dark:hover:border-blue-400 transition-colors duration-200">
                <div className="flex items-start space-x-3">
                  <Send size={20} className="text-blue-500 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white">Open Email Client</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      Opens your default email app with a pre-filled message ready to send.
                    </p>
                    <button
                      onClick={onSendEmail}
                      className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors duration-200"
                    >
                      Open Email Client
                    </button>
                  </div>
                </div>
              </div>

              {/* Option 2: Copy to Clipboard */}
              <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:border-green-500 dark:hover:border-green-400 transition-colors duration-200">
                <div className="flex items-start space-x-3">
                  <Copy size={20} className="text-green-500 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white">Copy Email Content</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      Copy the email content to paste into any email service (Gmail, Outlook, etc.).
                    </p>
                    <button
                      onClick={onCopyEmail}
                      className="mt-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors duration-200"
                    >
                      Copy to Clipboard
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center space-x-2">
                <ExternalLink size={16} />
                <span>What the employer will receive:</span>
              </h4>
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                <li>• Professional invoice email with all details</li>
                <li>• Direct link to review and approve payment</li>
                <li>• Secure payment information and network details</li>
                <li>• Your contact information for any questions</li>
              </ul>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}