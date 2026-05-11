import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'framer-motion';
import { MapPin, Briefcase, Clock, DollarSign, ArrowRight } from 'lucide-react';
import Avatar from '../common/Avatar';
import Badge from '../common/Badge';
import { formatSalary, timeAgo, getImageUrl } from '../../utils/helpers';

const JobCard = ({ job, onClick, index }) => {
  const {
    title,
    company,
    description,
    location,
    jobType,
    salaryRange,
    skills = [],
    applicationCount = 0,
    createdAt,
  } = job;

  const isFeatured = index === 0;

  // Cinematic 3D Tilt & Magnetic Hover Logic
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  // Subtle elegant tilt (max 4 degrees)
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["4deg", "-4deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-4deg", "4deg"]);

  // Subtle ambient lighting tracking
  const spotlightX = useTransform(mouseXSpring, [-0.5, 0.5], ["0%", "100%"]);
  const spotlightY = useTransform(mouseYSpring, [-0.5, 0.5], ["0%", "100%"]);
  const spotlightBackground = useMotionTemplate`radial-gradient(500px circle at ${spotlightX} ${spotlightY}, rgba(79, 70, 229, 0.04), transparent 70%)`;

  const handlePointerMove = (e) => {
    // Only apply magnetic tilt for mouse interactions, keeping mobile touch clean
    if (!ref.current || e.pointerType !== "mouse") return;
    
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    
    x.set(xPct);
    y.set(yPct);
  };

  const handlePointerLeave = () => {
    // Reset smoothly to default position
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: index * 0.05 }}
      whileHover={{ y: -2, scale: 1.005 }}
      whileTap={{ scale: 0.99 }}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 1200,
      }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onClick={() => onClick?.(job)}
      className={`w-full rounded-[1.2rem] lg:rounded-[1.8rem] p-4 lg:p-6 cursor-pointer group relative flex flex-col h-full overflow-hidden ${
        isFeatured
          ? 'bg-white dark:bg-slate-800 border border-indigo-100 dark:border-slate-700 shadow-[0_4px_20px_rgba(79,70,229,0.06)] dark:shadow-md'
          : 'bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-slate-700 shadow-sm transition-all duration-300'
      }`}
    >
      {/* Animated Subtle Spotlight Overlay */}
      <motion.div 
        className="absolute inset-0 z-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700 hidden sm:block" 
        style={{ background: spotlightBackground }} 
      />

      {isFeatured && (
        <div className="absolute top-0 right-0 p-3 lg:p-4 z-20">
          <span className="flex items-center gap-1.5 px-2.5 py-0.5 lg:px-3 lg:py-1 bg-indigo-50 dark:bg-slate-700 rounded-full text-[7px] lg:text-[9px] font-black uppercase tracking-wider text-indigo-700 dark:text-indigo-300 border border-indigo-100/50">
            <span className="w-1 h-1 rounded-full bg-indigo-500 animate-pulse" />
            Featured
          </span>
        </div>
      )}

      <div className="relative z-10 flex items-start gap-3 lg:gap-4 mb-4 lg:mb-5">
        <div className="w-10 h-10 lg:w-14 lg:h-14 rounded-lg lg:rounded-xl flex-shrink-0 bg-white border border-slate-100 dark:bg-slate-800 dark:border-slate-700 overflow-hidden shadow-sm">
          {company?.logo ? (
            <img src={getImageUrl(company.logo)} alt={company.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-sm lg:text-lg">
              {company?.name?.[0]}
            </div>
          )}
        </div>
        
        <div className="min-w-0 flex-1 pt-0.5">
          <p className="text-[10px] lg:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-0.5">
            {company?.name}
          </p>
          <h3 className="text-base lg:text-xl font-serif text-slate-900 dark:text-white leading-tight tracking-tight group-hover:text-primary transition-colors">
            {title}
          </h3>
        </div>
      </div>

      <div className="relative z-10 flex-1 mb-5">
        <p className="text-[11px] lg:text-[13px] line-clamp-2 leading-relaxed text-slate-600 dark:text-slate-400 font-medium">
          {description || "Join our team and help us build the next generation of AI-powered solutions."}
        </p>
      </div>

      <div className="relative z-10 mt-auto space-y-4">
        <div className="flex flex-wrap gap-2 lg:gap-3">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-[10px] lg:text-[11px] font-bold text-slate-600 dark:text-slate-300">
            <MapPin size={12} className="text-slate-400" />
            {location || 'Remote'}
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-[10px] lg:text-[11px] font-bold text-slate-600 dark:text-slate-300">
            <DollarSign size={12} className="text-slate-400" />
            {formatSalary(salaryRange?.min, salaryRange?.max, salaryRange?.currency)}
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50/50 dark:bg-indigo-500/10 border border-indigo-100/50 dark:border-indigo-500/20 text-[10px] lg:text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
            <Briefcase size={12} className="text-indigo-400" />
            {jobType?.replace('-', ' ') || 'Full Time'}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[9px] lg:text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            <Clock size={12} />
            {timeAgo(createdAt)}
          </div>
          <div className="flex items-center gap-1 text-[10px] lg:text-xs font-black uppercase tracking-wider text-primary group-hover:gap-2 transition-all">
            <span>Details</span>
            <ArrowRight size={14} />
          </div>
        </div>
      </div>
    </motion.div>

  );
};

export default JobCard;
