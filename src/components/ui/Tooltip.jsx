import React, { useState } from 'react';

const Tooltip = ({ 
  content, 
  children, 
  position = 'top', 
  className = '' 
}) => {
  const [active, setActive] = useState(false);

  const showTooltip = () => setActive(true);
  const hideTooltip = () => setActive(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div 
      className={`relative inline-block ${className}`}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}
      {active && (
        <div className={`absolute z-50 px-2 py-1 text-xs font-semibold text-brand-textPrimary bg-brand-card border border-brand-border rounded shadow-lg whitespace-nowrap pointer-events-none transition-opacity ${positionClasses[position]}`}>
          {content}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
