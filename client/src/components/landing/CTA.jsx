import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import Button from '../common/Button';

const CTA = () => {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="max-w-6xl mx-auto rounded-[3rem] bg-gradient-to-r from-amber-400 to-amber-600 p-12 md:p-20 text-center text-white relative overflow-hidden shadow-2xl shadow-amber-200 dark:shadow-none"
      >
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

        <div className="relative z-10">
          <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight font-serif">
            Ready to hire smarter? <br />
            Join HireMind today.
          </h2>
          <p className="text-amber-100 text-lg mb-12 max-w-2xl mx-auto">
            Scale your team with AI-driven precision. Start your 14-day free trial and experience the future of recruitment.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button size="lg" className="bg-white text-amber-600 hover:bg-gray-50 border-none px-10">
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-10">
              Browse Jobs
            </Button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-8 text-sm font-bold text-amber-100">
            <div className="flex items-center gap-2">
              <CheckCircle size={18} /> No credit card required
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle size={18} /> Free 14-day trial
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle size={18} /> 24/7 support
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default CTA;
