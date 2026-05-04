import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

const StatsCard = ({ title, value, icon: Icon, gradient, change, trend }) => {
  const isPositive = trend === 'up';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white p-8 rounded-3xl border border-border hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 group"
    >
      <div className="flex items-start justify-between mb-8">
        <div className={twMerge(
          'w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-500',
          gradient || 'bg-primary/10 text-primary'
        )}>
          <Icon size={24} />
        </div>
        {change && (
           <div className={twMerge(
            'flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider',
            isPositive 
              ? 'bg-secondary/10 text-secondary' 
              : 'bg-red-50 text-red-500'
          )}>
            {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {change}%
          </div>
        )}
      </div>

      <div>
        <p className="text-sm font-medium text-text-secondary mb-1">
          {title}
        </p>
        <h3 className="text-3xl font-bold text-text-primary tracking-tight">
          {value}
        </h3>
      </div>
    </motion.div>

  );
};

export default StatsCard;
