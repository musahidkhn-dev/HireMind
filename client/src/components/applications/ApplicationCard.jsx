import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ExternalLink, Trash2, Calendar, Target } from 'lucide-react';
import Avatar from '../common/Avatar';
import Badge from '../common/Badge';
import Button from '../common/Button';
import ConfirmDialog from '../common/ConfirmDialog';
import StageHistory from './StageHistory';
import { timeAgo, stageBadgeVariant } from '../../utils/helpers';

const ApplicationCard = ({ application, onWithdraw, onViewDetail }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  
  const { 
    job, 
    company,
    status, 
    stage, 
    aiScore, 
    createdAt, 
    stageHistory = [] 
  } = application;

  const score = aiScore?.fitPercentage || 0;
  const scoreValue = score || 0;
  const scoreColor = scoreValue >= 80 ? 'text-green-500' : scoreValue >= 60 ? 'text-yellow-500' : 'text-red-500';

  return (
    <div className="card overflow-hidden hover:border-amber-100 dark:hover:border-amber-900 transition-all">
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4 flex-1">
            <Avatar src={company?.logo} name={company?.name} size="lg" className="rounded-2xl" />
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white hover:text-amber-600 transition-colors cursor-pointer" onClick={() => onViewDetail(application)}>
                {job?.title}
              </h3>
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">{company?.name}</p>
              <div className="flex items-center gap-4 mt-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                <span className="flex items-center gap-1"><Calendar size={14} /> {timeAgo(createdAt)}</span>
                <span className="flex items-center gap-1"><Target size={14} /> {job?.location}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-3">
             <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-[10px] font-black text-gray-400 uppercase mb-1">AI Match Score</p>
                  <p className={`text-xl font-black ${scoreColor}`}>{scoreValue}%</p>
                </div>
                <div className="w-12 h-12 rounded-full border-4 border-gray-100 dark:border-gray-800 flex items-center justify-center relative">
                   <svg className="w-full h-full -rotate-90">
                      <circle 
                        cx="24" cy="24" r="20" 
                        fill="transparent" 
                        stroke="currentColor" 
                        strokeWidth="4" 
                        strokeDasharray={126}
                        strokeDashoffset={126 - (126 * scoreValue) / 100}
                        className={scoreColor.replace('text', 'stroke')}
                      />
                   </svg>
                </div>
             </div>
             <Badge className={stageBadgeVariant(stage)}>{stage}</Badge>
          </div>
        </div>

        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-50 dark:border-gray-800">
           <Button variant="ghost" size="sm" icon={ChevronDown} onClick={() => setIsExpanded(!isExpanded)}>
              {isExpanded ? 'Hide' : 'Show'} History
           </Button>
           <div className="flex items-center gap-2">
              <Button variant="secondary" size="sm" icon={Trash2} onClick={() => setShowConfirm(true)} className="text-red-500 hover:bg-red-50" />
              <Button size="sm" icon={ExternalLink} onClick={() => onViewDetail(application)}>Details</Button>
           </div>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-gray-50 dark:bg-gray-900/50 px-8 py-6 border-t border-gray-100 dark:border-gray-800"
          >
            <StageHistory history={stageHistory} />
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={() => {
          onWithdraw(application._id);
          setShowConfirm(false);
        }}
        title="Withdraw Application?"
        message="Are you sure you want to withdraw your application for this position? This action cannot be undone."
      />
    </div>
  );
};

export default ApplicationCard;
