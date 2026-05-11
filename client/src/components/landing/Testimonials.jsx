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
    <section className="py-12 lg:py-24 bg-[#F5F7FB] dark:bg-slate-900 relative overflow-hidden transition-colors duration-500">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px] -z-0" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-[120px] -z-0" />

      <div className="max-w-7xl mx-auto px-5 lg:px-6 relative z-10">
        <div className="text-center mb-10 lg:mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-[8px] lg:text-[10px] font-black uppercase tracking-[0.2em] mb-4 lg:mb-6"
          >
            Social Proof
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl lg:text-6xl font-serif text-gray-900 dark:text-white mb-4 lg:mb-6 tracking-tight"
          >
            Loved by <span className="text-primary italic">thousands</span> of users.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-600 dark:text-gray-400 text-[13px] lg:text-lg max-w-2xl mx-auto font-medium px-4"
          >
            Don't just take our word for it. Here is what our global community has to say.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-20 items-center mb-12 lg:mb-24">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-6 lg:p-12 rounded-[1.5rem] lg:rounded-[3rem] bg-white/80 dark:bg-white/[0.03] backdrop-blur-xl border border-gray-100 dark:border-slate-700 shadow-2xl shadow-primary/5 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-4 lg:p-8 text-primary/10 group-hover:text-primary/20 transition-colors">
              <Quote size={60} className="lg:hidden" />
              <Quote size={120} className="hidden lg:block" />
            </div>
            <div className="relative z-10">
              <div className="flex gap-1 mb-4 lg:mb-10">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} size={12} className="lg:w-[18px] lg:h-[18px] fill-primary text-primary" />
                ))}
              </div>
              <p className="text-base lg:text-3xl text-gray-900 dark:text-white font-serif leading-relaxed mb-6 lg:mb-12 italic tracking-tight">
                "{testimonials[0].text}"
              </p>
              <div className="flex items-center gap-3 lg:gap-5">
                <div className="w-10 h-10 lg:w-16 lg:h-16 rounded-lg lg:rounded-[1.25rem] bg-primary flex items-center justify-center text-white text-base font-black shadow-xl shadow-primary/20">
                  {testimonials[0].avatar}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white text-sm lg:text-lg">{testimonials[0].name}</h4>
                  <p className="text-gray-500 dark:text-gray-400 font-medium text-[10px] lg:text-base">{testimonials[0].role}</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex justify-center relative hidden lg:flex"
          >
            {/* Visual Container */}
            <div className="relative w-full max-w-md aspect-[4/5] bg-gradient-to-br from-primary/5 to-secondary/5 dark:from-white/[0.02] dark:to-white/[0.05] rounded-[4rem] border border-gray-100 dark:border-slate-700 flex items-center justify-center p-8 overflow-hidden group">
               <motion.div 
                 animate={{ y: [0, -15, 0] }}
                 transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                 className="relative z-10"
               >
                 {/* Premium Realistic Portrait from Unsplash */}
                 <img 
                    src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80" 
                    alt="Professional Software Engineer" 
                    className="w-full h-full object-cover drop-shadow-[0_20px_50px_rgba(0,0,0,0.4)] rounded-3xl" 
                    loading="lazy"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-3xl pointer-events-none mix-blend-overlay" />
               </motion.div>

               {/* Floating Badges */}
               <motion.div 
                 animate={{ x: [0, 10, 0] }}
                 transition={{ duration: 4, repeat: Infinity }}
                 className="absolute top-10 left-10 p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-border dark:border-slate-700 z-20"
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-8">
          {testimonials.slice(1).map((t, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -5 }}
              className="p-6 lg:p-10 bg-white dark:bg-white/[0.02] rounded-[1.2rem] lg:rounded-[2.5rem] border border-gray-100 dark:border-slate-700 hover:border-primary/30 hover:shadow-2xl transition-all duration-500 group"
            >
              <Quote className="text-primary/20 mb-4 lg:mb-8 w-5 h-5 lg:w-8 lg:h-8" />
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6 lg:mb-10 font-medium italic text-[13px] lg:text-base">"{t.text}"</p>
              <div className="flex items-center gap-3 lg:gap-4 pt-4 lg:pt-6 border-t border-gray-50 dark:border-slate-700">
                <div className="w-9 h-9 lg:w-12 lg:h-12 rounded-lg lg:rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-primary font-black border border-gray-100 dark:border-slate-700 group-hover:scale-110 transition-transform text-[10px] lg:text-sm">
                  {t.avatar}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white text-[13px] lg:text-base leading-none">{t.name}</h4>
                  <p className="text-[8px] lg:text-[10px] text-gray-500 dark:text-gray-500 uppercase font-black tracking-widest mt-1">{t.role.split('@')[0]}</p>
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
