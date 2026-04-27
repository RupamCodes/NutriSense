import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  icon: Icon, 
  ...props 
}) => {
  const variants = {
    primary: 'bg-primary text-on-primary hover:bg-primary/90',
    secondary: 'bg-secondary text-on-secondary hover:bg-secondary/90',
    tertiary: 'bg-tertiary text-on-tertiary hover:bg-tertiary/90',
    outline: 'border border-outline text-primary hover:bg-surface-container-low',
    ghost: 'text-on-surface-variant hover:bg-surface-container-low',
    error: 'bg-error text-on-error hover:bg-error/90',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-label-md',
    md: 'px-4 py-2 text-label-lg',
    lg: 'px-6 py-3 text-headline-md',
  };

  return (
    <button
      className={`
        inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant] || variants.primary}
        ${sizes[size] || sizes.md}
        ${className}
      `}
      {...props}
    >
      {Icon && <span className="material-symbols-outlined text-[20px]">{Icon}</span>}
      {children}
    </button>
  );
};

export default Button;
