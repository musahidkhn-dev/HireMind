import API from './axios';

export const userApi = {
  // Fix: Backend endpoint is /profile
  getCandidateProfile: () => API.get('/candidate/profile'),
  updateCandidateProfile: (data) => API.put('/candidate/profile', data),
  uploadResume: (formData) => {
    return API.post('/candidate/upload-resume', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  getResume: () => API.get('/candidate/resume'),
  deleteResume: () => API.delete('/candidate/resume'),
  // Fix: Backend endpoint is /upload-profileImage
  uploadAvatar: (formData) => {
    return API.post('/candidate/upload-profileImage', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  getCandidateDashboard: () => API.get('/candidate/dashboard'),
  // Fix: Backend endpoint is /:id
  getPublicProfile: (candidateId) => API.get(`/candidate/${candidateId}`),
};

export default userApi;
