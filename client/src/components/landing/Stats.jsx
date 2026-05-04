import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Briefcase, Building2, Users2, Trophy } from 'lucide-react';

const StatItem = ({ icon: Icon, value, label }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = parseInt(value.substring(0, value.length - (isNaN(value.slice(-1)) ? 1 : 0)));
      const duration = 2000;
      const increment = end / (duration / 16);

      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);
      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  const suffix = isNaN(value.slice(-1)) ? value.slice(-1) : '';

  return (
    <div ref={ref} className="flex flex-col items-center text-center p-8">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white mb-6 shadow-lg shadow-amber-200 dark:shadow-none">
        <Icon size={32} />
      </div>
      <h3 className="text-4xl font-black text-gray-900 dark:text-white mb-2">
        {count}{suffix}
      </h3>
      <p className="text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest text-xs">
        {label}
      </p>
    </div>
  );
};

const Stats = () => {
  return (
    <section className="bg-white dark:bg-black border-y border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 divide-x-0 lg:divide-x divide-gray-100 dark:divide-gray-800">
          <StatItem icon={Briefcase} value="1300+" label="Jobs Posted" />
          <StatItem icon={Building2} value="300+" label="Companies" />
          <StatItem icon={Users2} value="3000+" label="Total Hires" />
          <StatItem icon={Trophy} value="98%" label="Success Rate" />
        </div>
      </div>
    </section>
  );
};

export default Stats;
