import React from 'react';

const PageHeader = ({ 
  title, 
  description, 
  actions, 
  className = '' 
}) => {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 ${className}`}>
      <div>
        <h2 className="text-xl font-bold text-brand-textPrimary">{title}</h2>
        {description && (
          <p className="text-xs text-brand-textSecondary mt-1 max-w-xl">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-3 shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
