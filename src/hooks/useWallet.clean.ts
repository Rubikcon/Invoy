import { useState, useEffect, useCallback } from 'react';
import { WalletInfo } from '../types';
import walletAuthService from '../services/walletAuthService';
import { EthereumProvider, EthereumError } from '../types/ethereum';

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}

export function useWallet() {
  const [walletInfo, setWalletInfo] = useState<WalletInfo>({
    address: '',
    network: '',
    isConnected: false
  });
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Get network name from chain ID
  const getNetworkName = useCallback((chainId: string): string => {
    const networks: { [key: string]: string } = {
      '0x1': 'Ethereum',
      '0x89': 'Polygon',
      '0xa4b1': 'Arbitrum',
      '0xa': 'Optimism',
      '0x2105': 'Base',
      '0xaa36a7': 'Sepolia',
      '0x13881': 'Mumbai',
      '0x106a': 'Lisk Sepolia',
      '0x1069': 'Lisk Mainnet',
    };
    
    return networks[chainId] || 'Unknown Network';
  }, []);

  // Check wallet connection
  const checkConnection = useCallback(async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      return false;
    }

    try {
      // Check if wallet is already connected
      const accounts = await window.ethereum.request({ method: 'eth_accounts' }) as string[];
      
      if (accounts && accounts.length > 0) {
        const networkId = await window.ethereum.request({ method: 'eth_chainId' }) as string;
        const networkName = getNetworkName(networkId);
        
        setWalletInfo({
          address: accounts[0],
          network: networkName,
          isConnected: true
        });
        
        // Save connection status to localStorage for persistence
        localStorage.setItem('walletConnected', 'true');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error checking wallet connection:', error);
      return false;
    }
  }, [getNetworkName]);

  // Initialize wallet connection on page load and set up event listeners
  useEffect(() => {
    // Check for existing connection
    const checkInitialConnection = async () => {
      const wasConnected = localStorage.getItem('walletConnected') === 'true';
      if (wasConnected) {
        await checkConnection();
      }
    };
    
    checkInitialConnection();
    
    // Handler for account changes
    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        // Wallet disconnected
        setWalletInfo(prev => ({
          ...prev,
          address: '',
          isConnected: false
        }));
        localStorage.removeItem('walletConnected');
      } else {
        // Account changed
        setWalletInfo(prev => ({
          ...prev,
          address: accounts[0],
          isConnected: true
        }));
      }
    };

    // Handler for network changes
    const handleChainChanged = async (chainId: string) => {
      const networkName = getNetworkName(chainId);
      setWalletInfo(prev => ({
        ...prev,
        network: networkName
      }));
    };

    // Add listeners if ethereum is available
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged as (...args: unknown[]) => void);
      window.ethereum.on('chainChanged', handleChainChanged as (...args: unknown[]) => void);
    }
    
    // Clean up listeners on component unmount
    return () => {
      if (window.ethereum?.removeListener) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged as (...args: unknown[]) => void);
        window.ethereum.removeListener('chainChanged', handleChainChanged as (...args: unknown[]) => void);
      }
    };
  }, [checkConnection, getNetworkName]);

  // Connect wallet
  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      setConnectionError('MetaMask is not installed. Please install MetaMask to continue.');
      return false;
    }

    setIsConnecting(true);
    setConnectionError('');
    
    try {
      // Request account access
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      }) as string[];
      
      if (!accounts || accounts.length === 0) {
        setConnectionError('No accounts found. Please check your wallet and try again.');
        return false;
      }

      // Get network information
      const networkId = await window.ethereum.request({ 
        method: 'eth_chainId' 
      }) as string;
      
      const networkName = getNetworkName(networkId);
      
      // Update state with connected wallet info
      setWalletInfo({
        address: accounts[0],
        network: networkName,
        isConnected: true
      });

      // Store connection in localStorage for persistence
      localStorage.setItem('walletConnected', 'true');
      
      return true;
    } catch (error) {
      console.error('Error connecting wallet:', error);
      
      // Handle user rejection
      const ethError = error as EthereumError;
      if (ethError.code === 4001) {
        setConnectionError('User rejected the connection request.');
      } else if (ethError.code === -32002) {
        setConnectionError('Connection request already pending. Please check your wallet.');
      } else {
        setConnectionError(ethError.message || 'An error occurred while connecting to your wallet.');
      }
      
      return false;
    } finally {
      setIsConnecting(false);
    }
  };

  // Verify wallet ownership with signature
  const verifyWalletOwnership = async (): Promise<{ success: boolean; message: string }> => {
    if (!walletInfo.isConnected) {
      return { success: false, message: 'No wallet connected' };
    }

    setIsVerifying(true);
    try {
      const result = await walletAuthService.authenticateWithWallet(walletInfo.address);
      return result;
    } catch (error) {
      const err = error as Error;
      return { success: false, message: err.message || 'Wallet verification failed' };
    } finally {
      setIsVerifying(false);
    }
  };

  // Request wallet signature for a message
  const requestWalletSignature = async (): Promise<{ success: boolean; signature?: string; message: string }> => {
    if (!walletInfo.isConnected) {
      return { success: false, message: 'No wallet connected' };
    }

    try {
      const signatureResult = await walletAuthService.requestWalletSignature(walletInfo.address);
      
      if (signatureResult) {
        return { 
          success: true, 
          signature: signatureResult.signature,
          message: 'Signature obtained successfully' 
        };
      }
      
      return { success: false, message: 'Failed to get wallet signature' };
    } catch (error) {
      const err = error as Error;
      return { success: false, message: err.message || 'Signature request failed' };
    }
  };

  // Disconnect wallet
  const disconnectWallet = async () => {
    try {
      // If MetaMask is installed, request account disconnection
      if (window.ethereum && window.ethereum.isMetaMask) {
        try {
          // This is the standard EIP-1193 method for disconnecting
          await window.ethereum.request({
            method: 'wallet_revokePermissions',
            params: [
              {
                eth_accounts: {}
              }
            ]
          });
        } catch (error) {
          console.warn('Error disconnecting wallet:', error);
          // Continue with disconnection even if MetaMask disconnect fails
        }
      }
      
      // Reset local state
      setWalletInfo({
        address: '',
        network: '',
        isConnected: false
      });
      setConnectionError('');
      
      // Clear any stored wallet connection data
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem('walletConnected');
      }
      
      return true;
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
      setConnectionError('Failed to disconnect wallet');
      return false;
    }
  };

  // Format wallet address for display (e.g. 0x1234...abcd)
  const formatAddress = (address: string): string => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return {
    walletInfo,
    isConnecting,
    isVerifying,
    connectionError,
    connectWallet,
    disconnectWallet,
    formatAddress,
    verifyWalletOwnership,
    requestWalletSignature
  };
}

export default useWallet;
