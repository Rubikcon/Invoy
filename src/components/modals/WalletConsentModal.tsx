import React from 'react';
import { X, Wallet, Shield, AlertCircle, CheckCircle, Info } from 'lucide-react';

interface WalletConsentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConsent: () => void;
  onDecline: () => void;
  walletAddress: string;
  network: string;
  isLoading: boolean;
}

export default function WalletConsentModal({ 
  isOpen, 
  onClose, 
  onConsent, 
  onDecline, 
  walletAddress, 
  network, 
  isLoading 
}: WalletConsentModalProps) {
  if (!isOpen) return null;

  const formatAddress = (address: string): string => {
    if (!address) return '';
    return `${address.slice(0, 8)}...${address.slice(-6)}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4">
      <div className="flex min-h-screen items-center justify-center">
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>
        
        <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-6 transition-colors duration-300">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
              <Wallet size={24} className="text-blue-500" />
              <span>Wallet Connection Consent</span>
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
            >
              <X size={24} />
            </button>
          </div>

          <div className="space-y-6">
            {/* Wallet Information */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Info size={20} className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                    Wallet Connection Request
                  </h3>
                  <div className="space-y-2 text-sm text-blue-700 dark:text-blue-300">
                    <div className="flex items-center justify-between">
                      <span>Address:</span>
                      <code className="bg-white dark:bg-gray-800 px-2 py-1 rounded text-xs font-mono">
                        {formatAddress(walletAddress)}
                      </code>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Network:</span>
                      <span className="font-medium">{network}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* What We'll Store */}
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center space-x-2">
                <Shield size={18} className="text-green-500" />
                <span>What we'll store:</span>
              </h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li className="flex items-center space-x-2">
                  <CheckCircle size={14} className="text-green-500 flex-shrink-0" />
                  <span>Your wallet address (public information)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle size={14} className="text-green-500 flex-shrink-0" />
                  <span>Selected network for payments</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle size={14} className="text-green-500 flex-shrink-0" />
                  <span>Verification signature (for security)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle size={14} className="text-green-500 flex-shrink-0" />
                  <span>Connection timestamp</span>
                </li>
              </ul>
            </div>

            {/* What We Won't Store */}
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center space-x-2">
                <AlertCircle size={18} className="text-red-500" />
                <span>What we'll NEVER store:</span>
              </h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li className="flex items-center space-x-2">
                  <X size={14} className="text-red-500 flex-shrink-0" />
                  <span>Your private keys or seed phrase</span>
                </li>
                <li className="flex items-center space-x-2">
                  <X size={14} className="text-red-500 flex-shrink-0" />
                  <span>Access to your funds</span>
                </li>
                <li className="flex items-center space-x-2">
                  <X size={14} className="text-red-500 flex-shrink-0" />
                  <span>Ability to make transactions</span>
                </li>
                <li className="flex items-center space-x-2">
                  <X size={14} className="text-red-500 flex-shrink-0" />
                  <span>Personal transaction history</span>
                </li>
              </ul>
            </div>

            {/* Privacy Notice */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Privacy & Security</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                Your wallet connection is secure and you maintain full control. We only store your public wallet address 
                to enable invoice payments. You can disconnect and remove this information at any time from your profile settings.
              </p>
            </div>

            {/* Consent Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={onDecline}
                disabled={isLoading}
                className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 disabled:opacity-50"
              >
                Decline
              </button>
              <button
                onClick={onConsent}
                disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200 disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Connecting...</span>
                  </>
                ) : (
                  <>
                    <Shield size={18} />
                    <span>I Consent & Connect</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              By clicking "I Consent & Connect", you agree to store your wallet address for invoice payments.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}