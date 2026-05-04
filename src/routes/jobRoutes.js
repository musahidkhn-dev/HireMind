import express from 'express'
import { createJob, getCompanyJobs, getPublicJobs, getJobById, updateJob, updateJobStatus, deleteJob, generateJobDescription } from '../controllers/jobController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';
import { getAllApplications } from '../controllers/applicationController.js';

const router = express.Router();

// FIXED: Specific routes FIRST to avoid param conflict (/:jobId)
router.get('/public', getPublicJobs);

// FIXED: Company/Recruiter jobs endpoint with correct roles
router.get('/my-jobs', protect, authorizeRoles('recruiter'), getCompanyJobs);
router.get('/company/all',
  protect,
  authorizeRoles('recruiter'),
  getCompanyJobs
);

// Creation route
router.post('/',
  protect,
  authorizeRoles('recruiter'),
  createJob
);

// FIXED: Param route LAST to avoid catching /company/all
router.get('/:jobId', getJobById);

// FIXED: Modification routes with correct roles
router.put('/:jobId',
  protect,
  authorizeRoles('recruiter'),
  updateJob
);

router.delete('/:jobId',
  protect,
  authorizeRoles('recruiter'),
  deleteJob
);

router.patch('/:jobId/status',
  protect,
  authorizeRoles('recruiter'),
  updateJobStatus
);

// FIXED: Legacy application route updated with roles
router.get('/company/:jobId/applications', 
  protect, 
  authorizeRoles('recruiter'), 
  getAllApplications
);

export default router;
