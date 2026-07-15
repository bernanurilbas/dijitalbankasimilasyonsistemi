import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from '../../hooks/useTranslation';
import { Menu, Bell } from 'lucide-react';
import NotificationBadge from '../notifications/NotificationBadge';
import NotificationList from '../notifications/NotificationList';
import { fetchNotifications } from '../../store/slices/notificationSlice';

const Navbar = ({ onMenuToggle }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { accounts } = useSelector((state) => state.accounts);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchNotifications(user.id));
    }
  }, [dispatch, user]);
  
  // Find customer TRY account balance
  const tryAccount = accounts.find(acc => acc.currency === 'TRY');
  const balanceText = tryAccount 
    ? new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(tryAccount.balance)
    : '0,00 ₺';

  return (
    <header className="h-16 border-b border-brand-border flex items-center justify-between px-6 bg-brand-card bg-opacity-50 sticky top-0 z-30 backdrop-blur">
      <div className="flex items-center gap-3">
        <button 
          onClick={onMenuToggle}
          className="p-1.5 text-brand-textPrimary hover:bg-white/5 rounded-lg lg:hidden"
        >
          <Menu size={20} />
        </button>
        <div className="flex flex-col">
          <span className="text-[10px] text-brand-textMuted font-semibold">{t('welcome', 'Hoş geldiniz,')}</span>
          <h3 className="text-sm font-bold text-brand-textPrimary">{user?.fullName || t('dear_customer', 'Değerli Müşterimiz')}</h3>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {user?.role === 'customer' && (
          <div className="hidden sm:flex flex-col items-end px-3 py-1 bg-white/[0.02] border border-white/5 rounded-lg">
            <span className="text-[9px] text-brand-textMuted uppercase font-bold tracking-wider">{t('main_account_balance', 'Ana Hesap Bakiyesi')}</span>
            <span className="text-xs font-bold text-brand-primary">{balanceText}</span>
          </div>
        )}
        
        <div className="relative">
          <button 
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-brand-border hover:bg-white/5 text-brand-textSecondary hover:text-brand-textPrimary transition-all focus:outline-none"
          >
            <Bell size={16} />
            <NotificationBadge />
          </button>

          <NotificationList 
            isOpen={isNotificationsOpen} 
            onClose={() => setIsNotificationsOpen(false)} 
          />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
