import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Briefcase, Clock, DollarSign } from 'lucide-react';
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

  // REDESIGN: First card gets golden featured treatment
  const isFeatured = index === 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick?.(job)}
      className={`w-full rounded-[2.5rem] p-8 cursor-pointer transition-all duration-500 group relative flex flex-col h-full ${
        isFeatured
          ? 'bg-primary text-white shadow-[0_20px_40px_rgba(245,158,11,0.2)]'
          : 'bg-white dark:bg-[#1A1A1A] border border-border dark:border-white/5 hover:shadow-2xl dark:hover:shadow-none hover:border-primary/20 dark:hover:border-primary/30'
      }`}
    >
      {isFeatured && (
        <div className="absolute top-0 right-0 p-6">
          <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
            Featured
          </span>
        </div>
      )}

      <div className="flex items-center gap-4 mb-8">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center overflow-hidden border transition-colors ${
          isFeatured ? 'bg-white/20 border-white/20' : 'bg-gray-50 dark:bg-white/5 border-border dark:border-white/5'
        }`}>
          {company?.logo ? (
            <img src={getImageUrl(company.logo)} alt={company.name} className="w-full h-full object-cover" />
          ) : (
            <span className={`text-xl font-bold ${isFeatured ? 'text-white' : 'text-primary'}`}>
              {company?.name?.[0]}
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className={`text-sm font-bold truncate ${isFeatured ? 'text-white/90' : 'text-text-primary dark:text-white'}`}>
            {company?.name}
          </p>
          <div className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest ${isFeatured ? 'text-white/60' : 'text-text-secondary dark:text-gray-500'}`}>
            <Clock size={12} />
            {timeAgo(createdAt)}
          </div>
        </div>
      </div>

      <div className="flex-1">
        <h3 className={`text-2xl font-serif mb-4 leading-tight tracking-tight ${
          isFeatured ? 'text-white' : 'text-text-primary dark:text-white group-hover:text-primary transition-colors'
        }`}>
          {title}
        </h3>
        <p className={`text-sm line-clamp-3 mb-8 leading-relaxed font-medium ${
          isFeatured ? 'text-white/80' : 'text-text-secondary dark:text-gray-400'
        }`}>
          {description || "No description provided."}
        </p>
      </div>

      <div className="space-y-6">
        <div className="flex flex-wrap gap-x-6 gap-y-3">
          <div className={`flex items-center gap-2 text-xs font-bold ${isFeatured ? 'text-white/90' : 'text-text-primary dark:text-gray-300'}`}>
            <div className={`p-1.5 rounded-lg ${isFeatured ? 'bg-white/20' : 'bg-primary/10 text-primary'}`}>
              <MapPin size={14} />
            </div>
            {location || 'Remote'}
          </div>
          <div className={`flex items-center gap-2 text-xs font-bold ${isFeatured ? 'text-white/90' : 'text-text-primary dark:text-gray-300'}`}>
            <div className={`p-1.5 rounded-lg ${isFeatured ? 'bg-white/20' : 'bg-secondary/10 text-secondary'}`}>
              <DollarSign size={14} />
            </div>
            {formatSalary(salaryRange?.min, salaryRange?.max, salaryRange?.currency)}
          </div>
        </div>

        <div className={`h-px w-full ${isFeatured ? 'bg-white/20' : 'bg-border dark:bg-white/5'}`} />

        <div className="flex items-center justify-between">
          <div className="flex -space-x-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className={`w-8 h-8 rounded-full border-2 ${isFeatured ? 'border-primary bg-white/30' : 'border-white dark:border-[#1A1A1A] bg-gray-100 dark:bg-white/10'} flex items-center justify-center text-[8px] font-black`}>
                {i}+
              </div>
            ))}
          </div>
          <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${isFeatured ? 'text-white' : 'text-primary'}`}>
            View Details
          </span>
        </div>
      </div>
    </motion.div>

  );
};

export default JobCard;
