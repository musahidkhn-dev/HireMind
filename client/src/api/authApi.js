import API from './axios';

export const authApi = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  googleLogin: (data) => API.post('/auth/google', data),
  logout: () => API.post('/auth/logout'),
  getMe: () => API.get('/auth/me'),
  forgotPassword: (email) => API.post('/auth/forgot-password', { email }),
  // Fix: Backend expects token and password in query parameters
  resetPassword: (data) => API.post(`/auth/reset-password?token=${data.token}&password=${data.password}`),
  refreshToken: (token) => API.post('/auth/refresh-token', { refreshToken: token }),
  // Added verify reset token
  verifyResetToken: (token) => API.get(`/auth/verify-reset-token/${token}`),
  
  // FIXED: Standardized OTP functions as requested
  sendOTP: (email) => API.post('/auth/forgot-password-otp', { email }),
  verifyOTP: (email, otp) => API.post('/auth/verify-otp', { email, otp }),
  resetPasswordWithOTP: (email, otp, password) => API.post('/auth/reset-password-otp', { email, otp, password }),

  getSecurityQuestion: (email) => API.post('/auth/get-security-question', { email }),
  updateSecuritySettings: (data) => API.patch('/auth/security-settings', data),
  completeProfile: (data) => API.post('/auth/complete-profile', data),
};

export default authApi;
