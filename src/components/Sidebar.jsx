import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { useTranslation } from '../hooks/useTranslation';
import { 
  LayoutDashboard, Send, CreditCard, Receipt, 
  TrendingUp, History, Settings, LogOut, 
  Users, MessageSquare, Shield, SlidersHorizontal, Activity 
} from 'lucide-react';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { t } = useTranslation();

  const handleLogout = () => {
    dispatch(logout());
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
          { to: '/profile', label: t('profile_settings', 'Profil Ayarları'), icon: Settings },
        ];
      case 'staff':
        return [
          { to: '/staff', label: t('customer_list', 'Müşteri Listesi'), icon: Users },
          { to: '/staff/tickets', label: t('support_requests', 'Destek Talepleri'), icon: MessageSquare },
          { to: '/profile', label: t('profile_settings', 'Profil Ayarları'), icon: Settings },
        ];
      case 'customer':
      default:
        return [
          { to: '/dashboard', label: t('dashboard', 'Ana Sayfa'), icon: LayoutDashboard },
          { to: '/transfers', label: t('transfers', 'Para Transferi'), icon: Send },
          { to: '/cards', label: t('cards', 'Kartlarım'), icon: CreditCard },
          { to: '/bills', label: t('bills', 'Fatura Ödemeleri'), icon: Receipt },
          { to: '/investments', label: t('investments', 'Yatırım Paneli'), icon: TrendingUp },
          { to: '/history', label: t('history', 'Hesap Hareketleri'), icon: History },
          { to: '/profile', label: t('profile_settings', 'Profil & Ayarlar'), icon: Settings },
        ];
    }
  };

  const links = getNavigationLinks();

  return (
    <aside className={`sidebar-container ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-brand">
        <div className="sidebar-logo-icon">
          <Shield size={24} className="text-primary" />
        </div>
        <div>
          <h2>Astra Bank</h2>
        </div>
      </div>

      <div className="sidebar-user-info">
        <div className="avatar-placeholder">
          {user?.fullName?.charAt(0).toUpperCase()}
        </div>
        <div className="user-details">
          <h4>{user?.fullName}</h4>
          <span className="user-role-badge">{user?.role?.toUpperCase()}</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/admin' || link.to === '/staff' || link.to === '/dashboard'}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={toggleSidebar}
            >
              <Icon size={20} className="link-icon" />
              <span>{link.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <button className="sidebar-logout-btn" onClick={handleLogout}>
        <LogOut size={20} />
        <span>{t('secure_logout', 'Güvenli Çıkış')}</span>
      </button>
    </aside>
  );
};

export default Sidebar;
