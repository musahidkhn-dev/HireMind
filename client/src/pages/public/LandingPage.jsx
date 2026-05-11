import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Hero from '../../components/landing/Hero';
import Stats from '../../components/landing/Stats';
import Features from '../../components/landing/Features';
import HowItWorks from '../../components/landing/HowItWorks';
import Testimonials from '../../components/landing/Testimonials';
import CTA from '../../components/landing/CTA';
import Categories from '../../components/landing/Categories';
import TipsSection from '../../components/landing/TipsSection';
import MicroIntro from '../../components/landing/MicroIntro';

const LandingPage = () => {
  const [showIntro, setShowIntro] = useState(false);
  const [introFinished, setIntroFinished] = useState(false);
  
  useEffect(() => {
    document.title = "HireMind - AI Powered Hiring";
    const played = sessionStorage.getItem('hiremind_intro_played_micro');
    
    if (!played) {
      setShowIntro(true);
    } else {
      setIntroFinished(true);
    }
  }, []);

  const handleIntroComplete = () => {
    sessionStorage.setItem('hiremind_intro_played_micro', 'true');
    setShowIntro(false);
    setIntroFinished(true);
    window.dispatchEvent(new Event('hiremind_intro_finished'));
  };

  return (
    <div className="flex flex-col relative min-h-screen bg-[#F5F7FB] dark:bg-slate-900 overflow-x-hidden">
      {/* 🎬 1. PREMIUM MICRO INTRO OVERLAY */}
      <AnimatePresence>
        {showIntro && (
          <MicroIntro key="micro-intro" onComplete={handleIntroComplete} />
        )}
      </AnimatePresence>

      {/* 🏠 2. HOMEPAGE EMERGENCE */}
      <motion.div
        initial={false}
        animate={{ 
          opacity: introFinished ? 1 : 0.2,
          filter: introFinished ? "blur(0px)" : "blur(10px)",
          scale: introFinished ? 1 : 1.02
        }}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col"
      >
        <Hero isReady={introFinished} />
        <Categories />
        <Stats />
        <Features />
        <HowItWorks />
        <Testimonials />
        <TipsSection />
        <CTA />
      </motion.div>
    </div>
  );
};

export default LandingPage;
