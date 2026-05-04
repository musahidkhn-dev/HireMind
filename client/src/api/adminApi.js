import API from './axios';

export const adminApi = {
  getStats: () => API.get('/admin/stats'),
  getUsers: (params) => API.get('/admin/users', { params }),
  getUserDetails: (id) => API.get(`/admin/users/${id}`),
  blockUser: (id, isActive) => API.patch(`/admin/block-user/${id}`, { isActive }),
  deleteUser: (id) => API.delete(`/admin/delete-user/${id}`),
  getCompanies: (params) => API.get('/admin/companies', { params }),
  getCompanyDetails: (id) => API.get(`/admin/companies/${id}`),
  deleteCompany: (id) => API.delete(`/admin/delete-company/${id}`),
  getJobs: (params) => API.get('/admin/jobs', { params }),
  getJobDetails: (id) => API.get(`/admin/jobs/${id}`),
};

export default adminApi;
