import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { applicationApi } from '../api/applicationApi';
import { toast } from 'react-hot-toast';

export const useMyApplications = (filters) => {
  const token = localStorage.getItem('accessToken');
  return useQuery({
    queryKey: ['applications', 'me', filters],
    queryFn: () => applicationApi.getMyApplications(filters).then(res => res.data),
    enabled: !!token,
  });
};

export const useJobApplicants = (jobId, params = {}) => {
  return useQuery({
    queryKey: ['applications', 'job', jobId, params],
    queryFn: () => applicationApi.getJobApplicants(jobId, params).then(res => res.data),
    enabled: !!jobId,
  });
};

export const useApplicationById = (id) => {
  return useQuery({
    queryKey: ['application', id],
    queryFn: () => applicationApi.getApplicationById(id).then(res => res.data),
    enabled: !!id,
  });
};

export const useApplyToJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ jobId, formData }) => applicationApi.applyToJob(jobId, formData),
    retry: 1,
    onSuccess: () => {
      queryClient.invalidateQueries(['applications']);
      queryClient.invalidateQueries(['dashboard']);
      queryClient.invalidateQueries(['applications', 'stats']);
      toast.success('Applied successfully!');
    },
    onError: (error) => {
      const msg = error.code === 'ECONNABORTED'
        ? 'Request timed out. Please try again.'
        : error.response?.data?.message || 'Failed to apply';
      toast.error(msg);
    },
  });
};

export const useUpdateStage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => applicationApi.updateStage(id, data),
    retry: 1,
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries(['applications']);
      queryClient.invalidateQueries(['application', id]);
      queryClient.invalidateQueries(['dashboard']);
      queryClient.invalidateQueries(['applications', 'stats']);
      toast.success('Stage updated');
    },
    onError: (error) => {
      const msg = error.code === 'ECONNABORTED'
        ? 'Request timed out. Please try again.'
        : error.response?.data?.message || 'Failed to update stage';
      toast.error(msg);
    },
  });
};

export const useWithdrawApplication = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => applicationApi.withdrawApplication(id),
    retry: 1,
    onSuccess: () => {
      queryClient.invalidateQueries(['applications']);
      toast.success('Application withdrawn');
    },
    onError: (error) => {
      const msg = error.code === 'ECONNABORTED'
        ? 'Request timed out. Please try again.'
        : error.response?.data?.message || 'Failed to withdraw application';
      toast.error(msg);
    },
  });
};

export const useAddNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, text }) => applicationApi.addNote(id, text),
    retry: 1,
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries(['application', id]);
      toast.success('Note added');
    },
    onError: (error) => {
      const msg = error.code === 'ECONNABORTED'
        ? 'Request timed out. Please try again.'
        : error.response?.data?.message || 'Failed to add note';
      toast.error(msg);
    },
  });
};

export const useApplicationStats = () => {
  const token = localStorage.getItem('accessToken');
  return useQuery({
    queryKey: ['applications', 'stats'],
    queryFn: () => applicationApi.getStats().then(res => res.data),
    enabled: !!token,
  });
};
