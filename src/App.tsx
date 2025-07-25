import React from 'react';
import { Routes, Route, useParams, useNavigate, useLocation } from 'react-router-dom';
import { View, WalletInfo, Invoice, CreateInvoiceData } from './types';
import { invoiceStorage, StoredInvoice } from './services/invoiceStorage';
import { notificationService } from './services/notificationService';
import { useDarkMode } from './hooks/useDarkMode';
import { useWallet } from './hooks/useWallet';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Hero from './components/landing/Hero';
import Features from './components/landing/Features';
import HowItWorks from './components/landing/HowItWorks';
import Testimonials from './components/landing/Testimonials';
import FAQ from './components/landing/FAQ';
import Dashboard from './components/dashboard/Dashboard';
import EmployerDashboard from './components/dashboard/EmployerDashboard';
import CreateInvoiceModal from './components/modals/CreateInvoiceModal';
import EmployerInvoice from './components/pages/EmployerInvoice';
import AboutUs from './components/pages/AboutUs';
import FreelancerInvoiceView from './components/pages/FreelancerInvoiceView';
import EmailSetupModal from './components/modals/EmailSetupModal';
import { sendInvoiceEmail, copyInvoiceDetails } from './services/emailService';
import { sendStatusUpdateEmail } from './services/emailService';

// Component to handle employer invoice routes
function EmployerInvoiceRoute() {
  const { invoiceId } = useParams<{ invoiceId: string }>();
  const navigate = useNavigate();
  const [invoice, setInvoice] = React.useState<Invoice | null>(null);
  const [loading, setLoading] = React.useState(true);
  
  // Load invoice from storage
  React.useEffect(() => {
    if (invoiceId) {
      const storedInvoice = invoiceStorage.getById(invoiceId);
      if (storedInvoice) {
        // Convert stored invoice to Invoice type
        const convertedInvoice: Invoice = {
          ...storedInvoice,
          createdAt: new Date(storedInvoice.createdAt)
        };
        setInvoice(convertedInvoice);
      }
      setLoading(false);
    }
  }, [invoiceId]);
  
  const handleApprove = async (invoice: Invoice) => {
    if (!invoice) return;
    
    // Update invoice status in storage
    invoiceStorage.updateStatus(invoice.id, 'Approved');
    
    // Update local state to show success
    setInvoice(prev => prev ? { ...prev, status: 'Approved' } : null);
  };
  
  const handleReject = async (invoice: Invoice, reason: string) => {
    if (!invoice) return;
    
    // Update invoice status in storage
    invoiceStorage.updateStatus(invoice.id, 'Rejected', reason);
    
    // Update local state to show rejection
    setInvoice(prev => prev ? { ...prev, status: 'Rejected' } : null);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading invoice...</p>
        </div>
      </div>
    );
  }
  
  if (!invoice) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Invoice Not Found</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">The invoice you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
          >
            Go to Homepage
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <EmployerInvoice
      invoice={invoice}
      onApprove={handleApprove}
      onReject={handleReject}
      onBack={() => navigate('/')}
    />
  );
}

function App() {
  const location = useLocation();
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { walletInfo, isConnecting, connectionError, connectWallet, disconnectWallet } = useWallet();
  const [currentView, setCurrentView] = React.useState<View>('landing');
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [isEmailSetupModalOpen, setIsEmailSetupModalOpen] = React.useState(false);
  const [pendingEmailData, setPendingEmailData] = React.useState<any>(null);
  const [emailStatus, setEmailStatus] = React.useState<string>('');
  const [invoices, setInvoices] = React.useState<Invoice[]>([]);
  const [selectedInvoice, setSelectedInvoice] = React.useState<Invoice | null>(null);
  const [userType, setUserType] = React.useState<'freelancer' | 'employer'>('freelancer');

  // Load invoices from storage on component mount
  React.useEffect(() => {
    if (walletInfo.isConnected && walletInfo.address && userType === 'freelancer') {
      const storedInvoices = invoiceStorage.getByWalletAddress(walletInfo.address);
      const convertedInvoices: Invoice[] = storedInvoices.map(stored => ({
        ...stored,
        createdAt: new Date(stored.createdAt),
        sentDate: stored.sentDate ? new Date(stored.sentDate) : undefined,
        paidDate: stored.paidDate ? new Date(stored.paidDate) : undefined
      }));
      setInvoices(convertedInvoices);
    }
  }, [walletInfo.isConnected, walletInfo.address, userType]);

  // Check if we're on an invoice route
  const isInvoiceRoute = location.pathname.startsWith('/invoice/');

  const handleCreateInvoice = () => {
    if (!walletInfo.isConnected && !isConnecting) {
      connectWallet();
      return;
    }
    setIsCreateModalOpen(true);
  };

  const handleConnectWallet = async () => {
    setUserType('freelancer');
    await connectWallet();
  };

  const handleEmployerLogin = async () => {
    setUserType('employer');
    // For employers, we redirect to a separate employer portal
    // In a real app, this would be a separate authentication system
    setCurrentView('employer-dashboard');
  };

  const handleDisconnectWallet = () => {
    disconnectWallet();
    setUserType('freelancer');
    setCurrentView('landing');
  };

  // Auto-redirect to dashboard when wallet connects successfully
  React.useEffect(() => {
    if (walletInfo.isConnected && userType === 'freelancer') {
      setCurrentView('dashboard');
    }
  }, [walletInfo.isConnected, userType]);

  const handleSubmitInvoice = (data: CreateInvoiceData) => {
    // Generate a more unique invoice ID
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
    const newInvoice: Invoice = {
      id: `INV-${timestamp}-${randomSuffix}`,
      employerEmail: data.employerEmail,
      amount: data.amount,
      status: 'Pending',
      freelancerName: data.fullName,
      freelancerEmail: data.email,
      walletAddress: data.walletAddress,
      network: data.network,
      token: data.token || 'ETH',
      role: data.role,
      description: data.description,
      createdAt: new Date(),
      sentDate: new Date(),
      paidDate: undefined
    };
    
    // Save to storage
    const storedInvoice: StoredInvoice = {
      ...newInvoice,
      createdAt: newInvoice.createdAt.toISOString(),
      sentDate: newInvoice.sentDate?.toISOString(),
      paidDate: newInvoice.paidDate?.toISOString()
    };
    invoiceStorage.save(storedInvoice);
    
    // Create notification for employer (using a generic employer ID)
    const employerId = 'employer_' + data.employerEmail.toLowerCase().replace(/[^a-z0-9]/g, '_');
    notificationService.createNewInvoiceNotification(
      newInvoice.id,
      employerId,
      data.fullName,
      data.amount
    );
    
    setInvoices(prev => [newInvoice, ...prev]);
    
    // Prepare email data and show email setup modal
    const emailData = {
      employerEmail: data.employerEmail,
      freelancerName: data.fullName,
      freelancerEmail: data.email,
      invoiceId: newInvoice.id,
      amount: data.amount,
      network: data.network,
      description: data.description,
      invoiceLink: `${window.location.origin}/invoice/${newInvoice.id}`
    };
    
    setPendingEmailData(emailData);
    setIsEmailSetupModalOpen(true);
  };

  const handleSendEmail = async () => {
    if (pendingEmailData) {
      const result = await sendInvoiceEmail(pendingEmailData);
      setIsEmailSetupModalOpen(false);
      setPendingEmailData(null);
      
      if (result.success) {
        setEmailStatus(`✅ ${result.message}`);
        setTimeout(() => setEmailStatus(''), 5000);
      } else {
        setEmailStatus(`❌ ${result.message}`);
        setTimeout(() => setEmailStatus(''), 5000);
      }
    }
  };

  const handleCopyEmail = async () => {
    if (pendingEmailData) {
      const result = await copyInvoiceDetails(pendingEmailData);
      setIsEmailSetupModalOpen(false);
      setPendingEmailData(null);
      
      if (result.success) {
        setEmailStatus(`✅ ${result.message}`);
        setTimeout(() => setEmailStatus(''), 5000);
      } else {
        setEmailStatus(`❌ ${result.message}`);
        setTimeout(() => setEmailStatus(''), 5000);
      }
    }
  };

  const handleApproveInvoice = () => {
    if (selectedInvoice) {
      setInvoices(prev => prev.map(inv => 
        inv.id === selectedInvoice.id 
          ? { ...inv, status: 'Paid' as const }
          : inv
      ));
      setCurrentView('dashboard');
      setSelectedInvoice(null);
    }
  };

  const handleRejectInvoice = (reason: string) => {
    if (selectedInvoice) {
      setInvoices(prev => prev.map(inv => 
        inv.id === selectedInvoice.id 
          ? { ...inv, status: 'Rejected' as const }
          : inv
      ));
      setCurrentView('dashboard');
      setSelectedInvoice(null);
    }
    // For demo purposes, we'll show the employer view
    // In a real app, this would be accessed via the email link
    setCurrentView('employer-invoice');
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <Dashboard
            walletInfo={walletInfo}
            invoices={invoices}
            onCreateInvoice={handleCreateInvoice}
            onDisconnectWallet={handleDisconnectWallet}
            onViewInvoice={(invoice) => {
              setSelectedInvoice(invoice);
              setCurrentView('freelancer-invoice-view');
            }}
            onDeleteInvoice={(invoiceId) => {
              // Remove from state
              setInvoices(prev => prev.filter(inv => inv.id !== invoiceId));
              // Remove from storage
              if (walletInfo.address) {
                invoiceStorage.delete(invoiceId, walletInfo.address);
              }
            }}
          />
        );
      case 'employer-dashboard':
        return (
          <EmployerDashboard
            onBack={() => setCurrentView('landing')}
            onViewInvoice={(invoice) => {
              setSelectedInvoice(invoice);
              setCurrentView('employer-invoice');
            }}
          />
        );
      case 'freelancer-invoice-view':
        return selectedInvoice ? (
          <FreelancerInvoiceView
            invoice={selectedInvoice}
            onBack={() => setCurrentView('dashboard')}
          />
        ) : null;
      case 'employer-invoice':
        return selectedInvoice ? (
          <EmployerInvoice
            invoice={selectedInvoice}
            onBack={() => setCurrentView('employer-dashboard')}
          />
        ) : null;
      case 'about-us':
        return (
          <AboutUs
            onBack={() => setCurrentView('landing')}
          />
        );
      default:
        return (
          <>
            <Hero
              onConnectWallet={handleConnectWallet}
              onCreateInvoice={handleCreateInvoice}
              onEmployerLogin={handleEmployerLogin}
              isWalletConnected={walletInfo.isConnected}
              isConnecting={isConnecting}
              walletAddress={walletInfo.address}
              connectionError={connectionError}
            />
            <Features />
            <Testimonials />
            <HowItWorks />
            <FAQ />
          </>
        );
    }
  };

  return (
    <Routes>
      {/* Employer invoice route */}
      <Route path="/invoice/:invoiceId" element={<EmployerInvoiceRoute />} />
      
      {/* Main app route */}
      <Route path="/*" element={
        <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
          {!isInvoiceRoute && (
            <Navbar
              currentView={currentView}
              isWalletConnected={walletInfo.isConnected}
              onViewChange={setCurrentView}
              onConnectWallet={handleConnectWallet}
              onDisconnectWallet={disconnectWallet}
              walletAddress={walletInfo.address}
              isDarkMode={isDarkMode}
              onToggleDarkMode={toggleDarkMode}
              connectionError={connectionError}
            />
          )}

          {renderCurrentView()}

          {/* Email Status Message */}
          {emailStatus && (
            <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 max-w-sm z-50">
              <p className="text-sm text-gray-900 dark:text-white">{emailStatus}</p>
            </div>
          )}

          {currentView === 'landing' && <Footer />}

          <CreateInvoiceModal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            onSubmit={handleSubmitInvoice}
            walletAddress={walletInfo.address}
            currentNetwork={walletInfo.network}
          />

          <EmailSetupModal
            isOpen={isEmailSetupModalOpen}
            onClose={() => {
              setIsEmailSetupModalOpen(false);
              setPendingEmailData(null);
            }}
            onSendEmail={handleSendEmail}
            onCopyEmail={handleCopyEmail}
            employerEmail={pendingEmailData?.employerEmail || ''}
            invoiceId={pendingEmailData?.invoiceId || ''}
          />
        </div>
      } />
    </Routes>
  );
}

export default App;