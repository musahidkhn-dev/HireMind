import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Globe, MapPin, Users, Briefcase, ArrowLeft, ExternalLink, Calendar, Mail, CheckCircle2, Building2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import { usePublicCompany, useFollowCompany, useUnfollowCompany } from '../../hooks/useCompany';
import Loader from '../../components/common/Loader';
import Avatar from '../../components/common/Avatar';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { timeAgo } from '../../utils/helpers';
import { toast } from 'react-hot-toast';

const CompanyPublicProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  
  const { data, isLoading, error } = usePublicCompany(id);
  const followMutation = useFollowCompany();
  const unfollowMutation = useUnfollowCompany();

  const isFollowing = user?.followingCompanies?.includes(id);

  const handleFollowToggle = () => {
    if (!isAuthenticated) {
      toast.error('Please login to follow companies');
      return navigate('/login', { state: { from: { pathname: `/company/${id}` } } });
    }

    if (isFollowing) {
      unfollowMutation.mutate(id);
    } else {
      followMutation.mutate(id);
    }
  };

  if (isLoading) return <Loader fullScreen text="Loading company profile..." />;
  
  const company = data?.company;
  const jobs = data?.jobs || [];

  if (!company) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black">
      <div className="text-center bg-white dark:bg-gray-900 p-12 rounded-3xl shadow-xl">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Company profile incomplete</h2>
        <Button onClick={() => navigate('/jobs')} icon={ArrowLeft}>Back to Jobs</Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black pb-20">
      {/* Header Bar */}
      <div className="bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800 sticky top-16 z-30 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
           <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-amber-600 transition-colors">
              <ArrowLeft size={18} /> Back
           </button>
           <div className="flex items-center gap-3">
              <a href={company.website} target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="sm" icon={ExternalLink}>Website</Button>
              </a>
           </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Main Content */}
          <div className="flex-1 lg:max-w-[70%] space-y-10">
             {/* Profile Header Card */}
             <div className="card p-10 bg-white dark:bg-gray-900 border-none shadow-sm overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 blur-3xl rounded-full -z-0" />
                
                 <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-10 relative z-10">
                    <Avatar 
                     src={company?.logo} 
                     name={company?.name} 
                     size="xl" 
                     className="w-32 h-32 md:w-40 md:h-40 rounded-[2.5rem] border-4 border-white dark:border-gray-800 shadow-xl" 
                    />
                    <div className="text-center md:text-left pt-4">
                       <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4 leading-tight">
                         {company?.name || 'Company Name'}
                       </h1>
                       <div className="flex flex-wrap justify-center md:justify-start gap-4">
                          <div className="flex items-center gap-2 text-sm font-bold text-gray-500">
                             <MapPin size={18} className="text-amber-600" /> {company?.location || 'Not Specified'}
                          </div>
                          <div className="flex items-center gap-2 text-sm font-bold text-gray-500">
                             <Briefcase size={18} className="text-amber-600" /> {company?.industry || 'General Industry'}
                          </div>
                          <div className="flex items-center gap-2 text-sm font-bold text-gray-500">
                             <Users size={18} className="text-amber-600" /> {company?.size || 'Unknown'} Employees
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="pt-8 border-t border-gray-50 dark:border-gray-800 relative z-10">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">About the Company</h3>
                    <div className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap text-lg">
                       {company?.description || 'No description provided by the company.'}
                    </div>
                 </div>
             </div>

             {/* Jobs List */}
             <div>
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white">Active Openings</h3>
                  <Badge variant="primary" className="px-4 py-1.5">{jobs.length} Positions</Badge>
                </div>

                <div className="grid gap-6">
                   {(Array.isArray(jobs) ? jobs : []).length > 0 ? (
                     (Array.isArray(jobs) ? jobs : []).map((job) => (
                       <motion.div 
                        key={job._id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="card p-6 bg-white dark:bg-gray-900 border-none shadow-sm hover:shadow-md transition-all group cursor-pointer"
                        onClick={() => navigate(`/jobs/${job._id}`)}
                       >
                         <div className="flex justify-between items-start gap-4">
                            <div>
                               <h4 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-amber-600 transition-colors mb-2">
                                  {job.title}
                               </h4>
                               <div className="flex flex-wrap gap-4 text-sm font-medium text-gray-500">
                                  <span className="flex items-center gap-1.5"><MapPin size={16} /> {job.location}</span>
                                  <span className="flex items-center gap-1.5"><Briefcase size={16} /> {job.jobType.replace('-', ' ')}</span>
                                  <span className="flex items-center gap-1.5"><Calendar size={16} /> {timeAgo(job.createdAt)}</span>
                               </div>
                            </div>
                            <Button size="sm" variant="outline" className="opacity-0 group-hover:opacity-100 transition-all">Details</Button>
                         </div>
                       </motion.div>
                     ))
                   ) : (
                     <div className="card p-12 text-center bg-white dark:bg-gray-900 border-none shadow-sm">
                        <p className="text-gray-400 font-bold uppercase tracking-widest">No active positions currently</p>
                     </div>
                   )}
                </div>
             </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:w-80 space-y-8">
             <div className="card p-8 bg-white dark:bg-gray-900 border-none shadow-sm">
                <h4 className="font-bold text-gray-900 dark:text-white mb-6">Company Info</h4>
                <div className="space-y-6">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center text-amber-600">
                         <Globe size={20} />
                      </div>
                      <div>
                         <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Website</p>
                         <a href={company.website} target="_blank" className="text-sm font-bold text-amber-600 hover:underline break-all">
                            {company.website?.replace('https://', '')}
                         </a>
                      </div>
                   </div>
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center text-purple-600">
                         <Building2 size={20} />
                      </div>
                      <div>
                         <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Industry</p>
                         <p className="text-sm font-bold text-gray-900 dark:text-white">{company.industry}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600">
                         <Users size={20} />
                      </div>
                      <div>
                         <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Team Size</p>
                         <p className="text-sm font-bold text-gray-900 dark:text-white">{company.size} Employees</p>
                      </div>
                   </div>
                </div>
             </div>

             <div className="card p-8 bg-amber-600 text-white border-none shadow-xl relative overflow-hidden group">
                <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                <h4 className="font-bold text-xl mb-4 relative z-10">Stay Updated</h4>
                <p className="text-amber-100 text-sm mb-6 relative z-10">Get notified when {company.name} posts new opportunities.</p>
                <Button 
                  className={`w-full ${isFollowing ? 'bg-amber-500 text-white' : 'bg-white text-amber-600 hover:bg-amber-50'} border-none relative z-10`} 
                  icon={isFollowing ? CheckCircle2 : Mail}
                  onClick={handleFollowToggle}
                  loading={followMutation.isPending || unfollowMutation.isPending}
                >
                  {isFollowing ? 'Following' : 'Follow Company'}
                </Button>
             </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default CompanyPublicProfile;
