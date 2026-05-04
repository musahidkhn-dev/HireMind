import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { 
  Briefcase, TrendingUp, Calendar, Star, 
  Plus, Search, ArrowRight, CheckCircle2, AlertCircle, Brain 
} from 'lucide-react';
import StatsCard from '../../components/dashboard/StatsCard';
import JobCard from '../../components/jobs/JobCard';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import EmptyState from '../../components/common/EmptyState';
import { CardSkeleton } from '../../components/common/Skeleton';
import { useCandidateProfile, useCandidateDashboard } from '../../hooks/useCandidate';
import { usePublicJobs } from '../../hooks/useJobs';
import { timeAgo, stageBadgeVariant } from '../../utils/helpers';

const CandidateDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  
  const { data: dashboardData, isLoading: dashboardLoading } = useCandidateDashboard();
  const { data: profileData, isLoading: profileLoading } = useCandidateProfile();
  const { data: recommendations, isLoading: recommendationsLoading } = usePublicJobs({ limit: 3 });
  
  const candidateStats = dashboardData?.stats;
  const recentApps = dashboardData?.recentApplications || [];
  const profile = profileData?.profile;

  const stats = [
    { title: 'Total Applications', value: candidateStats?.totalApplications || 0, icon: Briefcase, gradient: 'bg-blue-600', change: '+2', trend: 'up' },
    { title: 'Active Applications', value: candidateStats?.activeApplications || 0, icon: TrendingUp, gradient: 'bg-green-600', change: '+1', trend: 'up' },
    { title: 'Interview Stage', value: candidateStats?.interviewApplications || 0, icon: Calendar, gradient: 'bg-purple-600', change: 'Live', trend: 'neutral' },
    { title: 'Offers Received', value: candidateStats?.offerApplications || 0, icon: Star, gradient: 'bg-amber-500', change: 'New', trend: 'up' },
  ];

  // Profile completion calc
  const profileFields = [
    { key: 'userImage', label: 'Profile Picture' },
    { key: 'bio', label: 'Bio' },
    { key: 'headline', label: 'Headline' },
    { key: 'skills', label: 'Skills' },
    { key: 'experiences', label: 'Experience' },
    { key: 'education', label: 'Education' },
    { key: 'resumeUrl', label: 'Resume' }
  ];

  const getFieldValue = (fieldKey) => {
    if (fieldKey === 'userImage') return profile?.user?.userImage;
    return profile?.[fieldKey];
  };

  const completedFields = profileFields.filter(f => {
    const val = getFieldValue(f.key);
    return val && (Array.isArray(val) ? val.length > 0 : true);
  });
  
  const completionPercentage = Math.round((completedFields.length / profileFields.length) * 100);
  const missingFields = profileFields.filter(f => !getFieldValue(f.key));

  return (
    <div className="w-full max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-serif text-text-primary mb-3">
            Welcome back, <span className="text-primary italic">{user?.name?.split(' ')[0] || 'User'}</span> 👋
          </h1>
          <p className="text-text-secondary font-medium">Here's what's happening with your job search today.</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <Button variant="outline" size="lg" className="rounded-2xl" onClick={() => navigate('/dashboard/candidate/profile')}>
            Edit Profile
          </Button>
          <Button size="lg" className="rounded-2xl shadow-xl shadow-primary/20" onClick={() => navigate('/jobs')}>
            Browse Jobs
          </Button>
        </div>
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
        {/* Main Content (Left 2/3) */}
        <div className="lg:col-span-2 space-y-12">
          
          {/* Recent Applications */}
          <div className="bg-white rounded-[2rem] border border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="px-8 py-6 border-b border-border flex items-center justify-between bg-gray-50/50">
              <h3 className="font-bold text-text-primary uppercase tracking-widest text-[10px]">Recent Applications</h3>
              <Link to="/dashboard/candidate/applications" className="text-xs font-bold text-primary hover:text-primary-600 transition-colors flex items-center gap-1.5 group">
                VIEW ALL <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse">
                  <thead>
                     <tr className="border-b border-border">
                        <th className="px-8 py-5 text-[10px] font-bold text-text-secondary uppercase tracking-widest">Company</th>
                        <th className="px-8 py-5 text-[10px] font-bold text-text-secondary uppercase tracking-widest">Role</th>
                        <th className="px-8 py-5 text-[10px] font-bold text-text-secondary uppercase tracking-widest">Status</th>
                        <th className="px-8 py-5 text-[10px] font-bold text-text-secondary uppercase tracking-widest text-center">Score</th>
                        <th className="px-8 py-5 text-[10px] font-bold text-text-secondary uppercase tracking-widest text-right">Applied</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                      {dashboardLoading ? (
                        [...Array(3)].map((_, i) => (
                           <tr key={i}><td colSpan="5" className="px-8 py-6"><div className="h-4 bg-gray-50 rounded-full animate-pulse w-full"></div></td></tr>
                        ))
                      ) : recentApps.length > 0 ? (
                        recentApps.map((app) => (
                          <tr key={app._id} className="hover:bg-gray-50/50 transition-colors cursor-pointer group" onClick={() => navigate(`/dashboard/candidate/applications`)}>
                             <td className="px-8 py-6">
                                <div className="flex items-center gap-4">
                                   <div className="w-10 h-10 rounded-xl bg-gray-50 border border-border flex items-center justify-center text-primary font-bold overflow-hidden shadow-sm group-hover:scale-110 transition-transform">
                                      {app.company?.logo ? (
                                        <img src={app.company.logo} alt="" className="w-full h-full object-cover" />
                                      ) : app.company?.name?.charAt(0)}
                                   </div>
                                   <span className="text-sm font-bold text-text-primary">{app.company?.name}</span>
                                </div>
                             </td>
                             <td className="px-8 py-6 text-sm font-medium text-text-secondary">{app.job?.title}</td>
                             <td className="px-8 py-6">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                  app.currentStage === 'hired' ? 'bg-secondary/10 text-secondary' :
                                  app.currentStage === 'rejected' ? 'bg-red-50 text-red-500' :
                                  'bg-primary/10 text-primary'
                                }`}>
                                  {app.currentStage}
                                </span>
                             </td>
                             <td className="px-8 py-6 text-center">
                                <div className="flex flex-col items-center">
                                  <span className={`text-sm font-bold ${app.aiScore?.fitPercentage >= 80 ? 'text-secondary' : 'text-primary'}`}>
                                     {app.aiScore?.fitPercentage || 0}%
                                  </span>
                                  <div className="w-12 h-1 bg-gray-100 rounded-full mt-1 overflow-hidden">
                                     <div className={`h-full ${app.aiScore?.fitPercentage >= 80 ? 'bg-secondary' : 'bg-primary'}`} style={{ width: `${app.aiScore?.fitPercentage || 0}%` }} />
                                  </div>
                                </div>
                             </td>
                             <td className="px-8 py-6 text-right text-xs text-text-secondary font-medium">
                                {timeAgo(app.createdAt)}
                             </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="px-8 py-16 text-center">
                             <div className="max-w-xs mx-auto">
                                <Briefcase size={40} className="mx-auto text-border mb-4" />
                                <p className="text-sm text-text-secondary">No applications yet. Start your journey by browsing jobs.</p>
                             </div>
                          </td>
                        </tr>
                      )}
                   </tbody>
               </table>
            </div>
          </div>

          {/* Recommended Jobs */}
          <div className="space-y-8">
            <h3 className="font-bold text-text-primary uppercase tracking-widest text-[10px]">Jobs for you</h3>
            <div className="grid sm:grid-cols-2 gap-8">
               {recommendationsLoading ? (
                 [...Array(2)].map((_, i) => <CardSkeleton key={i} />)
               ) : recommendations?.jobs?.length > 0 ? (
                 recommendations.jobs.slice(0, 2).map((job, idx) => (
                   <JobCard key={job._id} job={job} index={idx} onClick={() => navigate(`/jobs/${job._id}`)} />
                 ))
               ) : (
                 <p className="text-sm text-text-secondary col-span-2 py-10 text-center border-2 border-dashed border-border rounded-[2rem]">
                   Browse more jobs to get recommendations.
                 </p>
               )}
            </div>
          </div>
        </div>

        {/* Sidebar (Right 1/3) */}
        <div className="space-y-10">
           {/* Profile Completion */}
           <motion.div 
            whileHover={{ y: -5 }}
            className="p-10 rounded-[2.5rem] bg-dark text-white relative overflow-hidden shadow-2xl shadow-primary/20"
           >
              <div className="absolute top-0 right-0 p-6 opacity-10">
                <Brain size={120} />
              </div>
              <div className="relative z-10">
                <h3 className="text-2xl font-serif mb-3">Profile Power</h3>
                <p className="text-gray-400 text-sm mb-8 leading-relaxed">Complete your profile to unlock <span className="text-primary font-bold">Priority Matching</span> and better AI insights.</p>
                
                <div className="mb-10">
                   <div className="flex justify-between items-end mb-3">
                      <span className="text-4xl font-serif italic text-primary">{completionPercentage}%</span>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Completed</span>
                   </div>
                   <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${completionPercentage}%` }}
                        className="h-full bg-primary" 
                      />
                   </div>
                </div>

                <div className="space-y-4 mb-10">
                   {missingFields.slice(0, 2).map((f, i) => (
                      <div key={i} className="flex items-center gap-3 text-xs font-medium text-gray-300">
                         <div className="w-5 h-5 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary">
                            <Plus size={10} />
                         </div>
                         Add your {f.label}
                      </div>
                   ))}
                   {completionPercentage === 100 && (
                     <div className="flex items-center gap-3 text-xs font-bold text-secondary">
                        <CheckCircle2 size={16} /> Profile is complete!
                     </div>
                   )}
                </div>

                <Button className="w-full rounded-xl py-4 bg-primary text-white border-none shadow-lg shadow-primary/20 hover:scale-105" onClick={() => navigate('/dashboard/candidate/profile')}>
                  Finish Setup
                </Button>
              </div>
           </motion.div>

           {/* Quick Tips */}
           <div className="p-8 bg-white rounded-[2rem] border border-border">
              <h4 className="font-bold text-text-primary mb-6 text-[10px] uppercase tracking-widest">Search Insights</h4>
              <div className="space-y-6">
                 <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary shrink-0">
                       <TrendingUp size={18} />
                    </div>
                    <p className="text-xs text-text-secondary leading-relaxed">Adding <span className="text-text-primary font-bold">10+ skills</span> improves AI matching accuracy by 45%.</p>
                 </div>
                 <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-secondary/5 flex items-center justify-center text-secondary shrink-0">
                       <Calendar size={18} />
                    </div>
                    <p className="text-xs text-text-secondary leading-relaxed">Early applicants (within 48h) are <span className="text-text-primary font-bold">3x more likely</span> to get an interview.</p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateDashboard;
