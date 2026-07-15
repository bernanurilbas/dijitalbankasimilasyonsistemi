import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ 
  children, 
  title, 
  subtitle, 
  footer, 
  className = '' 
}) => {
  return (
    <motion.div 
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={`glass-panel rounded-xl shadow-lg shadow-black/10 overflow-hidden ${className}`}
    >
      {(title || subtitle) && (
        <div className="px-6 py-5 border-b border-white/5">
          {title && <h3 className="text-base font-bold text-brand-textPrimary">{title}</h3>}
          {subtitle && <p className="text-xs text-brand-textMuted mt-1">{subtitle}</p>}
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
      {footer && (
        <div className="px-6 py-4 bg-white/[0.01] border-t border-white/5">
          {footer}
        </div>
      )}
    </motion.div>
  );
};

export default Card;
