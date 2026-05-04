import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, UserCircle, Mail, MapPin, Building2, Briefcase, Calendar, Ban } from 'lucide-react';
import { adminApi } from '../../api/adminApi';
import Loader from '../../components/common/Loader';
import Badge from '../../components/common/Badge';
import { toast } from 'react-hot-toast';
import { useQueryClient, useMutation } from '@tanstack/react-query';

const AdminUserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-user', id],
    queryFn: async () => {
      console.log("Fetching user details for ID:", id);
      const res = await adminApi.getUserDetails(id);
      console.log("API Response:", res.data);
      return res.data;
    },
    retry: 1
  });

  const queryClient = useQueryClient();

  const blockMutation = useMutation({
    mutationFn: ({ userId, isActive }) => adminApi.blockUser(userId, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-user', id]);
      queryClient.invalidateQueries(['admin-users-all']);
      toast.success('User status updated');
    }
  });

  if (isLoading) return <Loader fullScreen />;
  
  if (error || !data?.user) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">User not found</h2>
        <button onClick={() => navigate('/dashboard/admin/users')} className="mt-4 text-amber-600 font-bold">Go Back</button>
      </div>
    );
  }

  const { user, activityStats } = data;

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-20">
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate('/dashboard/admin/users')}
          className="flex items-center gap-2 text-gray-500 hover:text-amber-600 transition-colors font-semibold"
        >
          <ArrowLeft size={20} /> Back to Users
        </button>

        <button
          onClick={() => {
            console.log("Toggling status for User ID:", user._id);
            blockMutation.mutate({ userId: user._id, isActive: !user.isActive });
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all ${
            user.isActive 
              ? 'bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40' 
              : 'bg-green-50 text-green-600 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/40'
          }`}
        >
          <Ban size={18} />
          {user.isActive ? 'Block User' : 'Unblock User'}
        </button>
      </div>

      <div className="card p-8 bg-white dark:bg-gray-900">
        <div className="flex flex-col md:flex-row gap-8 items-start md:items-center border-b border-gray-100 dark:border-gray-800 pb-8">
          <div className="w-24 h-24 rounded-2xl bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 shrink-0 text-3xl font-black">
            {user.name?.[0] || '?'}
          </div>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-black text-gray-900 dark:text-white">{user.name}</h1>
              <Badge variant={user.isActive ? 'success' : 'error'}>{user.isActive ? 'Active' : 'Blocked'}</Badge>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-gray-500 font-medium">
              <span className="flex items-center gap-1"><Mail size={16} /> {user.email}</span>
              <span className="flex items-center gap-1 capitalize"><UserCircle size={16} /> Role: {user.role}</span>
              <span className="flex items-center gap-1"><Calendar size={16} /> Joined: {new Date(user.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <div className="py-8 grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Profile Details</h3>
            <div className="space-y-4">
              <div className="flex justify-between pb-3 border-b border-gray-50 dark:border-gray-800">
                <span className="text-gray-500">Profile Completed</span>
                <span className="font-bold text-gray-900 dark:text-white">{user.isProfileComplete ? 'Yes' : 'No'}</span>
              </div>
              <div className="flex justify-between pb-3 border-b border-gray-50 dark:border-gray-800">
                <span className="text-gray-500">Location</span>
                <span className="font-bold text-gray-900 dark:text-white">{user.location || 'Not specified'}</span>
              </div>
              {user.company && (
                <div className="flex justify-between pb-3 border-b border-gray-50 dark:border-gray-800">
                  <span className="text-gray-500">Company Link</span>
                  <span className="font-bold text-amber-600">{user.company.name}</span>
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Activity Statistics</h3>
            {activityStats ? (
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(activityStats).map(([key, value]) => (
                  <div key={key} className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                    <p className="text-3xl font-black text-amber-600 mb-1">{value}</p>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No activity stats available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUserDetails;
