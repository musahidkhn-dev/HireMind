import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, CheckCircle, AlertCircle, Award, Target, XCircle } from 'lucide-react';
import Button from '../common/Button';
import Badge from '../common/Badge';
import { useScoreResume } from '../../hooks/useAI';

const ResumeScorer = ({ applicationId, existingScore }) => {
  const [scoreData, setScoreData] = useState(existingScore || null);
  const scoreMutation = useScoreResume();

  const handleScore = async () => {
    try {
      const result = await scoreMutation.mutateAsync(applicationId);
      if (result?.score) {
        setScoreData(result.score);
      }
    } catch (err) {
      console.error('Failed to score resume:', err);
    }
  };

  const scoreValue = scoreData?.fitPercentage || 0;
  const scoreColor = scoreValue >= 80 ? 'text-green-500' : scoreValue >= 60 ? 'text-yellow-500' : 'text-red-500';

  return (
    <div className="card p-8 border-amber-100 dark:border-amber-900 bg-white dark:bg-gray-900">
      {!scoreData ? (
        <div className="text-center py-8">
           <div className="w-20 h-20 bg-amber-100 dark:bg-amber-900/30 rounded-3xl flex items-center justify-center text-amber-600 mx-auto mb-6">
              <Brain size={40} />
           </div>
           <h3 className="text-xl font-bold dark:text-white mb-2">AI Resume Analysis</h3>
           <p className="text-gray-500 dark:text-gray-400 max-w-xs mx-auto mb-8">
              Analyze the candidate's resume against the job description for skill match and cultural fit.
           </p>
           <Button 
            size="lg" 
            className="w-full" 
            icon={Brain} 
            onClick={handleScore}
            loading={scoreMutation.isPending}
           >
             Score Resume
           </Button>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
           {/* Header Stats */}
           <div className="flex flex-col md:flex-row items-center gap-10">
              <div className="relative w-40 h-40 shrink-0">
                 <svg className="w-full h-full -rotate-90">
                    <circle cx="80" cy="80" r="70" fill="transparent" stroke="currentColor" strokeWidth="12" className="text-gray-100 dark:text-gray-800" />
                    <motion.circle 
                      cx="80" cy="80" r="70" fill="transparent" stroke="currentColor" strokeWidth="12" 
                      strokeDasharray={440}
                      initial={{ strokeDashoffset: 440 }}
                      animate={{ strokeDashoffset: 440 - (440 * scoreValue) / 100 }}
                      transition={{ duration: 2, ease: "easeOut" }}
                      className={scoreColor.replace('text', 'stroke')}
                    />
                 </svg>
                 <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-4xl font-black ${scoreColor}`}>{scoreValue}%</span>
                    <span className="text-[10px] font-black text-gray-400 uppercase">MATCH SCORE</span>
                 </div>
              </div>

              <div className="flex-1 space-y-4">
                 <div className="flex items-center gap-2">
                    <Badge variant={scoreValue >= 80 ? 'success' : scoreValue >= 60 ? 'warning' : 'danger'} size="lg">
                       Recommendation: {scoreData.recommendation}
                    </Badge>
                 </div>
                 <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    {scoreData.summary}
                 </p>
              </div>
           </div>

           <hr className="border-gray-100 dark:border-gray-800" />

           {/* Skills Analysis */}
           <div className="grid md:grid-cols-2 gap-8">
              <div>
                 <h4 className="flex items-center gap-2 font-bold text-sm text-green-600 mb-4 uppercase tracking-wider">
                    <CheckCircle size={16} /> Matched Skills
                 </h4>
                 <div className="flex flex-wrap gap-2">
                    {scoreData.matchedSkills?.map((s, i) => (
                       <Badge key={i} variant="success">{s}</Badge>
                    ))}
                 </div>
              </div>
              <div>
                 <h4 className="flex items-center gap-2 font-bold text-sm text-red-600 mb-4 uppercase tracking-wider">
                    <XCircle size={16} /> Missing Skills
                 </h4>
                 <div className="flex flex-wrap gap-2">
                    {scoreData.missingSkills?.map((s, i) => (
                       <Badge key={i} variant="danger">{s}</Badge>
                    ))}
                 </div>
              </div>
           </div>

           {/* Strengths / Weaknesses */}
           <div className="grid md:grid-cols-2 gap-8 pt-4">
              <div className="p-6 bg-green-50/50 dark:bg-green-900/10 rounded-2xl border border-green-100 dark:border-green-900/20">
                 <h4 className="font-bold text-green-800 dark:text-green-400 mb-3 text-sm uppercase">Strengths</h4>
                 <ul className="space-y-2">
                    {scoreData.strengths?.map((s, i) => (
                       <li key={i} className="flex items-start gap-2 text-sm text-green-700 dark:text-green-500">
                          <CheckCircle size={14} className="mt-0.5 shrink-0" /> {s}
                       </li>
                    ))}
                 </ul>
              </div>
              <div className="p-6 bg-red-50/50 dark:bg-red-900/10 rounded-2xl border border-red-100 dark:border-red-900/20">
                 <h4 className="font-bold text-red-800 dark:text-red-400 mb-3 text-sm uppercase">Weaknesses</h4>
                 <ul className="space-y-2">
                    {scoreData.weaknesses?.map((w, i) => (
                       <li key={i} className="flex items-start gap-2 text-sm text-red-700 dark:text-red-500">
                          <AlertCircle size={14} className="mt-0.5 shrink-0" /> {w}
                       </li>
                    ))}
                 </ul>
              </div>
           </div>

           <Button variant="secondary" className="w-full" onClick={() => setScoreData(null)} icon={Brain}>Re-analyze</Button>
        </motion.div>
      )}
    </div>
  );
};

export default ResumeScorer;
