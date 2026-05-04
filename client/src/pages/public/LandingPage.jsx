import React, { useEffect } from 'react';
import Hero from '../../components/landing/Hero';
import Stats from '../../components/landing/Stats';
import Features from '../../components/landing/Features';
import HowItWorks from '../../components/landing/HowItWorks';
import Testimonials from '../../components/landing/Testimonials';
import CTA from '../../components/landing/CTA';
import Categories from '../../components/landing/Categories';
import TipsSection from '../../components/landing/TipsSection'; // REDESIGN: New tips section

const LandingPage = () => {
  useEffect(() => {
    document.title = "HireMind - AI Powered Hiring";
  }, []);

  return (
    <div className="flex flex-col">
      <Hero />
      <Categories />
      <Stats />
      <Features />
      <HowItWorks />
      <Testimonials />
      <TipsSection /> {/* REDESIGN: Added tips section before CTA */}
      <CTA />
    </div>
  );
};

export default LandingPage;
