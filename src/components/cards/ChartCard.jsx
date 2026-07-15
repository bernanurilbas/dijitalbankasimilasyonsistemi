import React from 'react';

const ChartCard = ({ 
  title, 
  subtitle, 
  children, 
  className = ''
}) => {
  return (
    <div className={`glass-panel p-6 rounded-xl shadow-md ${className}`}>
      {(title || subtitle) && (
        <div className="mb-4">
          {title && <h3 className="text-sm font-bold text-brand-textPrimary">{title}</h3>}
          {subtitle && <p className="text-[10px] text-brand-textMuted mt-0.5">{subtitle}</p>}
        </div>
      )}
      <div className="w-full flex items-center justify-center min-h-[160px]">
        {children}
      </div>
    </div>
  );
};

export default ChartCard;
