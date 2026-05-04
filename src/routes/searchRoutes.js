import express from 'express';
import { searchJobs, searchCandidates, searchCompanies, getSearchSuggestions } from '../controllers/searchController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';


const router = express.Router();



//Public Routes
router.get('/jobs', searchJobs);
router.get('/companies', searchCompanies);
router.get('/suggestions', getSearchSuggestions);


//Recruiter only
router.get('/candidates', protect, authorizeRoles('recruiter'), searchCandidates);


export default router;
