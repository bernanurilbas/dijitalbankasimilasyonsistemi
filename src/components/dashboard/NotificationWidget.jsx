import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Bell, Check } from 'lucide-react';
import Card from '../ui/Card';
import { markAllNotificationsRead, markNotificationRead } from '../../store/slices/dashboardSlice';

const NotificationWidget = () => {
  const dispatch = useDispatch();
  const { notifications } = useSelector((state) => state.dashboard);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Card 
      title={
        <div className="flex items-center gap-2">
          <Bell size={18} className="text-brand-primary" />
          <span>Bildirimler</span>
          {unreadCount > 0 && (
            <span className="bg-brand-danger text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full shrink-0">
              {unreadCount} Yeni
            </span>
          )}
        </div>
      }
      subtitle="Sistem ve hesap uyarıları"
      footer={
        unreadCount > 0 && (
          <button 
            onClick={() => dispatch(markAllNotificationsRead())}
            className="text-xs font-bold text-brand-primary hover:underline flex items-center gap-1"
          >
            <Check size={14} />
            Hepsini Okundu İşaretle
          </button>
        )
      }
    >
      <div className="flex flex-col gap-3 max-h-[220px] overflow-y-auto pr-1">
        {notifications.length === 0 ? (
          <div className="text-center py-6 text-xs text-brand-textMuted font-semibold">
            Herhangi bir bildiriminiz bulunmuyor.
          </div>
        ) : (
          notifications.map((n) => (
            <div 
              key={n.id}
              onClick={() => !n.read && dispatch(markNotificationRead(n.id))}
              className={`p-3 rounded-lg border text-xs leading-relaxed transition-all cursor-pointer ${n.read ? 'bg-white/[0.005] border-white/5 text-brand-textSecondary' : 'bg-brand-primary/5 border-brand-primary/10 text-brand-textPrimary font-semibold'}`}
            >
              <div className="flex justify-between items-start gap-2 mb-1">
                <span>{n.text}</span>
                {!n.read && (
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-primary shrink-0 mt-1"></span>
                )}
              </div>
              <span className="text-[9px] text-brand-textMuted font-bold block mt-1 uppercase tracking-wide">
                {n.time}
              </span>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};

export default NotificationWidget;
