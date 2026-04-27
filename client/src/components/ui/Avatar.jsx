import React from 'react';

const Avatar = ({ src, name, size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-8 h-8 text-label-md',
    md: 'w-10 h-10 text-label-lg',
    lg: 'w-16 h-16 text-headline-md',
    xl: 'w-24 h-24 text-headline-lg',
  };

  const initials = name
    ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <div className={`
      relative inline-flex items-center justify-center rounded-full overflow-hidden bg-primary-container text-on-primary-container
      ${sizes[size]}
      ${className}
    `}>
      {src ? (
        <img src={src} alt={name} className="w-full h-full object-cover" />
      ) : (
        <span className="font-bold">{initials}</span>
      )}
    </div>
  );
};

export default Avatar;
