import React from 'react';
import { Routes, Route, useParams, useNavigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { View, WalletInfo, Invoice, CreateInvoiceData, User } from './types';
import { invoiceService } from './services/invoiceService';
import { notificationService } from './services/notificationService';
import { useToast } from './hooks/useToast';
import ToastContainer from './components/ui/ToastContainer';
import { useDarkMode } from './hooks/useDarkMode';
import { useAuth } from './hooks/useAuth';
import { useWallet } from './hooks/useWallet';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Hero from './components/landing/Hero';
import Features from './components/landing/Features';
import HowItWorks from './components/landing/HowItWorks';
import Testimonials from './components/landing/Testimonials';
import FAQ from './components/landing/FAQ';
import Dashboard from './components/dashboard/Dashboard';
import { EmployerDashboard } from './components/dashboard/EmployerDashboard';
import CreateInvoiceModal from './components/modals/CreateInvoiceModal';
import EmployerInvoice from './components/pages/EmployerInvoice';
import AboutUs from './components/pages/AboutUs';
import FreelancerInvoiceView from './components/pages/FreelancerInvoiceView';
import EmailSetupModal from './components/modals/EmailSetupModal';
import LoginModal from './components/auth/LoginModal';
import RegisterModal from './components/auth/RegisterModal';
import RoleSelectionModal from './components/auth/RoleSelectionModal';
import UserProfile from './components/auth/UserProfile';
import { sendInvoiceEmail, copyInvoiceDetails } from './services/emailService';
import { sendStatusUpdateEmail } from './services/emailService';

// Component to handle employer invoice routes
// Component to handle employer invoice routes
function EmployerInvoiceRoute() {
  const { invoiceId } = useParams<{ invoiceId: string }>();
  const navigate = useNavigate();
  const [invoice, setInvoice] = React.useState<Invoice | null>(null);
  const [loading, setLoading] = React.useState(true);
  
  // Load invoice from backend
  React.useEffect(() => {
    const loadInvoice = async () => {
      if (invoiceId) {
        const result = await invoiceService.getInvoiceById(invoiceId);
        if (result.success && result.invoice) {
          setInvoice(result.invoice);
        }
      }
      setLoading(false);
    };
    
    loadInvoice();
  }, [invoiceId]);
  
  const handleApprove = async (invoice: Invoice) => {
    if (!invoice) return;
    
    // Update invoice status via backend
    await invoiceService.updateInvoiceStatus(invoice.id, 'Approved');
    
    // Update local state to show success
    setInvoice(prev => prev ? { ...prev, status: 'Approved' } : null);
  };
  
  const handleReject = async (invoice: Invoice, reason: string) => {
    if (!invoice) return;
    
    // Update invoice status via backend
    await invoiceService.updateInvoiceStatus(invoice.id, 'Rejected', reason);
    
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
  const { success, error, warning } = useToast();
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { 
    user, 
    isAuthenticated, 
    isLoading: authLoading, 
    error: authError, 
    pendingSocialUser,
    showRoleSelection,
    login, 
    register, 
    socialLogin,
    updateUserRole,
    logout, 
    updateProfile, 
    clearError 
  } = useAuth();
  const { walletInfo, isConnecting, connectionError, connectWallet, disconnectWallet } = useWallet();
  const [currentView, setCurrentView] = React.useState<View>('landing');
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = React.useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = React.useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = React.useState(false);
  const [isEmailSetupModalOpen, setIsEmailSetupModalOpen] = React.useState(false);
  const [pendingEmailData, setPendingEmailData] = React.useState<any>(null);
  const [emailStatus, setEmailStatus] = React.useState<string>('');
  const [invoices, setInvoices] = React.useState<Invoice[]>([]);
  const [selectedInvoice, setSelectedInvoice] = React.useState<Invoice | null>(null);

  // Load invoices from backend on component mount
  React.useEffect(() => {
    const loadInvoices = async () => {
      if (isAuthenticated && user && user.role === 'freelancer') {
        const result = await invoiceService.getUserInvoices();
        if (result.success && result.invoices) {
          setInvoices(result.invoices);
        } else if (result.error) {
          error('Load Failed', result.error);
        }
      }
    };
    
    loadInvoices();
  }, [isAuthenticated, user, error]);

  const refreshInvoices = async () => {
    if (isAuthenticated && user && user.role === 'freelancer') {
      const result = await invoiceService.getUserInvoices();
      if (result.success && result.invoices) {
        setInvoices(result.invoices);
      }
    }
  };

  // Check if we're on an invoice route
  const isInvoiceRoute = location.pathname.startsWith('/invoice/');

  // Auto-redirect to dashboard when user logs in as freelancer
  React.useEffect(() => {
    if (isAuthenticated && user && user.role === 'freelancer' && currentView === 'landing') {
      setCurrentView('dashboard');
    }
  }, [isAuthenticated, user, currentView]);

  const handleCreateInvoice = () => {
    if (!isAuthenticated) {
      setIsLoginModalOpen(true);
      return;
    }
    
    // Check if user needs to connect wallet for invoice creation
    if (user?.role === 'freelancer' && !user.walletAddress && !walletInfo.isConnected) {
      // Prompt to connect wallet first
      connectWallet();
      return;
    }
    
    setIsCreateModalOpen(true);
  };

  const handleEmployerLogin = async () => {
    if (!isAuthenticated) {
      setIsLoginModalOpen(true);
      return;
    }
    
    if (user?.role === 'employer') {
      setCurrentView('employer-dashboard');
    } else {
      // Show message that this is for employers only
      alert('This section is for employers only. Please create an employer account.');
    }
  };

  const handleLogin = () => {
    setIsLoginModalOpen(true);
  };

  const handleDisconnectWallet = async () => {
    try {
      await disconnectWallet();
      // Optionally show a success message
      toast.success('Wallet disconnected');
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
      toast.error('Failed to disconnect wallet');
    }
  };

  const handleLogout = () => {
    logout();
    disconnectWallet(); // Also disconnect wallet
    setCurrentView('landing');
  };

  const handleShowProfile = () => {
    setIsProfileModalOpen(true);
  };

  const handleSwitchToRegister = () => {
    setIsLoginModalOpen(false);
    setIsRegisterModalOpen(true);
  };

  const handleSwitchToLogin = () => {
    setIsRegisterModalOpen(false);
    setIsLoginModalOpen(true);
  };

  // Update user profile with wallet address when wallet connects
  React.useEffect(() => {
    if (walletInfo.isConnected && user && user.role === 'freelancer' && user.walletAddress !== walletInfo.address) {
      updateProfile({ walletAddress: walletInfo.address });
    }
  }, [walletInfo.isConnected, walletInfo.address, user, updateProfile]);

  const handleSubmitInvoice = async (data: CreateInvoiceData, isDraft: boolean = false) => {
    if (!user) return;
    
    // Refresh invoices list
    await refreshInvoices();
    
    if (!isDraft) {
      // For submitted invoices, show email setup modal
      const emailData = {
        employerEmail: data.employerEmail,
        freelancerName: data.fullName,
        freelancerEmail: data.email,
        invoiceId: 'pending', // Will be updated with actual ID
        amount: data.amount,
        network: data.network,
        description: data.description,
        invoiceLink: `${window.location.origin}/invoice/pending`
      };
      
      setPendingEmailData(emailData);
      setIsEmailSetupModalOpen(true);
    }
  };

  const handleSendEmail = async () => {
    if (pendingEmailData) {
      const result = await sendInvoiceEmail(pendingEmailData);
      setIsEmailSetupModalOpen(false);
      setPendingEmailData(null);
      
      if (result.success) {
        success('Email Sent', result.message);
      } else {
        error('Email Failed', result.message);
      }
    }
  };

  const handleCopyEmail = async () => {
    if (pendingEmailData) {
      const result = await copyInvoiceDetails(pendingEmailData);
      setIsEmailSetupModalOpen(false);
      setPendingEmailData(null);
      
      if (result.success) {
        success('Copied to Clipboard', result.message);
      } else {
        error('Copy Failed', result.message);
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
        if (!isAuthenticated || !user || user.role !== 'freelancer') {
          setCurrentView('landing');
          return null;
        }
        return (
          <Dashboard
            walletInfo={walletInfo.isConnected ? walletInfo : { ...walletInfo, isConnected: false }}
            invoices={invoices}
            onCreateInvoice={handleCreateInvoice}
            onDisconnectWallet={handleDisconnectWallet}
            onConnectWallet={connectWallet}
            onViewInvoice={(invoice) => {
              setSelectedInvoice(invoice);
              setCurrentView('freelancer-invoice-view');
            }}
            onDeleteInvoice={(invoiceId) => {
              // Remove from state
              setInvoices(prev => prev.filter(inv => inv.id !== invoiceId));
              // Delete via backend
              invoiceService.deleteInvoice(invoiceId);
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
              user={user}
              isAuthenticated={isAuthenticated}
              onLogin={handleLogin}
              onCreateInvoice={handleCreateInvoice}
              onEmployerLogin={handleEmployerLogin}
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
              user={user}
              isAuthenticated={isAuthenticated}
              onViewChange={setCurrentView}
              onLogin={handleLogin}
              onLogout={handleLogout}
              onShowProfile={handleShowProfile}
              isDarkMode={isDarkMode}
              onToggleDarkMode={toggleDarkMode}
            />
          )}

          {renderCurrentView()}

          {/* Toast Notifications */}
          <ToastContainer />
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              className: 'dark:bg-gray-800 dark:text-white',
            }}
          />

          {currentView === 'landing' && <Footer />}

          <CreateInvoiceModal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            onSubmit={handleSubmitInvoice}
            walletAddress={user?.walletAddress || walletInfo.address}
            currentNetwork={walletInfo.network || 'Ethereum'}
          />

          <LoginModal
            isOpen={isLoginModalOpen}
            onClose={() => {
              setIsLoginModalOpen(false);
              clearError();
            }}
            onLogin={login}
            onSocialLogin={socialLogin}
            onSwitchToRegister={handleSwitchToRegister}
            isLoading={authLoading}
            error={authError}
          />

          <RegisterModal
            isOpen={isRegisterModalOpen}
            onClose={() => {
              setIsRegisterModalOpen(false);
              clearError();
            }}
            onRegister={register}
            onSocialLogin={socialLogin}
            onSwitchToLogin={handleSwitchToLogin}
            isLoading={authLoading}
            error={authError}
          />

          <RoleSelectionModal
            isOpen={showRoleSelection}
            onClose={() => clearError()}
            onSelectRole={updateUserRole}
            userName={pendingSocialUser?.name || ''}
            isLoading={authLoading}
          />

          {user && (
            <UserProfile
              isOpen={isProfileModalOpen}
              onClose={() => setIsProfileModalOpen(false)}
              user={user}
              onUpdateProfile={updateProfile}
              isLoading={authLoading}
            />
          )}

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