import React, { useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  markNotificationAsRead, deleteNotification, markAllNotificationsAsRead 
} from '../../store/slices/notificationSlice';
import { useTranslation } from '../../hooks/useTranslation';
import NotificationCard from './NotificationCard';
import Button from '../ui/Button';
import { BellOff, CheckCheck } from 'lucide-react';

const NotificationList = ({ 
  isOpen, 
  onClose 
}) => {
  const dispatch = useDispatch();
  const panelRef = useRef(null);
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.auth);
  const { notifications, unreadCount } = useSelector((state) => state.notifications);

  // Close panel on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (isOpen && panelRef.current && !panelRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleMarkAsRead = (id) => {
    dispatch(markNotificationAsRead(id));
  };

  const handleDelete = (id) => {
    dispatch(deleteNotification(id));
  };

  const handleMarkAllRead = () => {
    if (user?.id) {
      dispatch(markAllNotificationsAsRead(user.id));
    }
  };

  return (
    <div 
      ref={panelRef}
      className="absolute right-0 mt-3 w-80 sm:w-96 max-h-[480px] rounded-2xl border border-white/5 bg-[#0f172a]/95 backdrop-blur-xl shadow-2xl z-[120] flex flex-col overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
    >
      {/* Panel Header */}
      <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
        <h4 className="text-xs font-extrabold text-brand-textPrimary tracking-wider uppercase">{t('notifications', 'Bildirimler')}</h4>
        
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="text-[10px] font-bold text-brand-primary hover:underline flex items-center gap-1 focus:outline-none"
          >
            <CheckCheck size={14} />
            {t('mark_all_read', 'Hepsini Okundu Yap')}
          </button>
        )}
      </div>

      {/* Panel Body (Scrollable) */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 custom-scrollbar">
        {notifications.length === 0 ? (
          <div className="py-10 text-center flex flex-col items-center justify-center gap-2">
            <div className="p-3 bg-white/[0.02] border border-white/5 rounded-full text-brand-textMuted">
              <BellOff size={24} />
            </div>
            <span className="text-xs text-brand-textSecondary font-bold">{t('no_notifications', 'Bildiriminiz Yok')}</span>
            <span className="text-[10px] text-brand-textMuted leading-relaxed max-w-[200px]">
              {t('notifications_empty_desc', 'Hesap hareketleriniz veya sistem duyuruları burada listelenir.')}
            </span>
          </div>
        ) : (
          notifications.map((item) => (
            <NotificationCard
              key={item.id}
              notification={item}
              onMarkAsRead={handleMarkAsRead}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>

      {/* Panel Footer */}
      <div className="p-3 border-t border-white/5 bg-white/[0.01] text-center">
        <button
          onClick={onClose}
          className="text-[10px] font-bold text-brand-textSecondary hover:text-brand-textPrimary focus:outline-none"
        >
          {t('close', 'Kapat')}
        </button>
      </div>

    </div>
  );
};

export default NotificationList;
