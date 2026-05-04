import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../api/dashboardApi';

export const useCompanyDashboard = () => {
  const token = localStorage.getItem('accessToken');
  return useQuery({
    queryKey: ['dashboard', 'company'],
    queryFn: () => dashboardApi.getCompanyDashboard().then(res => res.data),
    enabled: !!token,
  });
};

export const useJobStats = () => {
  const token = localStorage.getItem('accessToken');
  return useQuery({
    queryKey: ['dashboard', 'jobs', 'stats'],
    queryFn: () => dashboardApi.getJobStats().then(res => res.data),
    enabled: !!token,
  });
};

export const useApplicationStats = (filters) => {
  const token = localStorage.getItem('accessToken');
  return useQuery({
    queryKey: ['dashboard', 'applications', 'stats', filters],
    queryFn: () => dashboardApi.getApplicationStats(filters).then(res => res.data),
    enabled: !!token,
  });
};

export const useTopSkills = () => {
  const token = localStorage.getItem('accessToken');
  return useQuery({
    queryKey: ['dashboard', 'skills', 'top'],
    queryFn: () => dashboardApi.getTopSkills().then(res => res.data),
    enabled: !!token,
  });
};

export const useRecruiterPerformance = () => {
  const token = localStorage.getItem('accessToken');
  return useQuery({
    queryKey: ['dashboard', 'recruiters', 'performance'],
    queryFn: () => dashboardApi.getRecruiterPerformance().then(res => res.data),
    enabled: !!token,
  });
};

export const useActivities = (params) => {
  const token = localStorage.getItem('accessToken');
  return useQuery({
    queryKey: ['dashboard', 'activities', params],
    queryFn: () => dashboardApi.getActivities(params).then(res => res.data),
    enabled: !!token,
  });
};
