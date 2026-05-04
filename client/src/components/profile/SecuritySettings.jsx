import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, Save, KeyRound, ShieldQuestion } from 'lucide-react';
import Button from '../common/Button';
import Input from '../common/Input';
import { authApi } from '../../api/authApi';
import { toast } from 'react-hot-toast';

const SecuritySettings = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    securityQuestion: '',
    securityAnswer: '',
  });

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!formData.securityQuestion || !formData.securityAnswer) {
      return toast.error('Please fill in both question and answer');
    }

    setLoading(true);
    try {
      await authApi.updateSecuritySettings(formData);
      toast.success('Security settings updated successfully');
      setFormData({ ...formData, securityAnswer: '' }); // Clear answer for security
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update security settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-8 bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800">
      <div className="flex items-center gap-3 mb-8 border-b border-gray-50 dark:border-gray-800 pb-4">
        <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center text-purple-600">
          <ShieldQuestion size={20} />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white uppercase tracking-tight">Account Security</h3>
      </div>

      <div className="max-w-2xl">
        <div className="bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-800 rounded-2xl p-6 mb-8">
           <div className="flex gap-4">
              <div className="p-2 bg-white dark:bg-gray-900 rounded-xl shadow-sm h-fit">
                <ShieldAlert className="text-purple-600" size={24} />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white mb-1">Security Question Reset</h4>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Setting a security question allows you to recover your account even if you lose access to your email.
                  Choose a question that only you know the answer to.
                </p>
              </div>
           </div>
        </div>

        <form onSubmit={handleUpdate} className="space-y-6">
          <Input 
            label="Security Question" 
            placeholder="e.g. What was your first pet's name?" 
            icon={ShieldQuestion}
            value={formData.securityQuestion}
            onChange={(e) => setFormData({ ...formData, securityQuestion: e.target.value })}
          />
          <Input 
            label="Security Answer" 
            placeholder="Enter answer..." 
            type="password"
            icon={KeyRound}
            value={formData.securityAnswer}
            onChange={(e) => setFormData({ ...formData, securityAnswer: e.target.value })}
          />
          <div className="flex justify-end pt-4">
            <Button type="submit" icon={Save} loading={loading}>
              Update Security Settings
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SecuritySettings;
