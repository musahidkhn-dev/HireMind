import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Eye, Trash2, Search, Building2, MapPin, Calendar } from 'lucide-react';
import { adminApi } from '../../api/adminApi';
import Loader from '../../components/common/Loader';
import Badge from '../../components/common/Badge';
import { toast } from 'react-hot-toast';
import { timeAgo } from '../../utils/helpers';

const JobsPage = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: jobsData, isLoading } = useQuery({
    queryKey: ['admin-jobs-all'],
    queryFn: () => adminApi.getJobs({ limit: 100 })
  });

  const jobs = jobsData?.data?.jobs || jobsData?.jobs || [];

  if (isLoading) return <Loader fullScreen text="Loading platform jobs..." />;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Jobs Management</h1>
        <p className="text-gray-500 font-medium">Monitor and manage all job postings across the platform.</p>
      </div>

      <div className="grid gap-6">
        {jobs.length === 0 ? (
          <div className="card py-20 text-center">
            <Briefcase size={60} className="mx-auto text-gray-200 mb-6" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">No jobs found</h3>
          </div>
        ) : (
          jobs.map((job) => (
            <div 
              key={job._id}
              className="card bg-white dark:bg-gray-900 border-none hover:shadow-xl transition-all group overflow-hidden"
            >
              <div className="p-6 sm:p-8 flex flex-col md:flex-row gap-6 items-start md:items-center">
                {/* Company Logo/Icon */}
                <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 shrink-0">
                  {job.company?.logo ? (
                    <img src={job.company.logo} alt="" className="w-full h-full object-cover rounded-2xl" />
                  ) : (
                    <Building2 size={32} />
                  )}
                </div>

                {/* Job Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h3 className="text-xl font-black text-gray-900 dark:text-white truncate">{job.title}</h3>
                    <Badge variant={job.status === 'active' ? 'success' : 'default'} size="sm" className="capitalize">
                      {job.status}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-sm font-medium text-gray-500">
                    <div className="flex items-center gap-2">
                      <Building2 size={16} className="text-amber-500" />
                      <span>{job.company?.name || 'Unknown Company'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-amber-500" />
                      <span>{job.location || 'Remote'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-amber-500" />
                      <span>Posted {timeAgo(job.createdAt)}</span>
                    </div>
                  </div>
                </div>

                {/* Meta & Actions */}
                <div className="flex flex-col items-end gap-4 w-full md:w-auto">
                   <div className="text-right">
                      <p className="text-2xl font-black text-amber-600 leading-none">{job.applicationCount || 0}</p>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Applications</p>
                   </div>
                   <div className="flex items-center gap-2">
                      <button 
                        onClick={() => navigate(`/dashboard/admin/jobs/${job._id}`)}
                        className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-2xl text-gray-500 transition-colors"
                        title="View Details"
                      >
                        <Eye size={20} />
                      </button>
                      <button className="p-3 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-2xl text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 size={20} />
                      </button>
                   </div>
                </div>
              </div>
              
              {/* Recruiter info footer */}
              <div className="px-8 py-3 bg-gray-50/50 dark:bg-gray-800/30 border-t border-gray-50 dark:border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                  <span className="text-gray-300">Posted by:</span>
                  <span className="text-gray-500 dark:text-gray-400">{job.createdBy?.name || 'Admin'} ({job.createdBy?.email})</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default JobsPage;
