import API from './axios';

export const companyApi = {
  getProfile: () => API.get('/company/me'),
  getPublicProfile: (id) => API.get(`/company/public/${id}`),
  followCompany: (id) => API.post(`/company/follow/${id}`),
  unfollowCompany: (id) => API.post(`/company/unfollow/${id}`),
  updateProfile: (data) => {
    // If data is FormData, send it as is, otherwise axios will handle it
    const config = data instanceof FormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
    return API.put('/company/profile', data, config);
  },
  getRecruiters: () => API.get('/company/recruiters'),
  inviteRecruiter: (data) => API.post('/company/invite-recruiter', data),
  acceptInvite: (data) => API.post('/company/accept-invite', data),
  // Fix: Backend endpoint is singular /recruiter
  removeRecruiter: (id) => API.delete(`/company/recruiter/${id}`),
  getTeam: () => API.get('/company/team'),
};

export default companyApi;
