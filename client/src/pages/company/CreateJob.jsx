import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import JobForm from '../../components/jobs/JobForm';
import { useCreateJob } from '../../hooks/useJobs';
import { toast } from 'react-hot-toast';

const CreateJob = () => {
  const navigate = useNavigate();
  const createJob = useCreateJob();

  const onSubmit = async (data) => {
    console.log("🚀 CreateJob onSubmit called with:", data);
    try {
      console.log("⏳ Starting mutation...");
      await createJob.mutateAsync(data);
      console.log("✨ Mutation successful, navigating...");
      navigate('/dashboard/company/jobs');
    } catch (err) {
      console.error("❌ Mutation failed:", err);
      // toast handled in hook
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:text-amber-600 transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">Post New Job</h1>
          <p className="text-gray-500 font-medium">Create a new opportunity and find the perfect talent.</p>
        </div>
      </div>

      <div className="card p-8 md:p-12 bg-white dark:bg-gray-900 shadow-sm border-none">
        <JobForm onSubmit={onSubmit} isLoading={createJob.isPending} />
      </div>
    </div>
  );
};

export default CreateJob;
