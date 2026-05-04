import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Filter, SlidersHorizontal, ArrowLeft, Brain, Search } from 'lucide-react';
import { useCompanyJobs } from '../../hooks/useJobs';
import { useJobApplicants } from '../../hooks/useApplications';
import { useBulkScore } from '../../hooks/useAI';
import KanbanBoard from '../../components/kanban/KanbanBoard';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import Badge from '../../components/common/Badge';

const KanbanPipeline = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const jobId = searchParams.get('jobId');

  const { data: jobsData, isLoading: jobsLoading } = useCompanyJobs();
  const { data: applicantsData, isLoading: appsLoading } = useJobApplicants(jobId, { limit: 100 });
  const bulkScoreMutation = useBulkScore();
  
  console.log("Applications API Response:", applicantsData);
  console.log("Selected Job ID:", jobId);

  const selectedJob = jobsData?.find(j => j._id === jobId);

  return (
    <div className="flex flex-col h-[calc(100vh-140px)]">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-4">
           <button onClick={() => navigate(-1)} className="p-2.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:text-amber-600 transition-colors">
              <ArrowLeft size={20} />
           </button>
           <div>
              <h1 className="text-3xl font-black text-gray-900 dark:text-white">Hiring Pipeline</h1>
              <p className="text-gray-500 font-medium">Visual drag-and-drop workflow for applicants.</p>
           </div>
        </div>
        
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-3 bg-white dark:bg-gray-900 px-4 py-2 rounded-xl border border-gray-100 dark:border-gray-800 min-w-[240px]">
              <Filter size={18} className="text-amber-600" />
              <select 
                value={jobId || ''} 
                onChange={(e) => setSearchParams({ jobId: e.target.value })}
                className="bg-transparent border-none text-sm font-bold text-gray-700 dark:text-gray-300 focus:ring-0 cursor-pointer w-full"
              >
                <option value="">Select a position...</option>
                {jobsData?.map(job => (
                  <option key={job._id} value={job._id}>{job.title}</option>
                ))}
              </select>
           </div>
           <Button 
              variant="secondary" 
              icon={Brain} 
              disabled={!jobId}
              onClick={() => bulkScoreMutation.mutate(jobId)}
              loading={bulkScoreMutation.isPending}
            >
              Score Stage
            </Button>
        </div>
      </div>

      {/* Main Board Area */}
      <div className="flex-1 min-h-0 bg-gray-50/50 dark:bg-black/20 rounded-[2.5rem] p-6 border-2 border-dashed border-gray-100 dark:border-gray-800 overflow-hidden flex flex-col">
        {!jobId ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
             <div className="w-20 h-20 bg-white dark:bg-gray-800 rounded-3xl flex items-center justify-center text-amber-600 mb-6 shadow-xl shadow-amber-100 dark:shadow-none">
                <SlidersHorizontal size={40} />
             </div>
             <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4">No Position Selected</h3>
             <p className="text-gray-500 dark:text-gray-400 max-w-sm mb-8">
                Please select a job from the dropdown above to visualize its hiring pipeline and manage applicants.
             </p>
             <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" onClick={() => navigate('/dashboard/company/jobs')}>Manage Jobs</Button>
                <Button onClick={() => navigate('/dashboard/company/applicants')}>List View</Button>
             </div>
          </div>
        ) : appsLoading ? (
          <Loader text="Loading pipeline data..." />
        ) : (
          <div className="flex-1 min-h-0 flex flex-col">
             <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <h2 className="text-xl font-bold text-gray-900 dark:text-white">{selectedJob?.title}</h2>
                    <Badge variant="default" size="sm">{applicantsData?.applications?.length || 0} Total</Badge>
                </div>
                <div className="relative max-w-xs w-full">
                   <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                   <input type="text" placeholder="Search cards..." className="w-full pl-9 pr-4 py-2 bg-white dark:bg-gray-900 border-none rounded-lg text-xs focus:ring-1 focus:ring-amber-500/20" />
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
