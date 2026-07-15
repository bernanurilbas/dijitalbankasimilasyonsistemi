import React from 'react';

const Input = React.forwardRef(({ 
  label, 
  error, 
  icon: Icon, 
  className = '', 
  id, 
  ...props 
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-xs font-semibold text-brand-textSecondary mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-textMuted pointer-events-none transition-colors">
            <Icon size={18} />
          </div>
        )}
        <input
          id={id}
          ref={ref}
          aria-invalid={!!error}
          aria-describedby={error && id ? `${id}-error` : undefined}
          className={`w-full bg-slate-100/50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-lg py-2.5 px-4 text-brand-textPrimary placeholder-brand-textMuted focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all ${Icon ? 'pl-11' : ''} ${error ? 'border-brand-danger dark:border-brand-danger focus:border-brand-danger focus:ring-brand-danger/20' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && (
        <p id={id ? `${id}-error` : undefined} className="mt-1 text-xs text-brand-danger font-medium">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
