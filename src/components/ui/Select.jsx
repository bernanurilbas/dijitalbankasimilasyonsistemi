import React from 'react';

const Select = React.forwardRef(({ 
  label, 
  error, 
  options = [], 
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
        <select
          id={id}
          ref={ref}
          aria-invalid={!!error}
          aria-describedby={error && id ? `${id}-error` : undefined}
          className={`w-full bg-white/[0.02] border border-white/10 rounded-lg py-2.5 px-4 pr-10 text-brand-textPrimary placeholder-brand-textMuted appearance-none focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all ${error ? 'border-brand-danger focus:border-brand-danger focus:ring-brand-danger/20' : ''} ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-brand-card text-brand-textPrimary">
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-textMuted pointer-events-none">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {error && (
        <p id={id ? `${id}-error` : undefined} className="mt-1 text-xs text-brand-danger font-medium">{error}</p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;
