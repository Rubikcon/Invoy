// Invoice storage service to persist invoices across sessions
export interface StoredInvoice {
  id: string;
  employerEmail: string;
  amount: string;
  status: 'Pending' | 'Approved' | 'Paid' | 'Rejected';
  freelancerName: string;
  freelancerEmail: string;
  walletAddress: string;
  network: string;
  role: string;
  description: string;
  createdAt: string;
  rejectionReason?: string;
}

const STORAGE_KEY = 'invoy_invoices';

export const invoiceStorage = {
  // Get all invoices
  getAll(): StoredInvoice[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading invoices:', error);
      return [];
    }
  },

  // Get invoice by ID
  getById(id: string): StoredInvoice | null {
    const invoices = this.getAll();
    return invoices.find(inv => inv.id === id) || null;
  },

  // Save invoice
  save(invoice: StoredInvoice): void {
    try {
      const invoices = this.getAll();
      const existingIndex = invoices.findIndex(inv => inv.id === invoice.id);
      
      if (existingIndex >= 0) {
        invoices[existingIndex] = invoice;
      } else {
        invoices.unshift(invoice);
      }
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(invoices));
    } catch (error) {
      console.error('Error saving invoice:', error);
    }
  },

  // Update invoice status
  updateStatus(id: string, status: StoredInvoice['status'], rejectionReason?: string): void {
    try {
      const invoices = this.getAll();
      const invoice = invoices.find(inv => inv.id === id);
      
      if (invoice) {
        invoice.status = status;
        if (rejectionReason) {
          invoice.rejectionReason = rejectionReason;
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(invoices));
      }
    } catch (error) {
      console.error('Error updating invoice status:', error);
    }
  },

  // Get invoices for a specific freelancer
  getByFreelancer(freelancerEmail: string): StoredInvoice[] {
    const invoices = this.getAll();
    return invoices.filter(inv => inv.walletAddress.toLowerCase() === freelancerEmail.toLowerCase());
  },

  // Get invoices for a specific wallet address
  getByWalletAddress(walletAddress: string): StoredInvoice[] {
    const invoices = this.getAll();
    return invoices.filter(inv => inv.walletAddress.toLowerCase() === walletAddress.toLowerCase());
  }
};