import React from 'react';
import { X, Wallet, Plus, Trash2, Shield, CheckCircle, AlertCircle, Star } from 'lucide-react';
import { UserWallet } from '../../types';
import { userProfileService } from '../../services/userProfileService';
import { useWallet } from '../../hooks/useWallet';
import WalletConsentModal from './WalletConsentModal';

interface WalletManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userWallets: UserWallet[];
  onWalletsUpdate: (wallets: UserWallet[]) => void;
}

export default function WalletManagementModal({ 
  isOpen, 
  onClose, 
  userId, 
  userWallets, 
  onWalletsUpdate 
}: WalletManagementModalProps) {
  const { walletInfo, connectWallet } = useWallet();
  const [isLoading, setIsLoading] = React.useState(false);
  const [showConsentModal, setShowConsentModal] = React.useState(false);
  const [pendingWallet, setPendingWallet] = React.useState<{ address: string; network: string } | null>(null);
  const [message, setMessage] = React.useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleAddWallet = async () => {
    if (!walletInfo.isConnected) {
      await connectWallet();
      return;
    }

    // Check if wallet already exists
    const existingWallet = userWallets.find(w => 
      w.walletAddress.toLowerCase() === walletInfo.address.toLowerCase() &&
      w.network.toLowerCase() === walletInfo.network.toLowerCase()
    );

    if (existingWallet) {
      setMessage({ type: 'error', text: 'This wallet is already connected to your account' });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    // Show consent modal
    setPendingWallet({
      address: walletInfo.address,
      network: walletInfo.network
    });
    setShowConsentModal(true);
  };

  const handleWalletConsent = async () => {
    if (!pendingWallet) return;

    setIsLoading(true);
    try {
      const result = await userProfileService.addWalletWithConsent(
        userId,
        pendingWallet.address,
        pendingWallet.network,
        `${pendingWallet.network} Wallet`
      );

      if (result.success) {
        // Refresh wallets list
        const updatedWallets = userProfileService.getUserWallets(userId);
        onWalletsUpdate(updatedWallets);
        setMessage({ type: 'success', text: result.message });
        setShowConsentModal(false);
        setPendingWallet(null);
      } else {
        setMessage({ type: 'error', text: result.message });
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to add wallet' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveWallet = async (walletId: string) => {
    if (confirm('Are you sure you want to remove this wallet? This action cannot be undone.')) {
      setIsLoading(true);
      try {
        const result = await userProfileService.removeWallet(userId, walletId);
        
        if (result.success) {
          const updatedWallets = userProfileService.getUserWallets(userId);
          onWalletsUpdate(updatedWallets);
          setMessage({ type: 'success', text: result.message });
        } else {
          setMessage({ type: 'error', text: result.message });
        }
      } catch (error) {
        setMessage({ type: 'error', text: 'Failed to remove wallet' });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSetPrimary = async (walletId: string) => {
    setIsLoading(true);
    try {
      const result = await userProfileService.setPrimaryWallet(userId, walletId);
      
      if (result.success) {
        const updatedWallets = userProfileService.getUserWallets(userId);
        onWalletsUpdate(updatedWallets);
        setMessage({ type: 'success', text: result.message });
      } else {
        setMessage({ type: 'error', text: result.message });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to set primary wallet' });
    } finally {
      setIsLoading(false);
    }
  };

  const formatAddress = (address: string): string => {
    if (!address) return '';
    return `${address.slice(0, 8)}...${address.slice(-6)}`;
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto p-4">
        <div className="flex min-h-screen items-center justify-center">
          <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>
          
          <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto transition-colors duration-300">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                <Wallet size={24} className="text-blue-500" />
                <span>Wallet Management</span>
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
              >
                <X size={24} />
              </button>
            </div>

            {/* Message */}
            {message && (
              <div className={`mb-4 p-3 rounded-lg ${
                message.type === 'success' 
                  ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200'
                  : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200'
              }`}>
                {message.text}
              </div>
            )}

            {/* Add Wallet Button */}
            <div className="mb-6">
              <button
                onClick={handleAddWallet}
                disabled={isLoading}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 rounded-lg hover:border-blue-500 hover:text-blue-500 dark:hover:border-blue-400 dark:hover:text-blue-400 transition-all duration-200 disabled:opacity-50"
              >
                <Plus size={20} />
                <span>Add New Wallet</span>
              </button>
            </div>

            {/* Wallets List */}
            <div className="space-y-4">
              {userWallets.length === 0 ? (
                <div className="text-center py-8">
                  <Wallet size={48} className="text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No wallets connected</h3>
                  <p className="text-gray-600 dark:text-gray-300">Connect your first wallet to start receiving payments</p>
                </div>
              ) : (
                userWallets.map((wallet) => (
                  <div
                    key={wallet.id}
                    className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 border border-gray-200 dark:border-gray-600 transition-colors duration-300"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {wallet.label || `${wallet.network} Wallet`}
                          </h3>
                          {wallet.isPrimary && (
                            <div className="flex items-center space-x-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full text-xs">
                              <Star size={10} />
                              <span>Primary</span>
                            </div>
                          )}
                          {wallet.isVerified ? (
                            <div className="flex items-center space-x-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-2 py-1 rounded-full text-xs">
                              <CheckCircle size={10} />
                              <span>Verified</span>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-1 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 px-2 py-1 rounded-full text-xs">
                              <AlertCircle size={10} />
                              <span>Unverified</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600 dark:text-gray-300">Address:</span>
                            <code className="bg-white dark:bg-gray-800 px-2 py-1 rounded text-xs font-mono">
                              {formatAddress(wallet.walletAddress)}
                            </code>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600 dark:text-gray-300">Network:</span>
                            <span className="font-medium text-blue-600 dark:text-blue-400 capitalize">
                              {wallet.network}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600 dark:text-gray-300">Added:</span>
                            <span className="text-gray-500 dark:text-gray-400">
                              {wallet.createdAt.toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col space-y-2 ml-4">
                        {!wallet.isPrimary && (
                          <button
                            onClick={() => handleSetPrimary(wallet.id)}
                            disabled={isLoading}
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-xs transition-colors duration-200 disabled:opacity-50"
                          >
                            Set Primary
                          </button>
                        )}
                        <button
                          onClick={() => handleRemoveWallet(wallet.id)}
                          disabled={isLoading}
                          className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 text-xs transition-colors duration-200 disabled:opacity-50"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Security Notice */}
            <div className="mt-6 bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Shield size={20} className="text-gray-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-1">Security Notice</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    We only store your public wallet addresses. Your private keys remain secure in your wallet and are never shared with Invoy.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wallet Consent Modal */}
      <WalletConsentModal
        isOpen={showConsentModal}
        onClose={() => {
          setShowConsentModal(false);
          setPendingWallet(null);
        }}
        onConsent={handleWalletConsent}
        onDecline={() => {
          setShowConsentModal(false);
          setPendingWallet(null);
        }}
        walletAddress={pendingWallet?.address || ''}
        network={pendingWallet?.network || ''}
        isLoading={isLoading}
      />
    </>
  );
}