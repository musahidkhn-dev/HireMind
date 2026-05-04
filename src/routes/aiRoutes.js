import express from 'express';
import { scoreResume,  extractSkills, interviewQuestionGenerator, getInterviewQuestions, bulkScoreResumes, generateJobDescription  } from '../controllers/aiController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

 
// --------- Resume Scoring ------------
router.post('/score-resume', protect, authorizeRoles('recruiter'), scoreResume);
router.post('/bulk-score', protect, authorizeRoles('recruiter'), bulkScoreResumes);
//----- Skill extraction ------------
router.post('/skill-extract', protect, authorizeRoles('recruiter'), extractSkills);

//------- Interview Questions --------------------- 
router.post('/interview-questions', protect, authorizeRoles('recruiter'), interviewQuestionGenerator);
router.get('/interview-questions/:jobId', protect, authorizeRoles('recruiter'), getInterviewQuestions);

//------- AI Assistant (JD Generator) --------------
router.post('/generate-description', protect, authorizeRoles('recruiter'), generateJobDescription);

export default router;
