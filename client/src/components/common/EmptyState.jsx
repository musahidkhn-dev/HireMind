import React from 'react';
import Button from './Button';
import { twMerge } from 'tailwind-merge';

const EmptyState = ({
  icon: Icon,
  title,
  description,
  action,
  className,
}) => {
  return (
    <div className={twMerge(
      'flex flex-col items-center justify-center text-center p-12 rounded-3xl border-2 border-dashed border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/30',
      className
    )}>
      {Icon && (
        <div className="p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-sm mb-6 text-gray-400">
          <Icon size={48} />
        </div>
      )}
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-gray-500 dark:text-gray-400 max-w-xs mb-8">
        {description}
      </p>
      {action && (
        <Button onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
