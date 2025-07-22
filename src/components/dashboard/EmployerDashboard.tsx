import React from 'react';
import { User, Globe, Search, X, Mail, ExternalLink, CheckCircle, XCircle, Clock } from 'lucide-react';
import { LogOut } from 'lucide-react';
import { WalletInfo, Invoice } from '../../types';
import { invoiceStorage } from '../../services/invoiceStorage';

interface EmployerDashboardProps {
  walletInfo: WalletInfo;
  onDisconnectWallet: () => void;
  onViewInvoice?: (invoice: Invoice) => void;
}

export default function EmployerDashboard({ walletInfo, onDisconnectWallet, onViewInvoice }: EmployerDashboardProps) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [invoices, setInvoices] = React.useState<Invoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = React.useState<Invoice[]>([]);

  // Load all invoices that might be relevant to this employer
  React.useEffect(() => {
    // Load all invoices for employer to review
    // In production, this could be filtered by employer's email or other criteria
    const allInvoices = invoiceStorage.getAllGlobal();
    const convertedInvoices: Invoice[] = allInvoices.map(stored => ({
      ...stored,
      createdAt: new Date(stored.createdAt)
    }));
    setInvoices(convertedInvoices);
  }, []);

  // Filter invoices based on search term
  React.useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredInvoices(invoices);
    } else {
      const filtered = invoices.filter(invoice => 
        invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.employerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.freelancerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredInvoices(filtered);
    }
  }, [searchTerm, invoices]);

  const pendingInvoices = invoices.filter(inv => inv.status === 'Pending').length;
  const paidInvoices = invoices.filter(inv => inv.status === 'Paid').length;
  const totalPaid = invoices
    .filter(inv => inv.status === 'Paid')
    .reduce((sum, inv) => sum + parseFloat(inv.amount), 0);

  const formatAddress = (address: string): string => {
    if (!address) return '';
    return `${address.slice(0, 8)}...${address.slice(-6)}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
      case 'Approved':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'Paid':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'Rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending':
        return Clock;
      case 'Approved':
      case 'Paid':
        return CheckCircle;
      case 'Rejected':
        return XCircle;
      default:
        return Clock;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          {/* Title and Disconnect Button Row */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">Employer Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-300">Review and manage invoice payments</p>
            </div>
            
            {/* Disconnect Wallet Button */}
            <div className="flex flex-col items-start md:items-end">
              <button
                onClick={onDisconnectWallet}
                className="bg-gradient-to-r from-red-600 to-pink-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
              >
                <LogOut size={18} />
                <span>Disconnect Wallet</span>
              </button>
              <span className="text-xs text-gray-600 dark:text-gray-400 mt-1 font-mono">
                {formatAddress(walletInfo.address)}
              </span>
            </div>
          </div>
          
          {/* Wallet Info Card */}
          <div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 transition-colors duration-300">
              <div className="flex flex-col md:flex-row md:items-center justify-between space-y-2 md:space-y-0">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Connected Wallet</h3>
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center space-x-2">
                      <User size={14} className="text-gray-500" />
                      <code className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded font-mono text-gray-900 dark:text-gray-100">
                        {formatAddress(walletInfo.address)}
                      </code>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Globe size={14} className="text-blue-500" />
                      <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full text-xs font-medium">
                        {walletInfo.network}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 md:p-6 transition-colors duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Pending Reviews</p>
                <p className="text-xl md:text-2xl font-bold text-orange-600">{pendingInvoices}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <div className="w-6 h-6 bg-orange-500 rounded-full"></div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 md:p-6 transition-colors duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Paid Invoices</p>
                <p className="text-xl md:text-2xl font-bold text-green-600">{paidInvoices}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <div className="w-6 h-6 bg-green-500 rounded-full"></div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 md:p-6 transition-colors duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Paid</p>
                <p className="text-xl md:text-2xl font-bold text-blue-600">{totalPaid.toFixed(2)} ETH</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <div className="w-6 h-6 bg-blue-500 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8 flex justify-end">
          <div className="relative max-w-md w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search invoices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Search Results Info */}
        {searchTerm && (
          <div className="mb-4 text-sm text-gray-600 dark:text-gray-300">
            {filteredInvoices.length === 0 ? (
              <span>No invoices found for "{searchTerm}"</span>
            ) : (
              <span>
                Found {filteredInvoices.length} invoice{filteredInvoices.length !== 1 ? 's' : ''} for "{searchTerm}"
              </span>
            )}
          </div>
        )}

        {/* Invoice Table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors duration-300">
          <div className="px-4 md:px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">All Invoices</h2>
          </div>

          {filteredInvoices.length === 0 ? (
            <div className="p-8 md:p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Mail size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No invoices found</h3>
              <p className="text-gray-600 dark:text-gray-300">
                {searchTerm ? `No invoices match "${searchTerm}"` : 'No invoices have been created yet'}
              </p>
            </div>
          ) : (
            <>
              {/* Mobile Card View */}
              <div className="md:hidden">
                {filteredInvoices.map((invoice) => {
                  const StatusIcon = getStatusIcon(invoice.status);
                  return (
                    <div key={invoice.id} className="p-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                      <div className="flex justify-between items-start mb-2">
                        <code className="text-sm font-medium text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                          {invoice.id}
                        </code>
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(invoice.status)}`}>
                          <StatusIcon size={12} className="mr-1" />
                          {invoice.status}
                        </span>
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center space-x-2">
                          <User size={14} className="text-gray-400" />
                          <span className="text-gray-900 dark:text-white truncate">{invoice.freelancerName}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Mail size={14} className="text-gray-400" />
                          <span className="text-gray-600 dark:text-gray-300 truncate">{invoice.employerEmail}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-900 dark:text-white">{invoice.amount} ETH</span>
                          <button 
                            onClick={() => onViewInvoice?.(invoice)}
                            className="text-blue-600 hover:text-blue-800 transition-colors duration-200 flex items-center space-x-1"
                          >
                            <ExternalLink size={12} />
                            <span className="text-xs">Review</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Invoice ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Freelancer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Employer Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredInvoices.map((invoice) => {
                      const StatusIcon = getStatusIcon(invoice.status);
                      return (
                        <tr key={invoice.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <code className="text-sm font-medium text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                              {invoice.id}
                            </code>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <User size={16} className="text-gray-400" />
                              <div>
                                <div className="text-sm font-medium text-gray-900 dark:text-white">{invoice.freelancerName}</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">{invoice.role}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <Mail size={16} className="text-gray-400" />
                              <span className="text-sm text-gray-900 dark:text-white">{invoice.employerEmail}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {invoice.amount} ETH
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(invoice.status)}`}>
                              <StatusIcon size={12} className="mr-1" />
                              {invoice.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button 
                              onClick={() => onViewInvoice?.(invoice)}
                              className="text-blue-600 hover:text-blue-800 transition-colors duration-200 flex items-center space-x-1"
                            >
                              <ExternalLink size={14} />
                              <span className="text-sm">Review</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}