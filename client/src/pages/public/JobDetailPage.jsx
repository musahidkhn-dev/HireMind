import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  MapPin, Briefcase, Clock, DollarSign, CheckCircle, 
  Share2, ArrowLeft, Building2, Globe, Users, 
  FileText, Send, Brain
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { useJobById } from '../../hooks/useJobs';
import { useApplyToJob } from '../../hooks/useApplications';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Avatar from '../../components/common/Avatar';
import Modal from '../../components/common/Modal';
import Loader from '../../components/common/Loader';
import { formatSalary, timeAgo, getImageUrl } from '../../utils/helpers';
import { toast } from 'react-hot-toast';

const JobDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  
  const { data: job, isLoading, error } = useJobById(id);
  const applyMutation = useApplyToJob();

  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [resume, setResume] = useState(null);

  useEffect(() => {
    if (job) document.title = `${job.title} | ${job.company?.name} - HireMind`;
  }, [job]);

  const handleApplyClick = () => {
    if (!isAuthenticated) {
      toast.error('Please login to apply');
      navigate('/login', { state: { from: { pathname: `/jobs/${id}` } } });
      return;
    }
    setIsApplyModalOpen(true);
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    if (!resume) return toast.error('Please upload your resume');

    const formData = new FormData();
    formData.append('resume', resume);
    formData.append('coverLetter', coverLetter);

    try {
      await applyMutation.mutateAsync({ jobId: id, formData });
      setIsApplyModalOpen(false);
      setCoverLetter('');
      setResume(null);
    } catch (err) {
      // toast handled in hook
    }
  };

  const copyJobLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard');
  };

  if (isLoading) return <Loader fullScreen text="Loading job details..." />;
  if (error || !job) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Job not found</h2>
        <Button onClick={() => navigate('/jobs')}>Back to Search</Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFCFB] dark:bg-[#0F0F0F] pb-32 transition-colors duration-300">
      {/* Sticky Header Bar — REDESIGN: Elegant & Minimal */}
      <div className="bg-white/80 dark:bg-[#0F0F0F]/80 backdrop-blur-md border-b border-border dark:border-white/5 sticky top-0 z-40 py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
           <button onClick={() => navigate(-1)} className="flex items-center gap-3 text-sm font-bold text-text-secondary dark:text-gray-500 hover:text-primary transition-all group">
              <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                <ArrowLeft size={16} />
              </div>
              <span className="hidden sm:inline">Back to listings</span>
           </button>
           <div className="flex items-center gap-4">
              <button onClick={copyJobLink} className="p-2.5 text-text-secondary dark:text-gray-500 hover:text-primary hover:bg-primary/5 rounded-xl transition-all border border-transparent hover:border-primary/20">
                <Share2 size={18} />
              </button>
              <Button size="lg" className="rounded-2xl shadow-xl shadow-primary/20 px-8" onClick={handleApplyClick}>
                Apply Now
              </Button>
           </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-16">
        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* Main Content */}
          <main className="flex-1 min-w-0 space-y-16">
             {/* Hero Title Section */}
             <div className="relative">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-10 text-center md:text-left">
                   <div className="w-24 h-24 md:w-32 md:h-32 rounded-[2.5rem] bg-white dark:bg-[#1A1A1A] border border-border dark:border-white/5 flex items-center justify-center p-6 shadow-2xl shadow-primary/5 group-hover:scale-105 transition-transform overflow-hidden shrink-0">
                      {job.company?.logo ? (
                        <img src={getImageUrl(job.company.logo)} alt="" className="w-full h-full object-contain" />
                      ) : <Building2 size={48} className="text-primary/20" />}
                   </div>
                   <div className="flex-1 pt-2 min-w-0">
                      <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 mb-6">
                        <Link to={`/company/${job.company?._id}`} className="text-[10px] font-black text-primary hover:underline flex items-center gap-2 uppercase tracking-[0.2em]">
                          {job.company?.name} <Globe size={14} />
                        </Link>
                        <span className="w-1.5 h-1.5 rounded-full bg-border dark:bg-white/10 hidden sm:block" />
                        <span className="px-3 py-1 bg-secondary/10 dark:bg-secondary/20 text-secondary rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
                          {job.jobType.replace('-', ' ')}
                        </span>
                      </div>
                      <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-text-primary dark:text-white leading-tight mb-6 tracking-tight">
                        {job.title}
                      </h1>
                   </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-y border-border dark:border-white/5">
                   <div className="space-y-3">
                      <span className="text-[10px] font-black text-text-secondary dark:text-gray-500 uppercase tracking-[0.2em]">Location</span>
                      <div className="flex items-center gap-3 text-sm font-bold text-text-primary dark:text-gray-300">
                         <div className="w-8 h-8 rounded-xl bg-primary/5 flex items-center justify-center text-primary border border-primary/10">
                            <MapPin size={16} />
                         </div>
                         <span className="truncate">{job.location}</span>
                      </div>
                   </div>
                   <div className="space-y-3">
                      <span className="text-[10px] font-black text-text-secondary dark:text-gray-500 uppercase tracking-[0.2em]">Compensation</span>
                      <div className="flex items-center gap-3 text-sm font-bold text-text-primary dark:text-gray-300">
                         <div className="w-8 h-8 rounded-xl bg-secondary/5 flex items-center justify-center text-secondary border border-secondary/10">
                            <DollarSign size={16} />
                         </div>
                         <span className="truncate">{formatSalary(job.salaryRange?.min, job.salaryRange?.max, job.salaryRange?.currency)}</span>
                      </div>
                   </div>
                   <div className="space-y-3">
                      <span className="text-[10px] font-black text-text-secondary dark:text-gray-500 uppercase tracking-[0.2em]">Department</span>
                      <div className="flex items-center gap-3 text-sm font-bold text-text-primary dark:text-gray-300">
                         <div className="w-8 h-8 rounded-xl bg-accent/5 flex items-center justify-center text-accent border border-accent/10">
                            <Briefcase size={16} />
                         </div>
                         <span className="truncate">{job.industry || 'Technology'}</span>
                      </div>
                   </div>
                   <div className="space-y-3">
                      <span className="text-[10px] font-black text-text-secondary dark:text-gray-500 uppercase tracking-[0.2em]">Published</span>
                      <div className="flex items-center gap-3 text-sm font-bold text-text-primary dark:text-gray-300">
                         <div className="w-8 h-8 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-text-secondary border border-border dark:border-white/5">
                            <Clock size={16} />
                         </div>
                         <span className="truncate">{timeAgo(job.createdAt)}</span>
                      </div>
                   </div>
                </div>

                <div className="pt-16 max-w-none">
                   <h3 className="text-3xl font-serif text-text-primary dark:text-white mb-8">About the role</h3>
                   <div className="text-text-secondary dark:text-gray-400 text-lg leading-relaxed whitespace-pre-wrap font-medium">
                      {job.description}
                   </div>
                </div>
             </div>

             {/* Requirements & Skills */}
             <div className="grid md:grid-cols-2 gap-8 pt-8">
                <div className="p-8 md:p-10 bg-white dark:bg-[#1A1A1A] rounded-[2.5rem] border border-border dark:border-white/5 shadow-sm">
                   <h3 className="text-2xl font-serif text-text-primary dark:text-white mb-8">What we're looking for</h3>
                   <ul className="space-y-5">
                      {(Array.isArray(job.requirements) ? job.requirements : []).map((req, idx) => (
                        <li key={idx} className="flex items-start gap-4 text-sm font-bold text-text-secondary dark:text-gray-400 leading-relaxed">
                           <div className="w-5 h-5 rounded-full bg-secondary/10 dark:bg-secondary/20 flex items-center justify-center text-secondary shrink-0 mt-0.5">
                              <CheckCircle size={12} />
                           </div>
                           {req}
                        </li>
                      ))}
                   </ul>
                </div>

                <div className="p-8 md:p-10 bg-white dark:bg-[#1A1A1A] rounded-[2.5rem] border border-border dark:border-white/5 shadow-sm">
                   <h3 className="text-2xl font-serif text-text-primary dark:text-white mb-8">Preferred Expertise</h3>
                   <div className="flex flex-wrap gap-3">
                      {(Array.isArray(job.skills) ? job.skills : []).map((skill, idx) => (
                        <Badge key={idx} variant="primary" className="px-5 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl">{skill}</Badge>
                      ))}
                   </div>
                   <div className="mt-12 p-8 bg-primary/5 dark:bg-primary/10 rounded-[2rem] border border-primary/10 flex gap-5">
                      <div className="w-14 h-14 rounded-2xl bg-white dark:bg-[#1A1A1A] flex items-center justify-center text-primary shadow-xl shadow-primary/5 shrink-0">
                        <Brain size={28} />
                      </div>
                      <div>
                        <p className="text-[10px] text-text-primary dark:text-white font-black mb-2 uppercase tracking-[0.2em]">AI Matching Active</p>
                        <p className="text-xs text-text-secondary dark:text-gray-400 leading-relaxed font-medium">
                          Tailor your resume to include these skills. Our AI engine uses them to rank your application for the hiring team.
                        </p>
                      </div>
                   </div>
                </div>
             </div>
          </main>

          {/* Sidebar */}
          <aside className="lg:w-96">
             <div className="sticky top-32 space-y-10">
                <div className="p-10 bg-white dark:bg-[#1A1A1A] rounded-[2.5rem] border border-border dark:border-white/5 shadow-sm text-center">
                <div className="w-24 h-24 rounded-[2.5rem] bg-gray-50 dark:bg-white/5 border border-border dark:border-white/5 p-4 flex items-center justify-center mx-auto mb-8 shadow-inner overflow-hidden">
                  {job.company?.logo ? (
                    <img src={getImageUrl(job.company.logo)} alt="" className="w-full h-full object-contain" />
                  ) : <Building2 size={32} className="text-text-secondary/20" />}
                </div>
                <h4 className="text-2xl font-serif text-text-primary dark:text-white mb-3">{job.company?.name}</h4>
                <p className="text-sm text-text-secondary dark:text-gray-400 mb-8 leading-relaxed font-medium">
                  {job.company?.description?.slice(0, 120)}...
                </p>
                
                <div className="space-y-4 text-left border-t border-border dark:border-white/5 pt-8 mb-8">
                   <div className="flex items-center gap-4 text-sm font-bold text-text-primary dark:text-gray-300 group">
                      <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-text-secondary dark:text-gray-500 group-hover:bg-primary/5 group-hover:text-primary transition-all">
                        <Globe size={18} />
                      </div>
                      <a href={job.company?.website} target="_blank" rel="noreferrer" className="hover:text-primary hover:underline truncate">
                        {job.company?.website?.replace('https://', '')}
                      </a>
                   </div>
                   <div className="flex items-center gap-4 text-sm font-bold text-text-primary dark:text-gray-300">
                      <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-text-secondary dark:text-gray-500">
                        <Users size={18} />
                      </div>
                      <span className="truncate">{job.company?.size || '50-200'} Employees</span>
                   </div>
                   <div className="flex items-center gap-4 text-sm font-bold text-text-primary dark:text-gray-300">
                      <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-text-secondary dark:text-gray-500">
                        <Building2 size={18} />
                      </div>
                      <span className="truncate">{job.company?.industry || 'Technology'}</span>
                   </div>
                </div>
                
                <Button variant="outline" className="w-full rounded-2xl py-4 font-black uppercase tracking-widest text-[10px]" onClick={() => navigate(`/company/${job.company?._id}`)}>
                  View Profile
                </Button>
             </div>

             <div className="p-10 bg-gray-900 dark:bg-primary rounded-[2.5rem] text-white overflow-hidden relative group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 dark:bg-white/10 blur-[80px] group-hover:scale-150 transition-transform duration-1000" />
                <h4 className="text-xl font-serif mb-8 relative z-10">Application Insights</h4>
                <div className="space-y-6 relative z-10">
                   <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-gray-400 dark:text-white/60">Applications</span>
                      <span className="text-primary dark:text-white">{job.applicationCount || 0}</span>
                   </div>
                   <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-gray-400 dark:text-white/60">Response rate</span>
                      <span className="text-secondary dark:text-secondary">High</span>
                   </div>
                   <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-gray-400 dark:text-white/60">Hiring pace</span>
                      <span className="text-accent dark:text-accent">Active</span>
                   </div>
                </div>
                <div className="mt-10 pt-10 border-t border-white/10 relative z-10">
                  <p className="text-[10px] font-black text-gray-500 dark:text-white/40 uppercase tracking-[0.2em] mb-4">Pro-tip for you</p>
                  <p className="text-sm text-gray-300 dark:text-white/80 leading-relaxed italic font-medium">
                    "Applying within the first 48 hours of posting increases your interview chances by nearly <span className="text-primary dark:text-secondary font-black">3x</span>."
                  </p>
                </div>
             </div>
          </div>
          </aside>
        </div>
      </div>

      {/* Apply Modal — REDESIGN: Premium Form */}
      <Modal 
        isOpen={isApplyModalOpen} 
        onClose={() => setIsApplyModalOpen(false)} 
        title="Application Journey"
        size="md"
        className="dark:bg-[#1A1A1A]"
      >
        <form onSubmit={handleApplySubmit} className="space-y-8 p-4 bg-white dark:bg-[#1A1A1A]">
           <div className="flex items-center gap-4 p-6 bg-primary/5 dark:bg-primary/10 rounded-[2rem] border border-primary/10">
              <div className="w-14 h-14 rounded-2xl bg-white dark:bg-[#1A1A1A] border border-border dark:border-white/5 flex items-center justify-center p-3 shadow-sm overflow-hidden">
                <img src={getImageUrl(job.company?.logo)} alt="" className="w-full h-full object-contain" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-serif text-text-primary dark:text-white leading-tight truncate">{job.title}</h3>
                <p className="text-xs font-bold text-text-secondary dark:text-gray-500 uppercase tracking-wider truncate">{job.company?.name} • {job.location}</p>
              </div>
           </div>

           {/* Resume Upload */}
           <div className="space-y-4">
              <label className="text-[10px] font-black text-text-secondary dark:text-gray-500 uppercase tracking-[0.2em] px-2">Submit Resume</label>
              <div className="relative h-56 rounded-[2.5rem] border-2 border-dashed border-border dark:border-white/10 flex flex-col items-center justify-center p-10 bg-gray-50/50 dark:bg-white/[0.02] group hover:border-primary/50 hover:bg-primary/5 transition-all">
                 <input 
                  type="file" 
                  accept=".pdf" 
                  onChange={(e) => setResume(e.target.files[0])}
                  className="absolute inset-0 opacity-0 cursor-pointer" 
                 />
                 <div className="w-20 h-20 rounded-[1.5rem] bg-white dark:bg-[#1A1A1A] flex items-center justify-center text-primary shadow-2xl shadow-primary/10 mb-6 group-hover:scale-110 transition-transform">
                    <FileText size={32} />
                 </div>
                 <p className="text-sm font-bold text-text-primary dark:text-white">
                    {resume ? resume.name : 'Click or drop your PDF'}
                 </p>
                 <p className="text-[10px] font-black text-text-secondary dark:text-gray-600 mt-3 uppercase tracking-[0.2em]">Max 5MB • PDF Only</p>
              </div>
           </div>

           <div className="space-y-4">
              <label className="text-[10px] font-black text-text-secondary dark:text-gray-500 uppercase tracking-[0.2em] px-2">Cover Letter (Optional)</label>
              <textarea 
                rows={5}
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                className="w-full rounded-[2rem] border border-border dark:border-white/5 bg-white dark:bg-white/5 p-6 text-sm font-medium focus:border-primary/30 focus:ring-4 focus:ring-primary/5 transition-all outline-none placeholder:text-text-secondary/30 dark:text-white resize-none"
                placeholder="Share your story and why you're a perfect match..."
              />
           </div>

           <div className="pt-6">
              <Button type="submit" size="xl" className="w-full rounded-2xl shadow-2xl shadow-primary/20 py-5" loading={applyMutation.isPending} icon={Send}>
                Submit Application
              </Button>
              <p className="text-[10px] text-center text-text-secondary dark:text-gray-600 mt-8 uppercase font-black tracking-[0.2em] leading-relaxed px-4">
                 By proceeding, your profile and resume will be shared <br className="hidden sm:block"/> with the hiring team at {job.company?.name}.
              </p>
           </div>
        </form>
      </Modal>
    </div>
  );
};

export default JobDetailPage;
