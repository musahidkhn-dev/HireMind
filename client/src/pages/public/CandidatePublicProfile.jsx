import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  User, Mail, Briefcase, GraduationCap, Link as LinkIcon, 
  MapPin, Globe, Linkedin, Github, ExternalLink, Calendar, Building2, ArrowLeft
} from 'lucide-react';
import { userApi } from '../../api/userApi';
import Loader from '../../components/common/Loader';
import Avatar from '../../components/common/Avatar';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { formatDate } from '../../utils/helpers';

const CandidatePublicProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery({
    queryKey: ['candidate-public', id],
    queryFn: () => userApi.getPublicProfile(id).then(res => res.data.profile),
    enabled: !!id
  });

  if (isLoading) return <Loader fullScreen text="Fetching candidate profile..." />;
  if (error || !data) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
        <User size={40} />
      </div>
      <h2 className="text-2xl font-black text-gray-900 mb-2">Candidate Not Found</h2>
      <p className="text-gray-500 mb-8 max-w-xs">The profile you are looking for might have been removed or is no longer accessible.</p>
      <Button onClick={() => navigate(-1)}>Go Back</Button>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 pb-20">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-amber-600 transition-colors">
        <ArrowLeft size={18} /> Back
      </button>

      {/* Header Card */}
      <div className="card p-8 md:p-12 bg-white dark:bg-gray-900 border-none shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 blur-3xl rounded-full -mr-20 -mt-20" />
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
          <Avatar src={data.profileImage} name={data.name} size="xl" className="w-32 h-32 rounded-[2.5rem] shadow-2xl border-4 border-white dark:border-gray-800" />
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2">{data.name}</h1>
            <p className="text-xl font-medium text-amber-600 mb-6">{data.headline || 'Professional Candidate'}</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-6 text-sm text-gray-500 font-bold uppercase tracking-widest">
              <span className="flex items-center gap-1.5"><Briefcase size={16} /> {data.totalExperienceYears || 0} Years Exp</span>
              <span className="flex items-center gap-1.5"><MapPin size={16} /> Candidate</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bio */}
      {data.bio && (
        <div className="card p-8 bg-white dark:bg-gray-900 border-none shadow-sm">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">About</h3>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{data.bio}</p>
        </div>
      )}

      {/* Skills */}
      {data.skills?.length > 0 && (
        <div className="card p-8 bg-white dark:bg-gray-900 border-none shadow-sm">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Skills & Expertise</h3>
          <div className="flex flex-wrap gap-2">
            {data.skills.map(skill => (
              <Badge key={skill} variant="primary" size="lg" className="px-5 py-2">{skill}</Badge>
            ))}
          </div>
        </div>
      )}

      {/* Experience */}
      {data.experiences?.length > 0 && (
        <div className="card p-8 bg-white dark:bg-gray-900 border-none shadow-sm">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-8">Work History</h3>
          <div className="space-y-8">
            {data.experiences.map((exp, idx) => (
              <div key={idx} className="flex gap-6 relative">
                {idx !== data.experiences.length - 1 && <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-gray-50 dark:bg-gray-800" />}
                <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 shrink-0">
                  <Building2 size={20} />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white">{exp.title}</h4>
                  <p className="text-amber-600 font-bold text-sm mb-2">{exp.company}</p>
                  <p className="text-xs text-gray-400 font-medium mb-4">{formatDate(exp.startDate)} — {exp.current ? 'Present' : formatDate(exp.endDate)}</p>
                  <p className="text-sm text-gray-500 leading-relaxed">{exp.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {data.education?.length > 0 && (
        <div className="card p-8 bg-white dark:bg-gray-900 border-none shadow-sm">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-8">Education</h3>
          <div className="space-y-6">
            {data.education.map((edu, idx) => (
              <div key={idx} className="flex gap-6">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 shrink-0">
                  <GraduationCap size={20} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white">{edu.degree || 'Academic Qualification'}</h4>
                  <p className="text-purple-600 font-bold text-sm">{edu.institution}</p>
                  <p className="text-xs text-gray-400 font-medium mt-1">{formatDate(edu.startDate)} — {formatDate(edu.endDate)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Links */}
      {(data.portfolioUrl || data.linkedinUrl || data.githubUrl) && (
        <div className="card p-8 bg-white dark:bg-gray-900 border-none shadow-sm">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Connect</h3>
          <div className="flex flex-wrap gap-4">
            {data.portfolioUrl && <a href={data.portfolioUrl} target="_blank" rel="noreferrer"><Button variant="outline" size="sm" icon={Globe}>Portfolio</Button></a>}
            {data.linkedinUrl && <a href={data.linkedinUrl} target="_blank" rel="noreferrer"><Button variant="outline" size="sm" icon={Linkedin}>LinkedIn</Button></a>}
            {data.githubUrl && <a href={data.githubUrl} target="_blank" rel="noreferrer"><Button variant="outline" size="sm" icon={Github}>GitHub</Button></a>}
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidatePublicProfile;
