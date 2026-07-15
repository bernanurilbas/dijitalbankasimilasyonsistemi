import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

const Toast = ({ 
  message, 
  type = 'info', 
  onClose, 
  duration = 3000, 
  isOpen 
}) => {
  useEffect(() => {
    if (isOpen && duration) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, onClose]);

  const icons = {
    success: <CheckCircle2 className="text-brand-success shrink-0" size={18} />,
    danger: <AlertCircle className="text-brand-danger shrink-0" size={18} />,
    warning: <AlertTriangle className="text-brand-warning shrink-0" size={18} />,
    info: <Info className="text-brand-primary shrink-0" size={18} />,
  };

  const borders = {
    success: 'border-l-4 border-l-brand-success',
    danger: 'border-l-4 border-l-brand-danger',
    warning: 'border-l-4 border-l-brand-warning',
    info: 'border-l-4 border-l-brand-primary',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className={`flex items-center gap-3 p-4 bg-brand-card border border-brand-border rounded-lg shadow-xl max-w-sm w-full z-[100] ${borders[type]}`}
        >
          {icons[type]}
          <div className="flex-1 text-sm font-semibold text-brand-textPrimary">
            {message}
          </div>
          <button 
            onClick={onClose}
            className="text-brand-textMuted hover:text-brand-textPrimary transition-colors"
          >
            <X size={16} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
