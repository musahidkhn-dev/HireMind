import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Bell, Trash2, CheckCircle, Info, AlertCircle, Briefcase, UserPlus, Clock } from 'lucide-react';
import { notificationApi } from '../api/notificationApi';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import { toast } from 'react-hot-toast';

const NotificationsPage = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ['notifications-all'],
    queryFn: () => notificationApi.getNotifications({ limit: 50 }).then(res => res.data)
  });

  const markReadMutation = useMutation({
    mutationFn: notificationApi.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications-all']);
      queryClient.invalidateQueries(['notifications']);
      queryClient.invalidateQueries(['notifications-unread']);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: notificationApi.deleteNotification,
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications-all']);
      toast.success('Notification deleted');
    }
  });

  const clearAllMutation = useMutation({
    mutationFn: notificationApi.deleteAllNotifications,
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications-all']);
      toast.success('All notifications cleared');
    }
  });

  const getIcon = (type) => {
    switch (type) {
      case 'application_received': return <Briefcase className="text-amber-500" size={24} />;
      case 'recruiter_invited': return <UserPlus className="text-purple-500" size={24} />;
      case 'application_status': return <CheckCircle className="text-green-500" size={24} />;
      case 'application_rejected': return <AlertCircle className="text-red-500" size={24} />;
      default: return <Info className="text-blue-500" size={24} />;
    }
  };

  if (isLoading) return <Loader fullScreen text="Fetching notifications..." />;

  const notifications = data?.notifications || [];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">Notifications</h1>
          <p className="text-gray-500 font-medium">Stay updated with your latest activity.</p>
        </div>
        {notifications.length > 0 && (
          <Button 
            variant="outline" 
            icon={Trash2} 
            onClick={() => clearAllMutation.mutate()}
            className="text-red-500 border-red-100 hover:bg-red-50"
          >
            Clear All
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {notifications.length > 0 ? (
          notifications.map((n) => (
            <div 
              key={n._id}
              className={`card p-6 flex gap-6 items-start hover:shadow-md transition-all border-none ${!n.isRead ? 'bg-amber-50/30 dark:bg-amber-900/10' : 'bg-white dark:bg-gray-900'}`}
            >
              <div className={`p-3 rounded-2xl ${!n.isRead ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-800/50'}`}>
                {getIcon(n.type)}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-gray-900 dark:text-white">{n.title}</h3>
                  <span className="text-xs text-gray-400 font-medium flex items-center gap-1">
                    <Clock size={12} />
                    {formatDistanceToNow(new Date(n.createdAt))} ago
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{n.message}</p>
                <div className="flex items-center gap-4">
                  {!n.isRead && (
                    <button 
                      onClick={() => markReadMutation.mutate(n._id)}
                      className="text-xs font-bold text-amber-600 hover:underline"
                    >
                      Mark as read
                    </button>
                  )}
                  <button 
                    onClick={() => deleteMutation.mutate(n._id)}
                    className="text-xs font-bold text-gray-400 hover:text-red-500 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-20 text-center bg-white dark:bg-gray-900 rounded-[3rem] border border-gray-100 dark:border-gray-800">
            <Bell size={60} className="mx-auto text-gray-200 mb-6" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No notifications yet</h3>
            <p className="text-gray-500 max-w-xs mx-auto">We'll let you know when something important happens.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
