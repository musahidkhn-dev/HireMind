import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Ban, Eye, Search, Trash2 } from 'lucide-react';
import { adminApi } from '../../api/adminApi';
import Loader from '../../components/common/Loader';
import Badge from '../../components/common/Badge';
import { toast } from 'react-hot-toast';

const UsersPage = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: users, isLoading } = useQuery({
    queryKey: ['admin-users-all'],
    queryFn: () => adminApi.getUsers({ limit: 100 })
  });

  const blockMutation = useMutation({
    mutationFn: ({ id, isActive }) => adminApi.blockUser(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-users-all']);
      toast.success('User status updated');
    }
  });

  const deleteUserMutation = useMutation({
    mutationFn: (id) => adminApi.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-users-all']);
      toast.success('User deleted successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete user');
    }
  });

  if (isLoading) return <Loader fullScreen />;

  const userList = Array.isArray(users?.data)
    ? users.data
    : Array.isArray(users?.data?.users)
    ? users.data.users
    : Array.isArray(users?.users)
    ? users.users
    : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Users Management</h1>
          <p className="text-gray-500">Manage all registered users on the platform.</p>
        </div>
      </div>

      <div className="card p-6 bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
             <thead>
                <tr className="text-xs uppercase tracking-widest text-gray-400 font-black border-b border-gray-50 dark:border-gray-800">
                   <th className="pb-4">User</th>
                   <th className="pb-4">Role</th>
                   <th className="pb-4">Joined</th>
                   <th className="pb-4">Status</th>
                   <th className="pb-4 text-right">Actions</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                {userList.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-gray-500">
                      No users found
                    </td>
                  </tr>
                ) : (
                  userList.map((user) => (
                    <tr key={user._id} className="group">
                       <td className="py-4">
                          <div className="flex items-center gap-3">
                             <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center font-bold text-gray-500">
                                {user.name?.[0] || '?'}
                             </div>
                             <div>
                                <p className="text-sm font-bold text-gray-900 dark:text-white">{user.name}</p>
                                <p className="text-xs text-gray-500">{user.email}</p>
                             </div>
                          </div>
                       </td>
                       <td className="py-4">
                          <Badge variant="default" size="sm" className="capitalize">{user.role}</Badge>
                       </td>
                       <td className="py-4 text-sm text-gray-500">
                          {new Date(user.createdAt).toLocaleDateString()}
                       </td>
                       <td className="py-4">
                           <Badge variant={user.isActive ? 'success' : 'error'} size="sm">
                              {user.isActive ? 'Active' : 'Blocked'}
                           </Badge>
                       </td>
                       <td className="py-4 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                             <button 
                              onClick={() => blockMutation.mutate({ id: user._id, isActive: !user.isActive })}
                              className={`p-2 rounded-lg transition-colors ${user.isActive ? 'text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20' : 'text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20'}`}
                              title={user.isActive ? "Disable User" : "Enable User"}
                             >
                                <Ban size={16} />
                             </button>
                             <button 
                              onClick={() => {
                                if(window.confirm('Are you sure you want to PERMANENTLY delete this user?')) {
                                  deleteUserMutation.mutate(user._id);
                                }
                              }}
                              className="p-2 hover:bg-red-50 dark:hover:bg-red-900/10 text-gray-400 hover:text-red-500 rounded-xl transition-colors"
                              title="Delete User"
                             >
                                <Trash2 size={16} />
                             </button>
                             <button 
                                onClick={() => {
                                  console.log("User ID clicked:", user._id);
                                  navigate(`/dashboard/admin/users/${user._id}`);
                                }}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-500" title="View Details"
                             >
                                <Eye size={16} />
                             </button>
                          </div>
                       </td>
                    </tr>
                  ))
                )}
             </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
