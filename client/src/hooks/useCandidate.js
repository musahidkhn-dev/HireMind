import { useQuery } from '@tanstack/react-query';
import { userApi } from '../api/userApi';

export const useCandidateProfile = () => {
  const token = localStorage.getItem('accessToken');
  return useQuery({
    queryKey: ['candidate', 'profile'],
    queryFn: () => userApi.getCandidateProfile().then(res => res.data),
    enabled: !!token,
  });
};

export const useCandidateDashboard = () => {
  const token = localStorage.getItem('accessToken');
  return useQuery({
    queryKey: ['candidate', 'dashboard'],
    queryFn: () => userApi.getCandidateDashboard().then(res => res.data),
    enabled: !!token,
  });
};
