import React from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { 
  Briefcase, CheckCircle, Users, BarChart3, 
  Plus, Eye, Edit3, ArrowRight 
} from 'lucide-react';
import StatsCard from '../../components/dashboard/StatsCard';
import ChartCard from '../../components/dashboard/ChartCard';
import ActivityFeed from '../../components/dashboard/ActivityFeed';
import { useQuery } from '@tanstack/react-query';
import { jobApi } from '../../api/jobApi';
import { dashboardApi } from '../../api/dashboardApi';
import Loader from '../../components/common/Loader';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { timeAgo } from '../../utils/helpers';
import { ROLES } from '../../utils/constants';

const CompanyDashboard = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  // FIXED: Standardized role check
  const isCompanyMember = user?.role === ROLES.RECRUITER;

  // FIXED: Updated queries with role-aware enabled guard and improved settings
  const { data: dashboardData, isLoading: dashLoading, isError: dashError } = useQuery({
    queryKey: ['company-dashboard'],
    queryFn: () => dashboardApi.getCompanyDashboard(),
    enabled: !!isAuthenticated && isCompanyMember,
    select: (res) => res?.data,
    retry: 1,
    staleTime: 1000 * 60 * 5,
  });

  // FIXED: Use the centralized hook for jobs to ensure cache consistency
  const { data: jobsData, isLoading: jobsLoading } = useQuery({
    queryKey: ['jobs', 'company', { limit: 5 }],
    queryFn: () => jobApi.getCompanyJobs({ limit: 5 }),
    enabled: !!isAuthenticated && isCompanyMember,
    select: (res) => {
      console.log("Dashboard Jobs API Raw Response:", res?.data);
      return res?.data?.jobs || [];
    },
    retry: 1,
  });

  const jobs = jobsData || [];

  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ['application-stats'],
    queryFn: () => dashboardApi.getApplicationStats(),
    enabled: !!isAuthenticated && isCompanyMember,
    select: (res) => res?.data,
    retry: 1,
  });

  // FIXED: Safety redirect
  if (!user || !isCompanyMember) {
    return <Navigate to="/dashboard" replace />;
  }

  console.log("Dashboard Rendering - Jobs State:", jobs);

  // FIXED: Loading state
  if (dashLoading || jobsLoading || statsLoading) {
    return <Loader fullScreen text="Powering up your dashboard..." />;
  }

  // FIXED: Improved Error UI with refresh button
  if (dashError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-2xl border border-red-100 dark:border-red-800 text-center">
          <p className="text-red-500 font-bold mb-2">Failed to load dashboard data</p>
          <p className="text-xs text-red-400">Please check your permissions or connection.</p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-amber-600 text-white rounded-xl text-sm font-bold hover:bg-amber-700 shadow-lg shadow-amber-200 dark:shadow-none transition-all active:scale-95"
        >
          Refresh Page
        </button>
      </div>
    );
  }

  const totalJobs = jobs?.length || 0;
  const activeJobs = jobs?.filter(job => job.status === 'active').length || 0;
  const totalApplicants = jobs?.reduce((acc, job) => acc + (job.applicationCount || 0), 0);

  const stats = [
    { title: 'Total Jobs', value: totalJobs, icon: Briefcase, gradient: 'bg-amber-600', change: '8', trend: 'up' },
    { title: 'Active Jobs', value: activeJobs, icon: CheckCircle, gradient: 'bg-green-600', change: '12', trend: 'up' },
    { title: 'Total Applicants', value: totalApplicants || 0, icon: Users, gradient: 'bg-blue-600', change: '24', trend: 'up' },
    { title: 'New This Week', value: dashboardData?.newApplicants || '0', icon: BarChart3, gradient: 'bg-purple-600', change: '15', trend: 'up' },
  ];

  const pipelineData = [
    { label: 'Applied', value: statsData?.Applied || 0 },
    { label: 'Screening', value: statsData?.Screening || 0 },
    { label: 'Interview', value: statsData?.Interview || 0 },
    { label: 'Offer', value: statsData?.Offer || 0 },
    { label: 'Hired', value: statsData?.Hired || 0 },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-serif text-text-primary mb-3">
            Recruitment <span className="text-primary italic">Intelligence</span>
          </h1>
          <p className="text-text-secondary font-medium">Monitor your hiring pipeline and talent acquisition performance.</p>
        </div>
        <Button size="lg" icon={Plus} className="rounded-2xl shadow-xl shadow-primary/20" onClick={() => navigate('/dashboard/company/jobs/create')}>
          Post New Job
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <StatsCard 
            key={i} 
            {...stat} 
            gradient={
              i === 0 ? 'bg-primary/10 text-primary' : 
              i === 1 ? 'bg-secondary/10 text-secondary' : 
              i === 2 ? 'bg-accent/10 text-accent' : 
              'bg-primary/10 text-primary'
            }
          />
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-12">
          <div className="bg-white rounded-[2rem] border border-border p-8 shadow-sm">
            <ChartCard title="Pipeline Conversion" data={pipelineData} />
          </div>

          <div className="bg-white rounded-[2rem] border border-border overflow-hidden shadow-sm">
            <div className="px-8 py-6 border-b border-border flex items-center justify-between bg-gray-50/50">
              <h3 className="font-bold text-text-primary uppercase tracking-widest text-[10px]">Active Job Postings</h3>
              <Link to="/dashboard/company/jobs" className="text-xs font-bold text-primary hover:text-primary-600 transition-colors flex items-center gap-1.5 group">
                VIEW ALL <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse">
                  <thead>
                     <tr className="border-b border-border">
                        <th className="px-8 py-5 text-[10px] font-bold text-text-secondary uppercase tracking-widest">Job Title</th>
                        <th className="px-8 py-5 text-[10px] font-bold text-text-secondary uppercase tracking-widest">Status</th>
                        <th className="px-8 py-5 text-[10px] font-bold text-text-secondary uppercase tracking-widest text-center">Talent Pool</th>
                        <th className="px-8 py-5 text-[10px] font-bold text-text-secondary uppercase tracking-widest text-right">Actions</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                     {jobs?.length > 0 ? (
                       jobs.slice(0, 5).map((job) => (
                         <tr key={job._id} className="hover:bg-gray-50/50 transition-colors group">
                            <td className="px-8 py-6 min-w-[200px]">
                               <div className="min-w-0">
                                  <p className="text-sm font-bold text-text-primary group-hover:text-primary transition-colors">{job.title}</p>
                                  <p className="text-[10px] text-text-secondary font-bold uppercase tracking-wider mt-1">{timeAgo(job.createdAt)}</p>
                               </div>
                            </td>
                            <td className="px-8 py-6">
                               <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                 job.status === 'active' ? 'bg-secondary/10 text-secondary' : 'bg-gray-100 text-gray-500'
                               }`}>
                                 {job.status}
                               </span>
                            </td>
                            <td className="px-8 py-6 text-center">
                               <span className="text-sm font-bold text-primary">{job.applicationCount || 0} Applicants</span>
                            </td>
                            <td className="px-8 py-6">
                               <div className="flex items-center justify-end gap-3">
                                  <button onClick={() => navigate(`/dashboard/company/applicants?jobId=${job._id}`)} className="p-2.5 text-text-secondary hover:text-primary hover:bg-primary/5 rounded-xl transition-all border border-transparent hover:border-primary/20" title="View Applicants"><Eye size={18} /></button>
                                  <button onClick={() => navigate(`/dashboard/company/jobs/edit/${job._id}`)} className="p-2.5 text-text-secondary hover:text-primary hover:bg-primary/5 rounded-xl transition-all border border-transparent hover:border-primary/20" title="Edit Job"><Edit3 size={18} /></button>
                               </div>
                            </td>
                         </tr>
                       ))
                     ) : (
                       <tr>
                         <td colSpan="4" className="px-8 py-16 text-center">
                            <div className="max-w-xs mx-auto">
                               <Briefcase size={40} className="mx-auto text-border mb-4" />
                               <p className="text-sm text-text-secondary">No active job postings. Start by posting your first job!</p>
                            </div>
                         </td>
                       </tr>
                     )}
                  </tbody>
               </table>
            </div>
          </div>
        </div>

        <div className="space-y-10">
           <div className="bg-white rounded-[2rem] border border-border p-8 shadow-sm">
             <ActivityFeed 
               activities={dashboardData?.recentActivities?.map(a => ({
                 user: a.user,
                 type: a.type,
                 action: a.action,
                 time: a.createdAt,
                 target: a.target
               })) || []} 
               viewAllLink="/dashboard/company/activity"
             />
           </div>
           
           <div className="p-8 rounded-[2rem] bg-primary/5 border border-primary/20 relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
              <h4 className="font-bold text-primary mb-3 text-xs uppercase tracking-widest relative z-10">Pro Insight</h4>
              <p className="text-sm text-text-primary leading-relaxed relative z-10">
                 Jobs with <span className="text-primary font-bold italic">AI-optimized</span> descriptions receive 40% more qualified applications.
              </p>
              <button className="mt-6 text-xs font-bold text-primary hover:underline flex items-center gap-2 relative z-10">
                Optimize Now <ArrowRight size={14} />
              </button>
           </div>
        </div>
      </div>
    </div>

  );
};

export default CompanyDashboard;
