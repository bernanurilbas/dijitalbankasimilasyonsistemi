import React from 'react';

const Checkbox = React.forwardRef(({ 
  label, 
  error, 
  className = '', 
  id, 
  ...props 
}, ref) => {
  return (
    <div className="w-full">
      <label className={`flex items-start gap-3 cursor-pointer select-none ${className}`}>
        <input
          type="checkbox"
          id={id}
          ref={ref}
          className={`w-4 h-4 mt-0.5 rounded border border-slate-300 dark:border-white/10 bg-slate-100/50 dark:bg-white/[0.02] text-brand-primary focus:ring-brand-primary/20 focus:ring-offset-0 focus:outline-none transition-all ${error ? 'border-brand-danger' : ''}`}
          {...props}
        />
        {label && (
          <span className="text-sm text-brand-textSecondary">{label}</span>
        )}
      </label>
      {error && (
        <p className="mt-1 text-xs text-brand-danger font-medium">{error}</p>
      )}
    </div>
  );
});

Checkbox.displayName = 'Checkbox';

export default Checkbox;
