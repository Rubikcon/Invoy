// Invoice service for managing invoices with backend integration
import { Invoice, CreateInvoiceData } from '../types';
import apiClient from './apiClient';
import CryptoJS from 'crypto-js';

export interface InvoiceApiData {
  id?: string;
  employer_email: string;
  freelancer_name: string;
  freelancer_email: string;
  wallet_address: string;
  network: string;
  token: string;
  amount: string;
  role: string;
  description: string;
  description_html?: string;
}

export interface InvoiceResponse {
  success: boolean;
  message: string;
  invoice?: any;
  error?: string;
}

class InvoiceService {
  // Create or update invoice draft
  async saveDraft(data: CreateInvoiceData, draftId?: string): Promise<InvoiceResponse> {
    try {
      // For now, use local storage until backend is properly connected
      const invoice = {
        id: draftId || `DRAFT-${Date.now()}`,
        ...data,
        status: 'Draft' as const,
        createdAt: new Date(),
        token: data.token || 'ETH'
      };
      
      // Store locally
      const drafts = JSON.parse(localStorage.getItem('invoy_drafts') || '[]');
      const existingIndex = drafts.findIndex((d: any) => d.id === invoice.id);
      
      if (existingIndex >= 0) {
        drafts[existingIndex] = invoice;
      } else {
        drafts.push(invoice);
      }
      
      localStorage.setItem('invoy_drafts', JSON.stringify(drafts));
      
      return {
        success: true,
        message: 'Draft saved successfully',
        invoice
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Failed to save invoice draft',
        error: error.message
      };
    }
  }

  // Submit complete invoice
  async submitInvoice(data: CreateInvoiceData, draftId?: string): Promise<InvoiceResponse> {
    try {
      // Generate secure invoice ID
      const invoiceId = this.generateSecureInvoiceId();
      
      const invoice = {
        id: invoiceId,
        ...data,
        status: 'Sent' as const,
        createdAt: new Date(),
        sentDate: new Date(),
        token: data.token || 'ETH'
      };
      
      // Store in global storage for employer access
      const allInvoices = JSON.parse(localStorage.getItem('invoy_all_invoices') || '[]');
      allInvoices.unshift(invoice);
      localStorage.setItem('invoy_all_invoices', JSON.stringify(allInvoices));
      
      // Remove from drafts if it was a draft
      if (draftId) {
        const drafts = JSON.parse(localStorage.getItem('invoy_drafts') || '[]');
        const filteredDrafts = drafts.filter((d: any) => d.id !== draftId);
        localStorage.setItem('invoy_drafts', JSON.stringify(filteredDrafts));
      }
      
      return {
        success: true,
        message: 'Invoice submitted successfully',
        invoice: {
          invoice_number: invoiceId,
          employer_email: data.employerEmail,
          freelancer_name: data.fullName,
          freelancer_email: data.email,
          wallet_address: data.walletAddress,
          network: data.network,
          token: data.token || 'ETH',
          amount: parseFloat(data.amount),
          role: data.role,
          description: data.description,
          status: 'Sent',
          created_at: new Date().toISOString()
        }
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Failed to submit invoice',
        error: error.message
      };
    }
  }

  // Get user's invoices
  async getUserInvoices(): Promise<{ success: boolean; invoices?: Invoice[]; error?: string }> {
    try {
      // Get from local storage for now
      const allInvoices = JSON.parse(localStorage.getItem('invoy_all_invoices') || '[]');
      const drafts = JSON.parse(localStorage.getItem('invoy_drafts') || '[]');
      
      // Combine invoices and drafts
      const combined = [...allInvoices, ...drafts];
      
      const convertedInvoices: Invoice[] = combined.map((invoice: any) => ({
        id: invoice.id,
        employerEmail: invoice.employerEmail,
        amount: invoice.amount.toString(),
        status: invoice.status,
        freelancerName: invoice.fullName || invoice.freelancerName,
        freelancerEmail: invoice.email || invoice.freelancerEmail,
        walletAddress: invoice.walletAddress,
        network: invoice.network,
        token: invoice.token,
        role: invoice.role,
        description: invoice.description,
        createdAt: new Date(invoice.createdAt),
        sentDate: invoice.sentDate ? new Date(invoice.sentDate) : undefined,
        paidDate: invoice.paidDate ? new Date(invoice.paidDate) : undefined
      }));

      return { success: true, invoices: convertedInvoices };
    } catch (error: any) {
      return { success: false, error: error.message || 'Failed to fetch invoices' };
    }
  }

  // Get specific invoice by ID
  async getInvoiceById(invoiceId: string): Promise<{ success: boolean; invoice?: Invoice; error?: string }> {
    try {
      const response = await apiClient.request(`/invoices/${invoiceId}`, {
        method: 'GET'
      });

      if (response.success && response.invoice) {
        const invoice: Invoice = {
          id: response.invoice.invoice_number,
          employerEmail: response.invoice.employer_email,
          amount: response.invoice.amount.toString(),
          status: response.invoice.status,
          freelancerName: response.invoice.freelancer_name,
          freelancerEmail: response.invoice.freelancer_email,
          walletAddress: response.invoice.wallet_address,
          network: response.invoice.network,
          token: response.invoice.token,
          role: response.invoice.role,
          description: response.invoice.description,
          createdAt: new Date(response.invoice.created_at),
          sentDate: response.invoice.sent_at ? new Date(response.invoice.sent_at) : undefined,
          paidDate: response.invoice.paid_at ? new Date(response.invoice.paid_at) : undefined
        };

        return { success: true, invoice };
      }

      return { success: false, error: response.error || 'Invoice not found' };
    } catch (error: any) {
      return { success: false, error: error.message || 'Failed to fetch invoice' };
    }
  }

  // Update invoice status
  async updateInvoiceStatus(
    invoiceId: string, 
    status: string, 
    rejectionReason?: string
  ): Promise<InvoiceResponse> {
    try {
      const response = await apiClient.request(`/invoices/${invoiceId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status, rejection_reason: rejectionReason })
      });

      return response;
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Failed to update invoice status',
        error: error.message
      };
    }
  }

  // Delete invoice
  async deleteInvoice(invoiceId: string): Promise<InvoiceResponse> {
    try {
      const response = await apiClient.request(`/invoices/${invoiceId}`, {
        method: 'DELETE'
      });

      return response;
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Failed to delete invoice',
        error: error.message
      };
    }
  }

  // Validate network compatibility
  validateNetworkCompatibility(selectedNetwork: string, walletNetwork: string): {
    isCompatible: boolean;
    warning?: string;
  } {
    const normalizedSelected = selectedNetwork.toLowerCase();
    const normalizedWallet = walletNetwork.toLowerCase();

    if (normalizedSelected !== normalizedWallet) {
      return {
        isCompatible: false,
        warning: `Network mismatch: Your wallet is connected to ${walletNetwork}, but you selected ${selectedNetwork}. Please switch networks in your wallet or select the correct network.`
      };
    }

    return { isCompatible: true };
  }

  // Generate invoice hash for verification
  generateInvoiceHash(data: CreateInvoiceData): string {
    const canonicalData = {
      employer_email: data.employerEmail.toLowerCase(),
      freelancer_name: data.fullName.trim(),
      freelancer_email: data.email.toLowerCase(),
      wallet_address: data.walletAddress.toLowerCase(),
      network: data.network.toLowerCase(),
      token: (data.token || 'ETH').toUpperCase(),
      amount: parseFloat(data.amount).toFixed(8),
      role: data.role.trim(),
      description: data.description.trim()
    };
    
    const canonicalJson = JSON.stringify(canonicalData, Object.keys(canonicalData).sort());
    return CryptoJS.SHA256(canonicalJson).toString();
  }

  // Convert markdown to HTML (basic implementation)
  private convertMarkdownToHtml(markdown: string): string {
    return markdown
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/\n/g, '<br>');
  }

  // Generate cryptographically secure invoice ID
  private generateSecureInvoiceId(): string {
    const timestamp = Date.now().toString(36);
    const randomBytes = new Uint8Array(8);
    crypto.getRandomValues(randomBytes);
    const randomString = Array.from(randomBytes, byte => byte.toString(36)).join('');
    return `INV-${timestamp}-${randomString}`.toUpperCase();
  }
}

export const invoiceService = new InvoiceService();
export default invoiceService;