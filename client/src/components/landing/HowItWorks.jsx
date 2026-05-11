import React from 'react';
import { motion } from 'framer-motion';

const steps = [
  {
    num: '01',
    title: 'Create Profile',
    desc: 'Set up your personal or company profile in seconds.'
  },
  {
    num: '02',
    title: 'Post or Apply',
    desc: 'Companies post jobs; candidates apply with a single click.'
  },
  {
    num: '03',
    title: 'AI Screening',
    desc: 'Our AI scores applications and flags the best matches.'
  },
  {
    num: '04',
    title: 'Connect & Hire',
    desc: 'Interview the top talent and close the deal.'
  }
];

const HowItWorks = () => {
  return (
    <section className="py-12 lg:py-24 bg-white dark:bg-black overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="text-center mb-10 lg:mb-20">
          <h2 className="text-2xl lg:text-5xl font-black text-gray-900 dark:text-white font-serif tracking-tight">
            How It <span className="text-amber-600">Works</span>
          </h2>
          <p className="text-gray-500 mt-2 lg:mt-3 text-[13px] lg:text-base">Simple, transparent, and efficient hiring journey.</p>
        </div>

        <div className="relative">
          {/* Connecting Line (Desktop) */}
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 dark:bg-gray-800 -translate-y-1/2 hidden lg:block" />

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-12">
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="relative flex flex-col items-center text-center group"
              >
                <div className="w-10 h-10 lg:w-16 lg:h-16 rounded-full bg-white dark:bg-gray-900 border-[2px] lg:border-4 border-gray-100 dark:border-gray-800 flex items-center justify-center text-base lg:text-2xl font-black text-amber-600 mb-3 lg:mb-6 group-hover:border-amber-500 group-hover:scale-110 transition-all z-10">
                  {step.num}
                </div>
                <h3 className="text-sm lg:text-xl font-bold text-gray-900 dark:text-white mb-1 lg:mb-2">{step.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-[11px] lg:text-sm max-w-[140px] lg:max-w-[200px] leading-tight lg:leading-normal">{step.desc}</p>
                
                {/* Visual Dot on line */}
                <div className="absolute top-1/2 left-0 w-3 h-3 bg-amber-600 rounded-full -translate-y-1/2 -translate-x-1.5 hidden lg:group-first:hidden group-last:block" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
