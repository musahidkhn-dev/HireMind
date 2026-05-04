import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import companyApi from '../api/companyApi';
import { toast } from 'react-hot-toast';

export const usePublicCompany = (id) => {
  return useQuery({
    queryKey: ['company', 'public', id],
    queryFn: () => companyApi.getPublicProfile(id).then(res => res.data),
    enabled: !!id,
  });
};

export const useFollowCompany = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => companyApi.followCompany(id),
    onSuccess: (res) => {
      queryClient.invalidateQueries(['company']);
      queryClient.invalidateQueries(['user', 'profile']);
      toast.success(res.data.message);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to follow company');
    }
  });
};

export const useUnfollowCompany = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => companyApi.unfollowCompany(id),
    onSuccess: (res) => {
      queryClient.invalidateQueries(['company']);
      queryClient.invalidateQueries(['user', 'profile']);
      toast.success(res.data.message);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to unfollow company');
    }
  });
};
