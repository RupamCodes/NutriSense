import React from 'react';

const Card = ({ children, className = '', padding = 'p-6', ...props }) => {
  return (
    <div 
      className={`bg-surface-container-lowest rounded-xl border border-outline-variant shadow-card ${padding} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

const CardHeader = ({ title, subtitle, action, className = '' }) => (
  <div className={`flex justify-between items-start mb-stack-md ${className}`}>
    <div>
      {title && <h2 className="font-headline-md text-headline-md text-on-surface">{title}</h2>}
      {subtitle && <p className="font-body-md text-body-md text-on-surface-variant mt-1">{subtitle}</p>}
    </div>
    {action && <div>{action}</div>}
  </div>
);

export { Card, CardHeader };
