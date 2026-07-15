import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Dropdown = ({ 
  trigger, 
  items = [], 
  align = 'right', 
  className = '' 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const alignClasses = align === 'left' ? 'left-0' : 'right-0';

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
            className={`absolute ${alignClasses} mt-2 w-48 rounded-lg shadow-xl bg-[#0d121f] border border-brand-border py-1 z-50 overflow-hidden`}
          >
            {items.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    item.onClick();
                    setIsOpen(false);
                  }}
                  className={`w-full px-4 py-2.5 text-left text-sm font-semibold flex items-center gap-2 hover:bg-white/[0.03] transition-colors ${item.danger ? 'text-brand-danger hover:bg-brand-danger/10' : 'text-brand-textPrimary'}`}
                >
                  {Icon && <Icon size={16} className="text-current shrink-0" />}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dropdown;
