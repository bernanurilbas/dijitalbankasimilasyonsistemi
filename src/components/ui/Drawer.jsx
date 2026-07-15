import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const Drawer = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  position = 'right' 
}) => {
  const isRight = position === 'right';

  const drawerVariants = {
    hidden: { x: isRight ? '100%' : '-100%' },
    visible: { x: 0 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
          />

          {/* Drawer Panel */}
          <motion.div
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ type: 'tween', duration: 0.3 }}
            className={`fixed inset-y-0 ${isRight ? 'right-0' : 'left-0'} w-full max-w-sm bg-[#0d121f] border-l border-brand-border shadow-xl flex flex-col z-10`}
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
              <h3 className="text-base font-bold text-brand-textPrimary">{title}</h3>
              <button 
                onClick={onClose}
                className="text-brand-textMuted hover:text-brand-textPrimary transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 px-6 py-6 overflow-y-auto">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Drawer;
