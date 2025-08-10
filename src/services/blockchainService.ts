// Blockchain service for interacting with Invoy smart contracts
import { ethers } from 'ethers';
import { Invoice } from '../types';

// Contract ABIs (simplified for demo - in production, import from compiled artifacts)
const INVOICE_REGISTRY_ABI = [
  "function registerInvoice(bytes32 invoiceHash, address freelancerAddress, address employerAddress, uint256 amount, address tokenAddress, uint256 chainId) external",
  "function acceptInvoice(bytes32 invoiceHash) external",
  "function rejectInvoice(bytes32 invoiceHash, string reason) external",
  "function cancelInvoice(bytes32 invoiceHash) external",
  "function depositPayment(bytes32 invoiceHash) external payable",
  "function releasePayment(bytes32 invoiceHash) external",
  "function refundPayment(bytes32 invoiceHash) external",
  "function markAsPaid(bytes32 invoiceHash) external",
  "function getInvoice(bytes32 invoiceHash) external view returns (tuple(bytes32 invoiceHash, address freelancerAddress, address employerAddress, uint256 amount, address tokenAddress, uint256 chainId, uint8 state, uint256 createdAt, uint256 updatedAt, string rejectionReason, bool hasEscrow))",
  "function getFreelancerInvoices(address freelancer) external view returns (bytes32[])",
  "function getEmployerInvoices(address employer) external view returns (bytes32[])",
  "function getStatistics() external view returns (uint256, uint256, uint256)",
  "function invoiceExists(bytes32 invoiceHash) external view returns (bool)",
  "event InvoiceRegistered(bytes32 indexed invoiceHash, address indexed freelancer, address indexed employer, uint256 amount, address token, uint256 chainId, uint256 timestamp)",
  "event InvoiceAccepted(bytes32 indexed invoiceHash, address indexed employer, uint256 timestamp)",
  "event InvoiceRejected(bytes32 indexed invoiceHash, address indexed employer, string reason, uint256 timestamp)",
  "event InvoicePaid(bytes32 indexed invoiceHash, address indexed payer, uint256 timestamp)",
  "event PaymentDeposited(bytes32 indexed invoiceHash, address indexed depositor, uint256 amount, address token, uint256 timestamp)",
  "event PaymentReleased(bytes32 indexed invoiceHash, address indexed recipient, uint256 amount, address token, uint256 timestamp)"
];

// Contract addresses (update with actual deployed addresses)
const CONTRACT_ADDRESSES = {
  polygon: {
    invoiceRegistry: '0x...' // Update with actual deployed address
  },
  mumbai: {
    invoiceRegistry: '0x...' // Update with actual deployed address
  },
  ethereum: {
    invoiceRegistry: '0x...' // Update with actual deployed address
  }
};

// Network configurations
const NETWORK_CONFIGS = {
  polygon: {
    chainId: 137,
    rpcUrl: 'https://polygon-rpc.com',
    name: 'Polygon'
  },
  mumbai: {
    chainId: 80001,
    rpcUrl: 'https://rpc-mumbai.maticvigil.com',
    name: 'Mumbai Testnet'
  },
  ethereum: {
    chainId: 1,
    rpcUrl: 'https://mainnet.infura.io/v3/YOUR_INFURA_KEY',
    name: 'Ethereum'
  }
};

export interface BlockchainInvoice {
  invoiceHash: string;
  freelancerAddress: string;
  employerAddress: string;
  amount: string;
  tokenAddress: string;
  chainId: number;
  state: number;
  createdAt: number;
  updatedAt: number;
  rejectionReason: string;
  hasEscrow: boolean;
}

export interface ContractInteractionResult {
  success: boolean;
  message: string;
  transactionHash?: string;
  error?: string;
}

class BlockchainService {
  private provider: ethers.providers.Web3Provider | null = null;
  private signer: ethers.Signer | null = null;
  private contract: ethers.Contract | null = null;
  private currentNetwork: string = '';

  // Initialize blockchain connection
  async initialize(network: string = 'polygon'): Promise<{ success: boolean; message: string }> {
    try {
      if (typeof window.ethereum === 'undefined') {
        return { success: false, message: 'MetaMask is not installed' };
      }

      this.provider = new ethers.providers.Web3Provider(window.ethereum);
      this.signer = this.provider.getSigner();
      this.currentNetwork = network;

      // Get contract address for network
      const contractAddress = CONTRACT_ADDRESSES[network as keyof typeof CONTRACT_ADDRESSES]?.invoiceRegistry;
      if (!contractAddress) {
        return { success: false, message: `Contract not deployed on ${network}` };
      }

      // Initialize contract
      this.contract = new ethers.Contract(contractAddress, INVOICE_REGISTRY_ABI, this.signer);

      return { success: true, message: 'Blockchain service initialized successfully' };
    } catch (error: any) {
      console.error('Blockchain initialization error:', error);
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
      if (!this.contract) {
        return { success: false, message: 'Blockchain service not initialized' };
      }

      const invoiceHash = this.generateInvoiceHash(invoice);
      const amount = ethers.utils.parseEther(invoice.amount);
      const tokenAddress = invoice.token === 'ETH' ? ethers.constants.AddressZero : '0x...'; // Update with actual token addresses
      const chainId = NETWORK_CONFIGS[this.currentNetwork as keyof typeof NETWORK_CONFIGS]?.chainId || 137;

      // Check if invoice already exists
      const exists = await this.contract.invoiceExists(invoiceHash);
      if (exists) {
        return { success: false, message: 'Invoice already registered on blockchain' };
      }

      // Register invoice
      const tx = await this.contract.registerInvoice(
        invoiceHash,
        freelancerAddress,
        employerAddress,
        amount,
        tokenAddress,
        chainId
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
      if (!this.contract) {
        return { success: false, message: 'Blockchain service not initialized' };
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
      if (!this.contract) {
        return { success: false, message: 'Blockchain service not initialized' };
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
      if (!this.contract) {
        return { success: false, message: 'Blockchain service not initialized' };
      }

      const invoiceHash = this.generateInvoiceHash(invoice);
      const amount = ethers.utils.parseEther(invoice.amount);

      let tx;
      if (invoice.token === 'ETH') {
        // Native currency payment
        tx = await this.contract.depositPayment(invoiceHash, { value: amount });
      } else {
        // ERC-20 token payment (would need token approval first)
        tx = await this.contract.depositPayment(invoiceHash);
      }

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
      if (!this.contract) {
        return { success: false, message: 'Blockchain service not initialized' };
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

  // Get invoice from blockchain
  async getBlockchainInvoice(invoiceHash: string): Promise<{ success: boolean; invoice?: BlockchainInvoice; error?: string }> {
    try {
      if (!this.contract) {
        return { success: false, error: 'Blockchain service not initialized' };
      }

      const invoice = await this.contract.getInvoice(invoiceHash);
      
      const blockchainInvoice: BlockchainInvoice = {
        invoiceHash: invoice.invoiceHash,
        freelancerAddress: invoice.freelancerAddress,
        employerAddress: invoice.employerAddress,
        amount: ethers.utils.formatEther(invoice.amount),
        tokenAddress: invoice.tokenAddress,
        chainId: invoice.chainId.toNumber(),
        state: invoice.state,
        createdAt: invoice.createdAt.toNumber(),
        updatedAt: invoice.updatedAt.toNumber(),
        rejectionReason: invoice.rejectionReason,
        hasEscrow: invoice.hasEscrow
      };

      return { success: true, invoice: blockchainInvoice };
    } catch (error: any) {
      console.error('Get blockchain invoice error:', error);
      return { success: false, error: error.message || 'Failed to get invoice from blockchain' };
    }
  }

  // Get contract statistics
  async getContractStatistics(): Promise<{
    success: boolean;
    stats?: { totalInvoices: number; totalPaidInvoices: number; totalEscrowVolume: string };
    error?: string;
  }> {
    try {
      if (!this.contract) {
        return { success: false, error: 'Blockchain service not initialized' };
      }

      const stats = await this.contract.getStatistics();
      
      return {
        success: true,
        stats: {
          totalInvoices: stats[0].toNumber(),
          totalPaidInvoices: stats[1].toNumber(),
          totalEscrowVolume: ethers.utils.formatEther(stats[2])
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
    onInvoicePaid?: (event: any) => void;
    onPaymentDeposited?: (event: any) => void;
    onPaymentReleased?: (event: any) => void;
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
    if (callbacks.onInvoicePaid) {
      this.contract.on('InvoicePaid', callbacks.onInvoicePaid);
    }
    if (callbacks.onPaymentDeposited) {
      this.contract.on('PaymentDeposited', callbacks.onPaymentDeposited);
    }
    if (callbacks.onPaymentReleased) {
      this.contract.on('PaymentReleased', callbacks.onPaymentReleased);
    }
  }

  // Remove event listeners
  removeEventListeners(): void {
    if (this.contract) {
      this.contract.removeAllListeners();
    }
  }

  // Get current network info
  getCurrentNetwork(): { name: string; chainId: number } | null {
    const config = NETWORK_CONFIGS[this.currentNetwork as keyof typeof NETWORK_CONFIGS];
    return config ? { name: config.name, chainId: config.chainId } : null;
  }

  // Switch to specific network
  async switchNetwork(network: string): Promise<{ success: boolean; message: string }> {
    try {
      if (typeof window.ethereum === 'undefined') {
        return { success: false, message: 'MetaMask is not installed' };
      }

      const config = NETWORK_CONFIGS[network as keyof typeof NETWORK_CONFIGS];
      if (!config) {
        return { success: false, message: 'Unsupported network' };
      }

      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${config.chainId.toString(16)}` }],
      });

      // Reinitialize with new network
      await this.initialize(network);

      return { success: true, message: `Switched to ${config.name} successfully` };
    } catch (error: any) {
      console.error('Network switch error:', error);
      return { success: false, message: error.message || 'Failed to switch network' };
    }
  }
}

export const blockchainService = new BlockchainService();
export default blockchainService;