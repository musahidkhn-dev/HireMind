import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Building2, MapPin, Calendar, DollarSign, Clock, Users } from 'lucide-react';
import { adminApi } from '../../api/adminApi';
import Loader from '../../components/common/Loader';
import Badge from '../../components/common/Badge';
import { timeAgo } from '../../utils/helpers';

const AdminJobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: job, isLoading, error } = useQuery({
    queryKey: ['admin-job', id],
    queryFn: () => adminApi.getJobDetails(id).then(res => res.data),
    retry: 1
  });

  if (isLoading) return <Loader fullScreen />;
  
  if (error || !job) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Job not found</h2>
        <button onClick={() => navigate('/dashboard/admin/jobs')} className="mt-4 text-amber-600 font-bold">Go Back</button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-20">
      <button 
        onClick={() => navigate('/dashboard/admin/jobs')}
        className="flex items-center gap-2 text-gray-500 hover:text-amber-600 transition-colors font-semibold"
      >
        <ArrowLeft size={20} /> Back to Jobs
      </button>

      <div className="card p-8 bg-white dark:bg-gray-900">
        <div className="flex flex-col md:flex-row gap-8 items-start border-b border-gray-100 dark:border-gray-800 pb-8">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <h1 className="text-3xl font-black text-gray-900 dark:text-white">{job.title}</h1>
              <Badge variant={job.status === 'active' ? 'success' : 'default'} className="capitalize">{job.status}</Badge>
            </div>
            
            <div className="flex flex-wrap gap-4 text-gray-500 font-medium mb-6">
              <span className="flex items-center gap-1"><Building2 size={16} /> {job.company?.name || 'Unknown Company'}</span>
              <span className="flex items-center gap-1"><MapPin size={16} /> {job.location || 'Remote'}</span>
              <span className="flex items-center gap-1"><Calendar size={16} /> Posted {timeAgo(job.createdAt)}</span>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">{job.jobType}</Badge>
              <Badge variant="outline">{job.experienceLevel}</Badge>
              <Badge variant="outline">{job.workMode}</Badge>
              {job.salaryRange?.min && (
                <Badge variant="outline" className="flex items-center gap-1">
                   <DollarSign size={14} /> 
                   {job.salaryRange.min.toLocaleString()} - {job.salaryRange.max?.toLocaleString() || '+'} {job.salaryRange.currency}
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="py-8 grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Job Description</h3>
              <div className="prose dark:prose-invert max-w-none text-gray-500">
                 <p className="whitespace-pre-wrap">{job.description}</p>
              </div>
            </div>

            {job.requirements && job.requirements.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Requirements</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-500">
                  {job.requirements.map((req, i) => (
                    <li key={i}>{req}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {job.skills && job.skills.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Required Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, i) => (
                    <span key={i} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-lg text-sm font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="p-5 bg-amber-50 dark:bg-amber-900/10 rounded-2xl border border-amber-100 dark:border-amber-900/30 text-center">
               <p className="text-4xl font-black text-amber-600 mb-2">{job.applicationCount || 0}</p>
               <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Total Applications</p>
            </div>
            
            <div className="p-4 rounded-xl border border-gray-100 dark:border-gray-800">
               <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Created By</p>
               <div className="font-bold text-gray-900 dark:text-white">{job.createdBy?.name || 'Unknown'}</div>
               <div className="text-sm text-gray-500">{job.createdBy?.email}</div>
               <Badge variant="default" size="sm" className="mt-2 capitalize">{job.createdBy?.role}</Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminJobDetails;
