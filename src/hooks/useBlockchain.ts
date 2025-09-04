import { useState, useEffect } from 'react';
import { blockchainService, ContractInteractionResult, BlockchainInvoice } from '../services/blockchainService';
import { Invoice } from '../types';

export function useBlockchain() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentNetwork, setCurrentNetwork] = useState<string>('lisk-sepolia');
  const [contractStats, setContractStats] = useState<{
    totalInvoices: number;
    totalPaidInvoices: number;
    totalEscrowVolume: string;
  } | null>(null);

  // Initialize blockchain service
  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      try {
        const result = await blockchainService.initialize();
        setIsInitialized(result.success);
        
        if (result.success) {
          await loadContractStats();
        } else {
          setContractStats(null);
          console.warn('Blockchain initialization failed:', result.message);
        }
      } catch (error) {
        console.error('Blockchain initialization error:', error);
        setIsInitialized(false);
        setContractStats(null);
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, []);

  // Load contract statistics
  const loadContractStats = async () => {
    try {
      const result = await blockchainService.getContractStatistics();
      if (result.success && result.stats) {
        setContractStats(result.stats);
      } else {
        setContractStats(null);
      }
    } catch (error) {
      console.error('Failed to load contract stats:', error);
      setContractStats(null);
    }
  };

  // Register invoice on blockchain
  const registerInvoice = async (
    invoice: Invoice,
    freelancerAddress: string,
    employerAddress: string
  ): Promise<ContractInteractionResult> => {
    if (!isInitialized) {
      return { success: false, message: 'Blockchain service not initialized' };
    }

    setIsLoading(true);
    try {
      const result = await blockchainService.registerInvoice(invoice, freelancerAddress, employerAddress);
      if (result.success) {
        await loadContractStats();
      }
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  // Accept invoice on blockchain
  const acceptInvoice = async (invoice: Invoice): Promise<ContractInteractionResult> => {
    if (!isInitialized) {
      return { success: false, message: 'Blockchain service not initialized' };
    }

    setIsLoading(true);
    try {
      const result = await blockchainService.acceptInvoice(invoice);
      if (result.success) {
        await loadContractStats();
      }
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  // Reject invoice on blockchain
  const rejectInvoice = async (invoice: Invoice, reason: string): Promise<ContractInteractionResult> => {
    if (!isInitialized) {
      return { success: false, message: 'Blockchain service not initialized' };
    }

    setIsLoading(true);
    try {
      const result = await blockchainService.rejectInvoice(invoice, reason);
      if (result.success) {
        await loadContractStats();
      }
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  // Deposit payment into escrow
  const depositPayment = async (invoice: Invoice): Promise<ContractInteractionResult> => {
    if (!isInitialized) {
      return { success: false, message: 'Blockchain service not initialized' };
    }

    setIsLoading(true);
    try {
      const result = await blockchainService.depositPayment(invoice);
      if (result.success) {
        await loadContractStats();
      }
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  // Release payment from escrow
  const releasePayment = async (invoice: Invoice): Promise<ContractInteractionResult> => {
    if (!isInitialized) {
      return { success: false, message: 'Blockchain service not initialized' };
    }

    setIsLoading(true);
    try {
      const result = await blockchainService.releasePayment(invoice);
      if (result.success) {
        await loadContractStats();
      }
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  // Refund payment
  const refundPayment = async (invoice: Invoice): Promise<ContractInteractionResult> => {
    if (!isInitialized) {
      return { success: false, message: 'Blockchain service not initialized' };
    }

    setIsLoading(true);
    try {
      const result = await blockchainService.refundPayment(invoice);
      if (result.success) {
        await loadContractStats();
      }
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  // Cancel invoice
  const cancelInvoice = async (invoice: Invoice): Promise<ContractInteractionResult> => {
    if (!isInitialized) {
      return { success: false, message: 'Blockchain service not initialized' };
    }

    setIsLoading(true);
    try {
      const result = await blockchainService.cancelInvoice(invoice);
      if (result.success) {
        await loadContractStats();
      }
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  // Get blockchain invoice
  const getBlockchainInvoice = async (invoiceHash: string): Promise<{ success: boolean; invoice?: BlockchainInvoice; error?: string }> => {
    if (!isInitialized) {
      return { success: false, error: 'Blockchain service not initialized' };
    }

    return await blockchainService.getBlockchainInvoice(invoiceHash);
  };

  // Generate invoice hash
  const generateInvoiceHash = (invoice: Invoice): string => {
    return blockchainService.generateInvoiceHash(invoice);
  };

  // Check if wallet is connected
  const isWalletConnected = (): boolean => {
    return blockchainService.isWalletConnected();
  };

  // Get wallet address
  const getWalletAddress = async (): Promise<string | null> => {
    return await blockchainService.getWalletAddress();
  };

  return {
    isInitialized,
    isLoading,
    currentNetwork,
    contractStats,
    registerInvoice,
    acceptInvoice,
    rejectInvoice,
    depositPayment,
    releasePayment,
    refundPayment,
    cancelInvoice,
    getBlockchainInvoice,
    generateInvoiceHash,
    loadContractStats,
    isWalletConnected,
    getWalletAddress
  };
}