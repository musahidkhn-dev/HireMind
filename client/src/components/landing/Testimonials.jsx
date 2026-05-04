import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, User, CheckCircle2 } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Chen',
    age: 28,
    role: 'HR Director @ TechFlow',
    experience: '5 years in talent acquisition',
    text: 'HireMind reduced our time-to-hire by 40%. The AI resume scorer is spooky accurate—it found candidates we would have missed.',
    avatar: 'SC'
  },
  {
    name: 'James Wilson',
    age: 32,
    role: 'Software Engineer',
    experience: '8 years in full-stack development',
    text: 'I applied to 5 jobs through HireMind and got 3 interviews in a week. The matching algorithm actually understands my technical skills.',
    avatar: 'JW'
  },
  {
    name: 'Elena Rodriguez',
    age: 35,
    role: 'CEO @ GrowthScale',
    experience: '10 years in startup leadership',
    text: 'The Kanban pipeline makes managing hundreds of applicants a breeze. Best recruitment tool we have used in years.',
    avatar: 'ER'
  },
  {
    name: 'Marcus Thorne',
    age: 30,
    role: 'Talent Acquisition',
    experience: '6 years in recruitment',
    text: 'Data-driven hiring is no longer a buzzword. With HireMind, we have the metrics to prove our recruitment ROI.',
    avatar: 'MT'
  }
];

const Testimonials = () => {
  return (
    // REDESIGN: Theme-aware section with premium visuals
    <section className="py-32 bg-[#FDFCFB] dark:bg-[#0A0A0A] relative overflow-hidden transition-colors duration-500">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px] -z-0" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-[120px] -z-0" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6"
          >
            Social Proof
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-6xl font-serif text-gray-900 dark:text-white mb-6 tracking-tight"
          >
            Loved by <span className="text-primary italic">thousands</span> of users.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto font-medium"
          >
            Don't just take our word for it. Here is what our global community has to say.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-2 gap-20 items-center mb-32">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-12 rounded-[3rem] bg-white/80 dark:bg-white/[0.03] backdrop-blur-xl border border-gray-100 dark:border-white/5 shadow-2xl shadow-primary/5 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-8 text-primary/10 group-hover:text-primary/20 transition-colors">
              <Quote size={120} />
            </div>
            <div className="relative z-10">
              <div className="flex gap-1.5 mb-10">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} size={18} className="fill-primary text-primary" />
                ))}
              </div>
              <p className="text-2xl md:text-3xl text-gray-900 dark:text-white font-serif leading-relaxed mb-12 italic">
                "{testimonials[0].text}"
              </p>
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-[1.25rem] bg-primary flex items-center justify-center text-white text-xl font-black shadow-xl shadow-primary/20">
                  {testimonials[0].avatar}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white text-lg">{testimonials[0].name}</h4>
                  <p className="text-gray-500 dark:text-gray-400 font-medium">{testimonials[0].role}</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex justify-center relative"
          >
            {/* Visual Container */}
            <div className="relative w-full max-w-md aspect-[4/5] bg-gradient-to-br from-primary/5 to-secondary/5 dark:from-white/[0.02] dark:to-white/[0.05] rounded-[4rem] border border-gray-100 dark:border-white/5 flex items-center justify-center p-8 overflow-hidden group">
               <motion.div 
                 animate={{ y: [0, -15, 0] }}
                 transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                 className="relative z-10"
               >
                 {/* This would be the new 3D image */}
                 <img 
                    src="/images/user-3d.png" 
                    alt="Happy User" 
                    className="w-full h-auto drop-shadow-[0_20px_50px_rgba(0,0,0,0.2)] rounded-3xl" 
                 />
               </motion.div>

               {/* Floating Badges */}
               <motion.div 
                 animate={{ x: [0, 10, 0] }}
                 transition={{ duration: 4, repeat: Infinity }}
                 className="absolute top-10 left-10 p-4 bg-white dark:bg-[#1A1A1A] rounded-2xl shadow-xl border border-border dark:border-white/5 z-20"
               >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-green-500/10 text-green-500 flex items-center justify-center">
                      <CheckCircle2 size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-gray-400">Status</p>
                      <p className="text-xs font-bold text-gray-900 dark:text-white">Hired</p>
                    </div>
                  </div>
               </motion.div>
            </div>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.slice(1).map((t, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -10 }}
              className="p-10 bg-white dark:bg-white/[0.02] rounded-[2.5rem] border border-gray-100 dark:border-white/5 hover:border-primary/30 hover:shadow-2xl transition-all duration-500 group"
            >
              <Quote className="text-primary/20 mb-8" size={32} />
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-10 font-medium italic">"{t.text}"</p>
              <div className="flex items-center gap-4 pt-6 border-t border-gray-50 dark:border-white/5">
                <div className="w-12 h-12 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-primary font-black border border-gray-100 dark:border-white/5 group-hover:scale-110 transition-transform">
                  {t.avatar}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">{t.name}</h4>
                  <p className="text-[10px] text-gray-500 dark:text-gray-500 uppercase font-black tracking-widest">{t.role.split('@')[0]}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
