import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, User, Star, CheckCircle } from 'lucide-react';

const TipsSection = () => {
  const tips = [
    'Find jobs that fit your qualifications.',
    'Optimize your cover letter and resume. Your cover letter and resume should be brief, easy to read and memorable for the hiring manager.',
    'Ask for help from your network. Asking for help is difficult for some people, but it can be an effective way to get a job fast.',
    'Consider a temporary position.',
    'Communicate with other people in your field at industry events, through email or over social media.',
  ];

  return (
    // REDESIGN: Dark background section with numbered tips list
    <section className="bg-dark py-32 px-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
         <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[120px]" />
         <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-accent/20 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row gap-20 items-center">
          {/* Left: Illustrations */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-1 w-full hidden lg:flex justify-center"
          >
            {/* 3D Character Background Card */}
            <div className="relative w-full max-w-md bg-gradient-to-br from-orange-50 to-amber-100 dark:from-slate-800 dark:to-slate-900 p-12 rounded-[3rem] shadow-2xl overflow-visible group">
               {/* Decorative Floating Elements */}
               <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
               <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-secondary/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />

               <motion.img
                 src="/images/sitting-3d.png"
                 alt="3D Character"
                 onError={(e) => { e.target.src = "https://via.placeholder.com/600x600?text=3D+Character"; console.log("Tips Image failed to load"); }}
                 onLoad={() => console.log("Tips Image loaded")}
                 whileHover={{ scale: 1.05, rotate: 2 }}
                 transition={{ duration: 0.5, ease: "easeOut" }}
                 className="w-full h-auto drop-shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-3xl relative z-10"
               />
            </div>
          </motion.div>

          {/* Right: Tips Content */}
          <div className="flex-1">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-serif text-white mb-12"
            >
              How to land your <br />
              <span className="text-primary italic">next big role</span> fast.
            </motion.h2>

            <div className="space-y-10">
              {tips.map((tip, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group"
                >
                  <div className="flex items-start gap-6">
                    <span className="text-5xl font-serif text-white/10 group-hover:text-primary/40 transition-colors duration-500">
                      0{i + 1}
                    </span>
                    <div className="pt-2">
                      <p className="text-lg text-gray-300 leading-relaxed group-hover:text-white transition-colors">
                        {tip}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TipsSection;
