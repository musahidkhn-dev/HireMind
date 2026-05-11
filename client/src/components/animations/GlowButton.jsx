import React from 'react';
import { motion } from 'framer-motion';

const GlowButton = ({ 
  children, 
  onClick, 
  className = '', 
  variant = 'primary', 
  type = 'button',
  disabled = false,
  ...props 
}) => {
  const baseStyles = "relative inline-flex items-center justify-center overflow-hidden rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-white text-black hover:bg-gray-100 dark:bg-white dark:text-black dark:hover:bg-gray-200 focus:ring-white/50",
    glow: "bg-black text-white dark:bg-white dark:text-black hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] focus:ring-purple-500",
    outline: "border border-gray-200 bg-transparent text-gray-900 hover:bg-gray-50 dark:border-slate-600 dark:text-white dark:hover:bg-white/5",
    danger: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500/50"
  };

  return (
    <button
      type={type}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {variant === 'glow' && (
        <span className="absolute inset-0 z-0 bg-gradient-to-r from-purple-500 to-sky-400 opacity-0 transition-opacity duration-300 group-hover:opacity-20" />
      )}
      <span className="relative z-10 flex items-center justify-center gap-2 px-6 py-2.5">
        {children}
      </span>
    </button>
  );
};

export default GlowButton;
