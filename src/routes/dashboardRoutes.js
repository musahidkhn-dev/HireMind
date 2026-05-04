import express from "express";
import {
  getCompanyDashboard,
  getJobStats,
  getApplicationStats,
  getTopSkills,
  getRecruiterPerformance,
  getActivities,
} from "../controllers/dashboardController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// FIXED: Added recruiter to company_admin roles for dashboard access
router.get('/company',
  protect,
  authorizeRoles('recruiter'),
  getCompanyDashboard
);

// FIXED: Added recruiter to job stats access
router.get('/job-stats',
  protect,
  authorizeRoles('recruiter'),
  getJobStats
);

// FIXED: Added recruiter to application stats access
router.get('/application-stats',
  protect,
  authorizeRoles('company_admin', 'recruiter'),
  getApplicationStats
);

// FIXED: Added recruiter to top skills access
router.get('/top-skills',
  protect,
  authorizeRoles('company_admin', 'recruiter'),
  getTopSkills
);

// FIXED: Kept performance metrics restricted to company_admin
router.get('/recruiter-performance',
  protect,
  authorizeRoles('company_admin'),
  getRecruiterPerformance
);

// FIXED: Added recruiter to activities feed access
router.get('/activities',
  protect,
  authorizeRoles('company_admin', 'recruiter'),
  getActivities
);

export default router;
