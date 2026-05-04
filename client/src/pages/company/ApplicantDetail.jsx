import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Mail, Phone, Calendar, FileText, 
  ExternalLink, Brain, MessageSquare, ChevronDown, Check, Save, Plus
} from 'lucide-react';
import { useApplicationById, useUpdateStage, useAddNote } from '../../hooks/useApplications';
import Avatar from '../../components/common/Avatar';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import ResumeScorer from '../../components/ai/ResumeScorer';
import InterviewQuestions from '../../components/ai/InterviewQuestions';
import StageHistory from '../../components/applications/StageHistory';
import { PIPELINE_STAGES } from '../../utils/constants';
import { formatDate } from '../../utils/helpers';

const ApplicantDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { data, isLoading } = useApplicationById(id);
  const application = data?.application;

  const updateStage = useUpdateStage();
  const addNote = useAddNote();
  
  const [noteText, setNoteText] = useState('');
  const [selectedStage, setSelectedStage] = useState('');

  if (isLoading) return <Loader fullScreen text="Loading application data..." />;
  if (!application) return <div className="text-center py-20 font-bold text-gray-500">Applicant application not found.</div>;

  const { candidate, job, currentStage, aiScore, stageHistory = [] } = application;

  const handleUpdateStage = () => {
    if (!selectedStage) return;
    console.log("Sending stage update:", selectedStage);
    updateStage.mutate({ id, data: { stage: selectedStage } });
  };

  const handleAddNote = () => {
    if (!noteText.trim()) return;
    addNote.mutate({ id, text: noteText });
    setNoteText('');
  };

  return (
    <div className="space-y-8 pb-20 max-w-full overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
         <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-bold text-text-secondary dark:text-gray-500 hover:text-primary transition-colors">
            <ArrowLeft size={18} /> Back to Applicants
         </button>
         <div className="flex flex-wrap items-center gap-3">
            <Button variant="ghost" size="sm" icon={ExternalLink} onClick={() => navigate(`/candidate/${candidate?._id}`)} className="text-text-secondary dark:text-gray-400">View Public Profile</Button>
            <Button variant="outline" size="sm" icon={MessageSquare} onClick={() => window.open(`mailto:${candidate?.email}?subject=Regarding your application for ${job?.title}`)} className="rounded-xl">Email Candidate</Button>
         </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
         {/* Left Column (Main Info) */}
         <div className="lg:col-span-2 space-y-8 min-w-0">
            {/* Header Card */}
            <div className="card p-6 md:p-10 bg-white dark:bg-[#1A1A1A] border border-border dark:border-white/5 shadow-sm relative overflow-hidden rounded-[2.5rem]">
               <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full" />
               <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-10 text-center md:text-left">
                  <Avatar src={candidate?.userImage} name={candidate?.name} size="xl" className="w-24 h-24 md:w-32 md:h-32 rounded-[2rem] shadow-xl" />
                  <div className="min-w-0 flex-1">
                     <h1 className="text-3xl md:text-5xl font-serif text-text-primary dark:text-white mb-2 tracking-tight">{candidate?.name}</h1>
                     <p className="text-lg font-medium text-primary mb-6">{candidate?.headline || 'No headline provided'}</p>
                     <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-3 text-[10px] font-black text-text-secondary dark:text-gray-500 uppercase tracking-widest">
                        <span className="flex items-center gap-2 bg-gray-50 dark:bg-white/5 px-3 py-1.5 rounded-full"><Mail size={14} className="text-primary" /> {candidate?.email}</span>
                        <span className="flex items-center gap-2 bg-gray-50 dark:bg-white/5 px-3 py-1.5 rounded-full"><Calendar size={14} className="text-primary" /> Applied {formatDate(application.createdAt)}</span>
                     </div>
                  </div>
               </div>

               <div className="flex flex-col sm:flex-row items-center gap-4 p-6 bg-gray-50 dark:bg-white/[0.02] rounded-[2rem] border border-border dark:border-white/5">
                  <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                    <FileText size={24} />
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                     <p className="text-sm font-bold text-text-primary dark:text-white">Resume Attached</p>
                     <p className="text-xs text-text-secondary dark:text-gray-500">PDF Document • Click to view</p>
                  </div>
                  <a href={application.resumeUrl} target="_blank" rel="noreferrer" className="w-full sm:w-auto">
                    <Button variant="outline" size="sm" icon={ExternalLink} className="w-full rounded-xl">View Full PDF</Button>
                  </a>
               </div>
            </div>

            {/* AI Analysis */}
            <div className="min-w-0">
               <ResumeScorer applicationId={id} existingScore={aiScore} />
            </div>

            {/* Interview Guide */}
            <div className="min-w-0">
               <InterviewQuestions jobId={job?._id} applicationId={id} />
            </div>
         </div>

         {/* Right Column (Actions & Notes) */}
         <div className="space-y-8 min-w-0">
            {/* Stage Actions */}
            <div className="card p-8 bg-white dark:bg-[#1A1A1A] border border-border dark:border-white/5 shadow-sm rounded-[2.5rem]">
               <h3 className="text-[10px] font-black text-text-secondary dark:text-gray-500 uppercase tracking-widest mb-8">Current Progress</h3>
               <div className="mb-10">
                  <div className="text-[10px] font-black text-text-secondary dark:text-gray-600 uppercase mb-3 px-1">Current Stage</div>
                  <Badge variant="primary" size="lg" className="w-full justify-center text-xs py-4 rounded-2xl shadow-lg shadow-primary/10 font-black uppercase tracking-[0.2em]">{currentStage}</Badge>
               </div>
               
               <div className="space-y-4">
                  <div className="text-[10px] font-black text-text-secondary dark:text-gray-600 uppercase px-1">Move to New Stage</div>
                  <div className="relative">
                    <select 
                      value={selectedStage || currentStage}
                      onChange={(e) => setSelectedStage(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-white/5 border border-border dark:border-white/5 rounded-2xl p-4 text-sm font-bold focus:ring-4 focus:ring-primary/10 appearance-none dark:text-white"
                    >
                       {PIPELINE_STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" size={18} />
                  </div>
                  <Button className="w-full rounded-2xl py-4" icon={Check} onClick={handleUpdateStage} loading={updateStage.isPending}>Update Stage</Button>
               </div>
            </div>

            {/* History */}
            <div className="card p-8 bg-white dark:bg-[#1A1A1A] border border-border dark:border-white/5 shadow-sm rounded-[2.5rem]">
               <h3 className="text-[10px] font-black text-text-secondary dark:text-gray-500 uppercase tracking-widest mb-8">Application Journey</h3>
               <StageHistory history={stageHistory} />
            </div>

            {/* Notes */}
            <div className="card p-8 bg-white dark:bg-[#1A1A1A] border border-border dark:border-white/5 shadow-sm rounded-[2.5rem]">
               <h3 className="text-[10px] font-black text-text-secondary dark:text-gray-500 uppercase tracking-widest mb-6">Internal Notes</h3>
               <div className="space-y-4 mb-8 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                  {application.notes?.length === 0 && <p className="text-xs text-text-secondary dark:text-gray-600 italic text-center py-4">No notes yet.</p>}
                  {application.notes?.map((note, i) => (
                    <div key={i} className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-transparent dark:border-white/5">
                       <p className="text-xs text-text-primary dark:text-gray-300 mb-3 leading-relaxed font-medium">{note.text}</p>
                       <div className="flex items-center justify-between text-[8px] font-black text-text-secondary dark:text-gray-500 uppercase tracking-tighter">
                          <span>{note.addedBy?.name || 'Recruiter'}</span>
                          <span>{formatDate(note.createdAt)}</span>
                       </div>
                    </div>
                  ))}
               </div>
               <div className="space-y-4">
                  <textarea 
                    className="w-full bg-gray-50 dark:bg-white/5 border border-border dark:border-white/5 rounded-2xl p-4 text-xs focus:ring-4 focus:ring-primary/10 dark:text-white resize-none" 
                    placeholder="Add a private note..." 
                    rows={4}
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                  />
                  <Button variant="secondary" size="md" className="w-full rounded-xl" icon={Plus} onClick={handleAddNote} loading={addNote.isPending}>Add Note</Button>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default ApplicantDetail;
