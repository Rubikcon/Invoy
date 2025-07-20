import React from 'react';
import { View, WalletInfo, Invoice, CreateInvoiceData } from './types';
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
import CreateInvoiceModal from './components/modals/CreateInvoiceModal';
import EmployerInvoice from './components/pages/EmployerInvoice';

function App() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { walletInfo, isConnecting, connectionError, connectWallet, disconnectWallet } = useWallet();
  const [currentView, setCurrentView] = React.useState<View>('landing');
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [invoices, setInvoices] = React.useState<Invoice[]>([
    {
      id: 'INV-001',
      employerEmail: 'sarah@techcorp.com',
      amount: '2.5',
      status: 'Paid',
      freelancerName: 'Alex Chen',
      freelancerEmail: 'alex@example.com',
      walletAddress: '0x742d35Cc6634C0532925a3b8D84c2F3bBC3e3f3B',
      network: 'Ethereum',
      role: 'Frontend Developer',
      description: 'Built responsive landing page with React and Tailwind CSS, including mobile optimization and performance improvements.',
      createdAt: new Date('2025-01-10')
    },
    {
      id: 'INV-002',
      employerEmail: 'mike@startupxyz.com',
      amount: '1.8',
      status: 'Approved',
      freelancerName: 'Alex Chen',
      freelancerEmail: 'alex@example.com',
      walletAddress: '0x742d35Cc6634C0532925a3b8D84c2F3bBC3e3f3B',
      network: 'Polygon',
      role: 'Smart Contract Developer',
      description: 'Deployed and tested smart contracts for NFT marketplace, including minting functionality and royalty distribution.',
      createdAt: new Date('2025-01-12')
    },
    {
      id: 'INV-003',
      employerEmail: 'team@defiproject.io',
      amount: '3.2',
      status: 'Pending',
      freelancerName: 'Alex Chen',
      freelancerEmail: 'alex@example.com',
      walletAddress: '0x742d35Cc6634C0532925a3b8D84c2F3bBC3e3f3B',
      network: 'Arbitrum',
      role: 'DeFi Specialist',
      description: 'Integrated yield farming protocols and implemented automated liquidity provision strategies for DeFi platform.',
      createdAt: new Date('2025-01-15')
    }
  ]);
  const [selectedInvoice, setSelectedInvoice] = React.useState<Invoice | null>(null);

  const handleCreateInvoice = () => {
    if (!walletInfo.isConnected) {
      connectWallet();
      return;
    }
    setIsCreateModalOpen(true);
  };

  const handleConnectWallet = async () => {
    await connectWallet();
  };

  // Auto-redirect to dashboard when wallet connects successfully
  React.useEffect(() => {
    if (walletInfo.isConnected) {
      setCurrentView('dashboard');
    }
  }, [walletInfo.isConnected]);

  const handleSubmitInvoice = (data: CreateInvoiceData) => {
    const newInvoice: Invoice = {
      id: `INV-${String(invoices.length + 1).padStart(3, '0')}`,
      employerEmail: data.employerEmail,
      amount: data.amount,
      status: 'Pending',
      freelancerName: data.fullName,
      freelancerEmail: data.email,
      walletAddress: data.walletAddress,
      network: data.network,
      role: data.role,
      description: data.description,
      createdAt: new Date()
    };
    
    setInvoices(prev => [newInvoice, ...prev]);
    
    // Simulate sending employer to review page
    setTimeout(() => {
      setSelectedInvoice(newInvoice);
      setCurrentView('employer-invoice');
    }, 1000);
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
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <Dashboard
            walletInfo={walletInfo}
            invoices={invoices}
            onCreateInvoice={handleCreateInvoice}
          />
        );
      case 'employer-invoice':
        return selectedInvoice ? (
          <EmployerInvoice
            invoice={selectedInvoice}
            onApprove={handleApproveInvoice}
            onReject={handleRejectInvoice}
            onBack={() => setCurrentView('dashboard')}
          />
        ) : null;
      default:
        return (
          <>
            <Hero
              onConnectWallet={handleConnectWallet}
              onCreateInvoice={handleCreateInvoice}
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
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
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

      {renderCurrentView()}

      {currentView === 'landing' && <Footer />}

      <CreateInvoiceModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleSubmitInvoice}
        walletAddress={walletInfo.address}
        currentNetwork={walletInfo.network}
      />
    </div>
  );
}

export default App;