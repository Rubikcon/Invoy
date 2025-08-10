import { useState, useEffect } from 'react';
import { WalletInfo } from '../types';
import walletAuthService from '../services/walletAuthService';

declare global {
  interface Window {
    ethereum?: any;
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

  // Check if wallet is already connected on page load
  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          const networkId = await window.ethereum.request({ method: 'eth_chainId' });
          const networkName = getNetworkName(networkId);
          
          setWalletInfo({
            address: accounts[0],
            network: networkName,
            isConnected: true
          });
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error);
      }
    }
  };

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      setConnectionError('MetaMask is not installed. Please install MetaMask to continue.');
      return;
    }

    setIsConnecting(true);
    setConnectionError('');
    
    try {
      // Request account access
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      // Get network information
      const networkId = await window.ethereum.request({ 
        method: 'eth_chainId' 
      });
      
      const networkName = getNetworkName(networkId);
      
      setWalletInfo({
        address: accounts[0],
        network: networkName,
        isConnected: true
      });

      // Listen for account changes
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length === 0) {
          setWalletInfo({
            address: '',
            network: '',
            isConnected: false
          });
        } else {
          setWalletInfo(prev => ({
            ...prev,
            address: accounts[0]
          }));
        }
      });

      // Listen for network changes
      window.ethereum.on('chainChanged', (chainId: string) => {
        const networkName = getNetworkName(chainId);
        setWalletInfo(prev => ({
          ...prev,
          network: networkName
        }));
      });

    } catch (error: any) {
      console.error('Error connecting wallet:', error);
      if (error.code === 4001) {
        setConnectionError('Please connect to MetaMask.');
      } else {
        setConnectionError('An error occurred while connecting to your wallet.');
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const verifyWalletOwnership = async (): Promise<{ success: boolean; message: string }> => {
    if (!walletInfo.isConnected) {
      return { success: false, message: 'No wallet connected' };
    }

    setIsVerifying(true);
    try {
      const result = await walletAuthService.authenticateWithWallet(walletInfo.address);
      return result;
    } catch (error: any) {
      return { success: false, message: error.message || 'Wallet verification failed' };
    } finally {
      setIsVerifying(false);
    }
  };

  const requestWalletSignature = async (message?: string): Promise<{ success: boolean; signature?: string; message: string }> => {
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
    } catch (error: any) {
      return { success: false, message: error.message || 'Signature request failed' };
    }
  };

  const getNetworkName = (chainId: string): string => {
    const networks: { [key: string]: string } = {
      '0x1': 'Ethereum',
      '0x89': 'Polygon',
      '0xa4b1': 'Arbitrum',
      '0xa': 'Optimism',
      '0x2105': 'Base',
      '0xaa36a7': 'Sepolia',
      '0x13881': 'Mumbai'
    };
    
    return networks[chainId] || 'Unknown Network';
  };

  const disconnectWallet = () => {
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
  };

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