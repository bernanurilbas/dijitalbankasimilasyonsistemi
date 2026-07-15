import React from 'react';
import { Check, Trash2, Info, AlertTriangle, CheckCircle, Bell } from 'lucide-react';

const NotificationCard = ({ 
  notification, 
  onMarkAsRead, 
  onDelete 
}) => {
  const { id, message, type, date, isRead } = notification;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle size={16} className="text-brand-success" />;
      case 'warning':
        return <AlertTriangle size={16} className="text-brand-warning" />;
      case 'alert':
      case 'danger':
        return <AlertTriangle size={16} className="text-brand-danger" />;
      case 'info':
      default:
        return <Info size={16} className="text-brand-primary" />;
    }
  };

  const getBorderColor = () => {
    if (isRead) return 'border-white/5 bg-white/[0.003]';
    switch (type) {
      case 'success':
        return 'border-brand-success/20 bg-brand-success/[0.01]';
      case 'warning':
        return 'border-brand-warning/20 bg-brand-warning/[0.01]';
      case 'alert':
      case 'danger':
        return 'border-brand-danger/20 bg-brand-danger/[0.01]';
      case 'info':
      default:
        return 'border-brand-primary/20 bg-brand-primary/[0.01]';
    }
  };

  return (
    <div className={`p-4 rounded-xl border flex items-start gap-3 transition-all duration-300 ${getBorderColor()}`}>
      
      {/* Type Icon */}
      <div className="mt-0.5 shrink-0">
        {getIcon()}
      </div>

      {/* Message and Date */}
      <div className="flex-1 min-w-0 text-left">
        <p className={`text-xs leading-relaxed ${isRead ? 'text-brand-textSecondary' : 'text-brand-textPrimary font-bold'}`}>
          {message}
        </p>
        <span className="text-[10px] text-brand-textMuted font-semibold mt-1.5 block">
          {new Date(date).toLocaleString('tr-TR')}
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5 shrink-0">
        {!isRead && (
          <button
            onClick={() => onMarkAsRead(id)}
            className="p-1.5 border border-white/10 rounded-lg text-brand-textSecondary hover:text-brand-textPrimary hover:bg-white/5 transition-all"
            title="Okundu İşaretle"
          >
            <Check size={12} />
          </button>
        )}
        <button
          onClick={() => onDelete(id)}
          className="p-1.5 border border-white/10 rounded-lg text-brand-textMuted hover:text-brand-danger hover:bg-brand-danger/5 transition-all"
          title="Sil"
        >
          <Trash2 size={12} />
        </button>
      </div>

    </div>
  );
};

export default NotificationCard;
