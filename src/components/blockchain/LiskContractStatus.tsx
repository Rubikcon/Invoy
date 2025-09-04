import React from 'react';
import { Shield, Activity, TrendingUp, Users, AlertCircle, CheckCircle, RefreshCw, ExternalLink } from 'lucide-react';
import { useBlockchain } from '../../hooks/useBlockchain';

interface LiskContractStatusProps {
  className?: string;
}

export default function LiskContractStatus({ className = '' }: LiskContractStatusProps) {
  const { 
    isInitialized, 
    isLoading, 
    currentNetwork, 
    contractStats, 
    loadContractStats,
    isWalletConnected
  } = useBlockchain();

  const handleRefresh = () => {
    loadContractStats();
  };

  const contractAddress = '0x34c82345973449618fF78ac2F707ab533Af98Cb4';
  const explorerUrl = `https://sepolia-blockscout.lisk.com/address/${contractAddress}`;

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
          <Shield size={20} className="text-blue-500" />
          <span>Lisk Sepolia Contract</span>
        </h3>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${
            isInitialized ? 'bg-green-500' : 'bg-red-500'
          }`}></div>
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {isInitialized ? 'Connected' : 'Disconnected'}
          </span>
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200 disabled:opacity-50"
          >
            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Contract Info */}
      <div className="mb-4 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-300">Network:</span>
          <span className="font-medium text-gray-900 dark:text-white">
            Lisk Sepolia (Chain ID: 4202)
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-300">Contract:</span>
          <div className="flex items-center space-x-2">
            <code className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded font-mono">
              {contractAddress.slice(0, 8)}...{contractAddress.slice(-6)}
            </code>
            <a
              href={explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-700 transition-colors duration-200"
            >
              <ExternalLink size={14} />
            </a>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-300">Wallet:</span>
          <span className={`text-sm ${isWalletConnected() ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {isWalletConnected() ? 'Connected' : 'Not Connected'}
          </span>
        </div>
      </div>

      {/* Contract Statistics */}
      {contractStats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Users size={20} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {contractStats.totalInvoices}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-300">Total Invoices</div>
          </div>

          <div className="text-center">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mx-auto mb-2">
              <CheckCircle size={20} className="text-green-600 dark:text-green-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {contractStats.totalPaidInvoices}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-300">Paid Invoices</div>
          </div>

          <div className="text-center">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mx-auto mb-2">
              <TrendingUp size={20} className="text-purple-600 dark:text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {parseFloat(contractStats.totalEscrowVolume).toFixed(2)}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-300">ETH in Escrow</div>
          </div>
        </div>
      )}

      {/* Status Messages */}
      {!isInitialized && (
        <div className="mt-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <AlertCircle size={16} className="text-orange-600 dark:text-orange-400" />
            <span className="text-orange-800 dark:text-orange-200 text-sm">
              {isWalletConnected() 
                ? 'Please switch to Lisk Sepolia network in your wallet'
                : 'Connect your wallet to interact with smart contracts'
              }
            </span>
          </div>
        </div>
      )}

      {isInitialized && (
        <div className="mt-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <CheckCircle size={16} className="text-green-600 dark:text-green-400" />
            <span className="text-green-800 dark:text-green-200 text-sm">
              Connected to Invoy smart contract on Lisk Sepolia
            </span>
          </div>
        </div>
      )}
    </div>
  );
}