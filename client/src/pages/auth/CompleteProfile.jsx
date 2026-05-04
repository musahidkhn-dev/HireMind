import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, User, Building2, Briefcase, Info, ArrowRight, ShieldCheck } from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import { authApi } from '../../api/authApi';
import { fetchCurrentUser } from '../../store/authSlice';
import { toast } from 'react-hot-toast';

const CompleteProfile = () => {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get('userId');
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState('candidate');
  const [companyData, setCompanyData] = useState({
    name: '',
    industry: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await authApi.completeProfile({
        userId,
        role,
        companyName: role === 'recruiter' ? companyData.name : undefined,
        industry: role === 'recruiter' ? companyData.industry : undefined
      });
      
      // Save tokens returned from the API
      if (response.data.accessToken) {
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);
      }

      await dispatch(fetchCurrentUser());
      toast.success('Welcome to HireMind!');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to complete profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black flex flex-col items-center justify-center p-4">
      <div className="flex items-center gap-2 mb-12">
        <div className="p-2 bg-amber-600 rounded-lg">
          <Brain className="text-white" size={32} />
        </div>
        <span className="text-2xl font-black tracking-tight text-gray-900 dark:text-white">
          Hire<span className="text-amber-600">Mind</span>
        </span>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl w-full bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-gray-800 p-8 md:p-12"
      >
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Welcome, {user?.name}!</h1>
          <p className="text-gray-500 font-medium">Please tell us how you'll be using HireMind.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-4">
            <label className="text-sm font-bold text-gray-400 uppercase tracking-widest">Select Your Role</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setRole('candidate')}
                className={`p-6 rounded-3xl border-2 transition-all text-left ${
                  role === 'candidate' 
                  ? 'border-amber-600 bg-amber-50 dark:bg-amber-900/20' 
                  : 'border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900'
                }`}
              >
                <div className={`p-3 rounded-2xl mb-4 w-fit ${role === 'candidate' ? 'bg-amber-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}`}>
                  <User size={24} />
                </div>
                <p className="font-bold text-gray-900 dark:text-white">Job Seeker</p>
                <p className="text-[10px] text-gray-500 mt-1 leading-tight">I'm looking for my next opportunity</p>
              </button>

              <button
                type="button"
                onClick={() => setRole('recruiter')}
                className={`p-6 rounded-3xl border-2 transition-all text-left ${
                  role === 'recruiter' 
                  ? 'border-amber-600 bg-amber-50 dark:bg-amber-900/20' 
                  : 'border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900'
                }`}
              >
                <div className={`p-3 rounded-2xl mb-4 w-fit ${role === 'recruiter' ? 'bg-amber-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}`}>
                  <Briefcase size={24} />
                </div>
                <p className="font-bold text-gray-900 dark:text-white">Recruiter</p>
                <p className="text-[10px] text-gray-500 mt-1 leading-tight">I'm here to find and manage talent</p>
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {role === 'recruiter' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-6 overflow-hidden"
              >
                <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Company Details</h3>
                  <div className="space-y-4">
                    <Input 
                      label="Company Name" 
                      placeholder="Acme Inc." 
                      icon={Building2} 
                      value={companyData.name}
                      onChange={(e) => setCompanyData({...companyData, name: e.target.value})}
                      required
                    />
                    <Input 
                      label="Industry" 
                      placeholder="Technology, Finance, etc." 
                      icon={Info}
                      value={companyData.industry}
                      onChange={(e) => setCompanyData({...companyData, industry: e.target.value})}
                      required
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="pt-6">
            <Button 
              type="submit" 
              className="w-full h-14 text-lg" 
              loading={loading} 
              icon={role === 'recruiter' ? ArrowRight : ShieldCheck}
            >
              {role === 'recruiter' ? 'Create Organization' : 'Complete Registration'}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default CompleteProfile;
