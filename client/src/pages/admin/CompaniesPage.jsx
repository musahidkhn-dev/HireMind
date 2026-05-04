import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Building2, Trash2, Eye } from 'lucide-react';
import { adminApi } from '../../api/adminApi';
import Loader from '../../components/common/Loader';
import { toast } from 'react-hot-toast';

const CompaniesPage = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: companies, isLoading } = useQuery({
    queryKey: ['admin-companies-all'],
    queryFn: () => adminApi.getCompanies({ limit: 100 })
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => adminApi.deleteCompany(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-companies-all']);
      toast.success('Company deleted successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete company');
    }
  });

  if (isLoading) return <Loader fullScreen />;

  const companyList = Array.isArray(companies?.data)
    ? companies.data
    : Array.isArray(companies?.data?.companies)
    ? companies.data.companies
    : Array.isArray(companies?.companies)
    ? companies.companies
    : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Companies Management</h1>
          <p className="text-gray-500">Manage registered companies and their job listings.</p>
        </div>
      </div>

      <div className="card p-6 bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800">
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
                       <p className="text-xs text-gray-500">{company.industry} • {company.size || 'Unknown'} Employees</p>
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
                    <button 
                      onClick={() => {
                        if(window.confirm('Are you sure you want to delete this company?')) {
                          deleteMutation.mutate(company._id);
                        }
                      }}
                      className="p-2 hover:bg-red-50 dark:hover:bg-red-900/10 text-gray-400 hover:text-red-500 rounded-xl transition-colors"
                    >
                       <Trash2 size={18} />
                    </button>
                 </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CompaniesPage;
