import React from 'react';

const Spinner = ({ 
  size = 'md', 
  className = '' 
}) => {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div className={`animate-spin rounded-full border-t-brand-primary border-white/[0.08] ${sizes[size]}`} />
    </div>
  );
};

export default Spinner;
