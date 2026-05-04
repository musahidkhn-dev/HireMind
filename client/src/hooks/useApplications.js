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
    onSuccess: () => {
      queryClient.invalidateQueries(['applications']);
      queryClient.invalidateQueries(['dashboard']);
      queryClient.invalidateQueries(['applications', 'stats']);
      toast.success('Applied successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to apply');
    },
  });
};

export const useUpdateStage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => applicationApi.updateStage(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries(['applications']);
      queryClient.invalidateQueries(['application', id]);
      queryClient.invalidateQueries(['dashboard']);
      queryClient.invalidateQueries(['applications', 'stats']);
      toast.success('Stage updated');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update stage');
    },
  });
};

export const useWithdrawApplication = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => applicationApi.withdrawApplication(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['applications']);
      toast.success('Application withdrawn');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to withdraw application');
    },
  });
};

export const useAddNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, text }) => applicationApi.addNote(id, text),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries(['application', id]);
      toast.success('Note added');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to add note');
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
