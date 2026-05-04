import API from './axios';

export const jobApi = {
  getPublicJobs: (params) => API.get('/jobs/public', { params }),
  getJobById: (id) => API.get(`/jobs/${id}`),
  // FIXED: Correct endpoint for company jobs
  getCompanyJobs: (params) => API.get('/jobs/my-jobs', { params }),
  createJob: (data) => API.post('/jobs', data),
  updateJob: (id, data) => API.put(`/jobs/${id}`, data),
  deleteJob: (id) => API.delete(`/jobs/${id}`),
  updateJobStatus: (id, status) => API.patch(`/jobs/${id}/status`, { status }),
  generateJobDescription: (data) => API.post('/ai/generate-description', data),
  searchJobs: (params) => API.get('/search', { params }),
};

export default jobApi;
