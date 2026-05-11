import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import Button from '../common/Button';

const CTA = () => {
  return (
    <section className="py-10 lg:py-24 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="max-w-6xl mx-auto rounded-[1.5rem] lg:rounded-[3rem] bg-gradient-to-r from-amber-400 to-amber-600 p-8 lg:p-20 text-center text-white relative overflow-hidden shadow-2xl shadow-amber-200 dark:shadow-none"
      >
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

        <div className="relative z-10">
          <h2 className="text-2xl lg:text-6xl font-black mb-4 lg:mb-8 leading-tight font-serif px-2 tracking-tight">
            Ready to hire smarter? <br className="hidden sm:block" />
            Join HireMind today.
          </h2>
          <p className="text-amber-100 text-[13px] lg:text-lg mb-6 lg:mb-12 max-w-xl mx-auto px-4 leading-relaxed lg:leading-normal">
            Scale your team with AI-driven precision. Start your 14-day free trial and experience the future of recruitment.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 lg:gap-4 mb-6 lg:mb-12">
            <Button size="lg" className="w-full sm:w-auto bg-white text-amber-600 hover:bg-gray-50 border-none px-8 lg:px-10 h-11 lg:h-14 font-bold text-sm lg:text-base">
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white/10 px-8 lg:px-10 h-11 lg:h-14 font-bold text-sm lg:text-base">
              Browse Jobs
            </Button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 lg:gap-8 text-[10px] lg:text-sm font-bold text-amber-100 opacity-90">
            <div className="flex items-center gap-1.5 lg:gap-2">
              <CheckCircle size={14} className="lg:w-4 lg:h-4" /> No credit card required
            </div>
            <div className="flex items-center gap-1.5 lg:gap-2">
              <CheckCircle size={14} className="lg:w-4 lg:h-4" /> Free 14-day trial
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default CTA;
