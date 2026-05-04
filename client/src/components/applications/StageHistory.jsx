import React from 'react';
import { Check, Clock, User, ArrowRight } from 'lucide-react';
import { formatDate } from '../../utils/helpers';

const StageHistory = ({ history = [] }) => {
  if (!history || history.length === 0) {
    return <p className="text-sm text-gray-500 italic">No history available.</p>;
  }

  // Reverse history to show latest at top
  const sortedHistory = [...history].reverse();

  return (
    <div className="relative">
      {/* Timeline Line */}
      <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-amber-100 dark:bg-gray-800" />

      <div className="flex flex-col gap-8">
        {sortedHistory.map((item, idx) => (
          <div key={idx} className="relative flex items-start gap-6 group">
            {/* Timeline Dot/Icon */}
            <div className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center border-2 ${
              idx === 0 
                ? 'bg-amber-600 border-amber-600 text-white shadow-lg shadow-amber-200 dark:shadow-none' 
                : 'bg-white dark:bg-gray-900 border-amber-100 dark:border-gray-700 text-amber-400'
            }`}>
              {idx === 0 ? <Check size={12} /> : <Clock size={12} />}
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between gap-4">
                <h4 className={`text-sm font-bold ${idx === 0 ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>
                  {item.stage}
                </h4>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  {formatDate(item.movedAt)}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1 text-xs text-gray-400 font-medium">
                 <User size={12} />
                 <span>Moved by {item.movedBy?.name || 'Recruiter'}</span>
              </div>
              {item.note && (
                <div className="mt-3 p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400">
                  {item.note}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StageHistory;
