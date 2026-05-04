import React, { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

const Input = forwardRef(({
  label,
  error,
  icon: Icon,
  type = 'text',
  placeholder,
  className,
  ...rest
}, ref) => {
  return (
    <div className="flex flex-col w-full gap-1.5">
      {label && (
        <label className="text-sm font-medium text-text-primary dark:text-gray-300">
          {label}
        </label>
      )}
      <div className="relative group">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary transition-colors">
            <Icon size={18} />
          </div>
        )}
        <input
          ref={ref}
          type={type}
          placeholder={placeholder}
          className={twMerge(
            'w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm text-text-primary outline-none transition-all focus:ring-4 focus:ring-primary/10 focus:border-primary dark:border-gray-700 dark:bg-gray-900 dark:text-white',
            Icon && 'pl-11',
            error && 'border-red-500 focus:ring-red-500/10 focus:border-red-500',
            className
          )}
          {...rest}
        />
      </div>
      {error && (
        <p className="text-xs font-medium text-red-500 mt-1">
          {error}
        </p>
      )}
    </div>

  );
});

Input.displayName = 'Input';

export default Input;
