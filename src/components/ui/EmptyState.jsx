import React from 'react';

const EmptyState = ({ 
  title, 
  description, 
  icon: Icon, 
  action, 
  className = '' 
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 border border-dashed border-white/10 rounded-xl bg-white/[0.01] ${className}`}>
      {Icon && (
        <div className="text-brand-textMuted mb-4">
          <Icon size={40} />
        </div>
      )}
      <h3 className="text-base font-bold text-brand-textPrimary mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-brand-textMuted max-w-sm mb-5">{description}</p>
      )}
      {action && (
        <div>{action}</div>
      )}
    </div>
  );
};

export default EmptyState;
