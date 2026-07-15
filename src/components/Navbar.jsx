import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from '../hooks/useTranslation';
import { Menu, Bell, Sun, Moon } from 'lucide-react';

const Navbar = ({ toggleSidebar }) => {
  const { user } = useSelector((state) => state.auth);
  const { accounts } = useSelector((state) => state.accounts);
  const { t } = useTranslation();
  
  // Calculate total TRY balance for customer
  const tryAccount = accounts.find(acc => acc.currency === 'TRY');
  const balanceText = tryAccount 
    ? new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(tryAccount.balance)
    : '0,00 ₺';

  return (
    <header className="navbar-header">
      <button className="sidebar-toggle-btn" onClick={toggleSidebar}>
        <Menu size={24} />
      </button>

      <div className="navbar-welcome">
        <span className="welcome-text">{t('welcome', 'Hoş geldiniz,')}</span>
        <h3 className="user-name">{user?.fullName || t('dear_customer', 'Değerli Müşterimiz')}</h3>
      </div>

      <div className="navbar-actions">
        {user?.role === 'customer' && (
          <div className="navbar-stat glass-card">
            <span className="stat-label">{t('main_account_balance', 'Ana Hesap Bakiyesi')}</span>
            <span className="stat-value text-gradient-blue">{balanceText}</span>
          </div>
        )}
        
        <button className="navbar-icon-btn glass-card">
          <Bell size={18} />
          <span className="notification-badge"></span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
