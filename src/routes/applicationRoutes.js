import express from "express";
import {
  applyJob,
  getMyApplications,
  getAllApplications,
  getSingleApplication,
  updateApplicationStage,
  withdrawApplication,
  addNoteToApplication,
  getStats,
} from "../controllers/applicationController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
import { handleUpload, resumeUpload, } from "../middleware/uploadMiddleware.js";

const router = express.Router();

//---- Candidate routes ----------------
router.post('/apply/:jobId', protect, authorizeRoles('candidate'), handleUpload(resumeUpload), applyJob);
router.get('/my', protect, authorizeRoles('candidate'), getMyApplications);
router.delete('/:id', protect, authorizeRoles('candidate'), withdrawApplication);

//---- Recruiter / Admin routes ---------------

// FIXED: Added recruiter to company_admin roles for applicant viewing
router.get('/job/:jobId',
  protect,
  authorizeRoles('recruiter'),
  getAllApplications
);

// FIXED: Added recruiter to company_admin roles for stage updates
router.patch('/:id/status',
  protect,
  authorizeRoles('recruiter'),
  updateApplicationStage
);

// FIXED: Added recruiter to company_admin roles for note adding
router.post('/:id/note',
  protect,
  authorizeRoles('recruiter'),
  addNoteToApplication
);

// FIXED: Added recruiter to company_admin roles for stats access
router.get('/stats',
  protect,
  authorizeRoles('recruiter'),
  getStats
);

//----- Shared routes ------------------
router.get('/:id', protect, getSingleApplication);

export default router;
