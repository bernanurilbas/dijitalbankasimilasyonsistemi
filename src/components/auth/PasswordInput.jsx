import React, { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';

const PasswordInput = React.forwardRef(({ 
  label, 
  error, 
  id, 
  className = '', 
  ...props 
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-xs font-semibold text-brand-textSecondary mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-textMuted pointer-events-none">
          <Lock size={18} />
        </div>
        <input
          id={id}
          ref={ref}
          type={showPassword ? 'text' : 'password'}
          className={`w-full bg-slate-100/50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-lg py-2.5 pl-11 pr-10 text-brand-textPrimary placeholder-brand-textMuted focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all ${error ? 'border-brand-danger focus:border-brand-danger focus:ring-brand-danger/20' : ''} ${className}`}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-textMuted hover:text-brand-textPrimary transition-colors focus:outline-none"
        >
          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
      {error && (
        <p className="mt-1 text-xs text-brand-danger font-medium">{error}</p>
      )}
    </div>
  );
});

PasswordInput.displayName = 'PasswordInput';

export default PasswordInput;
