import React, { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

const Select = forwardRef(({
  label,
  error,
  options = [],
  placeholder,
  className,
  ...rest
}, ref) => {
  return (
    <div className="flex flex-col w-full gap-1.5">
      {label && (
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <select
        ref={ref}
        className={twMerge(
          'w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-gray-900 outline-none transition-all focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white appearance-none',
          error && 'border-red-500 focus:ring-red-500/20 focus:border-red-500',
          className
        )}
        {...rest}
      >
        {placeholder && (
          <option key="placeholder" value="" disabled selected>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-xs font-medium text-red-500 animate-fadeIn">
          {error}
        </p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;
