import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowUpDown, FileText, Activity, LayoutGrid } from 'lucide-react';
import { useMyApplications, useWithdrawApplication } from '../../hooks/useApplications';
import ApplicationCard from '../../components/applications/ApplicationCard';
import { CardSkeleton } from '../../components/common/Skeleton';
import EmptyState from '../../components/common/EmptyState';
import { PIPELINE_STAGES } from '../../utils/constants';

const MyApplications = () => {
  // ✅ STEP 1: Single Source of Truth
  const [activeStatus, setActiveStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const navigate = useNavigate();

  // Fetch all applications once (server-side sorting/search can still happen)
  const { data, isLoading } = useMyApplications({ 
    search: searchQuery,
    sortBy 
  });

  const applications = data?.applications || [];
  const withdrawMutation = useWithdrawApplication();



  // ✅ STEP 3 & 4: PURE FILTER FUNCTION + USE MEMO
  const filteredApplications = useMemo(() => {
    if (!applications || applications.length === 0) return [];

    if (activeStatus === "All") return applications;

    return applications.filter(app => {
      // ✅ STEP 8: HANDLE CASE MISMATCH & NORMALIZATION
      // Note: We check both currentStage and status to be extremely safe
      const appStatus = (app.currentStage || app.status || "").toLowerCase().trim();
      const targetStatus = activeStatus.toLowerCase().trim();
      
      return appStatus === targetStatus;
    });
  }, [applications, activeStatus]);

  // ✅ STEP 6: FIX BUTTON CLICK HANDLER
  const handleStatusChange = (status) => {

    setActiveStatus(status);
  };

  const statusButtons = ["All", ...PIPELINE_STAGES];

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h1 className="text-4xl font-serif text-text-primary dark:text-white mb-3">My Applications</h1>
          <p className="text-text-secondary font-medium">Manage and track all your active job applications in one place.</p>
        </div>
        
        {/* Optional: Quick Stats */}
        <div className="flex items-center gap-6 p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-border dark:border-slate-700">
           <div className="text-center px-4 border-r border-border dark:border-slate-600">
              <p className="text-[10px] font-bold text-text-secondary dark:text-gray-500 uppercase tracking-widest mb-1">Total</p>
              <p className="text-xl font-black text-primary">{applications.length}</p>
           </div>
           <div className="text-center px-4">
              <p className="text-[10px] font-bold text-text-secondary dark:text-gray-500 uppercase tracking-widest mb-1">Filtered</p>
              <p className="text-xl font-black text-secondary">{filteredApplications.length}</p>
           </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="space-y-6">
        {/* ✅ STEP 6: Status Buttons Rendering */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-hide">
          {statusButtons.map((status) => (
            <button
              key={status}
              onClick={() => handleStatusChange(status)}
              className={`px-6 py-3 rounded-xl text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                activeStatus === status 
                  ? 'bg-primary text-white shadow-xl shadow-primary/20 scale-105' 
                  : 'bg-white dark:bg-gray-900 text-text-secondary dark:text-gray-400 border border-border dark:border-slate-700 hover:border-primary/30'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="relative max-w-md w-full group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary dark:text-gray-500 group-focus-within:text-primary transition-all" size={20} />
            <input 
              type="text" 
              placeholder="Search by company or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-800 border border-border dark:border-slate-700 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-primary/5 transition-all dark:text-white font-medium"
            />
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-xs font-bold text-text-secondary dark:text-gray-500 uppercase tracking-widest">
              <ArrowUpDown size={16} />
              <span>Sort:</span>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent border-none p-0 text-text-primary dark:text-white focus:ring-0 cursor-pointer text-xs font-black"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="score">Highest Match</option>
              </select>
            </div>
            
            <button 
              onClick={() => navigate('/jobs')}
              className="flex items-center gap-2 px-6 py-3 bg-dark text-white rounded-xl text-sm font-bold hover:bg-black transition-colors"
            >
              <LayoutGrid size={18} />
              Browse Jobs
            </button>
          </div>
        </div>
      </div>

      {/* ✅ STEP 5: RENDER ONLY FILTERED DATA */}
      <div className="grid gap-6 min-h-[400px]">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div key="loading" className="space-y-6">
              {[...Array(3)].map((_, i) => <CardSkeleton key={i} />)}
            </motion.div>
          ) : filteredApplications.length > 0 ? (
            <motion.div 
              key={activeStatus}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {filteredApplications.map((app) => (
                <ApplicationCard 
                  key={app._id} 
                  application={app} 
                  onWithdraw={(id) => withdrawMutation.mutate(id)}
                  onViewDetail={() => navigate(`/jobs/${app.job?._id}`)}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <EmptyState 
                title={activeStatus === "All" ? "No applications found" : `No ${activeStatus} applications`}
                description={activeStatus === "All" 
                  ? "You haven't applied to any jobs yet. Start your journey today!" 
                  : `You don't have any applications currently in the ${activeStatus} stage.`}
                actionText="Explore Jobs"
                onAction={() => navigate('/jobs')}
              />
              

            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MyApplications;
