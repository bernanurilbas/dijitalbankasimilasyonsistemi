import React from 'react';

const Radio = React.forwardRef(({ 
  label, 
  name, 
  options = [], 
  error, 
  layout = 'horizontal', 
  className = '', 
  ...props 
}, ref) => {
  const layoutClasses = layout === 'vertical' ? 'flex flex-col gap-2' : 'flex flex-row gap-6';

  return (
    <div className="w-full">
      {label && (
        <span className="block text-xs font-semibold text-brand-textSecondary mb-2">
          {label}
        </span>
      )}
      <div className={`${layoutClasses} ${className}`}>
        {options.map((opt) => (
          <label key={opt.value} className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="radio"
              name={name}
              ref={ref}
              value={opt.value}
              className={`w-4 h-4 border border-white/10 bg-white/[0.02] text-brand-primary focus:ring-brand-primary/20 focus:ring-offset-0 focus:outline-none transition-all ${error ? 'border-brand-danger' : ''}`}
              {...props}
            />
            <span className="text-sm text-brand-textSecondary">{opt.label}</span>
          </label>
        ))}
      </div>
      {error && (
        <p className="mt-1 text-xs text-brand-danger font-medium">{error}</p>
      )}
    </div>
  );
});

Radio.displayName = 'Radio';

export default Radio;
