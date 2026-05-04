import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus, Briefcase, FileCheck, AlertCircle, ChevronRight } from 'lucide-react';
import Avatar from '../common/Avatar';
import { timeAgo } from '../../utils/helpers';

const ActivityItem = ({ activity }) => {
  const { user, type, action, time, target } = activity;

  const Icon = {
    application: FileCheck,
    job: Briefcase,
    user: UserPlus,
    alert: AlertCircle
  }[type] || AlertCircle;

  const iconColor = {
    application: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20',
    job: 'text-amber-500 bg-amber-50 dark:bg-amber-900/20',
    user: 'text-green-500 bg-green-50 dark:bg-green-900/20',
    alert: 'text-red-500 bg-red-50 dark:bg-red-900/20'
  }[type] || 'text-gray-500 bg-gray-50';

  return (
    <div className="flex items-start gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors group">
      <div className="relative">
        <Avatar src={user?.userImage} name={user?.name} size="sm" className="rounded-lg" />
        <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-950 ${iconColor}`}>
           <Icon size={10} />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-900 dark:text-white line-clamp-1">
          <span className="font-bold">{user?.name}</span> {action} <span className="font-bold text-amber-600">{target}</span>
        </p>
        <p className="text-[10px] font-bold text-gray-400 uppercase mt-1 tracking-wider">
          {timeAgo(time)}
        </p>
      </div>
      <button className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-amber-600">
        <ChevronRight size={18} />
      </button>
    </div>
  );
};

const ActivityFeed = ({ activities = [], viewAllLink = "/activity" }) => {
  return (
    <div className="card bg-white dark:bg-gray-900 overflow-hidden flex flex-col h-full">
      <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest border-l-4 border-amber-600 pl-3">
          Recent Activity
        </h3>
        <Link to={viewAllLink} className="text-xs font-bold text-amber-600 hover:underline">
          VIEW ALL
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {activities.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
             <p className="text-xs font-bold uppercase">No recent activity</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50 dark:divide-gray-800">
            {activities.map((activity, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <ActivityItem activity={activity} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityFeed;
