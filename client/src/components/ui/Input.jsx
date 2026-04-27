import React from 'react';

const Input = ({ 
  label, 
  error, 
  className = '', 
  icon: Icon,
  containerClassName = '',
  ...props 
}) => {
  return (
    <div className={`flex flex-col gap-1.5 ${containerClassName}`}>
      {label && (
        <label className="font-label-lg text-label-lg text-on-surface ml-1">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
            {Icon}
          </span>
        )}
        <input
          className={`
            w-full bg-surface-container-low border border-outline-variant rounded-lg p-3 
            font-body-md text-on-surface placeholder:text-outline
            focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary
            transition-all duration-200
            ${Icon ? 'pl-10' : ''}
            ${error ? 'border-error ring-1 ring-error' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="text-error text-label-md ml-1 mt-0.5">{error}</p>
      )}
    </div>
  );
};

export default Input;
