export type InvoiceStatus = 'Draft' | 'Sent' | 'Pending' | 'Approved' | 'Paid' | 'Rejected' | 'Cancelled';

export interface Invoice {
  id: string;
  employerEmail: string;
  amount: string;
  status: InvoiceStatus;
  freelancerName: string;
  freelancerEmail: string;
  walletAddress: string;
  network: string;
  token: string;
  role: string;
  description: string;
  createdAt: Date;
  sentDate?: Date;
  paidDate?: Date;
}

export interface CreateInvoiceData {
  fullName: string;
  email: string;
  walletAddress: string;
  network: string;
  token: string;
  role: string;
  description: string;
  amount: string;
  employerEmail: string;
  descriptionHtml?: string;
}

export interface WalletInfo {
  address: string;
  network: string;
  isConnected: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'freelancer' | 'employer';
  avatar?: string;
  createdAt: Date;
  lastLoginAt?: Date;
  isEmailVerified: boolean;
  walletAddress?: string;
  profile?: UserProfile;
  preferences?: UserPreferences;
  wallets?: UserWallet[];
}

export interface UserProfile {
  id: string;
  userId: string;
  bio: string;
  location: string;
  website: string;
  timezone: string;
  profileVisibility: 'public' | 'private' | 'contacts';
  createdAt: Date;
  updatedAt: Date;
}

export interface UserWallet {
  id: string;
  userId: string;
  walletAddress: string;
  network: string;
  isPrimary: boolean;
  isVerified: boolean;
  consentGiven: boolean;
  consentDate?: Date;
  verificationSignature?: string;
  verificationMessage?: string;
  verificationDate?: Date;
  label: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPreferences {
  id: string;
  userId: string;
  preferredNetwork: string;
  preferredCurrency: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  invoiceNotifications: boolean;
  paymentNotifications: boolean;
  marketingEmails: boolean;
  securityAlerts: boolean;
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  dateFormat: string;
  currencyDisplay: 'symbol' | 'code' | 'name';
  createdAt: Date;
  updatedAt: Date;
}

export interface WalletAuthChallenge {
  id: string;
  walletAddress: string;
  challengeMessage: string;
  nonce: string;
  expiresAt: Date;
  isUsed: boolean;
  usedAt?: Date;
  createdAt: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'freelancer' | 'employer';
}

export type View = 'landing' | 'dashboard' | 'employer-dashboard' | 'employer-invoice' | 'about-us' | 'freelancer-invoice-view';

export type UserType = 'freelancer' | 'employer';

export interface Notification {
  id: string;
  type: 'invoice_approved' | 'invoice_rejected' | 'invoice_paid' | 'new_invoice' | 'payment_received' | 'system';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  invoiceId?: string;
  priority: 'low' | 'medium' | 'high';
}