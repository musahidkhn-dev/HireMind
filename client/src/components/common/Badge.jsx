import React from 'react';
import { twMerge } from 'tailwind-merge';

// REDESIGN: Updated badge variants from indigo to amber/golden palette
const variants = {
  default: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  primary: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400', // REDESIGN: Amber primary
  success: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  warning: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  danger: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  purple: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  dark: 'bg-gray-900 text-white dark:bg-gray-700 dark:text-gray-100', // REDESIGN: New dark variant for featured cards
  outline: 'bg-white border border-gray-300 text-gray-600 dark:bg-gray-900 dark:border-gray-600 dark:text-gray-400', // REDESIGN: New outline variant
};

const sizes = {
  xs: 'px-1.5 py-0.5 text-[8px]',
  sm: 'px-2 py-0.5 text-[10px]',
  md: 'px-3 py-1 text-xs',
};

const Badge = ({
  variant = 'default',
  size = 'md',
  children,
  className,
}) => {
  return (
    <span
      className={twMerge(
        'inline-flex items-center font-medium rounded-full border border-transparent',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  );
};

export default Badge;
