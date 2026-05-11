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
import PageTransition from '../../components/animations/PageTransition';

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
    { title: 'Total Applications', value: candidateStats?.totalApplications || 0, icon: Briefcase, color: 'bg-blue-500/10 text-blue-500', trend: 2 },
    { title: 'Active Applications', value: candidateStats?.activeApplications || 0, icon: TrendingUp, color: 'bg-green-500/10 text-green-500', trend: 1 },
    { title: 'Interview Stage', value: candidateStats?.interviewApplications || 0, icon: Calendar, color: 'bg-purple-500/10 text-purple-500', trend: 0 },
    { title: 'Offers Received', value: candidateStats?.offerApplications || 0, icon: Star, color: 'bg-amber-500/10 text-amber-500', trend: 1 },
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
    <PageTransition>
      <div className="w-full max-w-7xl mx-auto space-y-8 lg:space-y-12">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 lg:gap-8">
          <div>
            <h1 className="text-2xl md:text-4xl font-serif text-text-primary mb-2 lg:mb-3">
              Welcome back, <span className="text-primary italic">{user?.name?.split(' ')[0] || 'User'}</span> 👋
            </h1>
            <p className="text-text-secondary text-sm lg:text-base font-medium">Here's what's happening with your job search.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3 lg:gap-4">
            <Button variant="outline" size="lg" className="flex-1 lg:flex-none rounded-xl lg:rounded-2xl h-11 lg:h-14" onClick={() => navigate('/dashboard/candidate/profile')}>
              Edit Profile
            </Button>
            <Button size="lg" className="flex-1 lg:flex-none rounded-xl lg:rounded-2xl shadow-xl shadow-primary/20 h-11 lg:h-14" onClick={() => navigate('/jobs')}>
              Browse Jobs
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {stats.map((stat, i) => (
            <StatsCard 
              key={i} 
              {...stat} 
            />
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-10">
          {/* Main Content (Left 2/3) */}
          <div className="lg:col-span-2 space-y-8 lg:space-y-12">
            
            {/* Recent Applications */}
            <div className="bg-white rounded-2xl lg:rounded-[2rem] border border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="px-5 py-4 lg:px-8 lg:py-6 border-b border-border flex items-center justify-between bg-gray-50/50">
                <h3 className="font-bold text-text-primary uppercase tracking-widest text-[9px] lg:text-[10px]">Recent Applications</h3>
                <Link to="/dashboard/candidate/applications" className="text-[10px] lg:text-xs font-bold text-primary hover:text-primary-600 transition-colors flex items-center gap-1.5 group">
                  VIEW ALL <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
              <div className="overflow-x-auto">
                 <table className="w-full text-left border-collapse">
                    <thead>
                       <tr className="border-b border-border">
                          <th className="px-5 py-4 lg:px-8 lg:py-5 text-[9px] lg:text-[10px] font-bold text-text-secondary uppercase tracking-widest">Company</th>
                          <th className="px-5 py-4 lg:px-8 lg:py-5 text-[9px] lg:text-[10px] font-bold text-text-secondary uppercase tracking-widest hidden sm:table-cell">Role</th>
                          <th className="px-5 py-4 lg:px-8 lg:py-5 text-[9px] lg:text-[10px] font-bold text-text-secondary uppercase tracking-widest">Status</th>
                          <th className="px-5 py-4 lg:px-8 lg:py-5 text-[9px] lg:text-[10px] font-bold text-text-secondary uppercase tracking-widest text-center">Score</th>
                          <th className="px-5 py-4 lg:px-8 lg:py-5 text-[9px] lg:text-[10px] font-bold text-text-secondary uppercase tracking-widest text-right">Applied</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {dashboardLoading ? (
                          [...Array(3)].map((_, i) => (
                             <tr key={i}><td colSpan="5" className="px-5 py-4 lg:px-8 lg:py-6"><div className="h-4 bg-gray-50 rounded-full animate-pulse w-full"></div></td></tr>
                          ))
                        ) : recentApps.length > 0 ? (
                          recentApps.map((app) => (
                            <tr key={app._id} className="hover:bg-gray-50/50 transition-colors cursor-pointer group" onClick={() => navigate(`/dashboard/candidate/applications`)}>
                               <td className="px-5 py-4 lg:px-8 lg:py-6">
                                  <div className="flex items-center gap-3 lg:gap-4">
                                     <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl bg-gray-50 border border-border flex items-center justify-center text-primary font-bold overflow-hidden shadow-sm group-hover:scale-110 transition-transform">
                                        {app.company?.logo ? (
                                          <img src={app.company.logo} alt="" className="w-full h-full object-cover" />
                                        ) : app.company?.name?.charAt(0)}
                                     </div>
                                     <span className="text-xs lg:text-sm font-bold text-text-primary truncate max-w-[80px] lg:max-w-none">{app.company?.name}</span>
                                  </div>
                               </td>
                               <td className="px-5 py-4 lg:px-8 lg:py-6 text-xs lg:text-sm font-medium text-text-secondary hidden sm:table-cell">{app.job?.title}</td>
                               <td className="px-5 py-4 lg:px-8 lg:py-6">
                                  <span className={`px-2 py-0.5 lg:px-3 lg:py-1 rounded-full text-[9px] lg:text-[10px] font-bold uppercase tracking-wider ${
                                    app.currentStage === 'hired' ? 'bg-secondary/10 text-secondary' :
                                    app.currentStage === 'rejected' ? 'bg-red-50 text-red-500' :
                                    'bg-primary/10 text-primary'
                                  }`}>
                                    {app.currentStage}
                                  </span>
                               </td>
                               <td className="px-5 py-4 lg:px-8 lg:py-6 text-center">
                                  <div className="flex flex-col items-center">
                                    <span className={`text-xs lg:text-sm font-bold ${app.aiScore?.fitPercentage >= 80 ? 'text-secondary' : 'text-primary'}`}>
                                       {app.aiScore?.fitPercentage || 0}%
                                    </span>
                                    <div className="w-10 lg:w-12 h-1 bg-gray-100 rounded-full mt-1 overflow-hidden hidden sm:block">
                                       <div className={`h-full ${app.aiScore?.fitPercentage >= 80 ? 'bg-secondary' : 'bg-primary'}`} style={{ width: `${app.aiScore?.fitPercentage || 0}%` }} />
                                    </div>
                                  </div>
                               </td>
                               <td className="px-5 py-4 lg:px-8 lg:py-6 text-right text-[10px] lg:text-xs text-text-secondary font-medium whitespace-nowrap">
                                  {timeAgo(app.createdAt)}
                               </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="5" className="px-5 py-12 lg:px-8 lg:py-16 text-center">
                               <div className="max-w-xs mx-auto">
                                  <Briefcase size={32} className="lg:w-10 lg:h-10 mx-auto text-border mb-3 lg:mb-4" />
                                  <p className="text-xs lg:text-sm text-text-secondary">No applications yet. Start by browsing jobs.</p>
                               </div>
                            </td>
                          </tr>
                        )}
                     </tbody>
                 </table>
              </div>
            </div>

            {/* Recommended Jobs */}
            <div className="space-y-6 lg:space-y-8">
              <h3 className="font-bold text-text-primary uppercase tracking-widest text-[9px] lg:text-[10px]">Jobs for you</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                 {recommendationsLoading ? (
                   [...Array(2)].map((_, i) => <CardSkeleton key={i} />)
                 ) : recommendations?.jobs?.length > 0 ? (
                   recommendations.jobs.slice(0, 2).map((job, idx) => (
                     <JobCard key={job._id} job={job} index={idx} onClick={() => navigate(`/jobs/${job._id}`)} />
                   ))
                 ) : (
                   <p className="text-xs lg:text-sm text-text-secondary col-span-2 py-8 lg:py-10 text-center border-2 border-dashed border-border rounded-2xl lg:rounded-[2rem]">
                     Browse more jobs to get recommendations.
                   </p>
                 )}
              </div>
            </div>
          </div>

          {/* Sidebar (Right 1/3) */}
          <div className="space-y-8 lg:space-y-10">
             {/* Profile Completion */}
             <motion.div 
              whileHover={{ y: -5 }}
              className="p-6 lg:p-10 rounded-2xl lg:rounded-[2.5rem] bg-dark text-white relative overflow-hidden shadow-2xl shadow-primary/20"
             >
                <div className="absolute top-0 right-0 p-4 lg:p-6 opacity-10">
                  <Brain size={80} className="lg:w-[120px] lg:h-[120px]" />
                </div>
                <div className="relative z-10">
                  <h3 className="text-xl lg:text-2xl font-serif mb-2 lg:mb-3">Profile Power</h3>
                  <p className="text-gray-400 text-xs lg:text-sm mb-6 lg:mb-8 leading-relaxed">Complete your profile to unlock <span className="text-primary font-bold">Priority Matching</span>.</p>
                  
                  <div className="mb-6 lg:mb-10">
                     <div className="flex justify-between items-end mb-2 lg:mb-3">
                        <span className="text-3xl lg:text-4xl font-serif italic text-primary">{completionPercentage}%</span>
                        <span className="text-[9px] lg:text-[10px] font-bold uppercase tracking-widest text-gray-500">Completed</span>
                     </div>
                     <div className="h-1 lg:h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${completionPercentage}%` }}
                          className="h-full bg-primary" 
                        />
                     </div>
                  </div>

                  <div className="space-y-3 lg:space-y-4 mb-6 lg:mb-10">
                     {missingFields.slice(0, 2).map((f, i) => (
                        <div key={i} className="flex items-center gap-2 lg:gap-3 text-[10px] lg:text-xs font-medium text-gray-300">
                           <div className="w-4 h-4 lg:w-5 lg:h-5 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary">
                              <Plus size={8} className="lg:w-2.5 lg:h-2.5" />
                           </div>
                           Add your {f.label}
                        </div>
                     ))}
                     {completionPercentage === 100 && (
                       <div className="flex items-center gap-2 lg:gap-3 text-[10px] lg:text-xs font-bold text-secondary">
                          <CheckCircle2 size={14} className="lg:w-4 lg:h-4" /> Profile is complete!
                       </div>
                     )}
                  </div>

                  <Button className="w-full rounded-lg lg:rounded-xl py-3 lg:py-4 bg-primary text-white border-none shadow-lg shadow-primary/20 hover:scale-105 h-10 lg:h-auto text-xs lg:text-base" onClick={() => navigate('/dashboard/candidate/profile')}>
                    Finish Setup
                  </Button>
                </div>
             </motion.div>

             {/* Quick Tips */}
             <div className="p-6 lg:p-8 bg-white rounded-2xl lg:rounded-[2rem] border border-border">
                <h4 className="font-bold text-text-primary mb-4 lg:mb-6 text-[9px] lg:text-[10px] uppercase tracking-widest">Search Insights</h4>
                <div className="space-y-4 lg:space-y-6">
                   <div className="flex gap-3 lg:gap-4">
                      <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl bg-primary/5 flex items-center justify-center text-primary shrink-0">
                         <TrendingUp size={16} className="lg:w-4.5 lg:h-4.5" />
                      </div>
                      <p className="text-[10px] lg:text-xs text-text-secondary leading-relaxed">Adding <span className="text-text-primary font-bold">10+ skills</span> improves AI matching by 45%.</p>
                   </div>
                   <div className="flex gap-3 lg:gap-4">
                      <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl bg-secondary/5 flex items-center justify-center text-secondary shrink-0">
                         <Calendar size={16} className="lg:w-4.5 lg:h-4.5" />
                      </div>
                      <p className="text-[10px] lg:text-xs text-text-secondary leading-relaxed">Early applicants are <span className="text-text-primary font-bold">3x more likely</span> to get an interview.</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default CandidateDashboard;
