import React from 'react';

const Skeleton = ({ 
  variant = 'rect', 
  className = '' 
}) => {
  const baseStyles = 'animate-pulse bg-white/[0.04]';

  const variants = {
    text: 'h-4 w-full rounded',
    circle: 'rounded-full',
    rect: 'rounded-lg',
  };

  return (
    <div className={`${baseStyles} ${variants[variant]} ${className}`} />
  );
};

export default Skeleton;
