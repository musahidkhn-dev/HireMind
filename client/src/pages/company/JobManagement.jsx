import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Plus, Filter, Edit3, Eye, Trash2, SlidersHorizontal, ChevronRight } from 'lucide-react';
import { useCompanyJobs, useDeleteJob, useUpdateJobStatus } from '../../hooks/useJobs';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Pagination from '../../components/common/Pagination';
import EmptyState from '../../components/common/EmptyState';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { TableRowSkeleton } from '../../components/common/Skeleton';
import { timeAgo } from '../../utils/helpers';
import useDebounce from '../../hooks/useDebounce';

const JobManagement = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [jobToDelete, setJobToDelete] = useState(null);

  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading } = useCompanyJobs({ search: debouncedSearch, status, page });
  const jobs = Array.isArray(data) ? data : data?.jobs || [];
  const deleteMutation = useDeleteJob();
  const statusMutation = useUpdateJobStatus();

  const handleDelete = () => {
    if (jobToDelete) {
      deleteMutation.mutate(jobToDelete._id);
      setJobToDelete(null);
    }
  };

  const toggleStatus = (job) => {
    const newStatus = job.status === 'active' ? 'draft' : 'active';
    statusMutation.mutate({ id: job._id, status: newStatus });
  };

  return (
    <div className="space-y-6 lg:space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-black text-gray-900 dark:text-white mb-1 lg:mb-2">Manage Jobs</h1>
          <p className="text-sm lg:text-base text-gray-500 font-medium">Create, edit and track your job listings.</p>
        </div>
        <Button icon={Plus} onClick={() => navigate('/dashboard/company/jobs/create')} className="w-full lg:w-auto py-3">Post New Job</Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-3 lg:gap-4 bg-white dark:bg-gray-900 p-3 lg:p-4 rounded-xl lg:rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search jobs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border-none rounded-lg lg:rounded-xl text-xs lg:text-sm focus:ring-2 focus:ring-amber-500/20"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto px-2">
          <Filter size={16} className="text-gray-400 shrink-0" />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="bg-transparent border-none text-[10px] lg:text-sm font-bold text-gray-700 dark:text-gray-300 focus:ring-0 cursor-pointer w-full sm:w-auto"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Jobs Table */}
      <div className="card bg-white dark:bg-gray-900 overflow-hidden shadow-sm rounded-xl lg:rounded-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-gray-800/50">
              <tr>
                <th className="px-4 py-3 lg:px-6 lg:py-4 text-[9px] lg:text-[10px] font-black text-gray-400 uppercase tracking-widest">Title</th>
                <th className="px-4 py-3 lg:px-6 lg:py-4 text-[9px] lg:text-[10px] font-black text-gray-400 uppercase tracking-widest hidden md:table-cell">Type / Location</th>
                <th className="px-4 py-3 lg:px-6 lg:py-4 text-[9px] lg:text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-4 py-3 lg:px-6 lg:py-4 text-[9px] lg:text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Applicants</th>
                <th className="px-4 py-3 lg:px-6 lg:py-4 text-[9px] lg:text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {isLoading ? (
                [...Array(5)].map((_, i) => <TableRowSkeleton key={i} columns={5} />)
              ) : jobs.length > 0 ? (
                jobs.map((job) => (
                  <tr key={job._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors group">
                    <td className="px-4 py-3 lg:px-6 lg:py-4 min-w-[120px]">
                      <div>
                        <p className="text-xs lg:text-sm font-bold text-gray-900 dark:text-white group-hover:text-amber-600 transition-colors cursor-pointer truncate max-w-[150px] lg:max-w-none" onClick={() => navigate(`/dashboard/company/jobs/edit/${job._id}`)}>
                          {job.title}
                        </p>
                        <p className="text-[9px] text-gray-500 font-bold uppercase mt-0.5">ID: {job._id.slice(-6)}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 lg:px-6 lg:py-4 hidden md:table-cell">
                      <div className="text-[10px] lg:text-xs font-semibold text-gray-600 dark:text-gray-400">
                        <p>{job.jobType.replace('-', ' ')}</p>
                        <p className="text-gray-400 font-medium mt-0.5">{job.location}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 lg:px-6 lg:py-4">
                      <div className="flex items-center gap-2 lg:gap-3">
                        <Badge variant={job.status === 'active' ? 'success' : 'default'} size="sm" className="capitalize text-[9px] lg:text-[10px] px-1.5 lg:px-2">{job.status}</Badge>
                        <button
                          onClick={() => toggleStatus(job)}
                          className={`w-7 h-3.5 lg:w-8 lg:h-4 rounded-full relative transition-colors shrink-0 ${job.status === 'active' ? 'bg-amber-600' : 'bg-gray-300'}`}
                        >
                          <div className={`absolute top-0.5 w-2.5 h-2.5 lg:w-3 lg:h-3 bg-white rounded-full transition-all ${job.status === 'active' ? 'left-[1.05rem] lg:left-[1.125rem]' : 'left-0.5'}`} />
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3 lg:px-6 lg:py-4 text-center">
                      <div
                        className="inline-flex flex-col items-center cursor-pointer group/count"
                        onClick={() => navigate(`/dashboard/company/applicants?jobId=${job._id}`)}
                      >
                        <span className="text-xs lg:text-sm font-black text-amber-600 group-hover/count:scale-110 transition-transform">{job.applicationCount || 0}</span>
                        <span className="text-[8px] font-bold text-gray-400 uppercase hidden sm:block">View All</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 lg:px-6 lg:py-4">
                      <div className="flex items-center justify-end gap-0.5 lg:gap-1">
                        <button onClick={() => navigate(`/dashboard/company/applicants?jobId=${job._id}`)} className="p-1.5 lg:p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/30 rounded-lg lg:rounded-xl transition-all" title="View Applicants"><Eye size={16} className="lg:hidden" /><Eye size={18} className="hidden lg:block" /></button>
                        <button onClick={() => navigate(`/dashboard/company/jobs/edit/${job._id}`)} className="p-1.5 lg:p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/30 rounded-lg lg:rounded-xl transition-all" title="Edit Job"><Edit3 size={16} className="lg:hidden" /><Edit3 size={18} className="hidden lg:block" /></button>
                        <button onClick={() => setJobToDelete(job)} className="p-1.5 lg:p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg lg:rounded-xl transition-all" title="Delete Job"><Trash2 size={16} className="lg:hidden" /><Trash2 size={18} className="hidden lg:block" /></button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">
                    <EmptyState
                      title="No jobs found"
                      description="Start by posting your first job opportunity."
                      actionText="Create New Job"
                      onAction={() => navigate('/dashboard/company/jobs/create')}
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination removed temporarily to match new data structure */}

      <ConfirmDialog
        isOpen={!!jobToDelete}
        onClose={() => setJobToDelete(null)}
        onConfirm={handleDelete}
        title="Delete Job Post?"
        message="This will permanently remove the job post and all associated applications. This action cannot be undone."
      />
    </div>
  );
};

export default JobManagement;
