import React from 'react';
import { motion } from 'framer-motion';
import { useActivities } from '../../hooks/useDashboard';
import { timeAgo } from '../../utils/helpers';
import Avatar from '../../components/common/Avatar';
import Badge from '../../components/common/Badge';
import Loader from '../../components/common/Loader';
import { 
  UserPlus, Briefcase, FileCheck, 
  AlertCircle, History, Filter, Search
} from 'lucide-react';

const ActivityPage = () => {
  const { data, isLoading } = useActivities({ limit: 50 });
  const activities = data?.activities || [];

  const getIcon = (type) => {
    switch (type) {
      case 'application': return FileCheck;
      case 'job': return Briefcase;
      case 'user': return UserPlus;
      default: return AlertCircle;
    }
  };

  const getIconColor = (type) => {
    switch (type) {
      case 'application': return 'text-blue-500 bg-blue-50 dark:bg-blue-900/20';
      case 'job': return 'text-amber-500 bg-amber-50 dark:bg-amber-900/20';
      case 'user': return 'text-green-500 bg-green-50 dark:bg-green-900/20';
      default: return 'text-red-500 bg-red-50 dark:bg-red-900/20';
    }
  };

  if (isLoading) return <Loader fullScreen text="Fetching activities..." />;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2 flex items-center gap-3">
            <History className="text-amber-600" /> System Activity Log
          </h1>
          <p className="text-gray-500 font-medium">Track all actions performed within your organization.</p>
        </div>
      </div>

      {/* Activity List */}
      <div className="card bg-white dark:bg-gray-900 overflow-hidden shadow-xl shadow-gray-200/50 dark:shadow-none border-none">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
           <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search activities..." 
                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-amber-600 transition-all"
              />
           </div>
           <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-300 transition-all uppercase tracking-widest">
                 <Filter size={14} /> Filter
              </button>
           </div>
        </div>

        <div className="divide-y divide-gray-50 dark:divide-gray-800">
          {activities.length === 0 ? (
            <div className="py-20 text-center text-gray-400">
               <History size={48} className="mx-auto mb-4 opacity-20" />
               <p className="text-sm font-bold uppercase tracking-widest">No activity logs found</p>
            </div>
          ) : (
            activities.map((activity, idx) => {
              const Icon = getIcon(activity.type);
              const iconClass = getIconColor(activity.type);
              
              return (
                <motion.div
                  key={activity._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  className="p-6 flex flex-col md:flex-row md:items-center gap-6 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="relative">
                      <Avatar src={activity.user?.userImage} name={activity.user?.name} size="md" className="rounded-2xl" />
                      <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-950 ${iconClass}`}>
                        <Icon size={12} />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-900 dark:text-white">
                        <span className="font-black">{activity.user?.name}</span>
                        <span className="mx-1 text-gray-500 font-medium">{activity.action}</span>
                        <span className="font-black text-amber-600">{activity.target}</span>
                      </p>
                      <p className="text-[10px] font-black text-gray-400 uppercase mt-1 tracking-widest">
                        {timeAgo(activity.createdAt)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Badge variant={activity.type === 'job' ? 'primary' : 'default'} size="sm" className="font-black uppercase tracking-widest">
                      {activity.type}
                    </Badge>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Pagination Placeholder */}
        <div className="p-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 flex items-center justify-center">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">End of activity log</p>
        </div>
      </div>
    </div>
  );
};

export default ActivityPage;
