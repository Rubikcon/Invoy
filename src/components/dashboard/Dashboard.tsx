import React from 'react';
import { Plus, User, Globe, Search, X } from 'lucide-react';
import { LogOut } from 'lucide-react';
import { WalletInfo, Invoice } from '../../types';
import InvoiceTable from './InvoiceTable';
import { invoiceStorage } from '../../services/invoiceStorage';
import NotificationBell from '../ui/NotificationBell';
import NotificationBanner from '../ui/NotificationBanner';
import { useNotifications } from '../../hooks/useNotifications';


interface DashboardProps {
  walletInfo: WalletInfo;
  invoices: Invoice[];
  onCreateInvoice: () => void;
  onDisconnectWallet: () => void;
  onViewInvoice?: (invoice: Invoice) => void;
  onDeleteInvoice?: (invoiceId: string) => void;
}

export default function Dashboard({ walletInfo, invoices, onCreateInvoice, onDisconnectWallet, onViewInvoice, onDeleteInvoice }: DashboardProps) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filteredInvoices, setFilteredInvoices] = React.useState<Invoice[]>(invoices);
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState<string | null>(null);

  // Notifications
  const { notifications, unreadCount, refreshNotifications } = useNotifications(walletInfo.address);

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
  const totalAmount = invoices
    .filter(inv => inv.status === 'Paid')
    .reduce((sum, inv) => sum + parseFloat(inv.amount), 0);

  const formatAddress = (address: string): string => {
    if (!address) return '';
    return `${address.slice(0, 8)}...${address.slice(-6)}`;
  };

  const handleDeleteInvoice = (invoiceId: string) => {
    setShowDeleteConfirm(invoiceId);
  };

  const confirmDelete = () => {
    if (showDeleteConfirm && onDeleteInvoice) {
      onDeleteInvoice(showDeleteConfirm);
      setShowDeleteConfirm(null);
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
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-300">Manage your invoices and payments</p>
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
          
          {/* Notification Banner */}
          <NotificationBanner 
            userId={walletInfo.address}
            notifications={notifications}
            onNotificationsUpdate={refreshNotifications}
          />
          
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
                <div className="flex items-center space-x-3">
                  <NotificationBell 
                    userId={walletInfo.address}
                    notifications={notifications}
                    onNotificationsUpdate={refreshNotifications}
                  />
                  <div className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0"></div>
                </div>
              </div>
            </div>
          </div>
        </div>



        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 md:p-6 transition-colors duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Pending Invoices</p>
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
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Earned</p>
                <p className="text-xl md:text-2xl font-bold text-blue-600">{totalAmount.toFixed(2)} ETH</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <div className="w-6 h-6 bg-blue-500 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="mb-8 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
          {/* Create Invoice Button */}
          <div>
            <button
              onClick={onCreateInvoice}
              className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <Plus size={20} />
              <span>Create New Invoice</span>
            </button>
          </div>

          {/* Search Bar */}
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
        <InvoiceTable 
          invoices={filteredInvoices} 
          onViewInvoice={onViewInvoice} 
          onDeleteInvoice={handleDeleteInvoice}
        />

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4">
              <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={() => setShowDeleteConfirm(null)}></div>
              
              <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-6 transition-colors duration-300">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Delete Invoice</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Are you sure you want to delete invoice <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{showDeleteConfirm}</code>? This action cannot be undone.
                </p>
                
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowDeleteConfirm(null)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors duration-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}