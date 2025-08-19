import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useWallet } from '../../hooks/useWallet';
import { Invoice } from '../../types';
import { invoiceService } from '../../services/invoiceService';
import { LogOut, Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface EmployerDashboardProps {
  onViewInvoice: (invoice: Invoice) => void;
  onBack: () => void;
}

export const EmployerDashboard: React.FC<EmployerDashboardProps> = ({ onViewInvoice, onBack }) => {
  const { walletInfo, connectWallet, disconnectWallet } = useWallet();
  const { user } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const formatAddress = (address: string) => {
    if (!address) return 'Not connected';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  type InvoiceStatus = 'pending' | 'paid' | 'rejected';
  
  const normalizeStatus = (status: string = ''): InvoiceStatus => {
    const normalized = status.toString().toLowerCase().trim();
    return (['pending', 'paid', 'rejected'].includes(normalized) 
      ? normalized 
      : 'pending') as InvoiceStatus;
  };
  
  const pendingInvoices = invoices.filter(inv => normalizeStatus(inv.status) === 'pending').length;
  const paidInvoices = invoices.filter(inv => normalizeStatus(inv.status) === 'paid').length;
  const totalPaid = invoices
    .filter(inv => normalizeStatus(inv.status) === 'paid')
    .reduce((sum, inv) => {
      const amount = parseFloat(inv.amount) || 0;
      return sum + amount;
    }, 0);

  useEffect(() => {
    const fetchInvoices = async () => {
      if (!user?.email) return;

      setIsLoading(true);
      setError(null);

      try {
        const { data: backendInvoices, error: fetchError } = await invoiceService.getInvoicesByEmployerEmail(user.email);

        if (!fetchError && backendInvoices) {
          setInvoices(backendInvoices);
        } else {
          console.warn('Falling back to local storage for invoices');
          const localInvoices = invoices.filter(inv => inv.employerEmail.toLowerCase() === user.email?.toLowerCase());
          setInvoices(localInvoices);
        }
      } catch (err) {
        console.error('Error fetching invoices:', err);
        setError('Failed to load invoices. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvoices();
  }, [user?.email]);

  const handleWalletAction = async () => {
    if (walletInfo.isConnected) {
      disconnectWallet();
    } else {
      try {
        await connectWallet();
      } catch (error) {
        console.error('Error connecting wallet:', error);
      }
    }
  };

  const getStatusIcon = (status: string) => {
    const normalizedStatus = normalizeStatus(status);
    switch (normalizedStatus) {
      case 'pending':
        return <Clock className="w-4 h-4 mr-1" />;
      case 'paid':
        return <CheckCircle className="w-4 h-4 mr-1 text-green-500" />;
      case 'rejected':
        return <AlertCircle className="w-4 h-4 mr-1 text-red-500" />;
      default:
        return null;
    }
  };

  const formatCurrency = (amount: string | number) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num || 0);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
            <p className="font-bold">Error</p>
            <p>{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-2 text-sm bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                aria-label="Go back"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
              </button>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">Employer Dashboard</h1>
                <p className="text-gray-600 dark:text-gray-300">
                {invoices.length > 0 
                  ? `You have ${invoices.length} invoice${invoices.length !== 1 ? 's' : ''} to review`
                  : 'No invoices found'}
                </p>
              </div>
            </div>
            
            <div className="flex flex-col items-start md:items-end">
              <button
                onClick={handleWalletAction}
                className={`${
                  walletInfo.isConnected 
                    ? 'bg-gradient-to-r from-red-600 to-pink-600' 
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600'
                } text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200 flex items-center space-x-2`}
              >
                {walletInfo.isConnected ? (
                  <>
                    <LogOut size={18} />
                    <span>Disconnect Wallet</span>
                  </>
                ) : (
                  <>
                 
                    <span>Connect Wallet</span>
                  </>
                )}
              </button>
              <span className="text-xs text-gray-600 dark:text-gray-400 mt-1 font-mono">
                {walletInfo.isConnected ? formatAddress(walletInfo.address) : 'Not connected'}
              </span>
            </div>
          </div>
          
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
                  <p className="text-xl md:text-2xl font-bold text-blue-600">{formatCurrency(totalPaid)}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <div className="w-6 h-6 bg-blue-500 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Invoice List */}
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
            <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-600">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Invoice ID
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Freelancer
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Amount
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Status
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span className="sr-only">View</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900">
                {invoices.length > 0 ? (
                  invoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer" onClick={() => onViewInvoice(invoice)}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white sm:pl-6">
                        {invoice.id}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">
                        {invoice.freelancerName || 'N/A'}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">
                        {formatCurrency(invoice.amount || 0)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          normalizeStatus(invoice.status) === 'paid' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                          normalizeStatus(invoice.status) === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                          'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                          {getStatusIcon(invoice.status)}
                          {normalizeStatus(invoice.status).charAt(0).toUpperCase() + normalizeStatus(invoice.status).slice(1)}
                        </span>
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onViewInvoice(invoice);
                          }}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          View<span className="sr-only">, {invoice.id}</span>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-3 py-4 text-sm text-center text-gray-500 dark:text-gray-400">
                      No invoices found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}