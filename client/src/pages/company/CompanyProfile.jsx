import React, { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import {
  Building2, Globe, MapPin, Info,
  Camera, CheckCircle,
  Save, X
} from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Avatar from '../../components/common/Avatar';
import Modal from '../../components/common/Modal';
import Badge from '../../components/common/Badge';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { companyApi } from '../../api/companyApi';
import { fetchCurrentUser } from '../../store/authSlice';
import { toast } from 'react-hot-toast';
import SecuritySettings from '../../components/profile/SecuritySettings';

const Section = ({ title, icon: Icon, children }) => (
  <div className="card p-8 bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800">
    <div className="flex items-center gap-3 mb-8 border-b border-gray-50 dark:border-gray-800 pb-4">
      <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center text-amber-600">
        <Icon size={20} />
      </div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white uppercase tracking-tight">{title}</h3>
    </div>
    {children}
  </div>
);

const CompanyProfile = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  const [formData, setFormData] = useState({
    name: user?.company?.name || '',
    description: user?.company?.description || '',
    industry: user?.company?.industry || '',
    website: user?.company?.website || '',
    location: user?.company?.location || '',
    size: user?.company?.size || '1-10',
  });

  // FIXED: Improved sync state with user data and added logging
  React.useEffect(() => {
    console.log("Current User Data in Profile:", user);
    if (user?.company) {
      const company = user.company;
      
      // If company is just an ID (string), trigger a fresh fetch
      if (typeof company === 'string') {
        console.warn("Company data is not populated (received ID only). Fetching full data...");
        dispatch(fetchCurrentUser());
        return;
      }

      console.log("Found Company in User State:", company);
      setFormData({
        name: company.name || '',
        description: company.description || '',
        industry: company.industry || '',
        website: company.website || '',
        location: company.location || '',
        size: company.size || '1-10',
      });
    } else {
      console.warn("No company data found in user state!");
    }
  }, [user, dispatch]);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLogoFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    console.log("Saving Company Profile. Form Data:", formData);
    
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        data.append(key, formData[key]);
      });
      if (logoFile) {
        data.append('logo', logoFile);
      }

      const response = await companyApi.updateProfile(data);
      console.log("Update API Response:", response.data);
      
      await dispatch(fetchCurrentUser());
      
      // Clear local file state but keep the new logo from user object
      setLogoFile(null);
      setLogoPreview(null);
      
      toast.success('Company profile updated successfully');
    } catch (err) {
      console.error("Save Profile Error:", err);
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-32">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">Organization Settings</h1>
          <p className="text-gray-500 font-medium">Manage your company profile and information.</p>
        </div>
      </div>

      {/* Company Details */}
      <Section title="Company Details" icon={Building2}>
        <div className="flex flex-col md:flex-row gap-12 mb-10">
          <div className="relative shrink-0 group">
            <Avatar src={logoPreview || user?.company?.logo} name={user?.company?.name} size="xl" className="w-32 h-32 rounded-[2.5rem] shadow-xl border-4 border-white dark:border-gray-800" />
            <button
              onClick={() => fileInputRef.current.click()}
              className="absolute bottom-0 right-0 p-2.5 bg-amber-600 text-white rounded-2xl shadow-lg hover:scale-110 transition-transform"
            >
              <Camera size={18} />
            </button>
            <input type="file" ref={fileInputRef} onChange={handleLogoChange} hidden accept="image/*" />
          </div>

          <div className="flex-1 space-y-6">
            <Input label="Company Name" value={formData.name} onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">About the Company</label>
              <textarea
                rows={4}
                className="w-full rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 text-sm focus:ring-2 focus:ring-amber-500/20"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe your company culture, mission and values..."
              />
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Input label="Industry" icon={Info} value={formData.industry} onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))} />
          <Input label="Website" icon={Globe} value={formData.website} onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))} />
          <Input label="Location" icon={MapPin} value={formData.location} onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))} />
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Company Size</label>
            <select
              value={formData.size}
              onChange={(e) => setFormData(prev => ({ ...prev, size: e.target.value }))}
              className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-3 text-sm focus:ring-2 focus:ring-amber-500/20"
            >
              {['1-10', '11-50', '51-200', '201-500', '500+'].map(s => <option key={s} value={s}>{s} Employees</option>)}
            </select>
          </div>
        </div>

        <div className="flex justify-end pt-6 border-t border-gray-50 dark:border-gray-800">
          <Button icon={Save} loading={loading} onClick={handleSaveProfile} className="px-10">Save Details</Button>
        </div>
      </Section>

      <SecuritySettings />
    </div>
  );
};

export default CompanyProfile;
