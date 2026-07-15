import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';
import MobileMenu from '../components/layout/MobileMenu';
import PageTransition from '../components/ui/PageTransition';

const DashboardLayout = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen flex bg-brand-bg text-brand-textPrimary font-sans">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block shrink-0">
        <Sidebar />
      </div>
      
      {/* Main Panel Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <Navbar onMenuToggle={() => setIsMobileMenuOpen(true)} />
        
        {/* Page Area */}
        <main className="flex-1 p-6 overflow-y-auto">
          <PageTransition>
            <Outlet />
          </PageTransition>
        </main>
      </div>

      {/* Mobile Drawer */}
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </div>
  );
};

export default DashboardLayout;
