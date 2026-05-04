import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Users, Building2, ShieldAlert, BarChart3, 
  Trash2, Ban, Eye, TrendingUp, Search 
} from 'lucide-react';
import { adminApi } from '../../api/adminApi';
import StatsCard from '../../components/dashboard/StatsCard';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import Badge from '../../components/common/Badge';
import { toast } from 'react-hot-toast';

const AdminDashboard = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  // FIXED: Ensure queries only fire for authorized admins
  const isAdmin = user?.role === 'superadmin' || user?.role === 'super_admin';

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: adminApi.getStats,
    enabled: isAdmin
  });

  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => adminApi.getUsers({ limit: 5 }),
    enabled: isAdmin
  });

  const { data: companies, isLoading: companiesLoading } = useQuery({
    queryKey: ['admin-companies'],
    queryFn: () => adminApi.getCompanies({ limit: 5 }),
    enabled: isAdmin
  });

  const blockMutation = useMutation({
    mutationFn: ({ id, isActive }) => adminApi.blockUser(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-users']);
      toast.success('User status updated');
    }
  });

  if (statsLoading || usersLoading || companiesLoading) return <Loader fullScreen />;

  const userList = Array.isArray(users?.data)
    ? users.data
    : Array.isArray(users?.data?.users)
    ? users.data.users
    : Array.isArray(users?.users)
    ? users.users
    : [];

  const companyList = Array.isArray(companies?.data)
    ? companies.data
    : Array.isArray(companies?.data?.companies)
    ? companies.data.companies
    : Array.isArray(companies?.companies)
    ? companies.companies
    : [];

  const dashboardStats = stats?.data?.stats || stats?.data || stats?.stats || {};

  return (
    <div className="space-y-10 pb-20">
      <div>
        <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2">Platform Control Center</h1>
        <p className="text-gray-500 font-medium text-lg">Global overview and administrative management.</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Total Users" 
          value={dashboardStats.totalUsers || 0} 
          icon={Users} 
          color="blue" 
          trend="+12%" 
        />
        <StatsCard 
          title="Active Companies" 
          value={dashboardStats.totalCompanies || 0} 
          icon={Building2} 
          color="green" 
          trend="+5%" 
        />
        <StatsCard 
          title="Total Jobs" 
          value={dashboardStats.totalJobs || 0} 
          icon={BarChart3} 
          color="purple" 
          trend="+24%" 
        />
        <StatsCard 
          title="Reported Issues" 
          value={dashboardStats.reportedIssues || 0} 
          icon={ShieldAlert} 
          color="red" 
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-10">
        {/* Recent Users Table */}
        <div className="card p-8 bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800">
           <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Recent Registrations</h3>
              <Button variant="outline" size="sm" onClick={() => navigate('/dashboard/admin/users')}>View All</Button>
           </div>
           <div className="overflow-x-auto">
              <table className="w-full text-left">
                 <thead>
                    <tr className="text-xs uppercase tracking-widest text-gray-400 font-black border-b border-gray-50 dark:border-gray-800">
                       <th className="pb-4">User</th>
                       <th className="pb-4">Role</th>
                       <th className="pb-4">Status</th>
                       <th className="pb-4 text-right">Actions</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                    {userList.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="py-8 text-center text-gray-500">
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
                           <td className="py-4">
                              <Badge variant={user.isActive ? 'success' : 'error'} size="sm">
                                 {user.isActive ? 'Active' : 'Blocked'}
                              </Badge>
                           </td>
                           <td className="py-4 text-right">
                              <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                 <button 
                                  onClick={() => blockMutation.mutate({ id: user._id, isActive: !user.isActive })}
                                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-500 hover:text-red-500"
                                 >
                                    <Ban size={16} />
                                 </button>
                                 <button 
                                  onClick={() => navigate(`/dashboard/admin/users/${user._id}`)}
                                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-500"
                                  title="View Details"
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

        {/* Recent Companies */}
        <div className="card p-8 bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800">
           <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Active Companies</h3>
              <Button variant="outline" size="sm" onClick={() => navigate('/dashboard/admin/companies')}>View All</Button>
           </div>
           <div className="space-y-4">
              {companyList.length === 0 ? (
                <div className="py-8 text-center text-gray-500">No companies found</div>
              ) : (
                companyList.map((company) => (
                  <div key={company._id} className="flex items-center justify-between p-4 rounded-2xl border border-gray-50 dark:border-gray-800 hover:border-amber-100 dark:hover:border-amber-900/30 transition-all">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center text-amber-600">
                           <Building2 size={24} />
                        </div>
                        <div>
                           <p className="font-bold text-gray-900 dark:text-white">{company.name}</p>
                           <p className="text-xs text-gray-500">{company.industry} • {company.size} Employees</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-4">
                        <div className="text-right">
                           <p className="text-sm font-bold text-gray-900 dark:text-white">{company.totalJobs || 0}</p>
                           <p className="text-[10px] text-gray-400 font-black uppercase">Jobs</p>
                        </div>
                        <button 
                          onClick={() => navigate(`/dashboard/admin/companies/${company._id}`)}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl text-gray-500 transition-colors"
                          title="View Details"
                        >
                           <Eye size={18} />
                        </button>
                        <button className="p-2 hover:bg-red-50 dark:hover:bg-red-900/10 text-gray-400 hover:text-red-500 rounded-xl">
                           <Trash2 size={18} />
                        </button>
                     </div>
                  </div>
                ))
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
