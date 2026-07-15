import React from 'react';
import { Search, X } from 'lucide-react';

const SearchBox = ({ 
  value, 
  onChange, 
  placeholder = 'Arama yapın...', 
  className = '' 
}) => {
  return (
    <div className={`relative w-full ${className}`}>
      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-textMuted pointer-events-none">
        <Search size={18} />
      </div>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-slate-100/50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-lg py-2 px-10 text-sm text-brand-textPrimary placeholder-brand-textMuted focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all"
      />
      {value && (
        <button
          onClick={() => onChange({ target: { value: '' } })}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-textMuted hover:text-brand-textPrimary transition-colors"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default SearchBox;
