import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Copy, ChevronDown, Check, Brain, Target, Code, Users, RefreshCw } from 'lucide-react';
import Button from '../common/Button';
import { useGenerateInterviewQuestions } from '../../hooks/useAI';
import { toast } from 'react-hot-toast';

const QuestionAccordion = ({ title, icon: Icon, questions }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden mb-4">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-gray-50/50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white dark:bg-gray-800 flex items-center justify-center text-amber-600 shadow-sm">
            <Icon size={18} />
          </div>
          <span className="font-bold text-gray-900 dark:text-white">{title}</span>
        </div>
        <ChevronDown size={20} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 space-y-4 bg-white dark:bg-gray-900">
              {questions?.map((q, idx) => (
                <div key={idx} className="group p-4 rounded-xl border border-gray-50 dark:border-gray-800 hover:border-amber-100 dark:hover:border-amber-900 transition-all">
                  <div className="flex justify-between gap-4">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white flex-1">{q.question}</p>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(q.question);
                        toast.success('Copied to clipboard');
                      }}
                      className="text-gray-400 hover:text-amber-600 transition-colors shrink-0"
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                  {q.answer && (
                    <div className="mt-3 p-3 bg-amber-50/30 dark:bg-amber-900/10 rounded-lg text-xs text-gray-600 dark:text-gray-400 border border-amber-100/50 dark:border-amber-900/30">
                      <p className="font-bold text-amber-600 mb-1 uppercase tracking-tighter">Expected Answer / Key Points</p>
                      {q.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const InterviewQuestions = ({ jobId, applicationId }) => {
  const [data, setData] = useState(null);
  const generateMutation = useGenerateInterviewQuestions();

  const handleGenerate = async () => {
    try {
      const result = await generateMutation.mutateAsync({ jobId, applicationId });
      if (result?.questions) {
        // Map backend fields to frontend expected names
        const formattedData = {
          ...result.questions,
          technical: result.questions.technical?.map(q => ({ ...q, answer: q.expectedAnswer })),
          behavioral: result.questions.behavioral?.map(q => ({ ...q, answer: q.purpose })),
          situational: result.questions.situational?.map(q => ({ ...q, answer: q.purpose })),
          specific: result.questions.roleSpecific?.map(q => ({ ...q, answer: q.purpose }))
        };
        setData(formattedData);
      }
    } catch (err) {
      console.error('Failed to generate guide:', err);
    }
  };

  const handleExport = () => {
    if (!data) return;

    const sections = [
      { title: 'Behavioral', questions: data.behavioral },
      { title: 'Technical', questions: data.technical },
      { title: 'Situational', questions: data.situational },
      { title: 'Role-Specific', questions: data.specific },
    ];

    const text = sections
      .filter(s => s.questions && s.questions.length > 0)
      .map(s => `--- ${s.title} ---\n${s.questions.map(q => `Q: ${q.question}\nA: ${q.answer}\n`).join('\n')}`)
      .join('\n\n');

    navigator.clipboard.writeText(text);
    toast.success('All questions copied to clipboard!');
  };

  return (
    <div className="space-y-6">
      {!data ? (
        <div className="card p-12 text-center bg-gradient-to-br from-white to-amber-50/30 dark:from-gray-900 dark:to-amber-950/20 border-amber-100 dark:border-amber-900">
           <div className="w-20 h-20 bg-white dark:bg-gray-800 rounded-3xl flex items-center justify-center text-amber-600 mx-auto mb-6 shadow-xl shadow-amber-100 dark:shadow-none">
              <Sparkles size={40} />
           </div>
           <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4">Interview Intelligence</h3>
           <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto mb-8">
              Generate tailored interview questions based on job requirements and candidate profile using AI.
           </p>
           <Button 
            size="lg" 
            className="w-full" 
            icon={Brain} 
            loading={generateMutation.isPending}
            onClick={handleGenerate}
           >
             Generate Interview Guide
           </Button>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
           <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-black text-gray-900 dark:text-white">Generated Guide</h3>
              <Button variant="outline" size="sm" icon={Copy} onClick={handleExport}>Export All</Button>
           </div>
           
           <QuestionAccordion title="Behavioral Questions" icon={Target} questions={data.behavioral || []} />
           <QuestionAccordion title="Technical Questions" icon={Code} questions={data.technical || []} />
           <QuestionAccordion title="Situational Questions" icon={Users} questions={data.situational || []} />
           <QuestionAccordion title="Role-Specific Questions" icon={Brain} questions={data.specific || []} />
           
           <div className="pt-6 flex justify-center">
              <Button variant="ghost" icon={RefreshCw} onClick={handleGenerate} loading={generateMutation.isPending}>Regenerate All</Button>
           </div>
        </motion.div>
      )}
    </div>
  );
};

export default InterviewQuestions;
