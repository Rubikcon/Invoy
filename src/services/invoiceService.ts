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
      const invoiceData: InvoiceApiData = {
        id: draftId,
        employer_email: data.employerEmail,
        freelancer_name: data.fullName,
        freelancer_email: data.email,
        wallet_address: data.walletAddress,
        network: data.network,
        token: data.token || 'ETH',
        amount: data.amount,
        role: data.role,
        description: data.description,
        description_html: this.convertMarkdownToHtml(data.description)
      };

      const response = await apiClient.request('/invoices/draft', {
        method: 'POST',
        body: JSON.stringify(invoiceData)
      });

      return response;
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
      const invoiceData: InvoiceApiData = {
        id: draftId,
        employer_email: data.employerEmail,
        freelancer_name: data.fullName,
        freelancer_email: data.email,
        wallet_address: data.walletAddress,
        network: data.network,
        token: data.token || 'ETH',
        amount: data.amount,
        role: data.role,
        description: data.description,
        description_html: this.convertMarkdownToHtml(data.description)
      };

      const response = await apiClient.request('/invoices/submit', {
        method: 'POST',
        body: JSON.stringify(invoiceData)
      });

      return response;
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
      const response = await apiClient.request('/invoices', {
        method: 'GET'
      });

      if (response.success && response.invoices) {
        const convertedInvoices: Invoice[] = response.invoices.map((invoice: any) => ({
          id: invoice.invoice_number,
          employerEmail: invoice.employer_email,
          amount: invoice.amount.toString(),
          status: invoice.status,
          freelancerName: invoice.freelancer_name,
          freelancerEmail: invoice.freelancer_email,
          walletAddress: invoice.wallet_address,
          network: invoice.network,
          token: invoice.token,
          role: invoice.role,
          description: invoice.description,
          createdAt: new Date(invoice.created_at),
          sentDate: invoice.sent_at ? new Date(invoice.sent_at) : undefined,
          paidDate: invoice.paid_at ? new Date(invoice.paid_at) : undefined
        }));

        return { success: true, invoices: convertedInvoices };
      }

      return { success: false, error: response.error || 'Failed to fetch invoices' };
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
}

export const invoiceService = new InvoiceService();
export default invoiceService;