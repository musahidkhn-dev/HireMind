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
    <section className="section-padding bg-white dark:bg-dark-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-amber-600 font-black uppercase tracking-[0.2em] text-xs"
          >
            Why HireMind
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mt-4 mb-6 font-serif"
          >
            Revolutionize Your <span className="gradient-text">Hiring Process</span>
          </motion.h2>
          <motion.p 
             initial={{ opacity: 0, y: 10 }}
             whileInView={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.2 }}
            className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto"
          >
            Stop wasting time on manual screening. Our AI-first approach helps you find the right people faster and more efficiently than ever before.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -10 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={`p-10 rounded-[2.5rem] bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 transition-all ${feature.shadow}`}
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-8 transition-transform group-hover:scale-110`}>
                <feature.icon size={32} />
              </div>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
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
