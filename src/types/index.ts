export interface Invoice {
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
  createdAt: Date;
}

export interface CreateInvoiceData {
  fullName: string;
  email: string;
  walletAddress: string;
  network: string;
  role: string;
  description: string;
  amount: string;
  employerEmail: string;
}

export interface WalletInfo {
  address: string;
  network: string;
  isConnected: boolean;
}

export type View = 'landing' | 'dashboard' | 'employer-invoice';