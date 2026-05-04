import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Check, RefreshCw, Edit3, Sparkles } from 'lucide-react';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';
import { useGenerateJD } from '../../hooks/useJobs';

const JDGenerator = ({ onGenerated }) => {
  const [formData, setFormData] = useState({
    title: '',
    industry: '',
    experienceLevel: 'Mid',
    additionalContext: ''
  });
  const [generatedData, setGeneratedData] = useState(null);
  const generateMutation = useGenerateJD();

  const handleGenerate = async () => {
    const data = await generateMutation.mutateAsync(formData);
    if (data) setGeneratedData(data);
  };

  return (
    <div className="card p-8 border-amber-100 dark:border-amber-900 bg-gradient-to-br from-white to-amber-50/30 dark:from-gray-900 dark:to-amber-950/20">
      <AnimatePresence mode="wait">
        {!generatedData ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-amber-600 rounded-xl flex items-center justify-center text-white">
                <Brain size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold dark:text-white">AI JD Generator</h3>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">CRAFT THE PERFECT POST</p>
              </div>
            </div>

            <Input 
              label="Role Title" 
              placeholder="e.g. Senior Product Designer"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input 
                label="Industry" 
                placeholder="e.g. Fintech"
                value={formData.industry}
                onChange={(e) => setFormData({...formData, industry: e.target.value})}
              />
              <Select 
                label="Experience Level"
                options={[{label:'Junior', value:'Junior'}, {label:'Mid', value:'Mid'}, {label:'Senior', value:'Senior'}]}
                value={formData.experienceLevel}
                onChange={(e) => setFormData({...formData, experienceLevel: e.target.value})}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium dark:text-gray-300">Additional Context</label>
              <textarea 
                className="w-full rounded-xl border border-gray-200 bg-white p-4 text-sm focus:ring-2 focus:ring-amber-500/20 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                placeholder="Mention specific projects, culture, or stack..."
                rows={3}
                value={formData.additionalContext}
                onChange={(e) => setFormData({...formData, additionalContext: e.target.value})}
              />
            </div>

            <Button 
              className="w-full h-12" 
              icon={Sparkles}
              loading={generateMutation.isPending}
              onClick={handleGenerate}
              disabled={!formData.title}
            >
              Generate with AI
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between mb-4">
               <div className="flex items-center gap-2 text-amber-600 font-bold uppercase text-xs tracking-widest">
                  <Check size={16} /> Content Generated
               </div>
               <button onClick={() => setGeneratedData(null)} className="text-xs font-bold text-gray-400 hover:text-amber-600">
                  START OVER
               </button>
            </div>

            <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 max-h-[400px] overflow-y-auto custom-scrollbar">
               <h4 className="font-bold text-lg mb-2 dark:text-white">{generatedData.title}</h4>
               <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap mb-6">{generatedData.description}</p>
               
               <h5 className="font-bold text-sm mb-2 dark:text-white">Requirements</h5>
               <ul className="list-disc pl-4 space-y-1 mb-6">
                 {generatedData.requirements?.map((req, i) => (
                    <li key={i} className="text-sm text-gray-600 dark:text-gray-400">{req}</li>
                 ))}
               </ul>

               <h5 className="font-bold text-sm mb-2 dark:text-white">Skills</h5>
               <div className="flex flex-wrap gap-2">
                 {generatedData.skills?.map((skill, i) => (
                    <span key={i} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-xs font-bold">{skill}</span>
                 ))}
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
               <Button variant="secondary" icon={RefreshCw} onClick={handleGenerate} loading={generateMutation.isPending}>Regenerate</Button>
               <Button icon={Check} onClick={() => onGenerated(generatedData)}>Accept Content</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default JDGenerator;
