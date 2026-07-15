import React from 'react';

const Switch = React.forwardRef(({ 
  label, 
  error, 
  className = '', 
  id, 
  ...props 
}, ref) => {
  return (
    <div className="w-full">
      <label className={`flex items-center gap-3 cursor-pointer select-none ${className}`}>
        <div className="relative">
          <input
            type="checkbox"
            id={id}
            ref={ref}
            className="sr-only peer"
            {...props}
          />
          <div className="w-10 h-6 bg-white/[0.08] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-brand-textPrimary after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-success"></div>
        </div>
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

Switch.displayName = 'Switch';

export default Switch;
