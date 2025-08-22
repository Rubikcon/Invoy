// Invoice service for managing invoices with Supabase backend
import { SupabaseClient } from '@supabase/supabase-js';
import { Invoice, CreateInvoiceData, InvoiceStatus } from '../types';
import { supabase } from './supabaseClient';

// Extended interface for database invoice data
interface DatabaseInvoice {
  id?: string;
  invoice_number: string;
  user_id: string;
  employer_email: string;
  freelancer_name: string;
  freelancer_email: string;
  wallet_address: string;
  network: string;
  token: string;
  amount: number;
  role: string;
  description: string;
  description_html?: string;
  status: InvoiceStatus;
  data_hash: string;
  rejection_reason?: string;
  sent_at?: string | null;
  paid_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface InvoiceResponse {
  success: boolean;
  message: string;
  invoice?: Invoice | null;
  error?: string;
}

class InvoiceService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = supabase;
  }

  // Generate a unique invoice number
  private generateInvoiceNumber(): string {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(1000 + Math.random() * 9000);
    return `INV-${timestamp}${random}`;
  }

  // Generate data hash for invoice integrity
  private generateDataHash(data: any): string {
    // Create a canonical JSON string with sorted keys
    const canonicalJson = JSON.stringify(data, Object.keys(data).sort());
    
    // Simple hash function (not cryptographically secure, but good enough for our needs)
    let hash = 0;
    for (let i = 0; i < canonicalJson.length; i++) {
      const char = canonicalJson.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString(16);
  }

  // Map database invoice to application invoice format
  private mapDbInvoiceToAppInvoice(dbInvoice: DatabaseInvoice): Invoice {
    // Ensure the status is one of the valid InvoiceStatus values
    const validStatuses: InvoiceStatus[] = ['Draft', 'Sent', 'Pending', 'Approved', 'Paid', 'Rejected', 'Cancelled'];
    const status = validStatuses.includes(dbInvoice.status as InvoiceStatus) 
      ? dbInvoice.status as InvoiceStatus 
      : 'Draft';
      
    return {
      id: dbInvoice.id || '',
      employerEmail: dbInvoice.employer_email,
      amount: dbInvoice.amount.toString(),
      status,
      freelancerName: dbInvoice.freelancer_name,
      freelancerEmail: dbInvoice.freelancer_email,
      walletAddress: dbInvoice.wallet_address,
      network: dbInvoice.network,
      token: dbInvoice.token,
      role: dbInvoice.role,
      description: dbInvoice.description,
      createdAt: new Date(dbInvoice.created_at),
      sentDate: dbInvoice.sent_at ? new Date(dbInvoice.sent_at) : undefined,
      paidDate: dbInvoice.paid_at ? new Date(dbInvoice.paid_at) : undefined,
    };
  }

  // Map app invoice data to database format
  private mapAppInvoiceToDbInvoice(data: CreateInvoiceData, userId: string, status: InvoiceStatus = 'Draft'): Omit<DatabaseInvoice, 'id' | 'created_at' | 'updated_at'> {
    // Ensure required fields have default values
    const amount = parseFloat(data.amount) || 0;
    const token = data.token || 'ETH';
    const description = data.description || '';
    
    return {
      invoice_number: this.generateInvoiceNumber(),
      user_id: userId,
      employer_email: data.employerEmail || '',
      freelancer_name: data.fullName || 'Unknown User',
      freelancer_email: data.email || '',
      wallet_address: data.walletAddress || '',
      network: data.network || 'ethereum', // Default to ethereum if not specified
      token: token,
      amount: amount,
      role: data.role || 'freelancer', // Default role
      description: description,
      description_html: data.descriptionHtml || description, // Fallback to plain text if HTML not provided
      status: status,
      data_hash: this.generateDataHash(data),
      sent_at: status === 'Sent' ? new Date().toISOString() : null,
      paid_at: null,
    };
  }

  // Create or update invoice draft
  async saveDraft(data: CreateInvoiceData, draftId?: string): Promise<InvoiceResponse> {
    try {
      // Get current user
      const { data: { user }, error: userError } = await this.supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error(userError?.message || 'User not authenticated');
      }

      const now = new Date().toISOString();
      const invoiceData = this.mapAppInvoiceToDbInvoice(data, user.id, 'Draft');
      
      const invoiceToSave: Partial<DatabaseInvoice> = {
        ...invoiceData,
        invoice_number: invoiceData.invoice_number,
        user_id: user.id,
        status: 'Draft',
        created_at: draftId ? undefined : now,
        updated_at: now,
        data_hash: this.generateDataHash(data)
      };

      let result;
      if (draftId) {
        const { data, error } = await this.supabase
          .from('invoices')
          .update(invoiceToSave)
          .eq('id', draftId)
          .eq('user_id', user.id)
          .select()
          .single();
        
        if (error) throw error;
        result = data;
      } else {
        const { data, error } = await this.supabase
          .from('invoices')
          .insert([{ ...invoiceToSave, created_at: now }])
          .select()
          .single();
        
        if (error) throw error;
        result = data;
      }

      return {
        success: true,
        message: draftId ? 'Draft updated successfully' : 'Draft created successfully',
        invoice: result ? this.mapDbInvoiceToAppInvoice(result) : undefined
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to save draft',
        error: error.message || 'Unknown error'
      };
    }
  }


  // Submit complete invoice
  async submitInvoice(data: CreateInvoiceData, userId: string, draftId?: string): Promise<InvoiceResponse> {
    try {
      // Generate invoice ID
      const invoiceId = this.generateInvoiceNumber();
      
      // Create invoice object
      const invoice: Invoice = {
        id: invoiceId,
        employerEmail: data.employerEmail,
        amount: data.amount,
        status: 'Sent',
        freelancerName: data.fullName,
        freelancerEmail: data.email,
        walletAddress: data.walletAddress,
        network: data.network,
        token: data.token,
        role: data.role,
        description: data.description,
        createdAt: new Date(),
        sentDate: new Date()
      };

      // Store invoice locally (since Supabase isn't configured)
      const { invoiceStorage } = await import('./invoiceStorage');
      const storedInvoice = {
        id: invoice.id,
        employerEmail: invoice.employerEmail,
        amount: invoice.amount,
        status: invoice.status,
        freelancerName: invoice.freelancerName,
        freelancerEmail: invoice.freelancerEmail,
        walletAddress: invoice.walletAddress,
        network: invoice.network,
        token: invoice.token,
        role: invoice.role,
        description: invoice.description,
        createdAt: invoice.createdAt.toISOString(),
        sentDate: invoice.sentDate?.toISOString()
      };
      
      invoiceStorage.save(storedInvoice);

      // Send email notification to employer
      const invoiceLink = `${window.location.origin}/invoice/${invoice.id}`;
      await this.sendInvoiceNotification({
        employerEmail: data.employerEmail,
        freelancerName: data.fullName,
        freelancerEmail: data.email,
        invoiceId: invoice.id,
        amount: data.amount,
        network: data.network,
        description: data.description,
        invoiceLink
      });

      return {
        success: true,
        message: 'Invoice submitted successfully',
        invoice
      };
    } catch (error: any) {
      console.error('Error submitting invoice:', error);
      return {
        success: false,
        message: 'Failed to submit invoice',
        error: error.message || 'Unknown error'
      };
    }
  }

  // Send invoice notification to employer
  private async sendInvoiceNotification(emailData: {
    employerEmail: string;
    freelancerName: string;
    freelancerEmail: string;
    invoiceId: string;
    amount: string;
    network: string;
    description: string;
    invoiceLink: string;
  }): Promise<{ success: boolean; message?: string }> {
    try {
      // Import email service dynamically to avoid circular dependencies
      const { sendInvoiceEmail } = await import('./emailService');
      const { notificationService } = await import('./notificationService');
      
      // Send email to employer
      const emailResult = await sendInvoiceEmail(emailData);
      
      if (!emailResult.success) {
        console.warn('Failed to send email notification:', emailResult.message);
      }

      // Check if employer is an existing user
      const { data: employerUser, error: employerLookupError } = await this.supabase
        .from('users')
        .select('id')
        .eq('email', emailData.employerEmail.toLowerCase())
        .maybeSingle();

      if (employerLookupError) {
        console.warn('Error looking up employer user:', employerLookupError);
      }

      if (employerUser) {
        const employerId = employerUser.id;
        // Create notification for employer
        notificationService.createNewInvoiceNotification(
          emailData.invoiceId,
          employerId,
          emailData.freelancerName,
          emailData.amount
        );
      }

      return { success: true };
    } catch (error) {
      console.error('Error sending invoice notification:', error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Failed to send notification' 
      };
    }
  }

  // Get user's invoices
  async getUserInvoices(): Promise<{ success: boolean; invoices?: Invoice[]; error?: string }> {
    try {
      // Get current user from auth service
      const { authService } = await import('./authService');
      const currentUser = authService.getCurrentUser();
      
      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      // Get invoices from local storage
      const { invoiceStorage } = await import('./invoiceStorage');
      const storedInvoices = invoiceStorage.getByWalletAddress(currentUser.walletAddress || '');
      
      const invoices = storedInvoices.map(stored => ({
        id: stored.id,
        employerEmail: stored.employerEmail,
        amount: stored.amount,
        status: stored.status,
        freelancerName: stored.freelancerName,
        freelancerEmail: stored.freelancerEmail,
        walletAddress: stored.walletAddress,
        network: stored.network,
        token: stored.token,
        role: stored.role,
        description: stored.description,
        createdAt: new Date(stored.createdAt),
        sentDate: stored.sentDate ? new Date(stored.sentDate) : undefined,
        paidDate: stored.paidDate ? new Date(stored.paidDate) : undefined
      }));
      
      return { success: true, invoices };
    } catch (error: any) {
      console.error('Error fetching user invoices:', error);
      return { success: false, error: error.message || 'Failed to fetch invoices' };
    }
  }

  // Get invoices by employer email
  async getInvoicesByEmployerEmail(email: string): Promise<{ data: Invoice[] | null; error: any }> {
    try {
      // Get invoices from local storage
      const { invoiceStorage } = await import('./invoiceStorage');
      const allInvoices = invoiceStorage.getAllGlobal();
      
      const filteredInvoices = allInvoices.filter(invoice => 
        invoice.employerEmail.toLowerCase() === email.toLowerCase()
      );
      
      const invoices = filteredInvoices.map(stored => ({
        id: stored.id,
        employerEmail: stored.employerEmail,
        amount: stored.amount,
        status: stored.status,
        freelancerName: stored.freelancerName,
        freelancerEmail: stored.freelancerEmail,
        walletAddress: stored.walletAddress,
        network: stored.network,
        token: stored.token,
        role: stored.role,
        description: stored.description,
        createdAt: new Date(stored.createdAt),
        sentDate: stored.sentDate ? new Date(stored.sentDate) : undefined,
        paidDate: stored.paidDate ? new Date(stored.paidDate) : undefined
      }));
      
      return { data: invoices, error: null };
    } catch (error) {
      console.error('Error fetching employer invoices:', error);
      return { data: null, error };
    }
  }

  // Get invoice by ID
  async getInvoiceById(invoiceId: string): Promise<{ success: boolean; invoice?: Invoice; error?: string }> {
    try {
      // Get invoice from local storage
      const { invoiceStorage } = await import('./invoiceStorage');
      const storedInvoice = invoiceStorage.getById(invoiceId);
      
      if (storedInvoice) {
        const invoice: Invoice = {
          id: storedInvoice.id,
          employerEmail: storedInvoice.employerEmail,
          amount: storedInvoice.amount,
          status: storedInvoice.status,
          freelancerName: storedInvoice.freelancerName,
          freelancerEmail: storedInvoice.freelancerEmail,
          walletAddress: storedInvoice.walletAddress,
          network: storedInvoice.network,
          token: storedInvoice.token,
          role: storedInvoice.role,
          description: storedInvoice.description,
          createdAt: new Date(storedInvoice.createdAt),
          sentDate: storedInvoice.sentDate ? new Date(storedInvoice.sentDate) : undefined,
          paidDate: storedInvoice.paidDate ? new Date(storedInvoice.paidDate) : undefined
        };
        
        return { 
          success: true, 
          invoice 
        };
      }

      return { 
        success: false, 
        error: 'Invoice not found' 
      };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.message || 'Failed to fetch invoice' 
      };
    }
  }

  // Update invoice status (for employers)
  async updateInvoiceStatus(
    invoiceId: string,
    status: 'Approved' | 'Rejected' | 'Paid',
    rejectionReason?: string
  ): Promise<{ success: boolean; message: string; invoice?: Invoice; error?: string }> {
    try {
      // Get current user from auth service
      const { authService } = await import('./authService');
      const currentUser = authService.getCurrentUser();
      
      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      // Update invoice status in local storage
      const { invoiceStorage } = await import('./invoiceStorage');
      invoiceStorage.updateStatus(invoiceId, status, rejectionReason);
      
      // Get updated invoice
      const updatedStoredInvoice = invoiceStorage.getById(invoiceId);
      
      if (!updatedStoredInvoice) {
        throw new Error('Invoice not found');
      }
      
      const updatedInvoice: Invoice = {
        id: updatedStoredInvoice.id,
        employerEmail: updatedStoredInvoice.employerEmail,
        amount: updatedStoredInvoice.amount,
        status: updatedStoredInvoice.status,
        freelancerName: updatedStoredInvoice.freelancerName,
        freelancerEmail: updatedStoredInvoice.freelancerEmail,
        walletAddress: updatedStoredInvoice.walletAddress,
        network: updatedStoredInvoice.network,
        token: updatedStoredInvoice.token,
        role: updatedStoredInvoice.role,
        description: updatedStoredInvoice.description,
        createdAt: new Date(updatedStoredInvoice.createdAt),
        sentDate: updatedStoredInvoice.sentDate ? new Date(updatedStoredInvoice.sentDate) : undefined,
        paidDate: updatedStoredInvoice.paidDate ? new Date(updatedStoredInvoice.paidDate) : undefined
      };
      
      return {
        success: true,
        message: 'Invoice status updated successfully',
        invoice: updatedInvoice
      };
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
      // Get current user from auth service
      const { authService } = await import('./authService');
      const currentUser = authService.getCurrentUser();
      
      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      // Get invoice from local storage to verify ownership
      const { invoiceStorage } = await import('./invoiceStorage');
      const invoice = invoiceStorage.getById(invoiceId);
      
      if (!invoice) {
        throw new Error('Invoice not found');
      }
      
      // Only the creator can delete the invoice (check by wallet address)
      if (invoice.walletAddress.toLowerCase() !== (currentUser.walletAddress || '').toLowerCase()) {
        throw new Error('Unauthorized to delete this invoice');
      }

      // Delete from local storage
      invoiceStorage.delete(invoiceId, invoice.walletAddress);
      
      return {
        success: true,
        message: 'Invoice deleted successfully'
      };
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


}

export const invoiceService = new InvoiceService();
export default invoiceService;