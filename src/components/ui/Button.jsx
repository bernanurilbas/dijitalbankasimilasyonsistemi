import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  loading = false, 
  disabled = false, 
  className = '', 
  type = 'button',
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold transition-all duration-200 rounded-lg focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-brand-primary hover:opacity-90 text-white shadow-lg shadow-brand-primary/15 active:scale-[0.98]',
    secondary: 'bg-brand-card border border-brand-border hover:bg-brand-border/10 text-brand-textPrimary',
    success: 'bg-brand-success hover:opacity-90 text-white shadow-lg shadow-brand-success/15 active:scale-[0.98]',
    danger: 'bg-brand-danger hover:opacity-90 text-white shadow-lg shadow-brand-danger/15 active:scale-[0.98]',
    outline: 'border border-brand-primary text-brand-primary hover:bg-brand-primary/10',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-6 py-3.5 text-base',
  };

  return (
    <button
      type={type}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : null}
      {children}
    </button>
  );
};

export default Button;
