import React from 'react';
import { motion } from 'framer-motion';

const GradientBackground = () => {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-[rgb(var(--background))]">
      <div className="absolute inset-0 opacity-20 mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
          x: [0, 50, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute -top-[40%] -left-[10%] w-[70%] h-[70%] rounded-full bg-indigo-300/20 dark:bg-indigo-900/10 blur-[120px]"
      />
      <motion.div
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.2, 0.4, 0.2],
          x: [0, -50, 0],
          y: [0, 50, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-slate-300/30 dark:bg-sky-900/10 blur-[120px]"
      />
    </div>
  );
};

export default GradientBackground;
