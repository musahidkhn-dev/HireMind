import API from './axios';

export const notificationApi = {
  getNotifications: (params) => API.get('/notifications', { params }),
  markAsRead: (id) => API.patch(`/notifications/${id}/read`),
  // Fix: Backend endpoint is /mark-all-read
  markAllAsRead: () => API.patch('/notifications/mark-all-read'),
  deleteNotification: (id) => API.delete(`/notifications/${id}`),
  // Added missing endpoints
  getUnreadCount: () => API.get('/notifications/unread-count'),
  deleteAllNotifications: () => API.delete('/notifications/all'),
};

export default notificationApi;
