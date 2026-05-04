import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Star, TrendingUp, Brain } from 'lucide-react';
import Button from '../common/Button';
import heroDashboard from '../../assets/hero-dashboard.png';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen pt-32 pb-20 flex items-center bg-[#FDFCFB] dark:bg-[#0F0F0F] overflow-hidden">
      {/* Subtle Background Decor */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 w-full relative z-10">
        {/* ✅ FIXED: Proper Grid Layout to prevent overlapping */}
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-16 lg:gap-24">
          
          {/* LEFT: TEXT CONTENT */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-start"
          >
            <div className="mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20">
                AI-Powered Recruitment
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-serif text-text-primary dark:text-white leading-[1.1] mb-6 tracking-tight">
              Master the art of <br />
              <span className="text-primary italic">hiring</span> with AI.
            </h1>

            <p className="text-lg text-text-secondary dark:text-gray-400 max-w-xl mb-10 leading-relaxed font-medium">
              HireMind revolutionizes the recruitment lifecycle. Seamlessly screen resumes, rank talent, and build high-performance teams with our state-of-the-art AI dashboard.
            </p>

            <div className="flex flex-wrap gap-4 mb-12">
              <Button size="xl" className="rounded-2xl px-10 shadow-xl shadow-primary/20" onClick={() => navigate('/jobs')}>
                Explore Jobs
              </Button>
              <Button variant="outline" size="xl" className="rounded-2xl px-10" onClick={() => navigate('/register')}>
                Hire Talent
              </Button>
            </div>

            <div className="flex items-center gap-10 pt-8 border-t border-gray-100 dark:border-white/5 w-full">
              <div>
                <p className="text-2xl font-black text-text-primary dark:text-white">98.5%</p>
                <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mt-1">Accuracy</p>
              </div>
              <div>
                <p className="text-2xl font-black text-text-primary dark:text-white">2.4k+</p>
                <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mt-1">Partners</p>
              </div>
            </div>
          </motion.div>

          {/* RIGHT: IMAGE & VISUALS */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:flex justify-center relative"
          >
            {/* Background Decorative Blur */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/20 rounded-full blur-[120px] -z-10" />
            
            <div className="relative group">
              {/* Main 3D Illustration */}
              <motion.img 
                src="/images/hero-3d.png" 
                alt="3D Hiring Illustration" 
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="w-full max-w-lg object-contain drop-shadow-[0_35px_60px_rgba(0,0,0,0.15)] group-hover:scale-105 transition-transform duration-700"
              />

              {/* Floating Cards (Premium Badges) */}
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="absolute top-10 -left-10 bg-white dark:bg-[#1A1A1A] p-4 rounded-2xl shadow-2xl border border-gray-100 dark:border-white/5 flex items-center gap-3 z-20"
              >
                <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
                   <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                </div>
                <span className="text-xs font-black uppercase tracking-widest text-gray-900 dark:text-white">AI Match ✓</span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2, duration: 0.5 }}
                className="absolute bottom-20 -right-10 bg-white dark:bg-[#1A1A1A] p-4 rounded-2xl shadow-2xl border border-gray-100 dark:border-white/5 flex flex-col gap-1 z-20"
              >
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Time Saved</span>
                <span className="text-xl font-black text-primary">40% ⚡</span>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* SEARCH BAR (Safe distance below grid) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-20 lg:mt-32 max-w-5xl mx-auto"
        >
          <div className="bg-white/80 dark:bg-[#1A1A1A]/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white dark:border-white/5 p-3 flex flex-col md:flex-row items-center gap-2">
            <div className="flex-1 flex items-center gap-4 px-6 py-4 w-full">
              <Search className="text-primary" size={22} />
              <input type="text" placeholder="Job titles or keywords" className="bg-transparent border-none outline-none text-text-primary dark:text-white w-full font-bold" />
            </div>
            <div className="hidden md:block w-px h-10 bg-border dark:bg-white/10" />
            <div className="flex-1 flex items-center gap-4 px-6 py-4 w-full">
              <MapPin className="text-primary" size={22} />
              <input type="text" placeholder="Location" className="bg-transparent border-none outline-none text-text-primary dark:text-white w-full font-bold" />
            </div>
            <Button size="xl" className="w-full md:w-auto rounded-[1.8rem] px-12 py-6 font-black" onClick={() => navigate('/jobs')}>
              Search
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
