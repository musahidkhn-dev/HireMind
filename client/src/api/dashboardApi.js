import API from './axios';

export const dashboardApi = {
  getCompanyDashboard: () => API.get('/dashboard/company'),
  // Fix: Standardized dashboard endpoints
  getJobStats: () => API.get('/dashboard/job-stats'),
  getApplicationStats: (params) => API.get('/dashboard/application-stats', { params }),
  getTopSkills: () => API.get('/dashboard/top-skills'),
  getRecruiterPerformance: () => API.get('/dashboard/recruiter-performance'),
  getActivities: (params) => API.get('/dashboard/activities', { params }),
};

export default dashboardApi;
