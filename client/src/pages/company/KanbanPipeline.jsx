import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Filter, SlidersHorizontal, ArrowLeft, Brain, Search } from 'lucide-react';
import { useCompanyJobs } from '../../hooks/useJobs';
import { useJobApplicants } from '../../hooks/useApplications';
import { useBulkScore } from '../../hooks/useAI';
import KanbanBoard from '../../components/kanban/KanbanBoard';
import Button from '../../components/common/Button';
import GlowButton from '../../components/animations/GlowButton';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import Badge from '../../components/common/Badge';
import PositionSelector from '../../components/common/PositionSelector';

const KanbanPipeline = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const jobId = searchParams.get('jobId');

  const { data: jobsData, isLoading: jobsLoading } = useCompanyJobs();
  const { data: applicantsData, isLoading: appsLoading } = useJobApplicants(jobId, { limit: 100 });
  const bulkScoreMutation = useBulkScore();

  const selectedJob = jobsData?.find(j => j._id === jobId);

  // STABILITY: Handle initial loading state to prevent blank screens
  if (jobsLoading) {
    return <Loader fullScreen text="Syncing your pipeline..." />;
  }

  return (
    <div className="flex flex-col min-h-screen lg:h-[calc(100vh-140px)]">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-4">
           <button onClick={() => navigate(-1)} className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-border dark:border-slate-700 hover:text-primary transition-colors">
              <ArrowLeft size={20} />
           </button>
           <div>
              <h1 className="text-2xl lg:text-3xl font-serif font-bold text-text-primary dark:text-white">Hiring Pipeline</h1>
              <p className="text-xs lg:text-sm text-text-secondary dark:text-gray-400 font-medium">Visual drag-and-drop workflow for applicants.</p>
           </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
           <div className="w-full sm:w-64 z-50">
              <PositionSelector 
                jobs={jobsData || []} 
                selectedId={jobId} 
                onChange={(id) => setSearchParams({ jobId: id })} 
              />
           </div>
           <GlowButton 
              variant="glow" 
              className="w-full sm:w-auto"
              disabled={!jobId || bulkScoreMutation.isPending}
              onClick={() => bulkScoreMutation.mutate(jobId)}
            >
              <Brain size={18} />
              {bulkScoreMutation.isPending ? 'Scoring...' : 'Score Stage'}
            </GlowButton>
        </div>
      </div>

      {/* Main Board Area */}
      <div className="flex-1 min-h-0 bg-white/60 dark:bg-slate-800/40 backdrop-blur-sm rounded-2xl lg:rounded-[2.5rem] p-4 lg:p-6 overflow-hidden flex flex-col border border-border dark:border-slate-700 shadow-sm">
        {!jobId ? (
          <div className="flex-1 flex flex-col items-center justify-center py-12 lg:p-12 text-center">
             <div className="w-16 h-16 lg:w-20 lg:h-20 bg-primary/10 rounded-2xl lg:rounded-3xl flex items-center justify-center text-primary mb-6 shadow-xl shadow-primary/10">
                <SlidersHorizontal size={32} className="lg:w-10 lg:h-10" />
             </div>
             <h3 className="text-xl lg:text-2xl font-serif font-bold text-text-primary dark:text-white mb-3 lg:mb-4">No Position Selected</h3>
             <p className="text-xs lg:text-sm text-text-secondary dark:text-gray-400 max-w-sm mb-6 lg:mb-8">
                Please select a job from the dropdown above to visualize its hiring pipeline and manage applicants.
             </p>
             <div className="grid grid-cols-2 gap-3 lg:gap-4 w-full sm:w-auto">
                <Button variant="outline" className="text-xs py-2.5" onClick={() => navigate('/dashboard/company/jobs')}>Jobs</Button>
                <Button className="text-xs py-2.5" onClick={() => navigate('/dashboard/company/applicants')}>List View</Button>
             </div>
          </div>
        ) : appsLoading ? (
          <Loader text="Fetching applicants..." />
        ) : (
          <div className="flex-1 min-h-0 flex flex-col">
             <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                   <h2 className="text-lg lg:text-xl font-bold text-text-primary dark:text-white truncate max-w-[200px] lg:max-w-none">{selectedJob?.title}</h2>
                    <Badge variant="default" size="sm">{applicantsData?.applications?.length || 0} Total</Badge>
                </div>
                <div className="relative max-w-xs w-full">
                   <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary dark:text-gray-500" />
                   <input type="text" placeholder="Search cards..." className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-white/5 border border-border dark:border-slate-700 rounded-xl lg:rounded-2xl text-xs focus:ring-2 focus:ring-primary/10 focus:border-primary/20 outline-none dark:text-white transition-all" />
                </div>
             </div>
              <KanbanBoard applications={applicantsData?.applications || []} />
          </div>
        )}
      </div>
    </div>
  );
};

export default KanbanPipeline;
