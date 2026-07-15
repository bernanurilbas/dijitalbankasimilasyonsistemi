import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const Breadcrumb = ({ 
  paths = [], 
  className = '' 
}) => {
  return (
    <nav className={`flex items-center gap-2 text-xs font-semibold text-brand-textMuted ${className}`}>
      <Link to="/" className="hover:text-brand-textPrimary transition-colors">
        Astra Bank
      </Link>
      {paths.map((p, idx) => {
        const isLast = idx === paths.length - 1;
        return (
          <React.Fragment key={idx}>
            <ChevronRight size={12} className="shrink-0" />
            {isLast || !p.to ? (
              <span className="text-brand-textSecondary truncate max-w-[120px] sm:max-w-none">
                {p.label}
              </span>
            ) : (
              <Link to={p.to} className="hover:text-brand-textPrimary transition-colors truncate max-w-[120px] sm:max-w-none">
                {p.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;
