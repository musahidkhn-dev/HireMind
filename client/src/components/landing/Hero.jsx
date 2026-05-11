import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Star, Brain, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

const Hero = ({ isReady }) => {
  const navigate = useNavigate();

  // 💎 Premium Luxury Easing
  const premiumEase = [0.22, 1, 0.36, 1];

  // Reveal Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, filter: 'blur(10px)' },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: 'blur(0px)',
      transition: { duration: 1.2, ease: premiumEase }
    }
  };

  return (
    <motion.section 
      initial="hidden"
      animate={isReady ? "visible" : "hidden"}
      variants={containerVariants}
      className="relative min-h-[85vh] lg:min-h-screen pt-20 pb-12 sm:pt-28 sm:pb-20 flex flex-col items-center justify-center bg-[#F5F7FB] dark:bg-slate-900 overflow-hidden font-sans select-none"
    >
      
      {/* 🏛️ Massive Background Typography */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center z-0">
        <motion.h2 
          animate={{ opacity: isReady ? 0.03 : 0.01 }}
          transition={{ duration: 2 }}
          className="text-[30vw] lg:text-[18vw] font-black text-indigo-950 dark:text-indigo-100 absolute tracking-tighter leading-none select-none opacity-[0.02]"
        >
          HIRE
        </motion.h2>
      </div>

      {/* 🌟 Ambient Background Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.4, 0.3],
            x: [-15, 15, -15]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-5%] right-[-2%] w-[400px] sm:w-[800px] h-[400px] sm:h-[800px] rounded-full bg-gradient-to-b from-indigo-200/40 to-purple-100/40 blur-[80px] sm:blur-[150px] dark:from-indigo-900/10 dark:to-purple-900/10" 
        />
      </div>

      <div className="max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-16 w-full relative z-10">
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 lg:gap-20 items-center">
          
          {/* 🔥 LEFT: Editorial Content */}
          <div className="w-full lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
            <motion.div variants={itemVariants} className="mb-4 lg:mb-6 inline-flex items-center gap-3 px-3.5 lg:px-5 py-1 lg:py-2 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border border-indigo-100 dark:border-slate-700">
              <Sparkles size={10} className="text-indigo-500" />
              <span className="text-[8px] lg:text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">The Intelligence Layer</span>
            </motion.div>

            <motion.h1 variants={itemVariants} className="text-[clamp(2.5rem,7.5vw,5.5rem)] font-serif font-medium text-slate-950 dark:text-white leading-[0.98] tracking-tighter mb-4 lg:mb-6">
              Hire <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 italic">Smarter.</span><br />
              Build Faster.
            </motion.h1>

            <motion.p variants={itemVariants} className="text-base lg:text-xl text-slate-600 dark:text-slate-400 max-w-xl mb-8 lg:mb-10 leading-snug font-medium tracking-tight">
              Elevate your recruiting pipeline with AI-driven insights and verified talent sourcing.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-row items-center justify-center lg:justify-start gap-3 lg:gap-4 w-full sm:w-auto">
              <button onClick={() => navigate('/jobs')} className="flex-1 sm:flex-none px-6 lg:px-10 py-3.5 lg:py-4.5 bg-slate-950 dark:bg-white text-white dark:text-slate-950 rounded-[1rem] lg:rounded-[1.2rem] text-sm lg:text-base font-bold transition-all hover:shadow-2xl hover:-translate-y-1 active:scale-95 shadow-xl shadow-slate-950/10">
                Explore Jobs
              </button>
              <button onClick={() => navigate('/register')} className="flex-1 sm:flex-none px-6 lg:px-10 py-3.5 lg:py-4.5 bg-white/40 dark:bg-slate-800/40 backdrop-blur-2xl text-slate-950 dark:text-white border-2 border-slate-200 dark:border-slate-700 rounded-[1rem] lg:rounded-[1.2rem] text-sm lg:text-base font-bold transition-all hover:bg-white dark:hover:bg-slate-700">
                Hire Talent
              </button>
            </motion.div>
          </div>

          {/* 🧥 RIGHT: Recruiter Composition */}
          <div className="w-full lg:col-span-5 relative mt-4 lg:mt-0">
            <div className="relative max-w-[280px] sm:max-w-[320px] lg:max-w-none mx-auto">
              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                animate={isReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                transition={{ duration: 1.5, ease: premiumEase, delay: 0.4 }}
                className="relative rounded-[2rem] lg:rounded-[3.5rem] overflow-hidden border-[4px] lg:border-[10px] border-white dark:border-slate-800 shadow-2xl aspect-[5/6]"
              >
                 <img src="/images/hero-recruiter-premium.png" alt="Elite Recruiter" className="w-full h-full object-cover" />
                 <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 via-transparent to-transparent" />
              </motion.div>

              {/* 💎 Floating AI Cards (Pinned to Image) */}
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                animate={isReady ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
                transition={{ delay: 0.8, duration: 1, ease: premiumEase }}
                className="absolute -top-3 lg:-top-8 -left-4 lg:-left-12 bg-white/95 dark:bg-slate-800/95 backdrop-blur-3xl p-2.5 lg:p-5 rounded-[1rem] lg:rounded-[2rem] shadow-xl flex items-center gap-2.5 lg:gap-4 w-[160px] lg:w-[280px] z-20"
              >
                <div className="w-7 h-7 lg:w-12 lg:h-12 rounded-lg lg:rounded-xl bg-indigo-600 flex items-center justify-center text-white text-[8px] lg:text-sm font-black">JS</div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-[9px] lg:text-sm font-black text-slate-900 dark:text-white truncate">John Smith</p>
                  <p className="text-[6px] lg:text-[9px] font-bold text-slate-400 uppercase tracking-widest">Match: 99.8%</p>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: 30 }}
                animate={isReady ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
                transition={{ delay: 1, duration: 1, ease: premiumEase }}
                className="absolute bottom-8 lg:bottom-16 -right-4 lg:-right-12 bg-slate-950/95 dark:bg-slate-900/95 backdrop-blur-3xl p-3 lg:p-6 rounded-[1.2rem] lg:rounded-[2.5rem] shadow-2xl w-[150px] lg:w-[260px] z-20"
              >
                <div className="flex items-center gap-2 lg:gap-3 text-white mb-2 lg:mb-4">
                  <Brain size={10} className="text-indigo-400" />
                  <span className="text-[7px] lg:text-[10px] font-black uppercase tracking-widest">AI Fit Analysis</span>
                </div>
                <div className="h-0.5 lg:h-1 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={isReady ? { width: '99%' } : { width: 0 }} transition={{ duration: 2, delay: 1.2 }} className="h-full bg-indigo-500" />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default Hero;
