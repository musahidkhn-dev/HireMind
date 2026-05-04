import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, Brain, Eye, MessageSquare, ChevronRight, Filter, ArrowUpDown } from 'lucide-react';
import { useCompanyJobs } from '../../hooks/useJobs';
import { useJobApplicants } from '../../hooks/useApplications';
import { useBulkScore } from '../../hooks/useAI';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Avatar from '../../components/common/Avatar';
import EmptyState from '../../components/common/EmptyState';
import { CardSkeleton } from '../../components/common/Skeleton';
import { PIPELINE_STAGES } from '../../utils/constants';

const ApplicantCard = ({ application, onClick }) => {
  const { candidate, aiScore, currentStage } = application;
  const scoreValue = aiScore?.fitPercentage || 0;

  return (
    <div className="card p-6 bg-white dark:bg-[#1A1A1A] hover:shadow-xl transition-all cursor-pointer group border border-border dark:border-white/5 rounded-[2rem] min-w-0 overflow-hidden" onClick={onClick}>
       <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex items-center gap-4 min-w-0">
             <Avatar name={candidate?.name} src={candidate?.userImage} size="lg" className="rounded-2xl shrink-0" />
             <div className="min-w-0">
                <h4 className="text-lg font-bold text-text-primary dark:text-white truncate">{candidate?.name}</h4>
                <p className="text-xs text-text-secondary dark:text-gray-500 font-medium truncate">{candidate?.email}</p>
             </div>
          </div>
          <div className="text-right shrink-0">
             <p className="text-[10px] font-black text-text-secondary dark:text-gray-500 uppercase mb-1">AI Match</p>
             <p className={`text-2xl font-black ${scoreValue >= 80 ? 'text-green-500' : scoreValue >= 60 ? 'text-amber-500' : 'text-red-500'}`}>
                {scoreValue ? `${scoreValue}%` : 'N/A'}
             </p>
          </div>
       </div>

       <div className="flex flex-wrap gap-2 mb-6">
          {application.matchedSkills?.slice(0, 3).map((s, i) => (
             <Badge key={i} variant="success" size="sm" className="rounded-lg">{s}</Badge>
          ))}
          {application.missingSkills?.slice(0, 2).map((s, i) => (
             <Badge key={i} variant="danger" size="sm" className="rounded-lg">{s}</Badge>
          ))}
       </div>

       <div className="flex items-center justify-between pt-6 border-t border-border dark:border-white/5">
          <Badge variant="primary" size="sm" className="rounded-lg uppercase tracking-widest text-[10px] font-black">{currentStage}</Badge>
          <div className="flex items-center gap-2">
             <button className="p-2 text-text-secondary dark:text-gray-500 hover:text-primary dark:hover:text-primary hover:bg-primary/5 rounded-xl transition-all"><Eye size={18} /></button>
             <button className="p-2 text-text-secondary dark:text-gray-500 hover:text-primary dark:hover:text-primary hover:bg-primary/5 rounded-xl transition-all"><MessageSquare size={18} /></button>
          </div>
       </div>
    </div>
  );
};

const Applicants = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const jobId = searchParams.get('jobId');
  
  const [stage, setStage] = useState('All');
  const [sortBy, setSortBy] = useState('score');

  const { data: jobsData } = useCompanyJobs();
  const { data: applicantsData, isLoading } = useJobApplicants(jobId, { stage: stage === 'All' ? undefined : stage, sortBy });
  const bulkScoreMutation = useBulkScore();

  const handleJobChange = (id) => {
    setSearchParams({ jobId: id });
  };

  return (
    <div className="space-y-8 max-w-full overflow-hidden">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-serif text-text-primary dark:text-white mb-2 tracking-tight">Applicants</h1>
          <p className="text-text-secondary dark:text-gray-400 font-medium">Review and manage candidates for your open positions.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3">
           <Button variant="secondary" icon={Brain} onClick={() => bulkScoreMutation.mutate(jobId)} loading={bulkScoreMutation.isPending} disabled={!jobId} className="w-full sm:w-auto shadow-lg shadow-primary/5">
              Score All with AI
           </Button>
           <Button icon={Filter} onClick={() => navigate('/dashboard/company/kanban')} className="w-full sm:w-auto">Pipeline View</Button>
        </div>
      </div>

      {/* Select Job & Filters */}
      <div className="flex flex-col lg:flex-row gap-8">
         <div className="lg:w-80 shrink-0 w-full">
            <div className="card p-6 bg-white dark:bg-[#1A1A1A] border border-border dark:border-white/5 shadow-sm rounded-[2rem]">
               <h3 className="text-[10px] font-black text-text-secondary dark:text-gray-500 uppercase tracking-widest mb-6 px-2">Select Position</h3>
               <div className="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar pr-1">
                  {jobsData?.map(job => (
                    <button
                      key={job._id}
                      onClick={() => handleJobChange(job._id)}
                      className={`w-full text-left p-4 rounded-2xl text-sm font-bold transition-all border-2 ${
                        jobId === job._id 
                          ? 'border-primary bg-primary/5 text-primary' 
                          : 'border-transparent dark:border-white/[0.02] hover:bg-gray-50 dark:hover:bg-white/5 text-text-secondary dark:text-gray-400'
                      }`}
                    >
                       <p className="truncate">{job.title}</p>
                       <p className="text-[10px] opacity-60 mt-1 font-black uppercase tracking-wider">{job.applicationCount || 0} applicants</p>
                    </button>
                  ))}
               </div>
            </div>
         </div>

         <div className="flex-1 space-y-6 min-w-0">
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
               <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-hide max-w-full">
                  {['All', ...PIPELINE_STAGES].map(s => (
                    <button
                      key={s}
                      onClick={() => setStage(s)}
                      className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border-2 ${
                        stage === s 
                          ? 'bg-primary border-primary text-white shadow-xl shadow-primary/20' 
                          : 'bg-white dark:bg-[#1A1A1A] text-text-secondary dark:text-gray-400 hover:text-primary dark:hover:text-primary border-border dark:border-white/5'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
               </div>
               <div className="flex items-center gap-3 shrink-0 bg-white dark:bg-[#1A1A1A] px-4 py-2.5 rounded-2xl border border-border dark:border-white/5 self-end xl:self-auto">
                  <ArrowUpDown size={16} className="text-text-secondary dark:text-gray-500" />
                  <select 
                    value={sortBy} 
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-transparent border-none text-[10px] font-black uppercase tracking-widest text-text-primary dark:text-white focus:ring-0 cursor-pointer outline-none"
                  >
                    <option value="score">Sort by Match</option>
                    <option value="newest">Newest First</option>
                    <option value="name">Name A-Z</option>
                  </select>
               </div>
            </div>

            <AnimatePresence mode="wait">
               {isLoading ? (
                 <div key="loading" className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[...Array(4)].map((_, i) => <CardSkeleton key={i} className="rounded-[2rem]" />)}
                 </div>
               ) : jobId && applicantsData?.applications?.length > 0 ? (
                 <motion.div 
                  key="list" 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                 >
                    {applicantsData.applications.map(app => (
                       <ApplicantCard 
                        key={app._id} 
                        application={app} 
                        onClick={() => navigate(`/dashboard/company/applicants/${app._id}`)} 
                       />
                    ))}
                 </motion.div>
               ) : !jobId ? (
                 <div className="bg-white dark:bg-[#1A1A1A] rounded-[2.5rem] border-2 border-dashed border-border dark:border-white/10 py-32 text-center">
                    <EmptyState title="Select a Job" description="Please select a position from the left sidebar to view applicants." />
                 </div>
               ) : (
                 <div className="bg-white dark:bg-[#1A1A1A] rounded-[2.5rem] border-2 border-dashed border-border dark:border-white/10 py-32 text-center">
                    <EmptyState title="No applicants found" description="Adjust your filters or wait for new applications." />
                 </div>
               )}
            </AnimatePresence>
         </div>
      </div>
    </div>
  );
};

export default Applicants;
