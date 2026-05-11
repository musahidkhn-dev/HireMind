import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

const StatsCard = ({ title, value, icon: Icon, color, trend }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white p-5 lg:p-8 rounded-2xl lg:rounded-3xl border border-border hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 group"
    >
      <div className="flex items-start justify-between mb-5 lg:mb-8">
        <div className={twMerge(
          'p-2 lg:p-3 rounded-xl lg:rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-500',
          color || 'bg-primary/10 text-primary'
        )}>
          <Icon className="lg:hidden" size={20} />
          <Icon className="hidden lg:block" size={24} />
        </div>
        {trend !== undefined && (
          <div className={twMerge(
            'flex items-center gap-1 text-[10px] lg:text-xs font-bold',
            trend >= 0 ? 'text-secondary' : 'text-red-500'
          )}>
            {trend >= 0 ? <TrendingUp size={12} className="lg:w-4 lg:h-4" /> : <TrendingDown size={12} className="lg:w-4 lg:h-4" />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>

      <div>
        <p className="text-[10px] lg:text-xs font-bold uppercase tracking-widest text-text-secondary mb-1">
          {title}
        </p>
        <h3 className="text-2xl lg:text-3xl font-black text-text-primary tracking-tight">
          {value}
        </h3>
      </div>
    </motion.div>
  );
};

export default StatsCard;
