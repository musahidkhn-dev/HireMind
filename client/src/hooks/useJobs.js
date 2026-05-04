import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { jobApi } from '../api/jobApi';
import { toast } from 'react-hot-toast';

export const usePublicJobs = (filters) => {
  return useQuery({
    queryKey: ['jobs', 'public', filters],
    queryFn: () => jobApi.getPublicJobs(filters).then(res => res.data),
  });
};

export const useCompanyJobs = (filters) => {
  const token = localStorage.getItem('accessToken');
  return useQuery({
    queryKey: ['jobs', 'company', filters],
    queryFn: () => jobApi.getCompanyJobs(filters).then(res => res.data.jobs || []),
    enabled: !!token,
  });
};

export const useJobById = (id) => {
  return useQuery({
    queryKey: ['job', id],
    queryFn: () => jobApi.getJobById(id).then(res => res.data.job),
    enabled: !!id,
  });
};

export const useCreateJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => jobApi.createJob(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['jobs'],
        exact: false
      });
      queryClient.invalidateQueries(['dashboard']);
      toast.success('Job created successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create job');
    },
  });
};

export const useUpdateJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => jobApi.updateJob(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries(['jobs']);
      queryClient.invalidateQueries(['job', id]);
      toast.success('Job updated successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update job');
    },
  });
};

export const useDeleteJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => jobApi.deleteJob(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['jobs']);
      toast.success('Job deleted successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete job');
    },
  });
};

export const useUpdateJobStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }) => jobApi.updateJobStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries(['jobs']);
      queryClient.invalidateQueries(['dashboard']);
      toast.success('Status updated');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update status');
    },
  });
};

export const useGenerateJD = () => {
  return useMutation({
    mutationFn: (data) => jobApi.generateJobDescription(data).then(res => res.data),
    onSuccess: () => toast.success('AI description generated'),
    onError: () => toast.error('AI generation failed'),
  });
};
