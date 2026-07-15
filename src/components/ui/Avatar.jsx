import React, { useState } from 'react';

const Avatar = ({ 
  src, 
  alt = 'Kullanıcı', 
  initials, 
  size = 'md', 
  className = '' 
}) => {
  const [hasError, setHasError] = useState(false);

  const baseStyles = 'relative inline-flex items-center justify-center rounded-full overflow-hidden font-bold select-none bg-brand-primary/10 text-brand-primary';

  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-lg',
  };

  return (
    <div className={`${baseStyles} ${sizes[size]} ${className}`}>
      {src && !hasError ? (
        <img
          src={src}
          alt={alt}
          onError={() => setHasError(true)}
          className="w-full h-full object-cover"
        />
      ) : (
        <span>{initials ? initials.substring(0, 2).toUpperCase() : '?'}</span>
      )}
    </div>
  );
};

export default Avatar;
