import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { aiApi } from '../api/aiApi';
import { toast } from 'react-hot-toast';

export const useScoreResume = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (applicationId) => aiApi.scoreResume(applicationId).then(res => res.data),
    onSuccess: (_, applicationId) => {
      queryClient.invalidateQueries(['application', applicationId]);
      toast.success('Resume scored by AI');
    },
  });
};

export const useBulkScore = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (jobId) => aiApi.bulkScore(jobId).then(res => res.data),
    onSuccess: (_, jobId) => {
      queryClient.invalidateQueries(['applications', 'job', jobId]);
      toast.success('Bulk scoring initiated');
    },
  });
};

export const useExtractSkills = () => {
  return useMutation({
    mutationFn: (text) => aiApi.extractSkills(text).then(res => res.data),
  });
};

export const useGenerateInterviewQuestions = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ jobId, applicationId }) => 
      aiApi.generateInterviewQuestions(jobId, applicationId).then(res => res.data),
    onSuccess: (_, { jobId }) => {
      queryClient.invalidateQueries(['ai', 'questions', jobId]);
      toast.success('Questions generated');
    },
  });
};

export const useInterviewQuestions = (jobId) => {
  const token = localStorage.getItem('accessToken');
  return useQuery({
    queryKey: ['ai', 'questions', jobId],
    queryFn: () => aiApi.getInterviewQuestions(jobId).then(res => res.data),
    enabled: !!jobId && !!token,
  });
};
