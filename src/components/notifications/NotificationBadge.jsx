import React from 'react';
import { useSelector } from 'react-redux';

const NotificationBadge = () => {
  const { unreadCount } = useSelector((state) => state.notifications);

  if (unreadCount <= 0) return null;

  return (
    <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-brand-danger text-[9px] font-extrabold text-white flex items-center justify-center animate-pulse border border-[#0f172a] pointer-events-none select-none">
      {unreadCount > 9 ? '9+' : unreadCount}
    </span>
  );
};

export default NotificationBadge;
