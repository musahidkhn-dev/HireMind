import API from './axios';

export const applicationApi = {
  applyToJob: (jobId, formData) => {
    return API.post(`/applications/apply/${jobId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  // Fix: Backend endpoint is /my
  getMyApplications: (params) => API.get('/applications/my', { params }),
  getJobApplicants: (jobId, params) => API.get(`/jobs/company/${jobId}/applications`, { params }),
  getApplicationById: (id) => API.get(`/applications/${id}`),
  // Fix: Backend endpoint is /status
  updateStage: (id, data) => API.patch(`/applications/${id}/status`, data),
  withdrawApplication: (id) => API.delete(`/applications/${id}`),
  // Fix: Backend endpoint is /note
  addNote: (id, text) => API.post(`/applications/${id}/note`, { text }),
  // FIXED: Removed non-existent /applications/stats endpoint (use dashboardApi instead)
  // getStats: () => API.get('/applications/stats'),
};

export default applicationApi;
