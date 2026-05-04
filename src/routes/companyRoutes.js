import express from "express";
import {
  getCompanyProfile,
  updateCompanyProfile,
  inviteRecruiter,
  acceptInvite,
  removeRecruiter,
  getRecruiters,
  getPublicCompanyProfile,
  followCompany,
  unfollowCompany,
  getTeam,
} from "../controllers/companyController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
import { companyLogoUpload, handleUpload } from "../middleware/uploadMiddleware.js";
import { get } from "mongoose";


const router = express.Router();

router.use((req, res, next) => {
    console.log(`Company Route Hit: ${req.method} ${req.url}`);
    next();
});

// Public route - candidate can view company profile
router.get('/public/:id', getPublicCompanyProfile);

// Follow/Unfollow routes
router.post('/follow/:id', protect, followCompany);
router.post('/unfollow/:id', protect, unfollowCompany);

// Company profile - recruiter only
router.get('/me', protect, authorizeRoles('recruiter'), getCompanyProfile);
router.get('/profile', protect, authorizeRoles('recruiter'), getCompanyProfile);
router.put('/profile', protect, authorizeRoles('recruiter'), handleUpload(companyLogoUpload), updateCompanyProfile);


// Recruiter management - recruiter only
router.post('/invite-recruiter', protect, authorizeRoles('recruiter'), inviteRecruiter);
router.post('/accept-invite', acceptInvite); //public - no auth needed
router.delete('/recruiter/:recruiterId', protect, authorizeRoles('recruiter'), removeRecruiter);
router.get('/recruiters' ,protect, authorizeRoles('recruiter'), getRecruiters);
router.get('/team', protect, authorizeRoles('recruiter'), getTeam);


export default router
