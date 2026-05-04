import React, { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, Briefcase, GraduationCap, Link as LinkIcon, 
  Plus, X, Camera, FileText, Trash2, Save, CheckCircle, Brain, 
  MapPin, Globe, Linkedin, Github, ExternalLink, Calendar, Building2
} from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Avatar from '../../components/common/Avatar';
import Modal from '../../components/common/Modal';
import { userApi } from '../../api/userApi';
import { fetchCurrentUser } from '../../store/authSlice';
import { toast } from 'react-hot-toast';
import SecuritySettings from '../../components/profile/SecuritySettings';

const Section = ({ title, icon: Icon, children }) => (
  <div className="card p-4 md:p-8 bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800">
    <div className="flex items-center gap-3 mb-6 md:mb-8 border-b border-gray-50 dark:border-gray-800 pb-4">
      <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center text-amber-600">
         <Icon size={20} />
      </div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white uppercase tracking-tight">{title}</h3>
    </div>
    {children}
  </div>
);

const CandidateProfile = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  
  const [loading, setLoading] = useState(false);
  const [showExpModal, setShowExpModal] = useState(false);
  const [showEduModal, setShowEduModal] = useState(false);
  
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    headline: '',
    bio: '',
    skills: [],
    portfolioUrl: '',
    linkedinUrl: '',
    githubUrl: '',
    education: [],
    experience: [],
  });

  // Fetch profile data on mount
  React.useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await userApi.getCandidateProfile();
        const profile = response.data.profile;
        if (profile) {
          setProfileData({
            name: profile.user?.name || '',
            headline: profile.headline || '',
            bio: profile.bio || '',
            skills: profile.skills || [],
            portfolioUrl: profile.portfolioUrl || '',
            linkedinUrl: profile.linkedinUrl || '',
            githubUrl: profile.githubUrl || '',
            education: profile.education || [],
            experience: profile.experiences || [], // Map backend experiences to experience
          });
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
      }
    };
    loadProfile();
  }, []);

  const [newEdu, setNewEdu] = useState({ degree: '', institution: '', startDate: '', endDate: '' });
  const [newExp, setNewExp] = useState({ title: '', company: '', startDate: '', endDate: '', description: '', current: false });

  const [skillInput, setSkillInput] = useState('');

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append('profileImage', file);
    
    try {
      const response = await userApi.uploadAvatar(formData);
      dispatch(fetchCurrentUser());
      toast.success(response.data.message || 'Profile picture updated');
    } catch (err) {
      console.error("Upload error:", err);
      toast.error(err.response?.data?.message || 'Failed to upload picture');
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await userApi.updateCandidateProfile(profileData);
      dispatch(fetchCurrentUser());
      toast.success('Profile saved successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  const addSkill = (e) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      if (!profileData.skills.includes(skillInput.trim())) {
        setProfileData({ ...profileData, skills: [...profileData.skills, skillInput.trim()] });
      }
      setSkillInput('');
    }
  };

  const removeSkill = (skill) => {
    setProfileData({ ...profileData, skills: profileData.skills.filter(s => s !== skill) });
  };

  const handleAddEducation = () => {
    if (!newEdu.degree || !newEdu.institution) {
      return toast.error('Please fill in degree and institution');
    }
    setProfileData({
      ...profileData,
      education: [...profileData.education, newEdu]
    });
    setNewEdu({ degree: '', institution: '', startDate: '', endDate: '' });
    setShowEduModal(false);
  };

  const handleAddExperience = () => {
    if (!newExp.title || !newExp.company) {
      return toast.error('Please fill in title and company');
    }
    setProfileData({
      ...profileData,
      experience: [...profileData.experience, newExp]
    });
    setNewExp({ title: '', company: '', startDate: '', endDate: '', description: '', current: false });
    setShowExpModal(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-0 space-y-8 pb-32">
      {/* Basic Info */}
      <Section title="Basic Information" icon={User}>
        <div className="flex flex-col md:flex-row gap-8 md:gap-10">
          <div className="relative shrink-0 group mx-auto md:mx-0">
             <Avatar src={user?.userImage} name={user?.name} size="xl" className="w-24 h-24 sm:w-32 sm:h-32 rounded-[2rem] sm:rounded-[2.5rem] shadow-xl border-4 border-white dark:border-gray-800" />
             <button 
              onClick={() => fileInputRef.current.click()}
              className="absolute bottom-0 right-0 p-2.5 bg-amber-600 text-white rounded-2xl shadow-lg hover:scale-110 transition-transform"
             >
                <Camera size={18} />
             </button>
             <input type="file" ref={fileInputRef} onChange={handleAvatarChange} hidden accept="image/*" />
          </div>
          <div className="flex-1 space-y-6">
             <div className="grid md:grid-cols-2 gap-4">
                <Input label="Full Name" value={profileData.name} onChange={(e) => setProfileData({...profileData, name: e.target.value})} />
                <Input label="Email" value={user?.email} disabled icon={Mail} />
             </div>
             <Input label="Professional Headline" placeholder="e.g. Senior Product Designer" value={profileData.headline} onChange={(e) => setProfileData({...profileData, headline: e.target.value})} />
             <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Bio / About Me</label>
                <textarea 
                  rows={4}
                  className="w-full rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 text-sm focus:ring-2 focus:ring-amber-500/20"
                  value={profileData.bio}
                  onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                  placeholder="Tell us about your professional journey..."
                />
             </div>
          </div>
        </div>
      </Section>

      <SecuritySettings />

      {/* Skills */}
      <Section title="Skills & Technologies" icon={Brain}>
        <div className="space-y-6">
          <div className="relative">
             <Brain size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
             <input 
              type="text"
              placeholder="Type a skill and press Enter..."
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={addSkill}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-amber-500/20"
             />
          </div>
          <div className="flex flex-wrap gap-2">
             {profileData.skills.map((skill) => (
               <div key={skill} className="flex items-center gap-2 px-4 py-2 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full text-xs font-bold border border-amber-100 dark:border-amber-800 group">
                  {skill}
                  <button onClick={() => removeSkill(skill)} className="hover:text-red-500 transition-colors">
                     <X size={14} />
                  </button>
               </div>
             ))}
          </div>
        </div>
      </Section>

      {/* Experience */}
      <Section title="Work Experience" icon={Briefcase}>
        <div className="space-y-6">
           {profileData.experience?.map((exp, idx) => (
             <div key={idx} className="p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 group hover:border-amber-200 transition-all">
                <div className="flex items-start justify-between mb-2">
                   <h4 className="font-bold text-gray-900 dark:text-white">{exp.title}</h4>
                   <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="text-gray-400 hover:text-red-500" onClick={() => setProfileData({...profileData, experience: profileData.experience.filter((_, i) => i !== idx)})}><Trash2 size={18} /></button>
                   </div>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-500 font-medium mb-4">
                   <span className="flex items-center gap-1"><Building2 size={14} /> {exp.company}</span>
                   <span className="text-gray-300">•</span>
                   <span className="flex items-center gap-1"><Calendar size={14} /> {exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">{exp.description}</p>
             </div>
           ))}
           <Button variant="outline" className="w-full border-dashed" icon={Plus} onClick={() => setShowExpModal(true)}>Add Work Experience</Button>
        </div>
      </Section>

      {/* Education */}
      <Section title="Education" icon={GraduationCap}>
        <div className="space-y-6">
           {profileData.education?.map((edu, idx) => (
             <div key={idx} className="p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 group hover:border-amber-200 transition-all">
                <div className="flex items-start justify-between mb-2">
                   <h4 className="font-bold text-gray-900 dark:text-white">{edu.degree}</h4>
                   <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="text-gray-400 hover:text-red-500" onClick={() => setProfileData({...profileData, education: profileData.education.filter((_, i) => i !== idx)})}><Trash2 size={18} /></button>
                   </div>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-500 font-medium">
                   <span className="flex items-center gap-1"><Building2 size={14} /> {edu.institution}</span>
                   <span className="text-gray-300">•</span>
                   <span className="flex items-center gap-1"><Calendar size={14} /> {edu.startDate} - {edu.endDate}</span>
                </div>
             </div>
           ))}
           <Button variant="outline" className="w-full border-dashed" icon={Plus} onClick={() => setShowEduModal(true)}>Add Education</Button>
        </div>
      </Section>

      {/* Links */}
      <Section title="Links & Profiles" icon={LinkIcon}>
        <div className="grid md:grid-cols-2 gap-6">
           <Input label="Portfolio Website" placeholder="https://example.com" icon={Globe} value={profileData.portfolioUrl} onChange={(e) => setProfileData({...profileData, portfolioUrl: e.target.value})} />
           <Input label="LinkedIn Profile" placeholder="https://linkedin.com/in/..." icon={Linkedin} value={profileData.linkedinUrl} onChange={(e) => setProfileData({...profileData, linkedinUrl: e.target.value})} />
           <Input label="GitHub Profile" placeholder="https://github.com/..." icon={Github} value={profileData.githubUrl} onChange={(e) => setProfileData({...profileData, githubUrl: e.target.value})} />
        </div>
      </Section>

      {/* Sticky Save */}
      <div className="fixed bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] md:w-auto">
         <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white dark:bg-gray-900 p-3 md:p-4 rounded-2xl md:rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 flex items-center justify-between md:justify-start gap-4"
         >
            <p className="text-[10px] md:text-xs font-bold text-gray-500 px-2 md:px-4 hidden sm:block">Unsaved changes will be lost.</p>
            <Button size="lg" icon={Save} onClick={handleSave} loading={loading} className="w-full md:w-auto md:px-10 py-3 text-sm md:text-base">Save Profile Changes</Button>
         </motion.div>
      </div>

      {/* Experience Modal */}
      <Modal isOpen={showExpModal} onClose={() => setShowExpModal(false)} title="Add Experience">
         <div className="space-y-4">
            <Input label="Job Title" value={newExp.title} onChange={(e) => setNewExp({...newExp, title: e.target.value})} />
            <Input label="Company" value={newExp.company} onChange={(e) => setNewExp({...newExp, company: e.target.value})} />
            <div className="grid grid-cols-2 gap-4">
               <Input label="Start Date" type="month" value={newExp.startDate} onChange={(e) => setNewExp({...newExp, startDate: e.target.value})} />
               <Input label="End Date" type="month" disabled={newExp.current} value={newExp.endDate} onChange={(e) => setNewExp({...newExp, endDate: e.target.value})} />
            </div>
            <div className="flex items-center gap-2">
               <input type="checkbox" id="current" checked={newExp.current} onChange={(e) => setNewExp({...newExp, current: e.target.checked})} />
               <label htmlFor="current" className="text-sm text-gray-600">I currently work here</label>
            </div>
            <textarea 
              className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 text-sm" 
              rows={4} 
              placeholder="Role description..." 
              value={newExp.description}
              onChange={(e) => setNewExp({...newExp, description: e.target.value})}
            />
            <Button className="w-full mt-4" onClick={handleAddExperience}>Add Experience</Button>
         </div>
      </Modal>

      {/* Education Modal */}
      <Modal isOpen={showEduModal} onClose={() => setShowEduModal(false)} title="Add Education">
         <div className="space-y-4">
            <Input label="Degree / Field of Study" value={newEdu.degree} onChange={(e) => setNewEdu({...newEdu, degree: e.target.value})} />
            <Input label="Institution" value={newEdu.institution} onChange={(e) => setNewEdu({...newEdu, institution: e.target.value})} />
            <div className="grid grid-cols-2 gap-4">
               <Input label="Start Date" type="month" value={newEdu.startDate} onChange={(e) => setNewEdu({...newEdu, startDate: e.target.value})} />
               <Input label="End Date" type="month" value={newEdu.endDate} onChange={(e) => setNewEdu({...newEdu, endDate: e.target.value})} />
            </div>
            <Button className="w-full mt-4" onClick={handleAddEducation}>Add Education</Button>
         </div>
      </Modal>
    </div>
  );
};

export default CandidateProfile;
