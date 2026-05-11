import React from 'react';
import { motion } from 'framer-motion';

const CinematicLoader = ({ fullScreen = false, text = "Powering up HireMind..." }) => {
  const containerClasses = fullScreen 
    ? "fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#F5F7FB] dark:bg-slate-900 overflow-hidden" 
    : "flex flex-col items-center justify-center p-8 w-full h-full min-h-[300px]";

  // 💎 Premium Luxury Easing
  const premiumEase = [0.22, 1, 0.36, 1];

  return (
    <div className={containerClasses}>
      {/* 🌌 Atmospheric Depth */}
      {fullScreen && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-[120px] animate-pulse" />
        </div>
      )}

      {/* 🧠 Core Loader UI */}
      <div className="relative flex flex-col items-center z-10">
        <div className="relative w-20 h-20 mb-12">
          {/* Outer Ring */}
          <div className="absolute inset-0 border-2 border-t-indigo-600 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
          {/* Inner Ring */}
          <div className="absolute inset-2 border border-b-purple-500 border-t-transparent border-r-transparent border-l-transparent rounded-full opacity-40 animate-spin-slow" />
          {/* Center Pulse */}
          <div className="absolute inset-6 bg-slate-900 dark:bg-white rounded-xl shadow-2xl shadow-indigo-500/20 animate-pulse" />
        </div>

        {/* Editorial Typography */}
        <div className="flex flex-col items-center gap-4">
          <span className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-[0.4em]">
            {text}
          </span>
          
          {/* Progress Bar (Minimalist) */}
          <div className="w-48 h-[1px] bg-slate-200 dark:bg-slate-800 relative overflow-hidden">
            <div className="absolute inset-0 bg-indigo-600 animate-progress" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CinematicLoader;
