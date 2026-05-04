import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Building2, MapPin, Globe, Users, Briefcase } from 'lucide-react';
import { adminApi } from '../../api/adminApi';
import Loader from '../../components/common/Loader';

const AdminCompanyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: company, isLoading, error } = useQuery({
    queryKey: ['admin-company', id],
    queryFn: () => adminApi.getCompanyDetails(id).then(res => res.data),
    retry: 1
  });

  if (isLoading) return <Loader fullScreen />;
  
  if (error || !company) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Company not found</h2>
        <button onClick={() => navigate('/dashboard/admin/companies')} className="mt-4 text-amber-600 font-bold">Go Back</button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-20">
      <button 
        onClick={() => navigate('/dashboard/admin/companies')}
        className="flex items-center gap-2 text-gray-500 hover:text-amber-600 transition-colors font-semibold"
      >
        <ArrowLeft size={20} /> Back to Companies
      </button>

      <div className="card p-8 bg-white dark:bg-gray-900">
        <div className="flex flex-col md:flex-row gap-8 items-start md:items-center border-b border-gray-100 dark:border-gray-800 pb-8">
          <div className="w-24 h-24 rounded-2xl bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
            {company.logo ? (
               <img src={company.logo} alt={company.name} className="w-full h-full object-cover rounded-2xl" />
            ) : (
               <Building2 size={40} className="text-amber-600" />
            )}
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-3">{company.name}</h1>
            <div className="flex flex-wrap items-center gap-4 text-gray-500 font-medium">
              <span className="flex items-center gap-1"><Briefcase size={16} /> {company.industry}</span>
              <span className="flex items-center gap-1"><Users size={16} /> {company.size || 'Unknown'} Employees</span>
              <span className="flex items-center gap-1"><MapPin size={16} /> {company.location || 'Not specified'}</span>
              {company.website && (
                 <a href={company.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-amber-600 hover:underline">
                    <Globe size={16} /> Website
                 </a>
              )}
            </div>
          </div>
        </div>

        <div className="py-8 grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">About Company</h3>
            <p className="text-gray-500 leading-relaxed whitespace-pre-wrap">
              {company.description || 'No description provided.'}
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Platform Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                  <p className="text-3xl font-black text-amber-600 mb-1">{company.totalJobs || 0}</p>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Jobs</p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                  <p className="text-3xl font-black text-green-500 mb-1">{company.activeJobs || 0}</p>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Active Jobs</p>
                </div>
              </div>
            </div>
            
            <div className="p-4 rounded-xl border border-gray-100 dark:border-gray-800">
               <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Created By</p>
               <div className="font-bold text-gray-900 dark:text-white">{company.createdBy?.name || 'Unknown'}</div>
               <div className="text-sm text-gray-500">{company.createdBy?.email}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCompanyDetails;
