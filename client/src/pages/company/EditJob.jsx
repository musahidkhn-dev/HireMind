import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import JobForm from '../../components/jobs/JobForm';
import { useJobById, useUpdateJob } from '../../hooks/useJobs';
import Loader from '../../components/common/Loader';

const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: job, isLoading } = useJobById(id);
  const updateJob = useUpdateJob();

  const onSubmit = async (data) => {
    try {
      await updateJob.mutateAsync({ id, data });
      navigate('/dashboard/company/jobs');
    } catch (err) {
      // toast handled in hook
    }
  };

  if (isLoading) return <Loader fullScreen text="Fetching job details..." />;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:text-amber-600 transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">Edit Job Post</h1>
          <p className="text-gray-500 font-medium">Updating details for {job?.title}.</p>
        </div>
      </div>

      <div className="card p-8 md:p-12 bg-white dark:bg-gray-900 shadow-sm border-none">
        <JobForm initialData={job} onSubmit={onSubmit} isLoading={updateJob.isPending} />
      </div>
    </div>
  );
};

export default EditJob;
