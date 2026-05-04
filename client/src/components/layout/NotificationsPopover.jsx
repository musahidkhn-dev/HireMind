import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Bell, Check, Trash, Info, AlertCircle, CheckCircle, Briefcase, UserPlus } from 'lucide-react';
import { notificationApi } from '../../api/notificationApi';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';

const NotificationsPopover = ({ isOpen, onClose }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const { data: notifData } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationApi.getNotifications({ limit: 5 }).then(res => res.data),
    // FIXED: Ensure user exists before fetching
    enabled: isOpen && !!user
  });

  const { data: countData } = useQuery({
    queryKey: ['notifications-unread'],
    queryFn: () => notificationApi.getUnreadCount().then(res => res.data),
    // FIXED: Ensure user exists before polling
    enabled: !!user,
    refetchInterval: 30000 // every 30s
  });

  const notifications = notifData?.notifications || [];
  const unreadCount = countData?.unreadCount || 0;

  const markReadMutation = useMutation({
    mutationFn: notificationApi.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications']);
      queryClient.invalidateQueries(['notifications-unread']);
    }
  });

  const markAllReadMutation = useMutation({
    mutationFn: notificationApi.markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications']);
      queryClient.invalidateQueries(['notifications-unread']);
    }
  });

  const handleNotificationClick = async (n) => {
    // Mark as read if unread
    if (!n.isRead) {
      markReadMutation.mutate(n._id);
    }

    // Close popover
    onClose();

    // Navigate based on type
    switch (n.type) {
      case 'application_received':
        if (n.data?.applicationId) navigate(`/dashboard/company/applicants/${n.data.applicationId}`);
        else navigate('/dashboard/company/applicants');
        break;
      case 'application_status':
      case 'application_rejected':
        navigate('/dashboard/candidate/applications');
        break;
      case 'interview_scheduled':
        navigate('/dashboard/candidate/applications');
        break;
      case 'job_published':
        navigate('/jobs');
        break;
      case 'recruiter_invited':
        navigate('/dashboard/company/team');
        break;
      default:
        // Do nothing or navigate to a general notifications page
        break;
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'application_received': return <Briefcase className="text-amber-500" size={18} />;
      case 'recruiter_invited': return <UserPlus className="text-purple-500" size={18} />;
      case 'application_status': return <CheckCircle className="text-green-500" size={18} />;
      case 'application_rejected': return <AlertCircle className="text-red-500" size={18} />;
      default: return <Info className="text-blue-500" size={18} />;
    }
  };

  return (
    <div className="relative">
      <button onClick={onClose} className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-500 hover:text-amber-600 transition-all relative">
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white dark:border-gray-900 animate-bounce">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={onClose} />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-4 w-80 bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-[2rem] shadow-2xl z-50 overflow-hidden"
            >
              <div className="p-6 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between">
                <h3 className="font-black text-gray-900 dark:text-white">Notifications</h3>
                <button 
                  onClick={() => markAllReadMutation.mutate()}
                  className="text-xs font-bold text-amber-600 hover:underline"
                >
                  Mark all as read
                </button>
              </div>

              <div className="max-h-[400px] overflow-y-auto">
                {notifications.length > 0 ? (
                  <div className="divide-y divide-gray-50 dark:divide-gray-800">
                    {notifications.map((n) => (
                      <div 
                        key={n._id} 
                        className={`p-4 flex gap-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer ${!n.isRead ? 'bg-amber-50/30 dark:bg-amber-900/10' : ''}`}
                        onClick={() => handleNotificationClick(n)}
                      >
                        <div className="shrink-0 mt-1">{getIcon(n.type)}</div>
                        <div className="flex-1">
                          <p className="text-sm font-bold text-gray-900 dark:text-white leading-tight mb-1">{n.title}</p>
                          <p className="text-xs text-gray-500 line-clamp-2 mb-2">{n.message}</p>
                          <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                            {formatDistanceToNow(new Date(n.createdAt))} ago
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <Bell size={40} className="mx-auto text-gray-200 mb-4" />
                    <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">No new notifications</p>
                  </div>
                )}
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-900/50 text-center">
                 <button 
                  onClick={() => {
                    // FIXED: Handle super_admin routing
                    const basePath = user?.role === 'candidate' 
                      ? '/dashboard/candidate' 
                      : (user?.role === 'superadmin' || user?.role === 'super_admin')
                        ? '/dashboard/admin'
                        : '/dashboard/company';
                    navigate(`${basePath}/notifications`);
                    onClose();
                  }}
                  className="text-sm font-bold text-gray-500 hover:text-amber-600 transition-colors"
                 >
                    View All Notifications
                 </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationsPopover;
