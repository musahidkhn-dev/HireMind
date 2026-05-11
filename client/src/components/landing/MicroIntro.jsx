import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MicroIntro = ({ onComplete }) => {
  const [phase, setPhase] = useState(1);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(2), 1200),
      setTimeout(() => onComplete(), 3200)
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  const premiumEase = [0.22, 1, 0.36, 1];

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 1.2, ease: premiumEase } }}
      className="fixed inset-0 z-[9999] bg-[#F5F7FB] dark:bg-slate-900 flex items-center justify-center overflow-hidden pointer-events-none"
    >
      {/* 🌌 Atmospheric Background */}
      <div className="absolute inset-0">
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-500/10 via-transparent to-transparent blur-[120px]" 
        />
      </div>

      <div className="relative z-10 w-full flex flex-col items-center justify-center px-8">
        <AnimatePresence mode="wait">
          {phase === 1 && (
            <motion.div
              key="phase1"
              initial={{ scale: 1.15, filter: 'blur(12px)', opacity: 0.6 }}
              animate={{ scale: 1, filter: 'blur(0px)', opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)', transition: { duration: 0.6 } }}
              transition={{ duration: 1, ease: premiumEase }}
              className="flex flex-col items-center"
            >
              <h1 className="text-[24vw] font-black uppercase text-slate-950 dark:text-white tracking-tighter leading-none m-0 select-none">
                HIRE
              </h1>
            </motion.div>
          )}

          {phase === 2 && (
            <motion.div
              key="phase2"
              initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.8, ease: premiumEase }}
              className="flex flex-col items-center"
            >
              <h1 className="text-7xl md:text-[10vw] font-serif font-medium text-slate-950 dark:text-white tracking-tighter leading-none">
                Hire <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Smarter.</span>
              </h1>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 🎞️ Minimalist Progress Indicator */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-32 h-px bg-slate-200 dark:bg-slate-800">
        <motion.div 
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 3.2, ease: "linear" }}
          className="h-full bg-indigo-600 origin-left"
        />
      </div>
    </motion.div>
  );
};

export default MicroIntro;
