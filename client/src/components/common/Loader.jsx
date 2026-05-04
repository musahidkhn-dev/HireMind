import React from 'react';
import { Loader2 } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

const sizes = {
  sm: 'w-6 h-6',
  md: 'w-10 h-10',
  lg: 'w-16 h-16',
};

const Loader = ({
  size = 'md',
  fullScreen = false,
  text,
}) => {
  const content = (
    <div className="flex flex-col items-center justify-center gap-4">
      <Loader2 className={twMerge('animate-spin text-amber-600', sizes[size])} />
      {text && (
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 animate-pulse">
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/80 backdrop-blur-sm dark:bg-black/80">
        {content}
      </div>
    );
  }

  return content;
};

export default Loader;
