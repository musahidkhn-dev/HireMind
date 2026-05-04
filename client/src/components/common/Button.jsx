import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// REDESIGN: Updated variant colors from indigo to golden/amber palette
const variants = {
  primary: 'bg-primary text-white hover:bg-primary-600 shadow-sm',
  secondary: 'bg-secondary text-white hover:bg-green-600 shadow-sm',
  accent: 'bg-accent text-white hover:bg-teal-600 shadow-sm',
  outline: 'bg-transparent border border-border text-text-primary hover:bg-gray-50 dark:border-gray-700 dark:text-gray-100 dark:hover:bg-gray-800',
  ghost: 'bg-transparent text-text-secondary hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800',
  danger: 'bg-red-500 text-white hover:bg-red-600 shadow-sm',
  dark: 'bg-dark text-white hover:bg-gray-900 shadow-sm',
};

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-sm font-medium',
  lg: 'px-8 py-4 text-base font-semibold',
};

const Button = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon: Icon,
  onClick,
  className,
  children,
  type = 'button',
  ...rest
}) => {
  return (
    <motion.button
      type={type}
      whileHover={!disabled && !loading ? { scale: 1.04 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      onClick={onClick}
      disabled={disabled || loading}
      className={twMerge(
        'inline-flex items-center justify-center rounded-2xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
        variants[variant],
        sizes[size],
        className
      )}
      {...rest}
    >
      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin mr-2" />
      ) : Icon ? (
        <Icon className={clsx('w-5 h-5', children && 'mr-2')} />
      ) : null}
      {children}
    </motion.button>
  );
};

export default Button;
