import React from 'react';

const Badge = ({ 
  children, 
  variant = 'default', 
  className = '' 
}) => {
  const baseStyles = 'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide';
  
  const variants = {
    default: 'bg-white/5 border border-white/10 text-brand-textSecondary',
    success: 'bg-brand-success/12 border border-brand-success/20 text-brand-success',
    danger: 'bg-brand-danger/12 border border-brand-danger/20 text-brand-danger',
    warning: 'bg-brand-warning/12 border border-brand-warning/20 text-brand-warning',
    info: 'bg-brand-primary/12 border border-brand-primary/20 text-brand-primary',
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
