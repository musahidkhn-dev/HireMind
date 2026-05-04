import React from 'react';
import { motion } from 'framer-motion';
import { Target, Users, ShieldCheck } from 'lucide-react';

const AboutPage = () => {
  const stats = [
    { label: 'Active Users', value: '50K+' },
    { label: 'Companies', value: '2K+' },
    { label: 'Placements', value: '15K+' },
    { label: 'AI Interviews', value: '100K+' },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Hero */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-amber-500/10 blur-3xl rounded-full -z-10" />
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white mb-6"
          >
            Revolutionizing Recruitment with <span className="gradient-text">Intelligence</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto font-medium"
          >
            HireMind is an AI-powered talent acquisition platform designed to bridge the gap between ambitious talent and visionary companies.
          </motion.p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-y border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-3xl font-black text-amber-600 mb-1">{stat.value}</p>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-2xl flex items-center justify-center text-amber-600">
              <Target size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Our Mission</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              To democratize the hiring process by removing bias and using data-driven insights to match the right people with the right roles.
            </p>
          </div>
          <div className="space-y-4">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center text-purple-600">
              <Users size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Community First</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              We build tools that empower candidates to showcase their true potential beyond just a static resume.
            </p>
          </div>
          <div className="space-y-4">
            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center text-emerald-600">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Transparency</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Honest feedback and clear communication are at the heart of every interaction on our platform.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
