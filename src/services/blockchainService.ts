// Blockchain service for interacting with the Invoy smart contract on Lisk Sepolia
import { ethers } from 'ethers';
import { Invoice } from '../types';
import InvoyModuleABI from '../contracts/InvoyModule.json';

// Contract configuration
const CONTRACT_CONFIG = {
  address: '0x34c82345973449618fF78ac2F707ab533Af98Cb4',
  abi: InvoyModuleABI.abi,
  network: 'lisk-sepolia',
  chainId: 4202,
  rpcUrl: 'https://rpc.sepolia-api.lisk.com'
};

// Invoice states enum (matching the smart contract)
export enum InvoiceState {
  Pending = 0,
  Accepted = 1,
  Rejected = 2,
  Deposited = 3,
  Paid = 4,
  Cancelled = 5,
  Refunded = 6
}

export interface BlockchainInvoice {
  freelancer: string;
  employer: string;
  amount: string;
  token: string;
  chainId: number;
  state: InvoiceState;
}

export interface ContractInteractionResult {
  success: boolean;
  message: string;
  transactionHash?: string;
  error?: string;
}

class BlockchainService {
  private provider: ethers.providers.JsonRpcProvider | ethers.providers.Web3Provider | null = null;
  private signer: ethers.Signer | null = null;
  private contract: ethers.Contract | null = null;
  private isInitialized: boolean = false;

  // Initialize blockchain connection
  async initialize(): Promise<{ success: boolean; message: string }> {
    try {
      // Check if MetaMask is available
      if (typeof window !== 'undefined' && window.ethereum) {
        // Use MetaMask provider
        this.provider = new ethers.providers.Web3Provider(window.ethereum);
        
        try {
          // Request account access
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          this.signer = this.provider.getSigner();
          
          // Verify signer can provide an address
          const address = await this.signer.getAddress();
          if (!address || address === ethers.constants.AddressZero) {
            this.isInitialized = false;
            return { success: false, message: 'No wallet account available' };
          }

          // Check if we're on the correct network
          const network = await this.provider.getNetwork();
          if (network.chainId !== CONTRACT_CONFIG.chainId) {
            // Try to switch to Lisk Sepolia
            try {
              await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: `0x${CONTRACT_CONFIG.chainId.toString(16)}` }],
              });
            } catch (switchError: any) {
              // If the network doesn't exist, add it
              if (switchError.code === 4902) {
                await window.ethereum.request({
                  method: 'wallet_addEthereumChain',
                  params: [{
                    chainId: `0x${CONTRACT_CONFIG.chainId.toString(16)}`,
                    chainName: 'Lisk Sepolia Testnet',
                    nativeCurrency: {
                      name: 'Sepolia Ether',
                      symbol: 'ETH',
                      decimals: 18
                    },
                    rpcUrls: [CONTRACT_CONFIG.rpcUrl],
                    blockExplorerUrls: ['https://sepolia-blockscout.lisk.com']
                  }]
                });
              } else {
                return { success: false, message: `Please switch to Lisk Sepolia network (Chain ID: ${CONTRACT_CONFIG.chainId})` };
              }
            }
          }
        } catch (error: any) {
          this.isInitialized = false;
          return { success: false, message: 'Wallet not connected or authorized' };
        }
      } else {
        // Fallback to read-only provider
        this.provider = new ethers.providers.JsonRpcProvider(CONTRACT_CONFIG.rpcUrl);
        this.signer = null;
      }

      // Initialize contract
      this.contract = new ethers.Contract(
        CONTRACT_CONFIG.address,
        CONTRACT_CONFIG.abi,
        this.signer || this.provider
      );

      this.isInitialized = true;
      return { success: true, message: 'Blockchain service initialized successfully' };
    } catch (error: any) {
      console.error('Blockchain initialization error:', error);
      this.isInitialized = false;
      return { success: false, message: error.message || 'Failed to initialize blockchain service' };
    }
  }

  // Generate invoice hash from invoice data
  generateInvoiceHash(invoice: Invoice): string {
    const canonicalData = {
      employer_email: invoice.employerEmail.toLowerCase(),
      freelancer_name: invoice.freelancerName.trim(),
      freelancer_email: invoice.freelancerEmail.toLowerCase(),
      wallet_address: invoice.walletAddress.toLowerCase(),
      network: invoice.network.toLowerCase(),
      token: invoice.token.toUpperCase(),
      amount: parseFloat(invoice.amount).toFixed(8),
      role: invoice.role.trim(),
      description: invoice.description.trim()
    };
    
    const canonicalJson = JSON.stringify(canonicalData, Object.keys(canonicalData).sort());
    return ethers.utils.keccak256(ethers.utils.toUtf8Bytes(canonicalJson));
  }

  // Register invoice on blockchain
  async registerInvoice(
    invoice: Invoice,
    freelancerAddress: string,
    employerAddress: string
  ): Promise<ContractInteractionResult> {
    try {
      if (!this.isInitialized || !this.contract || !this.signer) {
        return { success: false, message: 'Blockchain service not initialized or wallet not connected' };
      }

      const invoiceHash = this.generateInvoiceHash(invoice);
      const amount = ethers.utils.parseEther(invoice.amount);
      const tokenAddress = invoice.token === 'ETH' ? ethers.constants.AddressZero : ethers.constants.AddressZero; // For now, using ETH

      // Register invoice on smart contract
      const tx = await this.contract.registerInvoice(
        invoiceHash,
        freelancerAddress,
        employerAddress,
        amount,
        tokenAddress
      );

      await tx.wait();

      return {
        success: true,
        message: 'Invoice registered on blockchain successfully',
        transactionHash: tx.hash
      };
    } catch (error: any) {
      console.error('Invoice registration error:', error);
      return {
        success: false,
        message: error.message || 'Failed to register invoice on blockchain',
        error: error.message
      };
    }
  }

  // Accept invoice on blockchain
  async acceptInvoice(invoice: Invoice): Promise<ContractInteractionResult> {
    try {
      if (!this.isInitialized || !this.contract || !this.signer) {
        return { success: false, message: 'Blockchain service not initialized or wallet not connected' };
      }

      const invoiceHash = this.generateInvoiceHash(invoice);
      
      const tx = await this.contract.acceptInvoice(invoiceHash);
      await tx.wait();

      return {
        success: true,
        message: 'Invoice accepted on blockchain',
        transactionHash: tx.hash
      };
    } catch (error: any) {
      console.error('Invoice acceptance error:', error);
      return {
        success: false,
        message: error.message || 'Failed to accept invoice on blockchain',
        error: error.message
      };
    }
  }

  // Reject invoice on blockchain
  async rejectInvoice(invoice: Invoice, reason: string): Promise<ContractInteractionResult> {
    try {
      if (!this.isInitialized || !this.contract || !this.signer) {
        return { success: false, message: 'Blockchain service not initialized or wallet not connected' };
      }

      const invoiceHash = this.generateInvoiceHash(invoice);
      
      const tx = await this.contract.rejectInvoice(invoiceHash, reason);
      await tx.wait();

      return {
        success: true,
        message: 'Invoice rejected on blockchain',
        transactionHash: tx.hash
      };
    } catch (error: any) {
      console.error('Invoice rejection error:', error);
      return {
        success: false,
        message: error.message || 'Failed to reject invoice on blockchain',
        error: error.message
      };
    }
  }

  // Deposit payment into escrow
  async depositPayment(invoice: Invoice): Promise<ContractInteractionResult> {
    try {
      if (!this.isInitialized || !this.contract || !this.signer) {
        return { success: false, message: 'Blockchain service not initialized or wallet not connected' };
      }

      const invoiceHash = this.generateInvoiceHash(invoice);
      const amount = ethers.utils.parseEther(invoice.amount);

      // For ETH payments, send value with transaction
      const tx = await this.contract.depositPayment(invoiceHash, { value: amount });
      await tx.wait();

      return {
        success: true,
        message: 'Payment deposited into escrow successfully',
        transactionHash: tx.hash
      };
    } catch (error: any) {
      console.error('Payment deposit error:', error);
      return {
        success: false,
        message: error.message || 'Failed to deposit payment into escrow',
        error: error.message
      };
    }
  }

  // Release payment from escrow
  async releasePayment(invoice: Invoice): Promise<ContractInteractionResult> {
    try {
      if (!this.isInitialized || !this.contract || !this.signer) {
        return { success: false, message: 'Blockchain service not initialized or wallet not connected' };
      }

      const invoiceHash = this.generateInvoiceHash(invoice);
      
      const tx = await this.contract.releasePayment(invoiceHash);
      await tx.wait();

      return {
        success: true,
        message: 'Payment released to freelancer successfully',
        transactionHash: tx.hash
      };
    } catch (error: any) {
      console.error('Payment release error:', error);
      return {
        success: false,
        message: error.message || 'Failed to release payment',
        error: error.message
      };
    }
  }

  // Refund payment
  async refundPayment(invoice: Invoice): Promise<ContractInteractionResult> {
    try {
      if (!this.isInitialized || !this.contract || !this.signer) {
        return { success: false, message: 'Blockchain service not initialized or wallet not connected' };
      }

      const invoiceHash = this.generateInvoiceHash(invoice);
      
      const tx = await this.contract.refundPayment(invoiceHash);
      await tx.wait();

      return {
        success: true,
        message: 'Payment refunded successfully',
        transactionHash: tx.hash
      };
    } catch (error: any) {
      console.error('Payment refund error:', error);
      return {
        success: false,
        message: error.message || 'Failed to refund payment',
        error: error.message
      };
    }
  }

  // Cancel invoice on blockchain
  async cancelInvoice(invoice: Invoice): Promise<ContractInteractionResult> {
    try {
      if (!this.isInitialized || !this.contract || !this.signer) {
        return { success: false, message: 'Blockchain service not initialized or wallet not connected' };
      }

      const invoiceHash = this.generateInvoiceHash(invoice);
      
      const tx = await this.contract.cancelInvoice(invoiceHash);
      await tx.wait();

      return {
        success: true,
        message: 'Invoice cancelled on blockchain',
        transactionHash: tx.hash
      };
    } catch (error: any) {
      console.error('Invoice cancellation error:', error);
      return {
        success: false,
        message: error.message || 'Failed to cancel invoice on blockchain',
        error: error.message
      };
    }
  }

  // Get invoice from blockchain
  async getBlockchainInvoice(invoiceHash: string): Promise<{ success: boolean; invoice?: BlockchainInvoice; error?: string }> {
    try {
      if (!this.isInitialized || !this.contract) {
        return { success: false, error: 'Blockchain service not initialized' };
      }

      const invoice = await this.contract.invoices(invoiceHash);
      
      // Check if invoice exists (freelancer address should not be zero)
      if (invoice.freelancer === ethers.constants.AddressZero) {
        return { success: false, error: 'Invoice not found on blockchain' };
      }

      const blockchainInvoice: BlockchainInvoice = {
        freelancer: invoice.freelancer,
        employer: invoice.employer,
        amount: ethers.utils.formatEther(invoice.amount),
        token: invoice.token,
        chainId: invoice.chainId.toNumber(),
        state: invoice.state
      };

      return { success: true, invoice: blockchainInvoice };
    } catch (error: any) {
      console.error('Get blockchain invoice error:', error);
      return { success: false, error: error.message || 'Failed to get invoice from blockchain' };
    }
  }

  // Get contract statistics (mock implementation since the contract doesn't have this function)
  async getContractStatistics(): Promise<{
    success: boolean;
    stats?: { totalInvoices: number; totalPaidInvoices: number; totalEscrowVolume: string };
    error?: string;
  }> {
    try {
      if (!this.isInitialized) {
        return { success: false, error: 'Blockchain service not initialized' };
      }

      // Since the provided contract doesn't have statistics functions,
      // we'll return mock data or implement event-based counting
      return {
        success: true,
        stats: {
          totalInvoices: 0,
          totalPaidInvoices: 0,
          totalEscrowVolume: '0.0'
        }
      };
    } catch (error: any) {
      console.error('Get statistics error:', error);
      return { success: false, error: error.message || 'Failed to get contract statistics' };
    }
  }

  // Listen to contract events
  setupEventListeners(callbacks: {
    onInvoiceRegistered?: (event: any) => void;
    onInvoiceAccepted?: (event: any) => void;
    onInvoiceRejected?: (event: any) => void;
    onPaymentDeposited?: (event: any) => void;
    onPaymentReleased?: (event: any) => void;
    onPaymentRefunded?: (event: any) => void;
  }): void {
    if (!this.contract) return;

    if (callbacks.onInvoiceRegistered) {
      this.contract.on('InvoiceRegistered', callbacks.onInvoiceRegistered);
    }
    if (callbacks.onInvoiceAccepted) {
      this.contract.on('InvoiceAccepted', callbacks.onInvoiceAccepted);
    }
    if (callbacks.onInvoiceRejected) {
      this.contract.on('InvoiceRejected', callbacks.onInvoiceRejected);
    }
    if (callbacks.onPaymentDeposited) {
      this.contract.on('PaymentDeposited', callbacks.onPaymentDeposited);
    }
    if (callbacks.onPaymentReleased) {
      this.contract.on('PaymentReleased', callbacks.onPaymentReleased);
    }
    if (callbacks.onPaymentRefunded) {
      this.contract.on('PaymentRefunded', callbacks.onPaymentRefunded);
    }
  }

  // Remove event listeners
  removeEventListeners(): void {
    if (this.contract) {
      this.contract.removeAllListeners();
    }
  }

  // Get current network info
  getCurrentNetwork(): { name: string; chainId: number } {
    return { name: 'Lisk Sepolia', chainId: CONTRACT_CONFIG.chainId };
  }

  // Check if wallet is connected
  isWalletConnected(): boolean {
    return !!this.signer;
  }

  // Get connected wallet address
  async getWalletAddress(): Promise<string | null> {
    try {
      if (!this.signer) return null;
      return await this.signer.getAddress();
    } catch {
      return null;
    }
  }

  // Check if user has required role
  async hasRole(role: string, account: string): Promise<boolean> {
    try {
      if (!this.contract) return false;
      
      const roleHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(role));
      return await this.contract.hasRole(roleHash, account);
    } catch {
      return false;
    }
  }

  // Get initialization status
  getInitializationStatus(): boolean {
    return this.isInitialized;
  }
}

export const blockchainService = new BlockchainService();
export default blockchainService;