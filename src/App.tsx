import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { LetsTalkModal } from './components/LetsTalkModal';
import { HomePage } from './pages/HomePage';
import { ServicesPage } from './pages/ServicesPage';
import { PortfolioPage } from './pages/PortfolioPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsPage } from './pages/TermsPage';
import { ClientPaymentPage } from './pages/ClientPaymentPage';
import { AdminPage } from './pages/AdminPage';
import { SiteContentProvider } from './context/SiteContentContext';

function AppContent() {
  const [currentPath, setCurrentPath] = useState<string>(window.location.pathname || '/');
  const [isLetsTalkOpen, setIsLetsTalkOpen] = useState(false);

  // Sync with browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Handle in-app navigation
  const handleNavigate = (path: string) => {
    if (path.includes('#')) {
      const [route, hash] = path.split('#');
      if (route && route !== currentPath) {
        window.history.pushState({}, '', path);
        setCurrentPath(route);
        setTimeout(() => {
          const el = document.getElementById(hash);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      } else {
        const el = document.getElementById(hash);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        window.history.pushState({}, '', path);
      }
      return;
    }

    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Determine current view
  const renderContent = () => {
    // 1. Client Payment Link (/pay/:token)
    if (currentPath.startsWith('/pay/')) {
      const token = currentPath.replace('/pay/', '');
      return <ClientPaymentPage token={token} onNavigateHome={() => handleNavigate('/')} />;
    }

    // 2. Admin Console (/admin)
    if (currentPath === '/admin' || currentPath.startsWith('/admin/')) {
      return <AdminPage />;
    }

    // 3. Five Main Public Pages
    switch (currentPath) {
      case '/':
        return <HomePage onNavigate={handleNavigate} onOpenLetsTalk={() => setIsLetsTalkOpen(true)} />;
      case '/services':
        return <ServicesPage onNavigate={handleNavigate} onOpenLetsTalk={() => setIsLetsTalkOpen(true)} />;
      case '/portfolio':
        return <PortfolioPage onNavigate={handleNavigate} onOpenLetsTalk={() => setIsLetsTalkOpen(true)} />;
      case '/about':
        return <AboutPage onNavigate={handleNavigate} onOpenLetsTalk={() => setIsLetsTalkOpen(true)} />;
      case '/contact':
        return (
          <ContactPage
            onNavigateToPrivacy={() => handleNavigate('/privacy')}
            onOpenLetsTalk={() => setIsLetsTalkOpen(true)}
          />
        );
      case '/privacy':
        return <PrivacyPolicyPage />;
      case '/terms':
        return <TermsPage />;
      default:
        return <HomePage onNavigate={handleNavigate} onOpenLetsTalk={() => setIsLetsTalkOpen(true)} />;
    }
  };

  const isStandaloneAdmin = currentPath === '/admin' || currentPath.startsWith('/admin/');

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#242832]">
      {/* Global Header */}
      <Header
        currentPath={currentPath}
        onNavigate={handleNavigate}
        onOpenLetsTalk={() => setIsLetsTalkOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {renderContent()}
      </main>

      {/* Global Footer (displayed on all public pages, hidden only if inside full admin view if desired) */}
      {!isStandaloneAdmin && (
        <Footer
          onNavigate={handleNavigate}
          onOpenLetsTalk={() => setIsLetsTalkOpen(true)}
        />
      )}

      {/* Global Let's Talk Contact Popup */}
      <LetsTalkModal
        isOpen={isLetsTalkOpen}
        onClose={() => setIsLetsTalkOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <SiteContentProvider>
      <AppContent />
    </SiteContentProvider>
  );
}
