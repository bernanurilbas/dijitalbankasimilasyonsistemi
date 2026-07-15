import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { useTranslation } from '../../hooks/useTranslation';
import { X, Shield, LogOut } from 'lucide-react';
import { 
  LayoutDashboard, Send, CreditCard, Receipt, 
  TrendingUp, History, Settings, Users, 
  MessageSquare, SlidersHorizontal, Activity, Landmark, User 
} from 'lucide-react';

const MobileMenu = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { t } = useTranslation();

  const handleLogout = () => {
    dispatch(logout());
    onClose();
    navigate('/login');
  };

  const getNavigationLinks = () => {
    if (!user) return [];

    switch (user.role) {
      case 'admin':
        return [
          { to: '/admin', label: t('overview', 'Genel Durum'), icon: Activity },
          { to: '/admin/staff', label: t('staff_management', 'Personel Yönetimi'), icon: Users },
          { to: '/admin/settings', label: t('system_settings', 'Sistem Ayarları'), icon: SlidersHorizontal },
          { to: '/profile', label: t('profile_settings', 'Profil Ayarları'), icon: User },
          { to: '/settings', label: t('system_settings', 'Sistem Ayarları'), icon: Settings },
        ];
      case 'staff':
        return [
          { to: '/staff', label: t('customer_list', 'Müşteri Listesi'), icon: Users },
          { to: '/staff/tickets', label: t('support_requests', 'Destek Talepleri'), icon: MessageSquare },
          { to: '/profile', label: t('profile_settings', 'Profil Ayarları'), icon: User },
          { to: '/settings', label: t('system_settings', 'Sistem Ayarları'), icon: Settings },
        ];
      case 'customer':
      default:
        return [
          { to: '/dashboard', label: t('dashboard', 'Ana Sayfa'), icon: LayoutDashboard },
          { to: '/accounts', label: t('my_accounts', 'Hesaplarım'), icon: Landmark },
          { to: '/transfers', label: t('transfers', 'Para Transferi'), icon: Send },
          { to: '/cards', label: t('cards', 'Kartlarım'), icon: CreditCard },
          { to: '/bills', label: t('bills', 'Fatura Ödemeleri'), icon: Receipt },
          { to: '/investments', label: t('investments', 'Yatırım Paneli'), icon: TrendingUp },
          { to: '/history', label: t('history', 'Hesap Hareketleri'), icon: History },
          { to: '/support', label: t('support_requests', 'Destek Talepleri'), icon: MessageSquare },
          { to: '/profile', label: t('profile_title', 'Profilim'), icon: User },
          { to: '/settings', label: t('settings_title', 'Ayarlar'), icon: Settings },
        ];
    }
  };

  const links = getNavigationLinks();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-xs"
          />

          {/* Menu Panel */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.25 }}
            className="fixed inset-y-0 left-0 w-64 bg-brand-card border-r border-brand-border flex flex-col p-6 z-10"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="bg-brand-primary/10 p-2 rounded-lg text-brand-primary">
                  <Shield size={20} />
                </div>
                <div>
                  <h2 className="font-extrabold text-sm leading-none tracking-wide text-brand-textPrimary">Astra Bank</h2>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-1 text-brand-textMuted hover:text-brand-textPrimary transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Nav Links */}
            <nav className="flex flex-col gap-1 flex-1 overflow-y-auto pr-1">
              {links.map((link) => {
                const Icon = link.icon;
                return (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.to === '/admin' || link.to === '/staff' || link.to === '/dashboard'}
                    className={({ isActive }) => `flex items-center gap-3 py-2 px-3 text-sm font-semibold rounded-lg transition-all ${isActive ? 'bg-brand-primary/10 text-brand-primary' : 'text-brand-textSecondary hover:text-brand-textPrimary hover:bg-white/[0.02]'}`}
                    onClick={onClose}
                  >
                    <Icon size={18} className="shrink-0" />
                    <span>{link.label}</span>
                  </NavLink>
                );
              })}
            </nav>

            {/* Logout */}
            <button 
              onClick={handleLogout}
              className="flex items-center gap-3 py-2.5 px-3 text-sm font-bold text-brand-danger hover:bg-brand-danger/10 rounded-lg w-full text-left transition-all mt-auto"
            >
              <LogOut size={18} />
              <span>{t('secure_logout', 'Güvenli Çıkış')}</span>
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;
