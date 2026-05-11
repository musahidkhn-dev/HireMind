import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Zap, Kanban, BarChart3 } from 'lucide-react';

const features = [
  {
    title: 'AI Resume Scorer',
    description: 'Instantly grade resumes against job requirements with 99% accuracy using our custom LLM models.',
    icon: Brain,
    color: 'from-purple-500 to-amber-600',
    shadow: 'shadow-purple-100 dark:shadow-none'
  },
  {
    title: 'Smart Job Matching',
    description: 'Candidates get personalized job recommendations based on skills, experience, and career goals.',
    icon: Zap,
    color: 'from-amber-400 to-orange-600',
    shadow: 'shadow-amber-100 dark:shadow-none'
  },
  {
    title: 'Kanban Pipeline',
    description: 'Drag and drop applicants through custom hiring stages with automated status updates.',
    icon: Kanban,
    color: 'from-teal-400 to-emerald-600',
    shadow: 'shadow-teal-100 dark:shadow-none'
  },
  {
    title: 'Hiring Analytics',
    description: 'Track time-to-hire, source efficiency, and recruiter performance with beautiful real-time charts.',
    icon: BarChart3,
    color: 'from-rose-400 to-red-600',
    shadow: 'shadow-rose-100 dark:shadow-none'
  }
];

const Features = () => {
  return (
    <section className="py-12 lg:py-24 bg-white dark:bg-dark-900">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="text-center mb-8 lg:mb-16">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-amber-600 font-black uppercase tracking-[0.2em] text-[9px] lg:text-xs"
          >
            Why HireMind
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-2xl lg:text-5xl font-black text-gray-900 dark:text-white mt-2 lg:mt-4 mb-4 lg:mb-6 font-serif tracking-tight"
          >
            Revolutionize Your <span className="gradient-text">Hiring Process</span>
          </motion.h2>
          <motion.p 
             initial={{ opacity: 0, y: 10 }}
             whileInView={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.2 }}
            className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto text-[13px] lg:text-base px-2"
          >
            Stop wasting time on manual screening. Our AI-first approach helps you find the right people faster than ever before.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-8">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -5 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={`p-6 lg:p-10 rounded-[1.2rem] lg:rounded-[2.5rem] bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 transition-all ${feature.shadow}`}
            >
              <div className={`w-10 h-10 lg:w-16 lg:h-16 rounded-xl lg:rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-4 lg:mb-8 transition-transform group-hover:scale-110`}>
                <feature.icon size={20} className="lg:hidden" />
                <feature.icon size={32} className="hidden lg:block" />
              </div>
              <h3 className="text-lg lg:text-2xl font-black text-gray-900 dark:text-white mb-2 lg:mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-[13px] lg:text-base">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
