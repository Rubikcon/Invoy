// Global invoice storage service that works across different browsers/users
export interface StoredInvoice {
  id: string;
  employerEmail: string;
  amount: string;
  status: 'Pending' | 'Approved' | 'Paid' | 'Rejected' | 'Draft' | 'Cancelled';
  freelancerName: string;
  freelancerEmail: string;
  walletAddress: string;
  network: string;
  token: string;
  role: string;
  description: string;
  createdAt: string;
  sentDate?: string;
  paidDate?: string;
  rejectionReason?: string;
}

// Global storage key for all invoices (accessible to employers)
const GLOBAL_STORAGE_KEY = 'invoy_all_invoices';
// User-specific storage key for freelancer's own invoices
const USER_STORAGE_KEY = 'invoy_user_invoices';

export const invoiceStorage = {
  // Get all invoices globally (for employers accessing via links)
  getAllGlobal(): StoredInvoice[] {
    try {
      const stored = localStorage.getItem(GLOBAL_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading global invoices:', error);
      return [];
    }
  },

  // Get invoices for specific freelancer (private to them)
  getByWalletAddress(walletAddress: string): StoredInvoice[] {
    try {
      const userKey = `${USER_STORAGE_KEY}_${walletAddress.toLowerCase()}`;
      const stored = localStorage.getItem(userKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading user invoices:', error);
      return [];
    }
  },

  // Get invoice by ID (accessible globally for employer links)
  getById(id: string): StoredInvoice | null {
    const globalInvoices = this.getAllGlobal();
    return globalInvoices.find(inv => inv.id === id) || null;
  },

  // Save invoice (both globally and to user's private storage)
  save(invoice: StoredInvoice): void {
    try {
      // Save to global storage (for employer access)
      const globalInvoices = this.getAllGlobal();
      const existingGlobalIndex = globalInvoices.findIndex(inv => inv.id === invoice.id);
      
      if (existingGlobalIndex >= 0) {
        globalInvoices[existingGlobalIndex] = invoice;
      } else {
        globalInvoices.unshift(invoice);
      }
      localStorage.setItem(GLOBAL_STORAGE_KEY, JSON.stringify(globalInvoices));

      // Save to user's private storage
      const userKey = `${USER_STORAGE_KEY}_${invoice.walletAddress.toLowerCase()}`;
      const userInvoices = this.getByWalletAddress(invoice.walletAddress);
      const existingUserIndex = userInvoices.findIndex(inv => inv.id === invoice.id);
      
      if (existingUserIndex >= 0) {
        userInvoices[existingUserIndex] = invoice;
      } else {
        userInvoices.unshift(invoice);
      }
      localStorage.setItem(userKey, JSON.stringify(userInvoices));
      
    } catch (error) {
      console.error('Error saving invoice:', error);
    }
  },

  // Update invoice status (updates both global and user storage)
  updateStatus(id: string, status: StoredInvoice['status'], rejectionReason?: string): void {
    try {
      // Update in global storage
      const globalInvoices = this.getAllGlobal();
      const globalInvoice = globalInvoices.find(inv => inv.id === id);
      
      if (globalInvoice) {
        globalInvoice.status = status;
        if (rejectionReason) {
          globalInvoice.rejectionReason = rejectionReason;
        }
        localStorage.setItem(GLOBAL_STORAGE_KEY, JSON.stringify(globalInvoices));

        // Update in user's private storage
        const userKey = `${USER_STORAGE_KEY}_${globalInvoice.walletAddress.toLowerCase()}`;
        const userInvoices = this.getByWalletAddress(globalInvoice.walletAddress);
        const userInvoice = userInvoices.find(inv => inv.id === id);
        
        if (userInvoice) {
          userInvoice.status = status;
          if (rejectionReason) {
            userInvoice.rejectionReason = rejectionReason;
          }
          localStorage.setItem(userKey, JSON.stringify(userInvoices));
        }
      }
    } catch (error) {
      console.error('Error updating invoice status:', error);
    }
  },

  // Delete invoice (removes from both global and user storage)
  delete(id: string, walletAddress: string): void {
    try {
      // Remove from global storage
      const globalInvoices = this.getAllGlobal();
      const filteredGlobal = globalInvoices.filter(inv => inv.id !== id);
      localStorage.setItem(GLOBAL_STORAGE_KEY, JSON.stringify(filteredGlobal));

      // Remove from user's private storage
      const userKey = `${USER_STORAGE_KEY}_${walletAddress.toLowerCase()}`;
      const userInvoices = this.getByWalletAddress(walletAddress);
      const filteredUser = userInvoices.filter(inv => inv.id !== id);
      localStorage.setItem(userKey, JSON.stringify(filteredUser));
      
    } catch (error) {
      console.error('Error deleting invoice:', error);
    }
  }
};