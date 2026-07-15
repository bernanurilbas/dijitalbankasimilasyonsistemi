import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, loginSuccess } from '../../store/slices/authSlice';
import { useTranslation } from '../../hooks/useTranslation';
import api from '../../services/api';
import { 
  LayoutDashboard, Send, CreditCard, Receipt, 
  TrendingUp, History, Settings, LogOut, 
  Shield, Users, MessageSquare, SlidersHorizontal, Activity, Landmark, User,
  ChevronDown, ChevronUp
} from 'lucide-react';

const Sidebar = ({ onLogout }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { t } = useTranslation();
  const [unreadCount, setUnreadCount] = useState(0);
  const [isStaffDropdownOpen, setIsStaffDropdownOpen] = useState(false);
  const [staffUsers, setStaffUsers] = useState([]);

  useEffect(() => {
    if (user?.role !== 'staff') return;

    const fetchStaffList = async () => {
      try {
        const response = await api.get('/users?role=staff&status=active');
        setStaffUsers(response.data);
      } catch (err) {
        console.error('Failed to load staff list', err);
      }
    };
    fetchStaffList();
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const checkUnreadTickets = async () => {
      try {
        if (user.role === 'customer') {
          const response = await api.get(`/supportTickets?userId=${user.id}&unreadByCustomer=true`);
          setUnreadCount(response.data.length);
        } else if (user.role === 'staff') {
          const response = await api.get(`/supportTickets?unreadByStaff=true`);
          setUnreadCount(response.data.length);
        }
      } catch (err) {
        console.error('Failed to fetch unread support tickets count', err);
      }
    };

    checkUnreadTickets();
    const interval = setInterval(checkUnreadTickets, 4000);
    return () => clearInterval(interval);
  }, [user]);

  const handleLogout = () => {
    dispatch(logout());
    if (onLogout) onLogout();
    navigate('/login');
  };

  const handleSelectStaff = (staffMember) => {
    if (!staffMember || staffMember.id === user?.id) return;
    dispatch(loginSuccess({ user: staffMember, token: 'mock-staff-token' }));
    setIsStaffDropdownOpen(false);
    navigate('/staff');
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
          { to: '/staff/accounts', label: t('customer_accounts', 'Müşteri Hesapları'), icon: Landmark },
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
    <aside className="w-64 border-r border-brand-border bg-brand-card flex flex-col p-6 shrink-0 h-screen sticky top-0">
      {/* Brand logo */}
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-brand-primary/10 p-2 rounded-lg text-brand-primary">
          <Shield size={22} />
        </div>
        <div>
          <h2 className="font-extrabold text-base leading-none tracking-wide text-brand-textPrimary">Astra Bank</h2>
        </div>
      </div>

      {/* User Card with Dropdown Wrapper */}
      <div className="relative mb-8">
        <div 
          onClick={user?.role === 'staff' ? () => setIsStaffDropdownOpen(!isStaffDropdownOpen) : undefined}
          className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
            user?.role === 'staff' 
              ? `cursor-pointer ${isStaffDropdownOpen ? 'bg-brand-primary/10 border-brand-primary/50 shadow-[0_0_12px_rgba(20,184,166,0.15)]' : 'border-brand-border bg-white/[0.01] hover:bg-brand-primary/5 hover:border-brand-primary/30'} group active:scale-[0.98]` 
              : 'border-brand-border bg-white/[0.01]'
          }`}
          title={user?.role === 'staff' ? t('switch_staff_tooltip', 'Personel değiştirmek için tıklayın') : undefined}
        >
          <div className="w-9 h-9 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center font-bold shrink-0">
            {user?.fullName?.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-xs font-bold text-brand-textPrimary truncate">{user?.fullName}</h4>
            <span className="inline-block text-[8px] font-bold text-brand-gold bg-brand-gold/10 px-1.5 py-0.5 rounded uppercase mt-1">
              {user?.role}
            </span>
          </div>
          {user?.role === 'staff' && (
            <span className="text-brand-textMuted group-hover:text-brand-primary transition-colors shrink-0">
              {isStaffDropdownOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </span>
          )}
        </div>

        {/* Dropdown Popover */}
        {isStaffDropdownOpen && user?.role === 'staff' && (
          <>
            {/* Click Outside Backdrop overlay */}
            <div className="fixed inset-0 z-40 cursor-default" onClick={() => setIsStaffDropdownOpen(false)} />
            
            {/* Staff list card */}
            <div className="absolute top-[105%] left-0 right-0 z-50 glass-panel border border-brand-primary/30 p-2 rounded-xl bg-[#080d19]/95 shadow-[0_12px_30px_rgba(0,0,0,0.7)] backdrop-blur-xl flex flex-col gap-1">
              <span className="text-[7px] text-brand-textMuted font-black uppercase tracking-widest block px-2.5 py-1.5 border-b border-white/5 mb-1">
                {t('staff_accounts', 'Personel Hesapları')}
              </span>
              <div className="max-h-48 overflow-y-auto flex flex-col gap-0.5 pr-0.5">
                {staffUsers.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => handleSelectStaff(s)}
                    className={`w-full flex items-center gap-2 p-1.5 rounded-lg text-left transition-all ${
                      user.id === s.id
                        ? 'bg-brand-primary/10 text-brand-primary font-bold'
                        : 'hover:bg-white/[0.03] text-brand-textSecondary hover:text-brand-textPrimary'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[9px] shrink-0 ${
                      user.id === s.id ? 'bg-brand-primary/20 text-brand-primary' : 'bg-white/5 text-brand-textSecondary'
                    }`}>
                      {s.fullName?.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] truncate leading-none">{s.fullName}</p>
                      <span className="text-[7px] text-brand-textMuted font-mono block mt-0.5 truncate">{s.email}</span>
                    </div>
                    {user.id === s.id && (
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse shrink-0 mr-1" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
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
              className={({ isActive }) => `flex items-center justify-between py-2 px-3 text-sm font-semibold rounded-lg transition-all ${isActive ? 'bg-brand-primary/10 text-brand-primary' : 'text-brand-textSecondary hover:text-brand-textPrimary hover:bg-white/[0.02]'}`}
            >
              <div className="flex items-center gap-3">
                <Icon size={18} className="shrink-0" />
                <span>{link.label}</span>
              </div>
              {(link.to === '/support' || link.to === '/staff/tickets') && unreadCount > 0 && (
                <span className="flex h-5 min-w-5 px-1.5 items-center justify-center text-[10px] font-extrabold text-white bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.5)] shrink-0">
                  {unreadCount}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Logout button */}
      <button 
        onClick={handleLogout}
        className="flex items-center gap-3 py-2.5 px-3 text-sm font-bold text-brand-danger hover:bg-brand-danger/10 rounded-lg w-full text-left transition-all mt-auto"
      >
        <LogOut size={18} />
        <span>{t('secure_logout', 'Güvenli Çıkış')}</span>
      </button>
    </aside>
  );
};

export default Sidebar;
