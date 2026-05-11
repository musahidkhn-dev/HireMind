import React from 'react';
import { twMerge } from 'tailwind-merge';

const ChartCard = ({ title, data = [], type = 'bar' }) => {
  const maxValue = Math.max(...data.map(d => d.value), 1);

  return (
    <div className="card p-4 lg:p-6 bg-white dark:bg-gray-900 h-full">
      <h3 className="text-[10px] lg:text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest mb-6 lg:mb-8 border-l-4 border-amber-600 pl-3">
        {title}
      </h3>

      <div className="flex items-end justify-between gap-1.5 lg:gap-2 h-36 lg:h-48">
        {data.map((item, idx) => {
          const heightPercentage = (item.value / maxValue) * 100;
          return (
            <div key={idx} className="flex-1 flex flex-col items-center gap-2 lg:gap-3 group h-full justify-end">
              <div className="relative w-full flex justify-center items-end h-full">
                {/* Tooltip */}
                <div className="absolute -top-8 bg-gray-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 font-bold">
                  {item.value}
                </div>
                {/* Bar */}
                <div 
                  className={twMerge(
                    "w-full max-w-[32px] lg:max-w-[40px] rounded-t-md lg:rounded-t-lg transition-all duration-500 bg-amber-100 dark:bg-amber-900 group-hover:bg-amber-600 group-hover:shadow-lg group-hover:shadow-amber-200 dark:group-hover:shadow-none",
                    idx === data.length - 1 && "bg-amber-600"
                  )}
                  style={{ height: `${heightPercentage}%` }}
                />
              </div>
              <span className="text-[9px] lg:text-[10px] font-bold text-gray-400 uppercase truncate w-full text-center">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChartCard;
