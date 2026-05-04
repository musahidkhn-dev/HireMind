import React from 'react';
import { twMerge } from 'tailwind-merge';

export const Skeleton = ({ className }) => {
  return (
    <div
      className={twMerge(
        'animate-pulse rounded-md bg-gray-200 dark:bg-gray-800',
        className
      )}
    />
  );
};

export const CardSkeleton = () => {
  return (
    <div className="card p-6 flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      <div className="flex gap-2 mt-2">
        <Skeleton className="h-8 w-20 rounded-full" />
        <Skeleton className="h-8 w-20 rounded-full" />
      </div>
    </div>
  );
};

// FIXED: TableRowSkeleton now returns valid <tr> and <td> structure to prevent DOM nesting warnings
export const TableRowSkeleton = ({ columns = 5 }) => {
  return (
    <tr>
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="px-6 py-4">
          <Skeleton className="h-4 w-full" />
        </td>
      ))}
    </tr>
  );
};

export const StatSkeleton = () => {
  return (
    <div className="card p-6 flex flex-col gap-2">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-8 w-16" />
      <Skeleton className="h-3 w-32" />
    </div>
  );
};

export default Skeleton;
